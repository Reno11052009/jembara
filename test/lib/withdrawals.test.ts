import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedSession: vi.fn(),
  userFindUnique: vi.fn(),
  withdrawalFindMany: vi.fn(),
  withdrawalCount: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth-guard", () => ({
  requireAuthenticatedSession: mocks.requireAuthenticatedSession,
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    withdrawal_request: {
      findMany: mocks.withdrawalFindMany,
      count: mocks.withdrawalCount,
    },
  },
}));

import { getWithdrawalPageData } from "@/lib/withdrawals";

const request = {
  id: "33333333-3333-4333-8333-333333333333",
  amount: 10_000,
  provider: "BCA",
  accountName: "Ayu Lestari",
  accountNumber: "1234567890",
  status: "PENDING",
  adminNote: null,
  createdAt: new Date("2026-09-05T01:00:00.000Z"),
  processedAt: null,
  user: { name: "Ayu Lestari", email: "ayu@example.com" },
};

describe("getWithdrawalPageData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuthenticatedSession.mockResolvedValue({ userId: "user-1" });
    mocks.withdrawalFindMany.mockResolvedValue([request]);
    mocks.withdrawalCount.mockResolvedValue(1);
  });

  it("returns only the student's own requests and masks the destination number", async () => {
    mocks.userFindUnique.mockResolvedValue({
      role: "STUDENT",
      saldo: 40_000,
      student: { id: "student-1" },
      admin: null,
      payoutMethods: [
        {
          id: "method-1",
          provider: "BCA",
          accountName: "Ayu Lestari",
          accountNumber: "1234567890",
          isPrimary: true,
        },
      ],
    });

    const result = await getWithdrawalPageData();

    expect(mocks.withdrawalFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1" } }),
    );
    expect(result).toMatchObject({
      role: "STUDENT",
      balance: 40_000,
      requests: [{ accountNumber: "••••••7890" }],
      payoutMethods: [{ id: "method-1", isPrimary: true }],
    });
  });

  it("returns pending requests first and reveals payout details to admins", async () => {
    mocks.userFindUnique.mockResolvedValue({
      role: "ADMIN",
      saldo: 0,
      student: null,
      admin: { id: "admin-1" },
      payoutMethods: [],
    });
    mocks.withdrawalFindMany
      .mockResolvedValueOnce([request])
      .mockResolvedValueOnce([]);

    const result = await getWithdrawalPageData();

    expect(mocks.withdrawalFindMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ where: { status: "PENDING" } }),
    );
    expect(result).toMatchObject({
      role: "ADMIN",
      pendingCount: 1,
      requests: [{ accountNumber: "1234567890" }],
    });
  });

  it("redirects UMKM accounts away from withdrawal operations", async () => {
    mocks.userFindUnique.mockResolvedValue({
      role: "UMKM",
      saldo: 0,
      student: null,
      admin: null,
      payoutMethods: [],
    });

    await getWithdrawalPageData();

    expect(mocks.redirect).toHaveBeenCalledWith("/forbidden");
    expect(mocks.withdrawalFindMany).not.toHaveBeenCalled();
  });
});
