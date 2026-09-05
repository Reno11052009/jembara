import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  userFindUnique: vi.fn(),
  projectFindFirst: vi.fn(),
  paymentFindFirst: vi.fn(),
  paymentFindUnique: vi.fn(),
  consumeRateLimit: vi.fn(),
  getMidtransStatus: vi.fn(),
  applyMidtransStatus: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/config/unifiedConfig", () => ({
  config: {
    security: {
      auth: {
        rateLimit: {
          paymentCreateByProject: { limit: 5, windowMs: 600_000 },
          paymentSyncByProject: { limit: 30, windowMs: 60_000 },
        },
      },
    },
  },
}));
vi.mock("@/lib/session", () => ({ verifySession: mocks.verifySession }));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    project: { findFirst: mocks.projectFindFirst },
    project_payment: {
      findFirst: mocks.paymentFindFirst,
      findUnique: mocks.paymentFindUnique,
    },
  },
}));
vi.mock("@/lib/rate-limit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  createRateLimitKey: (scope: string, value: string) => `${scope}:${value}`,
}));
vi.mock("@/lib/payments", () => {
  class PaymentFlowError extends Error {}
  return {
    PaymentFlowError,
    applyMidtransStatus: mocks.applyMidtransStatus,
    createOrReuseProjectPayment: vi.fn(),
  };
});
vi.mock("server-only", () => ({}));
vi.mock("@/lib/midtrans", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/midtrans")>()),
  getMidtransPaymentStatus: mocks.getMidtransStatus,
}));
vi.mock("@/lib/notifications", () => ({ createUserNotification: vi.fn() }));

import { syncProjectPaymentAction } from "@/app/actions/payments";

const projectId = "11111111-1111-4111-8111-111111111111";

describe("syncProjectPaymentAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({ userId: "owner-user-1" });
    mocks.userFindUnique.mockResolvedValue({
      role: "UMKM",
      umkm: { id: "umkm-1" },
    });
    mocks.projectFindFirst.mockResolvedValue({ id: projectId });
    mocks.paymentFindFirst.mockResolvedValue({ orderId: "JEM-order-1" });
    mocks.getMidtransStatus.mockResolvedValue({ order_id: "JEM-order-1", transaction_status: "pending" });
    mocks.applyMidtransStatus.mockResolvedValue({
      newlyHeld: false,
      project: {},
    });
    mocks.paymentFindUnique.mockResolvedValue({ status: "PENDING" });
  });

  it("rejects excessive status checks before calling Midtrans", async () => {
    mocks.consumeRateLimit.mockResolvedValue({ allowed: false });

    await expect(syncProjectPaymentAction(projectId)).resolves.toEqual({
      success: false,
      error: "Status terlalu sering diperiksa. Tunggu sebentar lalu coba lagi.",
    });

    expect(mocks.paymentFindFirst).not.toHaveBeenCalled();
    expect(mocks.getMidtransStatus).not.toHaveBeenCalled();
  });

  it("does not let another UMKM consume a project's rate-limit bucket", async () => {
    mocks.projectFindFirst.mockResolvedValue(null);

    await expect(syncProjectPaymentAction(projectId)).resolves.toEqual({
      success: false,
      error: "Proyek tidak ditemukan atau tidak dapat diakses.",
    });

    expect(mocks.consumeRateLimit).not.toHaveBeenCalled();
    expect(mocks.paymentFindFirst).not.toHaveBeenCalled();
    expect(mocks.getMidtransStatus).not.toHaveBeenCalled();
  });

  it("returns the validated refreshed payment status", async () => {
    mocks.consumeRateLimit.mockResolvedValue({ allowed: true });

    await expect(syncProjectPaymentAction(projectId)).resolves.toEqual({
      success: true,
      status: "PENDING",
    });
    expect(mocks.consumeRateLimit).toHaveBeenCalledWith({
      key: `payment:sync:project:${projectId}`,
      limit: 30,
      windowMs: 60_000,
    });
  });

  it("uses a stored transaction ID for payment methods requiring it", async () => {
    mocks.consumeRateLimit.mockResolvedValue({ allowed: true });
    mocks.paymentFindFirst.mockResolvedValue({
      orderId: "JEM-order-1", midtransTransactionId: "midtrans-transaction-1",
    });
    await syncProjectPaymentAction(projectId);
    expect(mocks.getMidtransStatus).toHaveBeenCalledWith({
      orderId: "JEM-order-1", midtransTransactionId: "midtrans-transaction-1",
    }, undefined);
  });

  it("verifies a callback transaction ID against the owned order before applying payment", async () => {
    mocks.consumeRateLimit.mockResolvedValue({ allowed: true });
    const transactionId = "A120260905101415U461HEEMUJID";
    mocks.paymentFindUnique.mockResolvedValue({ status: "HELD" });
    await expect(syncProjectPaymentAction(projectId, transactionId)).resolves.toEqual({
      success: true, status: "HELD",
    });
    expect(mocks.getMidtransStatus).toHaveBeenCalledWith({ orderId: "JEM-order-1" }, transactionId);
    expect(mocks.applyMidtransStatus).toHaveBeenCalledOnce();
  });

  it("does not apply another order's payment supplied through a callback ID", async () => {
    mocks.consumeRateLimit.mockResolvedValue({ allowed: true });
    mocks.getMidtransStatus.mockResolvedValue({
      order_id: "someone-elses-order", transaction_status: "settlement",
    });
    await expect(syncProjectPaymentAction(
      projectId, "22222222-2222-4222-8222-222222222222",
    )).resolves.toMatchObject({ success: false });
    expect(mocks.applyMidtransStatus).not.toHaveBeenCalled();
  });

  it("rejects a malformed transaction reference without contacting Midtrans", async () => {
    await expect(syncProjectPaymentAction(projectId, "../../status")).resolves.toMatchObject({
      success: false,
    });
    expect(mocks.getMidtransStatus).not.toHaveBeenCalled();
  });
});
