import { createHash } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { verifyMidtransSignature } from "@/lib/midtrans";

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
