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
vi.mock("@/lib/midtrans", () => {
  class MidtransError extends Error {
    status?: number;
  }
  return {
    MidtransError,
    getMidtransTransactionStatus: mocks.getMidtransStatus,
  };
});
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
    mocks.getMidtransStatus.mockResolvedValue({ transaction_status: "pending" });
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
});
