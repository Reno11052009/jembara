import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { validateSessionSecret } from "./session-secret";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function key() { return createHash("sha256").update(validateSessionSecret(process.env.SESSION_SECRET)).digest(); }

export function encodeBase32(bytes: Uint8Array) {
  let bits = ""; for (const byte of bytes) bits += byte.toString(2).padStart(8, "0");
  let output = ""; for (let index = 0; index < bits.length; index += 5) output += alphabet[Number.parseInt(bits.slice(index, index + 5).padEnd(5, "0"), 2)];
  return output;
}

function decodeBase32(value: string) {
  const clean = value.toUpperCase().replace(/[^A-Z2-7]/g, ""); let bits = "";
  for (const char of clean) { const index = alphabet.indexOf(char); if (index < 0) throw new Error("Invalid base32"); bits += index.toString(2).padStart(5, "0"); }
  const bytes: number[] = []; for (let index = 0; index + 8 <= bits.length; index += 8) bytes.push(Number.parseInt(bits.slice(index, index + 8), 2));
  return Buffer.from(bytes);
}

export function generateTotpSecret() { return encodeBase32(randomBytes(20)); }
export function totpCode(secret: string, timestamp = Date.now()) {
  const counter = Math.floor(timestamp / 30_000); const bytes = Buffer.alloc(8); bytes.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac("sha1", decodeBase32(secret)).update(bytes).digest(); const offset = digest[digest.length - 1] & 15;
  const value = (digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000; return value.toString().padStart(6, "0");
}
export function verifyTotp(secret: string, code: string, timestamp = Date.now()) {
  if (!/^\d{6}$/.test(code)) return false;
  return [-1, 0, 1].some((window) => { const expected = Buffer.from(totpCode(secret, timestamp + window * 30_000)); const actual = Buffer.from(code); return actual.length === expected.length && timingSafeEqual(actual, expected); });
}
export function encryptTotpSecret(secret: string) { const iv = randomBytes(12); const cipher = createCipheriv("aes-256-gcm", key(), iv); const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]); return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), encrypted.toString("base64url")].join("."); }
export function decryptTotpSecret(value: string) { const [iv, tag, encrypted] = value.split("."); if (!iv || !tag || !encrypted) throw new Error("Invalid encrypted secret"); const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64url")); decipher.setAuthTag(Buffer.from(tag, "base64url")); return Buffer.concat([decipher.update(Buffer.from(encrypted, "base64url")), decipher.final()]).toString("utf8"); }
export function createRecoveryCodes() { return Array.from({ length: 8 }, () => `${encodeBase32(randomBytes(5)).slice(0, 4)}-${encodeBase32(randomBytes(5)).slice(0, 4)}`); }
export function hashRecoveryCode(code: string) { return createHmac("sha256", key()).update(code.trim().toUpperCase()).digest("hex"); }
export function createOtpAuthUri(secret: string, email: string) { return `otpauth://totp/${encodeURIComponent(`Jembara:${email}`)}?secret=${secret}&issuer=Jembara&algorithm=SHA1&digits=6&period=30`; }
