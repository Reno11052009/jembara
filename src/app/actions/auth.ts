"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { createSession, deleteSession, verifySession } from "@/lib/session";
import { LoginFormData, RegisterFormData } from "@/types/auth";
import { config } from "@/config/unifiedConfig";
import {
  clearRateLimit,
  consumeRateLimit,
  consumeRateLimits,
  createRateLimitKey,
  getClientAddress,
} from "@/lib/rate-limit";
import {
  getValidationMessage,
  loginSchema,
  registerSchema,
  roleSelectionSchema,
} from "@/validators/auth.schema";
import {
  formatRegionLocation,
  RegionInputError,
  RegionServiceError,
  validateRegionSelection,
} from "@/lib/regions";

const INVALID_CREDENTIALS_MESSAGE = "Email atau password salah";
const RATE_LIMIT_MESSAGE = "Terlalu banyak percobaan. Silakan coba lagi nanti";
const EMAIL_ALREADY_REGISTERED_MESSAGE =
  "Email sudah terdaftar. Silakan masuk atau gunakan email lain.";
const DUMMY_PASSWORD_HASH = "$2b$10$4VcIQIWwB9giOWgG9HFHbOlk5D5ut/ZfJf7gD3yhMgEzKAxcTcraS";

async function checkLoginRateLimit(email: string) {
  const clientAddress = await getClientAddress();
  const ipKey = createRateLimitKey("auth:login:ip", clientAddress);
  // Menggabungkan alamat sumber dan identitas mencegah satu penyerang
  // mengunci akun korban untuk semua perangkat/lokasi.
  const identityKey = createRateLimitKey(
    "auth:login:ip-identity",
    `${clientAddress}:${email}`,
  );
  const rateLimitConfig = config.security.auth.rateLimit;

  const [ipResult, identityResult] = await consumeRateLimits([
    { key: ipKey, ...rateLimitConfig.loginByIp },
    { key: identityKey, ...rateLimitConfig.loginByIpAndIdentity },
  ]);

  return {
    allowed: ipResult.allowed && identityResult.allowed,
    identityKey,
  };
}

async function checkRegistrationRateLimit() {
  const clientAddress = await getClientAddress();
  const key = createRateLimitKey("auth:register:ip", clientAddress);
  const result = await consumeRateLimit({
    key,
    ...config.security.auth.rateLimit.registerByIp,
  });

  return result.allowed;
}

export async function loginAction(formData: LoginFormData): Promise<{ error?: string } | never> {
  const parsed = loginSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: getValidationMessage(parsed.error) };
  }

  const { email, password } = parsed.data;
  const rateLimit = await checkLoginRateLimit(email);
  if (!rateLimit.allowed) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
  if (!user) {
    await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
    return { error: INVALID_CREDENTIALS_MESSAGE };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { error: INVALID_CREDENTIALS_MESSAGE };
  }

  await clearRateLimit(rateLimit.identityKey);
  await createSession(user.id, user.role, user.name || "Pengguna");
  redirect("/dashboard");
}

export async function registerAction(
  formData: RegisterFormData,
): Promise<{
  error?: string;
  code?: "EMAIL_ALREADY_REGISTERED";
} | never> {
  const parsed = registerSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: getValidationMessage(parsed.error) };
  }

  if (!(await checkRegistrationRateLimit())) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  const { fullName, email, password, address } = parsed.data;
  const existingUser = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true },
  });
  if (existingUser) {
    return {
      error: EMAIL_ALREADY_REGISTERED_MESSAGE,
      code: "EMAIL_ALREADY_REGISTERED",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let user;
  try {
    user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullName,
        location: address,
        role: "STUDENT",
        notifications: {
          create: {
            type: "INFO",
            title: "Selamat datang di JemBara",
            message: "Lengkapi profil Anda agar lebih mudah ditemukan oleh pemilik proyek.",
            href: "/dashboard/settings",
          },
        },
      },
    });
  } catch (error) {
    // Pemeriksaan findFirst di atas memberi respons cepat, sedangkan constraint
    // unik tetap menjadi pengaman atomik untuk dua registrasi yang bersamaan.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        error: EMAIL_ALREADY_REGISTERED_MESSAGE,
        code: "EMAIL_ALREADY_REGISTERED",
      };
    }
    console.error("Registrasi pengguna gagal:", error);
    return { error: "Pendaftaran belum dapat diproses. Silakan coba lagi." };
  }

  await createSession(user.id, user.role, user.name || "Pengguna Baru");
  redirect("/pilih-role");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}

