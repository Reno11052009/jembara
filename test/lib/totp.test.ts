import { describe, expect, it, vi } from "vitest";

vi.stubEnv("SESSION_SECRET", "a-secure-test-secret-with-at-least-32-bytes");
import { decryptTotpSecret, encryptTotpSecret, generateTotpSecret, hashRecoveryCode, totpCode, verifyTotp } from "@/lib/totp";

describe("TOTP", () => {
  it("generates and verifies a six-digit time-based code", () => {
    const secret = generateTotpSecret(); const timestamp = 1_800_000_000_000; const code = totpCode(secret, timestamp);
    expect(code).toMatch(/^\d{6}$/); expect(verifyTotp(secret, code, timestamp)).toBe(true); expect(verifyTotp(secret, "000000", timestamp)).toBe(code === "000000");
  });
  it("encrypts secrets at rest", () => { const secret = generateTotpSecret(); const encrypted = encryptTotpSecret(secret); expect(encrypted).not.toContain(secret); expect(decryptTotpSecret(encrypted)).toBe(secret); });
  it("normalizes recovery code hashes", () => { expect(hashRecoveryCode("abcd-efgh")).toBe(hashRecoveryCode("ABCD-EFGH")); });
});
