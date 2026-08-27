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

const optionalBusinessText = (maximum: number) =>
  z.string().trim().max(maximum).optional();

export const roleSelectionSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("STUDENT"),
  }).strict(),
  z.object({
    role: z.literal("UMKM"),
    businessName: z
      .string({ error: "Nama usaha wajib diisi" })
      .trim()
      .min(3, "Nama usaha minimal 3 karakter")
      .max(120, "Nama usaha terlalu panjang"),
    businessCategory: z
      .string({ error: "Kategori usaha wajib diisi" })
      .trim()
      .min(2, "Kategori usaha minimal 2 karakter")
      .max(100, "Kategori usaha terlalu panjang"),
    addressDetail: z
      .string({ error: "Alamat usaha wajib diisi" })
      .trim()
      .min(5, "Detail alamat minimal 5 karakter")
      .max(255, "Detail alamat terlalu panjang"),
    provinceCode: z.string().regex(/^\d{2}$/, "Provinsi tidak valid"),
    regencyCode: z.string().regex(/^\d{2}\.\d{2}$/, "Kabupaten/kota tidak valid"),
    districtCode: z.string().regex(/^\d{2}\.\d{2}\.\d{2}$/, "Kecamatan tidak valid"),
    villageCode: z
      .string()
      .regex(/^\d{2}\.\d{2}\.\d{2}\.\d{4}$/, "Kelurahan/desa tidak valid"),
    phone: optionalBusinessText(30).refine(
      (value) => value === undefined || value === "" || /^[+\d\s().-]+$/.test(value),
      "Nomor telepon tidak valid",
    ),
    website: optionalBusinessText(2048).refine((value) => {
      if (value === undefined || value === "") return true;

      try {
        const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
        const url = new URL(candidate);
        return ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname);
      } catch {
        return false;
      }
    }, "Website tidak valid"),
  }).strict(),
]);

export type SelectableRole = z.infer<typeof roleSelectionSchema>["role"];

export function getValidationMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Data yang dikirim tidak valid";
}
