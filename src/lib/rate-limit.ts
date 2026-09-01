import "server-only";

import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { headers } from "next/headers";
import { Prisma } from "@/generated/prisma/client";
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

export async function consumeRateLimit(
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  validateOptions(options);
  const now = options.now ?? Date.now();
  const currentTime = new Date(now);
  const nextResetAt = new Date(now + options.windowMs);
  const cleanupBefore = new Date(now - CLEANUP_GRACE_MS);
  const shouldCleanup = options.key.endsWith("00");
  const maximumStoredCount = options.limit + 1;

  // Satu statement atomik menangani create, reset, increment, penolakan, dan
  // sampled cleanup. Nilai limit + 1 menandai request yang ditolak tanpa
  // membutuhkan SELECT lanjutan.
  const [bucket] = await prisma.$queryRaw<Array<{ count: number; resetAt: Date }>>(
    Prisma.sql`
      WITH cleanup AS (
        DELETE FROM "security_rate_limit"
        WHERE ${shouldCleanup}
          AND "resetAt" < ${cleanupBefore}
        RETURNING "key"
      )
      INSERT INTO "security_rate_limit" (
        "key", "count", "resetAt", "updatedAt"
      )
      VALUES (${options.key}, 1, ${nextResetAt}, CURRENT_TIMESTAMP)
      ON CONFLICT ("key") DO UPDATE
      SET
        "count" = CASE
          WHEN "security_rate_limit"."resetAt" <= ${currentTime} THEN 1
          ELSE LEAST("security_rate_limit"."count" + 1, ${maximumStoredCount})
        END,
        "resetAt" = CASE
          WHEN "security_rate_limit"."resetAt" <= ${currentTime} THEN ${nextResetAt}
          ELSE "security_rate_limit"."resetAt"
        END,
        "updatedAt" = CURRENT_TIMESTAMP
      RETURNING "count", "resetAt"
    `,
  );

  if (!bucket) throw new Error("Rate-limit bucket tidak dapat diperbarui");
  if (bucket.count <= options.limit) return toResult(bucket.count, options.limit);

  return {
    allowed: false,
    remaining: 0,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((bucket.resetAt.getTime() - now) / 1000),
    ),
  };
}

export async function consumeRateLimits(
  optionsList: readonly RateLimitOptions[],
): Promise<RateLimitResult[]> {
  if (optionsList.length === 0) return [];
  optionsList.forEach(validateOptions);

  const keys = new Set(optionsList.map(({ key }) => key));
  if (keys.size !== optionsList.length) {
    throw new Error("Duplicate rate-limit key");
  }

  const inputRows = optionsList.map((options) => {
    const now = options.now ?? Date.now();
    return Prisma.sql`(
      ${options.key},
      ${new Date(now)},
      ${new Date(now + options.windowMs)},
      ${options.limit + 1}
    )`;
  });
  const cleanupBefore = new Date(
    Math.min(...optionsList.map((options) => options.now ?? Date.now())) -
      CLEANUP_GRACE_MS,
  );
  const shouldCleanup = optionsList.some(({ key }) => key.endsWith("00"));

  // Semua bucket independen diperbarui atomik dalam satu round-trip database.
  const buckets = await prisma.$queryRaw<
    Array<{ key: string; count: number; resetAt: Date }>
  >(Prisma.sql`
    WITH input("key", "currentTime", "nextResetAt", "maximumStoredCount") AS (
      VALUES ${Prisma.join(inputRows)}
    ), cleanup AS (
      DELETE FROM "security_rate_limit"
      WHERE ${shouldCleanup}
        AND "resetAt" < ${cleanupBefore}
      RETURNING "key"
    )
    INSERT INTO "security_rate_limit" (
      "key", "count", "resetAt", "updatedAt"
    )
    SELECT "key", 1, "nextResetAt", CURRENT_TIMESTAMP
    FROM input
    ON CONFLICT ("key") DO UPDATE
    SET
      "count" = CASE
        WHEN "security_rate_limit"."resetAt" <= (
          SELECT input."currentTime" FROM input
          WHERE input."key" = EXCLUDED."key"
        ) THEN 1
        ELSE LEAST(
          "security_rate_limit"."count" + 1,
          (
            SELECT input."maximumStoredCount" FROM input
            WHERE input."key" = EXCLUDED."key"
          )
        )
      END,
      "resetAt" = CASE
        WHEN "security_rate_limit"."resetAt" <= (
          SELECT input."currentTime" FROM input
          WHERE input."key" = EXCLUDED."key"
        ) THEN (
          SELECT input."nextResetAt" FROM input
          WHERE input."key" = EXCLUDED."key"
        )
        ELSE "security_rate_limit"."resetAt"
      END,
      "updatedAt" = CURRENT_TIMESTAMP
    RETURNING "key", "count", "resetAt"
  `);

  const bucketsByKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));
  return optionsList.map((options) => {
    const bucket = bucketsByKey.get(options.key);
    if (!bucket) throw new Error("Rate-limit bucket tidak dapat diperbarui");
    if (bucket.count <= options.limit) return toResult(bucket.count, options.limit);

    const now = options.now ?? Date.now();
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((bucket.resetAt.getTime() - now) / 1000),
      ),
    };
  });
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
