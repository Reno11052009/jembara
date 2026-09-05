import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  userFindUnique: vi.fn(),
  consumeRateLimit: vi.fn(),
  transaction: vi.fn(),
  transactionUserFindFirst: vi.fn(),
  transactionUserUpdateMany: vi.fn(),
  transactionUserUpdate: vi.fn(),
  payoutMethodFindFirst: vi.fn(),
  withdrawalCreate: vi.fn(),
  withdrawalFindUnique: vi.fn(),
  withdrawalUpdateMany: vi.fn(),
  balanceCreate: vi.fn(),
  notificationCreate: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ verifySession: mocks.verifySession }));
vi.mock("@/lib/rate-limit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  createRateLimitKey: (scope: string, value: string) => `${scope}:${value}`,
}));
vi.mock("@/config/unifiedConfig", () => ({
  config: {
    security: {
      auth: {
        rateLimit: {
          withdrawalCreateByUser: { limit: 5, windowMs: 86_400_000 },
          withdrawalDecisionByAdmin: { limit: 30, windowMs: 3_600_000 },
        },
      },
    },
  },
}));
vi.mock("@/lib/notifications", () => ({
  createUserNotification: mocks.notificationCreate,
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    $transaction: mocks.transaction,
  },
}));

import {
  createWithdrawalRequestAction,
  decideWithdrawalRequestAction,
} from "@/app/actions/withdrawals";

const STUDENT_USER_ID = "11111111-1111-4111-8111-111111111111";
const ADMIN_USER_ID = "22222222-2222-4222-8222-222222222222";
const WITHDRAWAL_ID = "33333333-3333-4333-8333-333333333333";

function transactionClient() {
  return {
    user: {
      findFirst: mocks.transactionUserFindFirst,
      updateMany: mocks.transactionUserUpdateMany,
      update: mocks.transactionUserUpdate,
    },
    payout_method: { findFirst: mocks.payoutMethodFindFirst },
    withdrawal_request: {
      create: mocks.withdrawalCreate,
      findUnique: mocks.withdrawalFindUnique,
      updateMany: mocks.withdrawalUpdateMany,
    },
    balance_transaction: { create: mocks.balanceCreate },
  };
}

function validFormData(amount = "10000") {
  const formData = new FormData();
  formData.set("amount", amount);
  formData.set("payoutMethodId", "44444444-4444-4444-8444-444444444444");
  return formData;
}

