import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const rateLimitMock = vi.hoisted(() => ({
  deleteMany: vi.fn(),
  queryRaw: vi.fn(),
  headers: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({
  default: {
    security_rate_limit: { deleteMany: rateLimitMock.deleteMany },
    $queryRaw: rateLimitMock.queryRaw,
  },
}));
vi.mock("next/headers", () => ({ headers: rateLimitMock.headers }));

import {
  clearRateLimit,
  consumeRateLimit,
  createRateLimitKey,
  getClientAddress,
} from "@/lib/rate-limit";

describe("persistent rate limit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rateLimitMock.deleteMany.mockResolvedValue({ count: 0 });
    rateLimitMock.headers.mockResolvedValue(new Headers());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("creates a new bucket for the first request", async () => {
    rateLimitMock.queryRaw.mockResolvedValue([
      { count: 1, resetAt: new Date(1_000) },
    ]);

    await expect(
      consumeRateLimit({ key: "test:bucket", limit: 2, windowMs: 1_000, now: 0 }),
    ).resolves.toEqual({ allowed: true, remaining: 1, retryAfterSeconds: 0 });
    expect(rateLimitMock.queryRaw).toHaveBeenCalledTimes(1);
  });

  it("blocks a bucket that has reached its limit", async () => {
    rateLimitMock.queryRaw.mockResolvedValue([
      { count: 3, resetAt: new Date(1_000) },
    ]);

    await expect(
      consumeRateLimit({ key: "test:bucket", limit: 2, windowMs: 1_000, now: 1 }),
    ).resolves.toEqual({ allowed: false, remaining: 0, retryAfterSeconds: 1 });
  });

  it("resets an expired bucket atomically", async () => {
    rateLimitMock.queryRaw.mockResolvedValue([
      { count: 1, resetAt: new Date(2_000) },
    ]);

    await expect(
      consumeRateLimit({ key: "test:bucket", limit: 2, windowMs: 1_000, now: 1_000 }),
    ).resolves.toEqual({ allowed: true, remaining: 1, retryAfterSeconds: 0 });
  });

  it("clears a bucket from persistent storage", async () => {
    rateLimitMock.deleteMany.mockResolvedValue({ count: 1 });
    await clearRateLimit("test:bucket");
    expect(rateLimitMock.deleteMany).toHaveBeenCalledWith({ where: { key: "test:bucket" } });
  });

  it("hashes sensitive rate-limit identities", () => {
    const key = createRateLimitKey("auth:login:identity", "student@example.com");
    expect(key).not.toContain("student@example.com");
    expect(key.length).toBeLessThanOrEqual(96);
  });

  it("ignores a spoofed Cloudflare header on a direct Vercel host", async () => {
    vi.stubEnv("VERCEL", "1");
    rateLimitMock.headers.mockResolvedValue(
      new Headers({
        host: "jembara-preview.vercel.app",
        "cf-connecting-ip": "198.51.100.99",
        "x-vercel-forwarded-for": "203.0.113.10",
      }),
    );

    await expect(getClientAddress()).resolves.toBe("203.0.113.10");
  });

  it("trusts Cloudflare client IP only on the configured production host", async () => {
    vi.stubEnv("VERCEL", "1");
    vi.stubEnv("TRUSTED_CLOUDFLARE_HOSTS", "jembara.web.id");
    rateLimitMock.headers.mockResolvedValue(
      new Headers({
        host: "jembara.web.id",
        "cf-connecting-ip": "198.51.100.25",
        "x-vercel-forwarded-for": "203.0.113.20",
      }),
    );

    await expect(getClientAddress()).resolves.toBe("198.51.100.25");
  });
});
