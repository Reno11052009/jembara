import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema, roleSelectionSchema } from "./auth.schema";

describe("auth schemas", () => {
  it("normalizes valid login input", () => {
    const result = loginSchema.parse({
      email: "  USER@Example.COM ",
      password: "password123",
    });

    expect(result.email).toBe("user@example.com");
  });

  it("rejects invalid login input", () => {
    expect(
      loginSchema.safeParse({ email: "not-an-email", password: "" }).success,
    ).toBe(false);
  });

  it("rejects login passwords beyond the bcrypt byte limit", () => {
    expect(
      loginSchema.safeParse({
        email: "chello@example.com",
        password: "🙂".repeat(19),
      }).success,
    ).toBe(false);
  });

  it("rejects mismatched registration passwords", () => {
    const result = registerSchema.safeParse({
      fullName: "Chello Arta",
      email: "chello@example.com",
      password: "password123",
      confirmPassword: "different-password",
      address: "Malang, Indonesia",
    });

    expect(result.success).toBe(false);
  });

  it("rejects passwords beyond the bcrypt byte limit", () => {
    const password = "🙂".repeat(19);
    const result = registerSchema.safeParse({
      fullName: "Chello Arta",
      email: "chello@example.com",
      password,
      confirmPassword: password,
      address: "Malang, Indonesia",
    });

    expect(result.success).toBe(false);
  });

  it("allows only public onboarding roles", () => {
    expect(roleSelectionSchema.safeParse({ role: "STUDENT" }).success).toBe(true);
    expect(roleSelectionSchema.safeParse({ role: "UMKM" }).success).toBe(true);
    expect(roleSelectionSchema.safeParse({ role: "ADMIN" }).success).toBe(false);
  });
});
