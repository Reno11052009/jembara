import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const snapResponseSchema = z.object({
  token: z.string().min(1),
  redirect_url: z.string().url(),
});

export const midtransStatusSchema = z.looseObject({
  order_id: z.string().min(1).max(50),
  status_code: z.string().min(3).max(3),
  gross_amount: z.string().regex(/^\d+(?:\.\d{1,2})?$/),
  transaction_status: z.string().min(1),
  transaction_id: z.string().optional(),
  payment_type: z.string().optional(),
  fraud_status: z.string().optional(),
  refund_amount: z.string().regex(/^\d+(?:\.\d{1,2})?$/).optional(),
  signature_key: z.string().optional(),
});

export type MidtransStatusPayload = z.infer<typeof midtransStatusSchema>;

export const midtransTransactionIdSchema = z.string().min(1).max(128).regex(/^[a-zA-Z0-9_-]+$/);

export class MidtransError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "MidtransError";
  }
}

export function getMidtransEnvironment() {
  const environment = process.env.MIDTRANS_ENVIRONMENT?.trim().toLowerCase() || "sandbox";
  if (environment !== "sandbox" && environment !== "production") {
    throw new MidtransError("MIDTRANS_ENVIRONMENT harus sandbox atau production.");
  }
  return environment;
}

function getMidtransConfig() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
  if (!serverKey) {
    throw new MidtransError("MIDTRANS_SERVER_KEY belum dikonfigurasi.");
  }

  const environment = getMidtransEnvironment();

  return {
    serverKey,
    snapBaseUrl:
      environment === "production"
        ? "https://app.midtrans.com"
        : "https://app.sandbox.midtrans.com",
    coreBaseUrl:
      environment === "production"
        ? "https://api.midtrans.com"
        : "https://api.sandbox.midtrans.com",
  };
}

function createAuthorization(serverKey: string) {
  return `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`;
}

async function parseMidtransResponse(response: Response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error_messages" in payload
        ? String(payload.error_messages)
        : `Midtrans merespons dengan HTTP ${response.status}.`;
    throw new MidtransError(message, response.status);
  }
  return payload;
}

export async function createSnapTransaction(input: {
  orderId: string;
  amount: number;
  projectTitle: string;
  customer: { firstName: string; email: string; phone?: string | null };
  finishUrl: string;
}) {
  const config = getMidtransConfig();
  const response = await fetch(`${config.snapBaseUrl}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: createAuthorization(config.serverKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: input.orderId,
        gross_amount: input.amount,
      },
      item_details: [
        {
          id: input.orderId,
          price: input.amount,
          quantity: 1,
          name: input.projectTitle.slice(0, 50),
        },
      ],
      customer_details: {
        first_name: input.customer.firstName.slice(0, 50),
        email: input.customer.email,
        ...(input.customer.phone ? { phone: input.customer.phone } : {}),
      },
      callbacks: { finish: input.finishUrl },
      credit_card: { secure: true },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  return snapResponseSchema.parse(await parseMidtransResponse(response));
}

export async function getMidtransTransactionStatus(transactionReference: string) {
  const config = getMidtransConfig();
  const response = await fetch(
    `${config.coreBaseUrl}/v2/${encodeURIComponent(transactionReference)}/status`,
    {
      headers: {
        Accept: "application/json",
        Authorization: createAuthorization(config.serverKey),
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    },
  );

  const payload = await parseMidtransResponse(response);
  // Core API can return HTTP 200 with a 4xx/5xx status_code and no transaction.
  // A valid transaction may also carry a non-2xx code (e.g. an expired payment).
  const parsed = midtransStatusSchema.safeParse(payload);
  if (parsed.success) return parsed.data;

  const apiError = z.object({ status_code: z.string().regex(/^[45]\d{2}$/) }).safeParse(payload);
  if (apiError.success) {
    const status = Number(apiError.data.status_code);
    throw new MidtransError(`Midtrans belum dapat memberikan status transaksi (kode ${status}).`, status);
  }
  throw new MidtransError("Respons status transaksi dari Midtrans tidak valid.");
}

export async function getMidtransPaymentStatus(payment: {
  orderId: string;
  midtransTransactionId?: string | null;
  snapToken?: string | null;
}, transactionIdHint?: string) {
  let coreStatus: MidtransStatusPayload | undefined;
  try {
    coreStatus = await getMidtransTransactionStatus(
      transactionIdHint || payment.midtransTransactionId || payment.orderId,
    );
  } catch (error) {
    if (!(error instanceof MidtransError && error.status === 404) || !payment.snapToken) throw error;
  }
  if (coreStatus?.order_id === payment.orderId) return coreStatus;

  // DANA can report its provider transaction ID as Core API order_id. A
  // browser-supplied ID must never establish ownership of that payment.
  const bindOrder = (status: MidtransStatusPayload): MidtransStatusPayload => ({
    ...status,
    order_id: payment.orderId,
    provider_order_id: status.order_id,
    // The original signature covers provider_order_id, not our mapped order.
    signature_key: undefined,
  });
  if (
    coreStatus && payment.midtransTransactionId &&
    coreStatus.transaction_id === payment.midtransTransactionId &&
    coreStatus.order_id === payment.midtransTransactionId
  ) return bindOrder(coreStatus);

  if (!payment.snapToken) {
    throw new MidtransError("ID pesanan Midtrans tidak cocok dengan pembayaran proyek.");
  }

  // Snap's own status endpoint provides the original order-to-transaction
  // binding for old checkouts that never received a callback/webhook. Use only
  // the token stored by our server. Financial status still comes from Core API.
  const { snapBaseUrl } = getMidtransConfig();
  const response = await fetch(
    `${snapBaseUrl}/snap/v1/transactions/${encodeURIComponent(payment.snapToken)}/status`,
    { headers: { Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(10_000) },
  );
  const snapStatus = midtransStatusSchema.parse(await parseMidtransResponse(response));
  const transactionId = midtransTransactionIdSchema.parse(snapStatus.transaction_id);
  if (snapStatus.order_id !== payment.orderId) {
    throw new MidtransError("ID pesanan Snap tidak cocok dengan pembayaran proyek.");
  }
  if (coreStatus?.transaction_id !== transactionId) {
    coreStatus = await getMidtransTransactionStatus(transactionId);
  }
  if (
    coreStatus.transaction_id !== transactionId ||
    (coreStatus.order_id !== payment.orderId && coreStatus.order_id !== transactionId) ||
    Number(coreStatus.gross_amount) !== Number(snapStatus.gross_amount)
  ) {
    throw new MidtransError("Data transaksi Core API tidak cocok dengan pesanan Snap.");
  }
  return coreStatus.order_id === payment.orderId ? coreStatus : bindOrder(coreStatus);
}

export function verifyMidtransSignature(payload: MidtransStatusPayload) {
  const signature = payload.signature_key;
  if (!signature || !/^[a-f\d]{128}$/i.test(signature)) return false;

  const { serverKey } = getMidtransConfig();
  const expected = createHash("sha512")
    .update(
      `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`,
      "utf8",
    )
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(signature, "hex");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}
