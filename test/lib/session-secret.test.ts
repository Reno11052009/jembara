import { describe, expect, it } from "vitest";

import { validateSessionSecret } from "@/lib/session-secret";

describe("validateSessionSecret", () => {
  it("rejects a missing secret", () => {
    expect(() => validateSessionSecret(undefined)).toThrow("SESSION_SECRET is required");
  });

  it("rejects a short secret", () => {
    expect(() => validateSessionSecret("too-short")).toThrow("at least 32 bytes");
  });

  it("rejects the former fallback secret", () => {
    expect(() =>
      validateSessionSecret("default_secret_key_change_this_in_production"),
    ).toThrow("known insecure value");
  });

  it("rejects accidental surrounding whitespace", () => {
    expect(() => validateSessionSecret(` ${"a".repeat(32)}`)).toThrow("whitespace");
  });

  it("accepts a secret with at least 32 bytes", () => {
    const secret = "a-secure-session-secret-with-32-plus-bytes";

    expect(validateSessionSecret(secret)).toBe(secret);
  });
});
