import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedSession: vi.fn(),
  userFindUnique: vi.fn(),
  payoutMethodFindMany: vi.fn(),
  projectPaymentFindMany: vi.fn(),
  withdrawalFindMany: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth-guard", () => ({
  requireAuthenticatedSession: mocks.requireAuthenticatedSession,
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    payout_method: { findMany: mocks.payoutMethodFindMany },
    project_payment: { findMany: mocks.projectPaymentFindMany },
    withdrawal_request: { findMany: mocks.withdrawalFindMany },
  },
}));

import { getPaymentSettingsData } from "@/lib/payment-settings";

describe("getPaymentSettingsData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuthenticatedSession.mockResolvedValue({ userId: "student-user-1" });
    mocks.userFindUnique.mockResolvedValue({
      role: "STUDENT",
      saldo: 75_000,
      student: { id: "student-1" },
    });
    mocks.payoutMethodFindMany.mockResolvedValue([
      {
        id: "method-1",
        provider: "BCA",
        accountName: "Ayu Lestari",
        accountNumber: "1234567890",
        isPrimary: true,
      },
    ]);
    mocks.projectPaymentFindMany.mockResolvedValue([
      {
        id: "payment-1",
        amount: 100_000,
        reversedAmount: 0,
        status: "RELEASED",
        createdAt: new Date("2026-09-05T01:00:00.000Z"),
        updatedAt: new Date("2026-09-05T01:00:00.000Z"),
        paidAt: new Date("2026-09-04T01:00:00.000Z"),
        heldAt: new Date("2026-09-04T01:00:00.000Z"),
        releasedAt: new Date("2026-09-05T01:00:00.000Z"),
        project: { title: "Website UMKM" },
      },
    ]);
    mocks.withdrawalFindMany.mockResolvedValue([
      {
        id: "withdrawal-1",
        amount: 25_000,
        provider: "BCA",
        accountNumber: "1234567890",
        status: "PENDING",
        createdAt: new Date("2026-09-05T02:00:00.000Z"),
        updatedAt: new Date("2026-09-05T02:00:00.000Z"),
        processedAt: null,
      },
    ]);
  });

  it("returns persisted methods and merges database payment and withdrawal history", async () => {
    const result = await getPaymentSettingsData();

    expect(result).toMatchObject({
      canManagePayoutMethods: true,
      paymentMethods: [
        {
          id: "method-1",
          name: "BCA",
          detailLine: "Ayu Lestari · ••••••7890",
          isPrimary: true,
        },
      ],
      transactions: [
        {
          description: "Penarikan ke BCA · ••••••7890",
          amountType: "debit",
          status: "Menunggu Admin",
        },
        {
          description: "Pembayaran proyek: Website UMKM",
          amountType: "credit",
          status: "Selesai",
        },
      ],
    });
  });

  it("does not expose student payout controls to UMKM", async () => {
    mocks.userFindUnique.mockResolvedValue({
      role: "UMKM",
      saldo: 0,
      student: null,
    });

    const result = await getPaymentSettingsData();

    expect(result.canManagePayoutMethods).toBe(false);
    expect(result.paymentMethods).toEqual([]);
    expect(mocks.payoutMethodFindMany).not.toHaveBeenCalled();
    expect(mocks.projectPaymentFindMany).not.toHaveBeenCalled();
    expect(mocks.withdrawalFindMany).not.toHaveBeenCalled();
  });
});
