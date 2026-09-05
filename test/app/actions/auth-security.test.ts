import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "@/generated/prisma/client";

const mocks = vi.hoisted(() => ({
  userFindFirst: vi.fn(),
  userCreate: vi.fn(),
  compare: vi.fn(),
  consumeRateLimit: vi.fn(),
  consumeRateLimits: vi.fn(),
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
      create: mocks.userCreate,
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
  consumeRateLimits: mocks.consumeRateLimits,
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

import { loginAction, registerAction } from "@/app/actions/auth";

describe("login rate-limit security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getClientAddress.mockResolvedValue("203.0.113.15");
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 4,
      retryAfterSeconds: 0,
    });
    mocks.consumeRateLimits.mockResolvedValue([
      { allowed: true, remaining: 29, retryAfterSeconds: 0 },
      { allowed: true, remaining: 4, retryAfterSeconds: 0 },
    ]);
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

  it("returns a generic error when a registration email already exists", async () => {
    mocks.userFindFirst.mockResolvedValue({ id: "existing-user" });

    await expect(
      registerAction({
        fullName: "Andi Pelajar",
        email: "andi@example.com",
        address: "Jalan Merdeka 10",
        password: "Password123!",
        confirmPassword: "Password123!",
      }),
    ).resolves.toEqual({
      error:
        "Pendaftaran belum dapat diproses. Periksa data atau masuk jika sudah memiliki akun.",
    });
    expect(mocks.userCreate).not.toHaveBeenCalled();
  });

  it("handles a concurrent duplicate registration without exposing a server error", async () => {
    mocks.userFindFirst.mockResolvedValue(null);
    mocks.userCreate.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "test",
      }),
    );

    await expect(
      registerAction({
        fullName: "Andi Pelajar",
        email: "andi@example.com",
        address: "Jalan Merdeka 10",
        password: "Password123!",
        confirmPassword: "Password123!",
      }),
    ).resolves.toEqual({
      error:
        "Pendaftaran belum dapat diproses. Periksa data atau masuk jika sudah memiliki akun.",
    });
    expect(mocks.createSession).not.toHaveBeenCalled();
  });
});
