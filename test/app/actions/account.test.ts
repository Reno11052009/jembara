import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  deleteSession: vi.fn(),
  consumeRateLimit: vi.fn(),
  compare: vi.fn(),
  userFindUnique: vi.fn(),
  transactionUserFindUnique: vi.fn(),
  userDelete: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("bcryptjs", () => ({ default: { compare: mocks.compare } }));
vi.mock("@/lib/session", () => ({
  verifySession: mocks.verifySession,
  deleteSession: mocks.deleteSession,
}));
vi.mock("@/lib/rate-limit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  createRateLimitKey: vi.fn(() => "account:test"),
}));
vi.mock("@/config/unifiedConfig", () => ({
  config: {
    security: {
      auth: { rateLimit: { accountDeleteByUser: { limit: 5, windowMs: 3_600_000 } } },
    },
  },
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    $transaction: mocks.transaction,
  },
}));

import { deleteAccountAction } from "@/app/actions/account";

const userId = "11111111-1111-4111-8111-111111111111";

describe("deleteAccountAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({ userId, role: "STUDENT", name: "Andi" });
    mocks.consumeRateLimit.mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
    mocks.userFindUnique.mockResolvedValue({ password: "hash", role: "STUDENT" });
    mocks.compare.mockResolvedValue(true);
    mocks.transactionUserFindUnique.mockResolvedValue({
      saldo: 0,
      role: "STUDENT",
      _count: { balanceTransactions: 0, withdrawalRequests: 0, releasedPayments: 0 },
      student: { _count: { projects: 0, submissions: 0 } },
      umkm: null,
    });
    mocks.transaction.mockImplementation(async (callback) =>
      callback({
        user: {
          findUnique: mocks.transactionUserFindUnique,
          delete: mocks.userDelete,
        },
      }),
    );
  });

  it("requires the current password", async () => {
    mocks.compare.mockResolvedValue(false);
    await expect(deleteAccountAction({ password: "wrong" })).resolves.toEqual({
      success: false,
      error: "Password tidak benar.",
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("preserves accounts with financial history", async () => {
    mocks.transactionUserFindUnique.mockResolvedValue({
      saldo: 20_000_000,
      role: "STUDENT",
      _count: { balanceTransactions: 1, withdrawalRequests: 0, releasedPayments: 1 },
      student: { _count: { projects: 0, submissions: 0 } },
      umkm: null,
    });
    const result = await deleteAccountAction({ password: "valid-password" });
    expect(result.success).toBe(false);
    expect(mocks.userDelete).not.toHaveBeenCalled();
  });

  it("deletes an eligible account and ends its session", async () => {
    await expect(deleteAccountAction({ password: "valid-password" })).resolves.toEqual({
      success: true,
    });
    expect(mocks.userDelete).toHaveBeenCalledWith({ where: { id: userId } });
    expect(mocks.deleteSession).toHaveBeenCalledOnce();
  });
});
