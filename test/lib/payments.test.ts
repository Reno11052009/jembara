import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  transaction: vi.fn(),
  paymentFindUnique: vi.fn(),
  paymentUpdateMany: vi.fn(),
  paymentUpdate: vi.fn(),
  projectUpdateMany: vi.fn(),
  userFindUnique: vi.fn(),
  userUpdate: vi.fn(),
  withdrawalFindMany: vi.fn(),
  withdrawalUpdateMany: vi.fn(),
  balanceTransactionCreate: vi.fn(),
  notificationCreate: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/auth-guard", () => ({ requireAuthenticatedSession: vi.fn() }));
vi.mock("@/lib/notifications", () => ({ createUserNotification: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  default: {
    $transaction: mocks.transaction,
  },
}));

import { applyMidtransStatus, PaymentFlowError } from "@/lib/payments";

const paymentRecord = {
  id: "payment-1",
  amount: 500_000,
  status: "PENDING",
  reversedAmount: 0,
  releasedToUserId: null,
  project: {
    id: "project-1",
    title: "Website UMKM",
    status: "PROPOSAL",
    studentId: "student-1",
    umkm: { userId: "owner-user-1" },
    student: { userId: "student-user-1" },
  },
};

const settlement = {
  order_id: "JEM-order-1",
  status_code: "200",
  gross_amount: "500000.00",
  transaction_status: "settlement",
  transaction_id: "midtrans-1",
  payment_type: "bank_transfer",
  fraud_status: "accept",
};

