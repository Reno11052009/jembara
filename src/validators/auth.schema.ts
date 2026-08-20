import { z } from "zod";

const MAX_BCRYPT_PASSWORD_BYTES = 72;

const emailSchema = z
  .string({ error: "Email wajib diisi" })
  .trim()
  .min(1, "Email wajib diisi")
  .max(254, "Email terlalu panjang")
  .email("Format email tidak valid")
  .transform((email) => email.toLowerCase());

const loginPasswordSchema = z
  .string({ error: "Password wajib diisi" })
  .min(1, "Password wajib diisi")
  .max(128, "Password terlalu panjang")
  .refine(
    (password) => new TextEncoder().encode(password).length <= MAX_BCRYPT_PASSWORD_BYTES,
    "Password maksimal 72 byte",
  );

const registrationPasswordSchema = loginPasswordSchema
  .min(8, "Password minimal 8 karakter");

export const loginSchema = z
  .object({
    email: emailSchema,
    password: loginPasswordSchema,
  })
  .strict();

export const registerSchema = z
  .object({
    fullName: z
      .string({ error: "Nama lengkap wajib diisi" })
      .trim()
      .min(3, "Nama terlalu pendek")
      .max(100, "Nama terlalu panjang"),
    email: emailSchema,
    password: registrationPasswordSchema,
    confirmPassword: z.string({ error: "Konfirmasi password wajib diisi" }),
    address: z
      .string({ error: "Alamat wajib diisi" })
      .trim()
      .min(5, "Alamat terlalu pendek")
      .max(255, "Alamat terlalu panjang"),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export const roleSelectionSchema = z
  .object({
    role: z.enum(["STUDENT", "UMKM"], {
      error: "Pilihan peran tidak valid",
    }),
  })
  .strict();

export type SelectableRole = z.infer<typeof roleSelectionSchema>["role"];

export function getValidationMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Data yang dikirim tidak valid";
}
