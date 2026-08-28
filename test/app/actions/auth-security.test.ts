import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  userFindFirst: vi.fn(),
  compare: vi.fn(),
  consumeRateLimit: vi.fn(),
  clearRateLimit: vi.fn(),
  getClientAddress: vi.fn(),
  createRateLimitKey: vi.fn((scope: string, value: string) => `${scope}:${value}`),
  createSession: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findFirst: mocks.userFindFirst,
      create: vi.fn(),
    },
  },
}));
vi.mock("bcryptjs", () => ({
  default: { compare: mocks.compare, hash: vi.fn() },
}));
vi.mock("@/lib/session", () => ({
  createSession: mocks.createSession,
  deleteSession: vi.fn(),
  verifySession: vi.fn(),
}));
vi.mock("@/lib/rate-limit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  clearRateLimit: mocks.clearRateLimit,
  getClientAddress: mocks.getClientAddress,
  createRateLimitKey: mocks.createRateLimitKey,
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/config/unifiedConfig", () => ({
  config: {
    security: {
      auth: {
        rateLimit: {
          loginByIp: { limit: 30, windowMs: 900_000 },
          loginByIpAndIdentity: { limit: 5, windowMs: 900_000 },
          registerByIp: { limit: 5, windowMs: 3_600_000 },
        },
      },
    },
  },
}));

import { loginAction } from "@/app/actions/auth";

describe("login rate-limit security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getClientAddress.mockResolvedValue("203.0.113.15");
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 4,
      retryAfterSeconds: 0,
    });
    mocks.userFindFirst.mockResolvedValue(null);
    mocks.compare.mockResolvedValue(false);
  });

  it("scopes identity throttling to both source IP and normalized email", async () => {
    await loginAction({
      email: "STUDENT@EXAMPLE.COM",
      password: "password-ku",
    });

    expect(mocks.createRateLimitKey).toHaveBeenNthCalledWith(
      1,
      "auth:login:ip",
      "203.0.113.15",
    );
    expect(mocks.createRateLimitKey).toHaveBeenNthCalledWith(
      2,
      "auth:login:ip-identity",
      "203.0.113.15:student@example.com",
    );
  });
});
