import { describe, expect, it } from "vitest";
import {
  createDatabasePoolConfig,
  requireEncryptedDatabaseUrl,
} from "@/lib/database-connection";

describe("database connection security", () => {
  it("forces TLS for remote PostgreSQL connections", () => {
    const value = requireEncryptedDatabaseUrl(
      "postgresql://user:secret@example.supabase.co:5432/postgres",
    );

    expect(new URL(value).searchParams.get("sslmode")).toBe("require");
  });

  it("forces encrypted node-postgres connections even without a project CA", () => {
    const config = createDatabasePoolConfig(
      "postgresql://user:secret@example.supabase.co:5432/postgres",
      "DATABASE_URL",
      "",
    );

    const url = new URL(config.connectionString!);
    expect(config.ssl).toBeUndefined();
    expect(url.searchParams.get("sslmode")).toBe("require");
    expect(url.searchParams.get("uselibpqcompat")).toBe("true");
  });

  it("rejects explicitly insecure SSL modes", () => {
    expect(() =>
      requireEncryptedDatabaseUrl(
        "postgresql://user:secret@example.supabase.co/postgres?sslmode=disable",
      ),
    ).toThrow("insecure SSL mode");
  });

  it("allows local development databases without TLS", () => {
    const value = requireEncryptedDatabaseUrl(
      "postgresql://user:secret@localhost:5432/jembara",
    );

    expect(new URL(value).searchParams.has("sslmode")).toBe(false);
  });

  it("uses CA verification when a Supabase certificate is configured", () => {
    const certificate = [
      "-----BEGIN CERTIFICATE-----",
      "test-certificate",
      "-----END CERTIFICATE-----",
    ].join("\n");
    const config = createDatabasePoolConfig(
      "postgresql://user:secret@example.supabase.co/postgres",
      "DATABASE_URL",
      Buffer.from(certificate).toString("base64"),
    );

    expect(config.ssl).toEqual({ ca: certificate, rejectUnauthorized: true });
    expect(new URL(config.connectionString!).searchParams.has("sslmode")).toBe(false);
  });

  it("rejects malformed CA certificate input", () => {
    expect(() =>
      createDatabasePoolConfig(
        "postgresql://user:secret@example.supabase.co/postgres",
        "DATABASE_URL",
        Buffer.from("not a certificate").toString("base64"),
      ),
    ).toThrow("base64-encoded PEM certificate");
  });
});
