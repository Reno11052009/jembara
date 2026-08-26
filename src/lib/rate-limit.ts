import "server-only";

import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { headers } from "next/headers";
import prisma from "./prisma";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
  now?: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

const MAX_KEY_LENGTH = 96;
const CLEANUP_GRACE_MS = 24 * 60 * 60 * 1000;

function validateOptions({ key, limit, windowMs }: RateLimitOptions) {
  if (
    !key ||
    key.length > MAX_KEY_LENGTH ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    !Number.isSafeInteger(windowMs) ||
    windowMs < 1
  ) {
    throw new Error("Invalid rate-limit configuration");
  }
}

function toResult(count: number, limit: number): RateLimitResult {
  return {
    allowed: true,
    remaining: Math.max(0, limit - count),
    retryAfterSeconds: 0,
  };
}

async function consumeRateLimitAttempt(
  options: RateLimitOptions,
  attempt = 0,
): Promise<RateLimitResult> {
  const now = options.now ?? Date.now();
  const currentTime = new Date(now);
  const nextResetAt = new Date(now + options.windowMs);

  // Sampling cleanup menjaga tabel tetap terbatas tanpa query tambahan pada
  // setiap request.
  if (options.key.endsWith("00")) {
    await prisma.security_rate_limit.deleteMany({
      where: { resetAt: { lt: new Date(now - CLEANUP_GRACE_MS) } },
    });
  }

  const resetBucket = await prisma.security_rate_limit.updateMany({
    where: { key: options.key, resetAt: { lte: currentTime } },
    data: { count: 1, resetAt: nextResetAt },
  });
  if (resetBucket.count === 1) return toResult(1, options.limit);

  const incrementedBucket = await prisma.security_rate_limit.updateMany({
    where: {
      key: options.key,
      resetAt: { gt: currentTime },
      count: { lt: options.limit },
    },
    data: { count: { increment: 1 } },
  });
  if (incrementedBucket.count === 1) {
    const bucket = await prisma.security_rate_limit.findUnique({
      where: { key: options.key },
      select: { count: true },
    });
    return toResult(bucket?.count ?? options.limit, options.limit);
  }

  const existingBucket = await prisma.security_rate_limit.findUnique({
    where: { key: options.key },
    select: { count: true, resetAt: true },
  });
  if (existingBucket && existingBucket.resetAt > currentTime) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existingBucket.resetAt.getTime() - now) / 1000),
      ),
    };
  }

  try {
    await prisma.security_rate_limit.create({
      data: {
        key: options.key,
        count: 1,
        resetAt: nextResetAt,
      },
      select: { key: true },
    });
    return toResult(1, options.limit);
  } catch (error) {
    // Dua instance dapat membuat bucket yang sama secara bersamaan. Instance
    // yang kalah mengulang update atomik dan tidak melewati pembatasan.
    if (attempt < 2) return consumeRateLimitAttempt(options, attempt + 1);
    throw error;
  }
}

export async function consumeRateLimit(
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  validateOptions(options);
  return consumeRateLimitAttempt(options);
}

export async function clearRateLimit(key: string) {
  if (!key || key.length > MAX_KEY_LENGTH) return;
  await prisma.security_rate_limit.deleteMany({ where: { key } });
}

export function createRateLimitKey(scope: string, value: string): string {
  return `${scope}:${createHash("sha256").update(value).digest("hex")}`;
}

function firstValidIp(values: Array<string | null | undefined>) {
  for (const value of values) {
    const candidate = value?.split(",")[0]?.trim();
    if (candidate && isIP(candidate)) return candidate;
  }
  return "unknown";
}

function normalizeHostname(value: string | null) {
  return value?.split(",")[0]?.trim().toLocaleLowerCase("en-US").split(":")[0] ?? "";
}

function getTrustedCloudflareHosts() {
  return new Set(
    (process.env.TRUSTED_CLOUDFLARE_HOSTS || "jembara.web.id")
      .split(",")
      .map((host) => normalizeHostname(host))
      .filter(Boolean),
  );
}

export async function getClientAddress(): Promise<string> {
  const requestHeaders = await headers();

  if (process.env.VERCEL === "1") {
    const hostname = normalizeHostname(
      requestHeaders.get("x-forwarded-host") || requestHeaders.get("host"),
    );
    if (getTrustedCloudflareHosts().has(hostname)) {
      return firstValidIp([
        requestHeaders.get("cf-connecting-ip"),
        requestHeaders.get("x-vercel-forwarded-for"),
        requestHeaders.get("x-real-ip"),
      ]);
    }

    // Header Vercel ini ditetapkan oleh platform. Header Cloudflare tidak
    // dipercaya pada URL deployment langsung karena dapat dikirim klien.
    return firstValidIp([
      requestHeaders.get("x-vercel-forwarded-for"),
      requestHeaders.get("x-real-ip"),
    ]);
  }

  return firstValidIp([
    requestHeaders.get("x-real-ip"),
    requestHeaders.get("x-forwarded-for"),
  ]);
}