describe("withdrawal actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({
      userId: STUDENT_USER_ID,
      role: "STUDENT",
      name: "Ayu",
    });
    mocks.userFindUnique.mockResolvedValue({
      role: "STUDENT",
      student: { id: "student-1" },
    });
    mocks.consumeRateLimit.mockResolvedValue({ allowed: true });
    mocks.transactionUserFindFirst.mockResolvedValue({ saldo: 50_000 });
    mocks.transactionUserUpdateMany.mockResolvedValue({ count: 1 });
    mocks.transactionUserUpdate.mockResolvedValue({ saldo: 50_000 });
    mocks.withdrawalCreate.mockResolvedValue({ id: WITHDRAWAL_ID });
    mocks.withdrawalUpdateMany.mockResolvedValue({ count: 1 });
    mocks.balanceCreate.mockResolvedValue({ id: "ledger-1" });
    mocks.payoutMethodFindFirst.mockResolvedValue({
      id: "44444444-4444-4444-8444-444444444444",
      provider: "BCA",
      accountName: "Ayu Lestari",
      accountNumber: "1234567890",
    });
    mocks.notificationCreate.mockResolvedValue({ id: "notification-1" });
    mocks.transaction.mockImplementation(
      async (callback: (transaction: ReturnType<typeof transactionClient>) => Promise<unknown>) =>
        callback(transactionClient()),
    );
  });

  it("rejects a withdrawal below Rp10.000 before accessing the session", async () => {
    await expect(createWithdrawalRequestAction(validFormData("9999"))).resolves.toEqual({
      success: false,
      error: "Minimum penarikan adalah Rp10.000.",
    });
    expect(mocks.verifySession).not.toHaveBeenCalled();
  });

  it("reserves the student's balance and records an auditable ledger entry", async () => {
    await expect(createWithdrawalRequestAction(validFormData())).resolves.toEqual({
      success: true,
    });

    expect(mocks.transactionUserUpdateMany).toHaveBeenCalledWith({
      where: {
        id: STUDENT_USER_ID,
        role: "STUDENT",
        saldo: { gte: 10_000 },
      },
      data: { saldo: { decrement: 10_000 } },
    });
    expect(mocks.withdrawalCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: STUDENT_USER_ID,
        payoutMethodId: "44444444-4444-4444-8444-444444444444",
        amount: 10_000,
        provider: "BCA",
        accountName: "Ayu Lestari",
        accountNumber: "1234567890",
        status: "PENDING",
      }),
      select: { id: true },
    });
    expect(mocks.balanceCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: STUDENT_USER_ID,
        type: "WITHDRAWAL_RESERVE",
        amount: -10_000,
        balanceBefore: 50_000,
        balanceAfter: 40_000,
      }),
      select: { id: true },
    });
  });

  it("rejects a valid amount when the trusted database balance is insufficient", async () => {
    mocks.transactionUserFindFirst.mockResolvedValue({ saldo: 9_999 });

    await expect(createWithdrawalRequestAction(validFormData())).resolves.toEqual({
      success: false,
      error: "Saldo tidak mencukupi untuk penarikan ini.",
    });
    expect(mocks.transactionUserUpdateMany).not.toHaveBeenCalled();
    expect(mocks.withdrawalCreate).not.toHaveBeenCalled();
  });

  it("does not allow a UMKM account to request a withdrawal", async () => {
    mocks.userFindUnique.mockResolvedValue({ role: "UMKM", student: null });

    await expect(createWithdrawalRequestAction(validFormData())).resolves.toEqual({
      success: false,
      error: "Hanya Student yang dapat menarik saldo.",
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("lets an admin complete a manually transferred withdrawal without changing balance again", async () => {
    mocks.verifySession.mockResolvedValue({ userId: ADMIN_USER_ID, role: "ADMIN" });
    mocks.userFindUnique.mockResolvedValue({ role: "ADMIN", admin: { id: "admin-1" } });
    mocks.withdrawalFindUnique.mockResolvedValue({
      id: WITHDRAWAL_ID,
      userId: STUDENT_USER_ID,
      amount: 10_000,
      status: "PENDING",
      user: { saldo: 40_000 },
    });

    await expect(
      decideWithdrawalRequestAction(WITHDRAWAL_ID, "COMPLETE", "Sudah ditransfer"),
    ).resolves.toEqual({ success: true });

    expect(mocks.withdrawalUpdateMany).toHaveBeenCalledWith({
      where: { id: WITHDRAWAL_ID, status: "PENDING" },
      data: expect.objectContaining({
        status: "COMPLETED",
        adminNote: "Sudah ditransfer",
        processedByUserId: ADMIN_USER_ID,
      }),
    });
    expect(mocks.transactionUserUpdate).not.toHaveBeenCalled();
    expect(mocks.balanceCreate).not.toHaveBeenCalled();
  });

  it("refunds reserved balance atomically when an admin rejects a withdrawal", async () => {
    mocks.verifySession.mockResolvedValue({ userId: ADMIN_USER_ID, role: "ADMIN" });
    mocks.userFindUnique.mockResolvedValue({ role: "ADMIN", admin: { id: "admin-1" } });
    mocks.withdrawalFindUnique.mockResolvedValue({
      id: WITHDRAWAL_ID,
      userId: STUDENT_USER_ID,
      amount: 10_000,
      status: "PENDING",
      user: { saldo: 40_000 },
    });
    mocks.transactionUserUpdate.mockResolvedValue({ saldo: 50_000 });

    await expect(
      decideWithdrawalRequestAction(WITHDRAWAL_ID, "REJECT", "Data rekening tidak cocok"),
    ).resolves.toEqual({ success: true });

    expect(mocks.transactionUserUpdate).toHaveBeenCalledWith({
      where: { id: STUDENT_USER_ID },
      data: { saldo: { increment: 10_000 } },
      select: { saldo: true },
    });
    expect(mocks.balanceCreate).toHaveBeenCalledWith({
      data: {
        userId: STUDENT_USER_ID,
        withdrawalId: WITHDRAWAL_ID,
        externalReference: `withdrawal:${WITHDRAWAL_ID}:refund`,
        type: "WITHDRAWAL_REFUND",
        amount: 10_000,
        balanceBefore: 40_000,
        balanceAfter: 50_000,
      },
      select: { id: true },
    });
  });
});
