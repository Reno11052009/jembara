import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  transaction: vi.fn(),
  paymentFindUnique: vi.fn(),
  paymentUpdateMany: vi.fn(),
  paymentUpdate: vi.fn(),
  projectUpdateMany: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/auth-guard", () => ({ requireAuthenticatedSession: vi.fn() }));
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
    mocks.transaction.mockImplementation(
      async (callback: (transaction: unknown) => Promise<unknown>) =>
        callback({
          project_payment: {
            findUnique: mocks.paymentFindUnique,
            updateMany: mocks.paymentUpdateMany,
            update: mocks.paymentUpdate,
          },
          project: { updateMany: mocks.projectUpdateMany },
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

  it("rejects a notification whose amount differs from the database", async () => {
    await expect(
      applyMidtransStatus({ ...settlement, gross_amount: "499999.00" }),
    ).rejects.toThrow(PaymentFlowError);
    expect(mocks.paymentUpdateMany).not.toHaveBeenCalled();
  });
});
