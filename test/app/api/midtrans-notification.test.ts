import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySignature: vi.fn(),
  applyStatus: vi.fn(),
  createNotification: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/midtrans", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/midtrans")>()),
  verifyMidtransSignature: mocks.verifySignature,
}));
vi.mock("@/lib/payments", () => ({
  applyMidtransStatus: mocks.applyStatus,
  PaymentFlowError: class PaymentFlowError extends Error {},
}));
vi.mock("@/lib/notifications", () => ({
  createUserNotification: mocks.createNotification,
}));

import { POST } from "@/app/api/payments/midtrans/notification/route";

const payload = {
  order_id: "JEM-order-1",
  status_code: "200",
  gross_amount: "500000.00",
  transaction_status: "settlement",
  transaction_id: "midtrans-1",
  payment_type: "bank_transfer",
  fraud_status: "accept",
  signature_key: "a".repeat(128),
};

describe("Midtrans notification route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySignature.mockReturnValue(true);
    mocks.applyStatus.mockResolvedValue({
      newlyHeld: false,
      project: {
        id: "project-1",
        title: "Website UMKM",
        umkm: { userId: "owner-user-1" },
        student: { userId: "student-user-1" },
      },
    });
  });

  it("rejects a notification with an invalid signature", async () => {
    mocks.verifySignature.mockReturnValue(false);
    const response = await POST(
      new Request("http://localhost/api/payments/midtrans/notification", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );

    expect(response.status).toBe(401);
    expect(mocks.applyStatus).not.toHaveBeenCalled();
  });

  it("processes a signed notification through the idempotent payment service", async () => {
    const response = await POST(
      new Request("http://localhost/api/payments/midtrans/notification", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({ received: true });
    expect(mocks.applyStatus).toHaveBeenCalledWith(payload);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard/settings");
    expect(mocks.revalidatePath).toHaveBeenCalledWith(
      "/dashboard/settings/pembayaran",
    );
  });

  it("requires JSON content", async () => {
    const response = await POST(
      new Request("http://localhost/api/payments/midtrans/notification", {
        method: "POST",
        headers: { "content-type": "text/plain" },
        body: JSON.stringify(payload),
      }),
    );

    expect(response.status).toBe(415);
    expect(mocks.verifySignature).not.toHaveBeenCalled();
  });

  it("rejects an oversized body before parsing or signature checks", async () => {
    const response = await POST(
      new Request("http://localhost/api/payments/midtrans/notification", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "content-length": String(65 * 1024),
        },
        body: JSON.stringify(payload),
      }),
    );

    expect(response.status).toBe(413);
    expect(mocks.verifySignature).not.toHaveBeenCalled();
  });
});
