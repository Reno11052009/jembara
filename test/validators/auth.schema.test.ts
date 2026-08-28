import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema, roleSelectionSchema } from "@/validators/auth.schema";

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
    expect(
      roleSelectionSchema.safeParse({
        role: "UMKM",
        businessName: "Kopi Jembara",
        businessCategory: "Kuliner",
        addressDetail: "Jalan Merdeka 10",
        provinceCode: "35",
        regencyCode: "35.73",
        districtCode: "35.73.05",
        villageCode: "35.73.05.1001",
        phone: "+62 812-3456-7890",
        website: "kopijembara.id",
      }).success,
    ).toBe(true);
    expect(roleSelectionSchema.safeParse({ role: "ADMIN" }).success).toBe(false);
  });

  it("requires business details when selecting the UMKM role", () => {
    const result = roleSelectionSchema.safeParse({ role: "UMKM" });

    expect(result.success).toBe(false);
  });

  it("rejects invalid UMKM contact details", () => {
    const result = roleSelectionSchema.safeParse({
      role: "UMKM",
      businessName: "Kopi Jembara",
      businessCategory: "Kuliner",
      addressDetail: "Jalan Merdeka 10",
      provinceCode: "35",
      regencyCode: "35.73",
      districtCode: "35.73.05",
      villageCode: "35.73.05.1001",
      phone: "telepon saya",
      website: "https://",
    });

    expect(result.success).toBe(false);
  });
});