export type RoleSelectionActionState = { error?: string };

function normalizeWebsite(value: string | undefined) {
  if (!value) return null;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export async function selectRoleAction(
  _previousState: RoleSelectionActionState,
  formData: FormData,
): Promise<RoleSelectionActionState> {
  const rawRole = formData.get("role");
  const parsed = roleSelectionSchema.safeParse(
    rawRole === "UMKM"
      ? {
          role: rawRole,
          businessName: formData.get("businessName"),
          businessCategory: formData.get("businessCategory"),
          addressDetail: formData.get("addressDetail"),
          provinceCode: formData.get("provinceCode"),
          regencyCode: formData.get("regencyCode"),
          districtCode: formData.get("districtCode"),
          villageCode: formData.get("villageCode"),
          phone: formData.get("phone") ?? undefined,
          website: formData.get("website") ?? undefined,
        }
      : { role: rawRole },
  );
  if (!parsed.success) {
    return { error: getValidationMessage(parsed.error) };
  }

  const session = await verifySession();
  if (!session || session.userId === "mock-user-id") {
    redirect("/login");
  }

  const { role } = parsed.data;
  let validatedRegion = null;
  if (parsed.data.role === "UMKM") {
    try {
      validatedRegion = await validateRegionSelection(parsed.data);
    } catch (error) {
      if (error instanceof RegionInputError) return { error: error.message };
      if (error instanceof RegionServiceError) {
        return { error: "Data wilayah belum dapat diverifikasi. Silakan coba lagi." };
      }
      throw error;
    }
  }

  const updatedUser = await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        role: true,
        student: { select: { id: true } },
        umkm: { select: { id: true } },
      },
    });

    if (!user || user.role === "ADMIN") {
      return null;
    }

    // Pemilihan role adalah bagian onboarding, bukan mekanisme pergantian
    // identitas. Setelah salah satu profil dibuat, role tidak boleh diubah dari
    // endpoint publik ini.
    if (user.student || user.umkm) {
      return { id: user.id, name: user.name, role: user.role, changed: false };
    }

    const businessData = parsed.data.role === "UMKM" ? parsed.data : null;

    await transaction.user.update({
      where: { id: user.id },
      data: {
        role,
        ...(businessData
          ? {
              location: formatRegionLocation(validatedRegion!),
              no_telepon: businessData.phone || null,
            }
          : {}),
      },
    });

    if (role === "STUDENT") {
      await transaction.student.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id },
      });
    } else {
      await transaction.umkm.upsert({
        where: { userId: user.id },
        update: {
          nama_usaha: businessData!.businessName,
          kategori_usaha: businessData!.businessCategory,
          website: normalizeWebsite(businessData!.website),
          alamat_detail: businessData!.addressDetail,
          provinsi_kode: validatedRegion!.provinceCode,
          provinsi_nama: validatedRegion!.provinceName,
          kabupaten_kode: validatedRegion!.regencyCode,
          kabupaten_nama: validatedRegion!.regencyName,
          kecamatan_kode: validatedRegion!.districtCode,
          kecamatan_nama: validatedRegion!.districtName,
          kelurahan_kode: validatedRegion!.villageCode,
          kelurahan_nama: validatedRegion!.villageName,
        },
        create: {
          userId: user.id,
          nama_usaha: businessData!.businessName,
          kategori_usaha: businessData!.businessCategory,
          website: normalizeWebsite(businessData!.website),
          alamat_detail: businessData!.addressDetail,
          provinsi_kode: validatedRegion!.provinceCode,
          provinsi_nama: validatedRegion!.provinceName,
          kabupaten_kode: validatedRegion!.regencyCode,
          kabupaten_nama: validatedRegion!.regencyName,
          kecamatan_kode: validatedRegion!.districtCode,
          kecamatan_nama: validatedRegion!.districtName,
          kelurahan_kode: validatedRegion!.villageCode,
          kelurahan_nama: validatedRegion!.villageName,
        },
      });
    }

    return { id: user.id, name: user.name, role, changed: true };
  });

  if (!updatedUser) {
    await deleteSession();
    redirect("/login");
  }

  if (!updatedUser.changed) {
    redirect("/dashboard");
  }

  await createSession(updatedUser.id, updatedUser.role, updatedUser.name || "Pengguna");
  redirect("/dashboard");
}
