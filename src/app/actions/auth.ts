"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSession, deleteSession, verifySession } from "@/lib/session";
import { LoginFormData, RegisterFormData } from "@/types/auth";
import { config } from "@/config/unifiedConfig";
import {
  clearRateLimit,
  consumeRateLimit,
  createRateLimitKey,
  getClientAddress,
} from "@/lib/rate-limit";
import {
  getValidationMessage,
  loginSchema,
  registerSchema,
  roleSelectionSchema,
} from "@/validators/auth.schema";

const INVALID_CREDENTIALS_MESSAGE = "Email atau password salah";
const RATE_LIMIT_MESSAGE = "Terlalu banyak percobaan. Silakan coba lagi nanti";
const DUMMY_PASSWORD_HASH = "$2b$10$4VcIQIWwB9giOWgG9HFHbOlk5D5ut/ZfJf7gD3yhMgEzKAxcTcraS";

async function checkLoginRateLimit(email: string) {
  const clientAddress = await getClientAddress();
  const ipKey = createRateLimitKey("auth:login:ip", clientAddress);
  const identityKey = createRateLimitKey("auth:login:identity", `${clientAddress}:${email}`);
  const rateLimitConfig = config.security.auth.rateLimit;

  const ipResult = consumeRateLimit({
    key: ipKey,
    ...rateLimitConfig.loginByIp,
  });
  const identityResult = consumeRateLimit({
    key: identityKey,
    ...rateLimitConfig.loginByIdentity,
  });

  return {
    allowed: ipResult.allowed && identityResult.allowed,
    identityKey,
  };
}

async function checkRegistrationRateLimit() {
  const clientAddress = await getClientAddress();
  const key = createRateLimitKey("auth:register:ip", clientAddress);
  const result = consumeRateLimit({
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

  clearRateLimit(rateLimit.identityKey);
  await createSession(user.id, user.role, user.name || "Pengguna");
  redirect("/dashboard");
}

export async function registerAction(formData: RegisterFormData): Promise<{ error?: string } | never> {
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
    return { error: "Pendaftaran tidak dapat diproses dengan data tersebut" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
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

  await createSession(user.id, user.role, user.name || "Pengguna Baru");
  redirect("/pilih-role");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}

export async function selectRoleAction(formData: FormData): Promise<void> {
  const parsed = roleSelectionSchema.safeParse({ role: formData.get("role") });
  if (!parsed.success) {
    return;
  }

  const session = await verifySession();
  if (!session || session.userId === "mock-user-id") {
    redirect("/login");
  }

  const { role } = parsed.data;
  const updatedUser = await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, role: true },
    });

    if (!user || user.role === "ADMIN") {
      return null;
    }

    await transaction.user.update({
      where: { id: user.id },
      data: { role },
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
        update: {},
        create: {
          userId: user.id,
          nama_usaha: user.name || "UMKM",
        },
      });
    }

    return { id: user.id, name: user.name, role };
  });

  if (!updatedUser) {
    await deleteSession();
    redirect("/login");
  }

  await createSession(updatedUser.id, updatedUser.role, updatedUser.name || "Pengguna");
  redirect("/dashboard");
}
