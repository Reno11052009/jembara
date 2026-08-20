import { SignJWT } from "jose";
import { describe, expect, it, vi } from "vitest";

const { testSecret } = vi.hoisted(() => ({
  testSecret: "test-session-secret-that-is-at-least-32-bytes",
}));

vi.mock("server-only", () => ({}));
vi.mock("@/config/unifiedConfig", () => ({
  config: {
    security: {
      auth: {
        session: {
          secret: testSecret,
          issuer: "jembara",
          audience: "jembara:web",
        },
      },
    },
  },
}));

import { decrypt, encrypt } from "./session";

describe("session JWT", () => {
  it("round-trips a valid session", async () => {
    const token = await encrypt({
      userId: "user-id",
      role: "STUDENT",
      name: "Chello",
    });

    await expect(decrypt(token)).resolves.toEqual({
      userId: "user-id",
      role: "STUDENT",
      name: "Chello",
    });
  });

  it("rejects a token without the required issuer and audience", async () => {
    const legacyToken = await new SignJWT({
      userId: "user-id",
      role: "ADMIN",
      name: "Attacker",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(testSecret));

    await expect(decrypt(legacyToken)).resolves.toBeNull();
  });

  it("rejects a token with an invalid payload shape", async () => {
    const malformedToken = await new SignJWT({ userId: "user-id" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer("jembara")
      .setAudience("jembara:web")
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(testSecret));

    await expect(decrypt(malformedToken)).resolves.toBeNull();
  });
});
