import { createHash } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  createSnapTransaction,
  getMidtransEnvironment,
  getMidtransPaymentStatus,
  getMidtransTransactionStatus,
  verifyMidtransSignature,
} from "@/lib/midtrans";

describe("verifyMidtransSignature", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("accepts the SHA-512 signature generated with the server key", () => {
    vi.stubEnv("MIDTRANS_SERVER_KEY", "SB-Mid-server-secret");
    const input = {
      order_id: "JEM-order-1",
      status_code: "200",
      gross_amount: "500000.00",
      transaction_status: "settlement",
      fraud_status: "accept",
    };
    const signature_key = createHash("sha512")
      .update(
        `${input.order_id}${input.status_code}${input.gross_amount}SB-Mid-server-secret`,
      )
      .digest("hex");

    expect(verifyMidtransSignature({ ...input, signature_key })).toBe(true);
  });

  it("rejects a forged signature", () => {
    vi.stubEnv("MIDTRANS_SERVER_KEY", "SB-Mid-server-secret");
    expect(
      verifyMidtransSignature({
        order_id: "JEM-order-1",
        status_code: "200",
        gross_amount: "500000.00",
        transaction_status: "settlement",
        fraud_status: "accept",
        signature_key: "0".repeat(128),
      }),
    ).toBe(false);
  });
});

describe("DANA payment reconciliation", () => {
  const orderId = "JEM-order-1";
  const transactionId = "A120260905101415U461HEEMUJID";
  const snap = {
    order_id: orderId, transaction_id: transactionId, status_code: "200",
    gross_amount: "20000000.00", payment_type: "dana", transaction_status: "settlement",
  };
  const core = { ...snap, order_id: transactionId, signature_key: "provider-signature" };
  const setup = (...responses: unknown[]) => {
    vi.stubEnv("MIDTRANS_SERVER_KEY", "test-server-key");
    vi.stubEnv("MIDTRANS_ENVIRONMENT", "sandbox");
    const fetchMock = vi.fn();
    for (const response of responses) fetchMock.mockResolvedValueOnce(Response.json(response));
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  };
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("recovers an old paid DANA checkout by proving its Snap binding then querying Core API", async () => {
    const fetchMock = setup({ status_code: "404" }, snap, core);
    await expect(getMidtransPaymentStatus({ orderId, snapToken: "stored-snap-token" })).resolves.toMatchObject({
      order_id: orderId, transaction_id: transactionId, transaction_status: "settlement",
      provider_order_id: transactionId, signature_key: undefined,
    });
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      `https://api.sandbox.midtrans.com/v2/${orderId}/status`,
      "https://app.sandbox.midtrans.com/snap/v1/transactions/stored-snap-token/status",
      `https://api.sandbox.midtrans.com/v2/${transactionId}/status`,
    ]);
    expect(fetchMock.mock.calls[2][1].headers.Authorization).toMatch(/^Basic /);
  });

  it("uses the stored verified transaction binding without relying on Snap again", async () => {
    const fetchMock = setup(core);
    await expect(getMidtransPaymentStatus({ orderId, midtransTransactionId: transactionId })).resolves.toMatchObject({
      order_id: orderId, transaction_status: "settlement",
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("never trusts an arbitrary callback ID whose provider order equals that ID", async () => {
    setup(core);
    await expect(getMidtransPaymentStatus({ orderId }, transactionId)).rejects.toThrow("tidak cocok");
  });

  it("rejects a Snap token bound to another order", async () => {
    const fetchMock = setup({ status_code: "404" }, { ...snap, order_id: "other-order" });
    await expect(getMidtransPaymentStatus({ orderId, snapToken: "stored-snap-token" })).rejects.toThrow("tidak cocok");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not mark a payment successful just because Snap reports settlement", async () => {
    setup({ status_code: "404" }, snap, { ...core, transaction_status: "pending" });
    await expect(getMidtransPaymentStatus({ orderId, snapToken: "stored-snap-token" })).resolves.toMatchObject({
      transaction_status: "pending",
    });
  });

  it("rejects a mismatched amount between Snap and authenticated Core API", async () => {
    setup({ status_code: "404" }, snap, { ...core, gross_amount: "100000.00" });
    await expect(getMidtransPaymentStatus({ orderId, snapToken: "stored-snap-token" })).rejects.toThrow("tidak cocok");
  });
});

describe("Midtrans API responses", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("reports Core API 404 inside an HTTP 200 response as a Midtrans error", async () => {
    vi.stubEnv("MIDTRANS_SERVER_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({
      status_code: "404", status_message: "Transaction doesn't exist.",
    })));

    await expect(getMidtransTransactionStatus("missing-order")).rejects.toMatchObject({
      name: "MidtransError", status: 404,
    });
  });

  it("preserves a valid expired transaction with a non-success status code", async () => {
    vi.stubEnv("MIDTRANS_SERVER_KEY", "test-key");
    const payload = {
      order_id: "JEM-order-1", status_code: "407", gross_amount: "500000.00",
      transaction_status: "expire",
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(payload)));

    await expect(getMidtransTransactionStatus("JEM-order-1")).resolves.toEqual(payload);
  });

  it("encodes the transaction reference and uses the normalized environment", async () => {
    vi.stubEnv("MIDTRANS_SERVER_KEY", "test-key");
    vi.stubEnv("MIDTRANS_ENVIRONMENT", " Production ");
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ status_code: "404" }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(getMidtransTransactionStatus("../another/path")).rejects.toMatchObject({ status: 404 });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.midtrans.com/v2/..%2Fanother%2Fpath/status", expect.any(Object),
    );
  });

  it("rejects a misspelled environment instead of silently querying sandbox", () => {
    vi.stubEnv("MIDTRANS_ENVIRONMENT", "prodution");
    expect(() => getMidtransEnvironment()).toThrow("MIDTRANS_ENVIRONMENT");
  });

  it("requests 3DS for card payments without overriding merchant payment channels", async () => {
    vi.stubEnv("MIDTRANS_SERVER_KEY", "test-key");
    vi.stubEnv("MIDTRANS_ENVIRONMENT", "sandbox");
    const fetchMock = vi.fn().mockResolvedValue(Response.json({
      token: "snap-token", redirect_url: "https://app.sandbox.midtrans.com/snap/token",
    }));
    vi.stubGlobal("fetch", fetchMock);
    await createSnapTransaction({
      orderId: "JEM-order-1", amount: 500000, projectTitle: "Website UMKM",
      customer: { firstName: "Owner", email: "owner@example.com" },
      finishUrl: "https://example.com/dashboard/payments/project?payment=finish",
    });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.credit_card).toEqual({ secure: true });
    expect(body.enabled_payments).toBeUndefined();
  });
});
