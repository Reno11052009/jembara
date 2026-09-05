"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { config } from "@/config/unifiedConfig";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { consumeRateLimit, createRateLimitKey } from "@/lib/rate-limit";
import { deleteSession, verifySession } from "@/lib/session";

const deleteAccountSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password wajib diisi.")
      .max(128, "Password tidak valid.")
      .refine((value) => Buffer.byteLength(value, "utf8") <= 72, "Password tidak valid."),
  })
  .strict();

class AccountDeletionError extends Error {}

export async function deleteAccountAction(input: unknown) {
  const parsed = deleteAccountSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Data tidak valid." };
  }

  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") {
    return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
  }

  const rateLimit = await consumeRateLimit({
    key: createRateLimitKey("account:delete:user", session.userId),
    ...config.security.auth.rateLimit.accountDeleteByUser,
  });
  if (!rateLimit.allowed) {
    return { success: false, error: "Terlalu banyak percobaan. Coba lagi nanti." };
  }

  const credentials = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { password: true, role: true },
  });
  if (!credentials || !(await bcrypt.compare(parsed.data.password, credentials.password))) {
    return { success: false, error: "Password tidak benar." };
  }
  if (credentials.role === "ADMIN") {
    return { success: false, error: "Akun Admin tidak dapat dihapus dari halaman ini." };
  }

  try {
    await prisma.$transaction(
      async (transaction) => {
        const account = await transaction.user.findUnique({
          where: { id: session.userId },
          select: {
            saldo: true,
            role: true,
            _count: {
              select: {
                balanceTransactions: true,
                withdrawalRequests: true,
                releasedPayments: true,
              },
            },
            student: {
              select: {
                _count: { select: { projects: true, submissions: true } },
              },
            },
            umkm: {
              select: { _count: { select: { projects: true } } },
            },
          },
        });
        if (!account || account.role !== credentials.role) {
          throw new AccountDeletionError("Akun berubah. Silakan login kembali.");
        }
        if (
          account.saldo !== 0 ||
          account._count.balanceTransactions > 0 ||
          account._count.withdrawalRequests > 0 ||
          account._count.releasedPayments > 0
        ) {
          throw new AccountDeletionError(
            "Akun dengan saldo atau riwayat transaksi wajib dipertahankan untuk audit. Hubungi Admin.",
          );
        }
        if (
          (account.student?._count.projects ?? 0) > 0 ||
          (account.student?._count.submissions ?? 0) > 0 ||
          (account.umkm?._count.projects ?? 0) > 0
        ) {
          throw new AccountDeletionError(
            "Selesaikan atau arsipkan riwayat proyek melalui Admin sebelum menghapus akun.",
          );
        }

        await transaction.user.delete({ where: { id: session.userId } });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (error) {
    if (error instanceof AccountDeletionError) {
      return { success: false, error: error.message };
    }
    console.error("Gagal menghapus akun:", error);
    return { success: false, error: "Akun belum dapat dihapus. Silakan coba lagi." };
  }

  await deleteSession();
  return { success: true };
}