describe("applyMidtransStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.paymentFindUnique.mockResolvedValue(paymentRecord);
    mocks.paymentUpdateMany.mockResolvedValue({ count: 1 });
    mocks.projectUpdateMany.mockResolvedValue({ count: 1 });
    mocks.userFindUnique.mockResolvedValue({ saldo: 600_000 });
    mocks.userUpdate.mockResolvedValue({ saldo: 100_000 });
    mocks.withdrawalFindMany.mockResolvedValue([]);
    mocks.withdrawalUpdateMany.mockResolvedValue({ count: 1 });
    mocks.balanceTransactionCreate.mockResolvedValue({ id: "ledger-1" });
    mocks.notificationCreate.mockResolvedValue({ id: "notification-1" });
    mocks.transaction.mockImplementation(
      async (callback: (transaction: unknown) => Promise<unknown>) =>
        callback({
          project_payment: {
            findUnique: mocks.paymentFindUnique,
            updateMany: mocks.paymentUpdateMany,
            update: mocks.paymentUpdate,
          },
          project: { updateMany: mocks.projectUpdateMany },
          user: {
            findUnique: mocks.userFindUnique,
            update: mocks.userUpdate,
          },
          withdrawal_request: {
            findMany: mocks.withdrawalFindMany,
            updateMany: mocks.withdrawalUpdateMany,
          },
          balance_transaction: { create: mocks.balanceTransactionCreate },
          notification: { create: mocks.notificationCreate },
        }),
    );
  });

  it("holds a verified successful payment and starts the project", async () => {
    await expect(applyMidtransStatus(settlement)).resolves.toMatchObject({
      newlyHeld: true,
    });

    expect(mocks.paymentUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "payment-1",
          status: { in: ["CREATING", "PENDING", "FAILED"] },
        },
        data: expect.objectContaining({ status: "HELD" }),
      }),
    );
    expect(mocks.projectUpdateMany).toHaveBeenCalledWith({
      where: {
        id: "project-1",
        status: "PROPOSAL",
        studentId: "student-1",
      },
      data: { status: "IN_PROGRESS" },
    });
  });

  it("accepts a successful settlement when the payment method omits fraud_status", async () => {
    const settlementWithoutFraudStatus = {
      order_id: settlement.order_id,
      status_code: settlement.status_code,
      gross_amount: settlement.gross_amount,
      transaction_status: settlement.transaction_status,
      transaction_id: settlement.transaction_id,
      payment_type: settlement.payment_type,
    };

    await expect(
      applyMidtransStatus(settlementWithoutFraudStatus),
    ).resolves.toMatchObject({ newlyHeld: true });
    expect(mocks.paymentUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: "HELD" }) }),
    );
    expect(mocks.projectUpdateMany).toHaveBeenCalledOnce();
  });

  it("does not duplicate a payment that is already held", async () => {
    mocks.paymentFindUnique.mockResolvedValue({
      ...paymentRecord,
      status: "HELD",
      project: { ...paymentRecord.project, status: "IN_PROGRESS" },
    });

    await expect(applyMidtransStatus(settlement)).resolves.toMatchObject({
      newlyHeld: false,
    });
    expect(mocks.paymentUpdateMany).not.toHaveBeenCalled();
    expect(mocks.projectUpdateMany).not.toHaveBeenCalled();
  });

  it("does not downgrade a held payment when an older expiry notification arrives", async () => {
    mocks.paymentFindUnique.mockResolvedValue({
      ...paymentRecord,
      status: "HELD",
      project: { ...paymentRecord.project, status: "IN_PROGRESS" },
    });

    await expect(
      applyMidtransStatus({
        ...settlement,
        status_code: "407",
        transaction_status: "expire",
      }),
    ).resolves.toMatchObject({ newlyHeld: false });

    expect(mocks.paymentUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "payment-1",
          status: {
            in: ["CREATING", "PENDING", "FAILED", "EXPIRED", "CANCELLED"],
          },
        },
      }),
    );
  });

  it("rejects a notification whose amount differs from the database", async () => {
    await expect(
      applyMidtransStatus({ ...settlement, gross_amount: "499999.00" }),
    ).rejects.toThrow(PaymentFlowError);
    expect(mocks.paymentUpdateMany).not.toHaveBeenCalled();
  });

  it("reverses a released balance when Midtrans reports a full refund", async () => {
    mocks.paymentFindUnique.mockResolvedValue({
      ...paymentRecord,
      status: "RELEASED",
      releasedToUserId: "student-user-1",
      project: { ...paymentRecord.project, status: "COMPLETED" },
    });

    await expect(
      applyMidtransStatus({
        ...settlement,
        transaction_status: "refund",
      }),
    ).resolves.toMatchObject({ newlyHeld: false });

    expect(mocks.paymentUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "payment-1",
          reversedAmount: 0,
        }),
        data: expect.objectContaining({
          status: "REFUNDED",
          reversedAmount: 500_000,
        }),
      }),
    );
    expect(mocks.userUpdate).toHaveBeenCalledWith({
      where: { id: "student-user-1" },
      data: { saldo: { decrement: 500_000 } },
      select: { saldo: true },
    });
    expect(mocks.balanceTransactionCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        externalReference: "payment-1:REFUNDED:500000",
        type: "PAYMENT_REFUND",
        amount: -500_000,
        balanceBefore: 600_000,
        balanceAfter: 100_000,
      }),
      select: { id: true },
    });
  });

  it("does not apply the same refund notification twice", async () => {
    mocks.paymentFindUnique.mockResolvedValue({
      ...paymentRecord,
      status: "REFUNDED",
      reversedAmount: 500_000,
      releasedToUserId: "student-user-1",
      project: { ...paymentRecord.project, status: "COMPLETED" },
    });

    await expect(
      applyMidtransStatus({
        ...settlement,
        transaction_status: "refund",
      }),
    ).resolves.toMatchObject({ newlyHeld: false });

    expect(mocks.paymentUpdateMany).not.toHaveBeenCalled();
    expect(mocks.userUpdate).not.toHaveBeenCalled();
    expect(mocks.balanceTransactionCreate).not.toHaveBeenCalled();
  });

  it("cancels a pending withdrawal before reversing released funds", async () => {
    mocks.paymentFindUnique.mockResolvedValue({
      ...paymentRecord,
      status: "RELEASED",
      releasedToUserId: "student-user-1",
      project: { ...paymentRecord.project, status: "COMPLETED" },
    });
    mocks.userFindUnique.mockResolvedValue({ saldo: 0 });
    mocks.withdrawalFindMany.mockResolvedValue([
      { id: "withdrawal-1", amount: 500_000 },
    ]);
    mocks.userUpdate
      .mockResolvedValueOnce({ saldo: 500_000 })
      .mockResolvedValueOnce({ saldo: 0 });

    await expect(
      applyMidtransStatus({ ...settlement, transaction_status: "chargeback" }),
    ).resolves.toMatchObject({ newlyHeld: false });

    expect(mocks.withdrawalUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "withdrawal-1", status: "PENDING" },
        data: expect.objectContaining({ status: "REJECTED" }),
      }),
    );
    expect(mocks.balanceTransactionCreate).toHaveBeenNthCalledWith(
      1,
      {
        data: expect.objectContaining({
          withdrawalId: "withdrawal-1",
          type: "WITHDRAWAL_REFUND",
          amount: 500_000,
          balanceBefore: 0,
          balanceAfter: 500_000,
        }),
        select: { id: true },
      },
    );
    expect(mocks.notificationCreate).toHaveBeenCalledOnce();
    expect(mocks.userUpdate).toHaveBeenLastCalledWith({
      where: { id: "student-user-1" },
      data: { saldo: { decrement: 500_000 } },
      select: { saldo: true },
    });
  });

  it("does not downgrade a refunded payment when a stale pending status arrives", async () => {
    mocks.paymentFindUnique.mockResolvedValue({
      ...paymentRecord,
      status: "REFUNDED",
      reversedAmount: 500_000,
      project: { ...paymentRecord.project, status: "COMPLETED" },
    });

    await expect(
      applyMidtransStatus({
        ...settlement,
        status_code: "201",
        transaction_status: "pending",
      }),
    ).resolves.toMatchObject({ newlyHeld: false });

    expect(mocks.paymentUpdateMany).not.toHaveBeenCalled();
  });
});
