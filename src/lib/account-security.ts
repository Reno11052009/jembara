import "server-only";

import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "./prisma";
import { createSession, deleteSession, verifySession } from "./session";
import { consumeRateLimit, createRateLimitKey } from "./rate-limit";
import { config } from "@/config/unifiedConfig";
import type { ActiveSession, SessionDeviceType } from "@/types/settings";

const MAX_BCRYPT_PASSWORD_BYTES = 72;
const sessionIdSchema = z.string().uuid();
const passwordSchema = z
  .string()
  .min(8, "Password baru minimal 8 karakter")
  .max(128, "Password terlalu panjang")
  .refine(
    (password) => new TextEncoder().encode(password).length <= MAX_BCRYPT_PASSWORD_BYTES,
    "Password maksimal 72 byte",
  );
const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Password saat ini wajib diisi")
      .max(128)
      .refine(
        (password) =>
          new TextEncoder().encode(password).length <= MAX_BCRYPT_PASSWORD_BYTES,
        "Password saat ini tidak valid",
      ),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .strict()
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Konfirmasi password baru tidak cocok",
    path: ["confirmPassword"],
  })
  .refine((value) => value.currentPassword !== value.newPassword, {
    message: "Password baru harus berbeda dari password saat ini",
    path: ["newPassword"],
  });

function getDeviceType(userAgent: string | null): SessionDeviceType {
  if (/iphone|ipad|android|mobile/i.test(userAgent || "")) return "mobile";
  if (/macintosh|windows|linux/i.test(userAgent || "")) return "laptop";
  return "desktop";
}

function getDeviceName(userAgent: string | null) {
  if (!userAgent) return "Perangkat tidak dikenal";
  const browser = /edg/i.test(userAgent)
    ? "Microsoft Edge"
    : /firefox/i.test(userAgent)
      ? "Firefox"
      : /chrome|crios/i.test(userAgent)
        ? "Google Chrome"
        : /safari/i.test(userAgent)
          ? "Safari"
          : "Browser";
  const operatingSystem = /iphone|ipad/i.test(userAgent)
    ? "iOS"
    : /android/i.test(userAgent)
      ? "Android"
      : /macintosh|mac os/i.test(userAgent)
        ? "macOS"
        : /windows/i.test(userAgent)
          ? "Windows"
          : /linux/i.test(userAgent)
            ? "Linux"
            : "perangkat tidak dikenal";
  return `${browser} di ${operatingSystem}`;
}

function formatLastSeen(value: Date, isCurrent: boolean) {
  if (isCurrent) return "Aktif sekarang (sesi ini)";
  const elapsedMinutes = Math.max(1, Math.floor((Date.now() - value.getTime()) / 60_000));
  if (elapsedMinutes < 60) return `Terakhir aktif ${elapsedMinutes} menit lalu`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `Terakhir aktif ${elapsedHours} jam lalu`;
  return `Terakhir aktif ${Math.floor(elapsedHours / 24)} hari lalu`;
}

export async function getActiveSessionsData(): Promise<ActiveSession[]> {
  const session = await verifySession();
  if (!session) return [];

  const now = new Date();
  await prisma.auth_session.deleteMany({
    where: {
      userId: session.userId,
      OR: [
        { expiresAt: { lte: now } },
        { lastSeenAt: { lte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } },
      ],
    },
  });
  const sessions = await prisma.auth_session.findMany({
    where: { userId: session.userId, expiresAt: { gt: now } },
    orderBy: { lastSeenAt: "desc" },
    take: 10,
    select: {
      id: true,
      userAgent: true,
      ipAddress: true,
      lastSeenAt: true,
    },
  });

  return sessions.map((item) => {
    const isCurrentSession = item.id === session.sessionId;
    return {
      id: item.id,
      deviceName: getDeviceName(item.userAgent),
      deviceType: getDeviceType(item.userAgent),
      location: item.ipAddress ? `IP ${item.ipAddress}` : "Alamat IP tidak tersedia",
      status: formatLastSeen(item.lastSeenAt, isCurrentSession),
      isCurrentSession,
    };
  });
}

export async function revokeCurrentUserSession(sessionId: unknown) {
  const parsedId = sessionIdSchema.safeParse(sessionId);
  if (!parsedId.success) return { success: false as const, error: "Sesi tidak valid" };

  const session = await verifySession();
  if (!session) return { success: false as const, error: "Sesi login tidak valid" };

  if (parsedId.data === session.sessionId) {
    await deleteSession();
    return { success: true as const, revokedCurrentSession: true };
  }

  const result = await prisma.auth_session.deleteMany({
    where: { id: parsedId.data, userId: session.userId },
  });
  if (result.count !== 1) {
    return { success: false as const, error: "Sesi tidak ditemukan" };
  }
  return { success: true as const, revokedCurrentSession: false };
}

export async function changeCurrentUserPassword(input: unknown) {
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message || "Data password tidak valid",
    };
  }

  const session = await verifySession();
  if (!session) return { success: false as const, error: "Sesi login tidak valid" };

  const rateLimit = await consumeRateLimit({
    key: createRateLimitKey("account:password:user", session.userId),
    ...config.security.auth.rateLimit.passwordChangeByUser,
  });
  if (!rateLimit.allowed) {
    return {
      success: false as const,
      error: "Terlalu banyak percobaan perubahan password. Coba lagi nanti.",
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, password: true, role: true, name: true },
  });
  if (!user || !(await bcrypt.compare(parsed.data.currentPassword, user.password))) {
    return { success: false as const, error: "Password saat ini salah" };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
      select: { id: true },
    }),
    prisma.auth_session.deleteMany({ where: { userId: user.id } }),
  ]);
  await createSession(user.id, user.role, user.name || "Pengguna");

  return { success: true as const };
}
