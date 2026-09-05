import "server-only";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { verifySession } from "./session";
import { createOtpAuthUri, createRecoveryCodes, decryptTotpSecret, encryptTotpSecret, generateTotpSecret, hashRecoveryCode, verifyTotp } from "./totp";

export async function getTwoFactorStatus() { const session = await verifySession(); if (!session) return { enabled: false }; const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { twoFactorEnabledAt: true } }); return { enabled: Boolean(user?.twoFactorEnabledAt), enabledAt: user?.twoFactorEnabledAt ?? null }; }
export async function beginTwoFactorSetup(password: unknown) {
  if (typeof password !== "string" || !password || password.length > 128) return { success: false as const, error: "Password saat ini wajib diisi." };
  const session = await verifySession(); if (!session) return { success: false as const, error: "Sesi tidak valid." };
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { email: true, password: true } });
  if (!user || !(await bcrypt.compare(password, user.password))) return { success: false as const, error: "Password saat ini salah." };
  const secret = generateTotpSecret(); await prisma.user.update({ where: { id: session.userId }, data: { twoFactorPendingSecret: encryptTotpSecret(secret) } });
  return { success: true as const, secret, otpAuthUri: createOtpAuthUri(secret, user.email) };
}
export async function confirmTwoFactorSetup(code: unknown) {
  if (typeof code !== "string") return { success: false as const, error: "Kode OTP tidak valid." };
  const session = await verifySession(); if (!session) return { success: false as const, error: "Sesi tidak valid." };
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { twoFactorPendingSecret: true } });
  if (!user?.twoFactorPendingSecret) return { success: false as const, error: "Mulai setup 2FA terlebih dahulu." };
  const secret = decryptTotpSecret(user.twoFactorPendingSecret); if (!verifyTotp(secret, code)) return { success: false as const, error: "Kode OTP salah atau kedaluwarsa." };
  const recoveryCodes = createRecoveryCodes(); await prisma.$transaction([prisma.user.update({ where: { id: session.userId }, data: { twoFactorSecret: user.twoFactorPendingSecret, twoFactorPendingSecret: null, twoFactorEnabledAt: new Date(), twoFactorRecoveryCodes: recoveryCodes.map(hashRecoveryCode) } }), prisma.audit_log.create({ data: { actorUserId: session.userId, action: "TWO_FACTOR_ENABLED", entityType: "user", entityId: session.userId } })]);
  return { success: true as const, recoveryCodes };
}
export async function disableTwoFactor(password: unknown) {
  if (typeof password !== "string") return { success: false as const, error: "Password wajib diisi." };
  const session = await verifySession(); if (!session) return { success: false as const, error: "Sesi tidak valid." };
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { password: true } }); if (!user || !(await bcrypt.compare(password, user.password))) return { success: false as const, error: "Password saat ini salah." };
  await prisma.$transaction([prisma.user.update({ where: { id: session.userId }, data: { twoFactorSecret: null, twoFactorPendingSecret: null, twoFactorRecoveryCodes: [], twoFactorEnabledAt: null } }), prisma.audit_log.create({ data: { actorUserId: session.userId, action: "TWO_FACTOR_DISABLED", entityType: "user", entityId: session.userId } })]);
  return { success: true as const };
}
