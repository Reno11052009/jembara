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

export class MidtransError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "MidtransError";
  }
}

function getMidtransConfig() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
  if (!serverKey) {
    throw new MidtransError("MIDTRANS_SERVER_KEY belum dikonfigurasi.");
  }

  const environment =
    process.env.MIDTRANS_ENVIRONMENT?.toLowerCase() === "production"
      ? "production"
      : "sandbox";

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
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  return snapResponseSchema.parse(await parseMidtransResponse(response));
}

export async function getMidtransTransactionStatus(orderId: string) {
  const config = getMidtransConfig();
  const response = await fetch(
    `${config.coreBaseUrl}/v2/${encodeURIComponent(orderId)}/status`,
    {
      headers: {
        Accept: "application/json",
        Authorization: createAuthorization(config.serverKey),
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    },
  );

  return midtransStatusSchema.parse(await parseMidtransResponse(response));
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
