import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  deleteSession: vi.fn(),
  createSession: vi.fn(),
  consumeRateLimit: vi.fn(),
  userFindUnique: vi.fn(),
  userUpdate: vi.fn(),
  sessionDeleteMany: vi.fn(),
  transaction: vi.fn(),
  bcryptCompare: vi.fn(),
  bcryptHash: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/session", () => ({
  verifySession: mocks.verifySession,
  deleteSession: mocks.deleteSession,
  createSession: mocks.createSession,
}));
vi.mock("@/lib/rate-limit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  createRateLimitKey: vi.fn(() => "password:test"),
}));
vi.mock("@/config/unifiedConfig", () => ({
  config: {
    security: {
      auth: {
        rateLimit: {
          passwordChangeByUser: { limit: 5, windowMs: 3_600_000 },
        },
      },
    },
  },
}));
vi.mock("bcryptjs", () => ({
  default: {
    compare: mocks.bcryptCompare,
    hash: mocks.bcryptHash,
  },
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: mocks.userFindUnique,
      update: mocks.userUpdate,
    },
    auth_session: {
      deleteMany: mocks.sessionDeleteMany,
    },
    $transaction: mocks.transaction,
  },
}));

import {
  changeCurrentUserPassword,
  revokeCurrentUserSession,
} from "@/lib/account-security";

describe("account security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({
      sessionId: "11111111-1111-4111-8111-111111111111",
      userId: "22222222-2222-4222-8222-222222222222",
      role: "STUDENT",
      name: "Andi",
    });
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 4,
      retryAfterSeconds: 0,
    });
    mocks.userFindUnique.mockResolvedValue({
      id: "22222222-2222-4222-8222-222222222222",
      password: "stored-hash",
      role: "STUDENT",
      name: "Andi",
    });
    mocks.userUpdate.mockResolvedValue({ id: "22222222-2222-4222-8222-222222222222" });
    mocks.sessionDeleteMany.mockResolvedValue({ count: 1 });
    mocks.transaction.mockResolvedValue([]);
    mocks.bcryptHash.mockResolvedValue("new-hash");
    mocks.createSession.mockResolvedValue(undefined);
  });

  it("scopes session revocation to the authenticated user", async () => {
    const targetSessionId = "33333333-3333-4333-8333-333333333333";
    await expect(revokeCurrentUserSession(targetSessionId)).resolves.toEqual({
      success: true,
      revokedCurrentSession: false,
    });
    expect(mocks.sessionDeleteMany).toHaveBeenCalledWith({
      where: {
        id: targetSessionId,
        userId: "22222222-2222-4222-8222-222222222222",
      },
    });
  });

  it("does not change a password when the current password is wrong", async () => {
    mocks.bcryptCompare.mockResolvedValue(false);
    const result = await changeCurrentUserPassword({
      currentPassword: "wrong-password",
      newPassword: "new-password-123",
      confirmPassword: "new-password-123",
    });
    expect(result).toEqual({ success: false, error: "Password saat ini salah" });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("revokes old sessions and issues a new session after a password change", async () => {
    mocks.bcryptCompare.mockResolvedValue(true);
    const result = await changeCurrentUserPassword({
      currentPassword: "old-password-123",
      newPassword: "new-password-123",
      confirmPassword: "new-password-123",
    });
    expect(result).toEqual({ success: true });
    expect(mocks.transaction).toHaveBeenCalledOnce();
    expect(mocks.createSession).toHaveBeenCalledWith(
      "22222222-2222-4222-8222-222222222222",
      "STUDENT",
      "Andi",
    );
  });
});
