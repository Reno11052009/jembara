"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { config } from "@/config/unifiedConfig";
import { Prisma } from "@/generated/prisma/client";
import { createUserNotification } from "@/lib/notifications";
import prisma from "@/lib/prisma";
import { consumeRateLimit, createRateLimitKey } from "@/lib/rate-limit";
import { verifySession } from "@/lib/session";

const MINIMUM_WITHDRAWAL = 10_000;
const MAX_TRANSACTION_ATTEMPTS = 3;

const withdrawalRequestSchema = z.object({
  amount: z.coerce
    .number()
    .int("Nominal penarikan harus berupa angka bulat.")
    .min(MINIMUM_WITHDRAWAL, "Minimum penarikan adalah Rp10.000.")
    .max(1_000_000_000, "Nominal penarikan terlalu besar."),
  payoutMethodId: z.string().uuid("Pilih metode pencairan yang valid."),
});

const withdrawalDecisionSchema = z.object({
  withdrawalId: z.string().uuid("Permintaan penarikan tidak valid."),
  decision: z.enum(["COMPLETE", "REJECT"]),
  adminNote: z.string().trim().max(500, "Catatan maksimal 500 karakter."),
});

export interface WithdrawalActionResult {
  success: boolean;
  error?: string;
}

class WithdrawalError extends Error {}

function revalidateWithdrawalPaths() {
  revalidatePath("/dashboard/withdrawals");
  revalidatePath("/dashboard/earnings");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/settings/pembayaran");
  revalidatePath("/dashboard");
}

function shouldRetryTransaction(error: unknown, attempt: number) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2034" &&
    attempt < MAX_TRANSACTION_ATTEMPTS - 1
  );
}

export async function createWithdrawalRequestAction(
  formData: FormData,
): Promise<WithdrawalActionResult> {
  const parsed = withdrawalRequestSchema.safeParse({
    amount: formData.get("amount"),
    payoutMethodId: formData.get("payoutMethodId"),
  });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Data penarikan tidak valid.",
    };
  }

  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") {
    return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
  }

  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true, student: { select: { id: true } } },
  });
  if (!viewer || viewer.role !== "STUDENT" || !viewer.student) {
    return { success: false, error: "Hanya Student yang dapat menarik saldo." };
  }

  const rateLimit = await consumeRateLimit({
    key: createRateLimitKey("withdrawal:create:user", session.userId),
    ...config.security.auth.rateLimit.withdrawalCreateByUser,
  });
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: "Batas permintaan penarikan harian tercapai. Coba lagi besok.",
    };
  }

  try {
    for (let attempt = 0; attempt < MAX_TRANSACTION_ATTEMPTS; attempt += 1) {
      try {
        await prisma.$transaction(
          async (transaction) => {
            const currentUser = await transaction.user.findFirst({
              where: { id: session.userId, role: "STUDENT" },
              select: { saldo: true },
            });
            if (!currentUser) {
              throw new WithdrawalError("Akun Student tidak ditemukan.");
            }
            if (currentUser.saldo < parsed.data.amount) {
              throw new WithdrawalError("Saldo tidak mencukupi untuk penarikan ini.");
            }

            const payoutMethod = await transaction.payout_method.findFirst({
              where: { id: parsed.data.payoutMethodId, userId: session.userId },
              select: {
                id: true,
                provider: true,
                accountName: true,
                accountNumber: true,
              },
            });
            if (!payoutMethod) {
              throw new WithdrawalError("Metode pencairan tidak ditemukan.");
            }

            const debited = await transaction.user.updateMany({
              where: {
                id: session.userId,
                role: "STUDENT",
                saldo: { gte: parsed.data.amount },
              },
              data: { saldo: { decrement: parsed.data.amount } },
            });
            if (debited.count !== 1) {
              throw new WithdrawalError("Saldo berubah. Muat ulang lalu coba kembali.");
            }

            const withdrawalId = randomUUID();
            await transaction.withdrawal_request.create({
              data: {
                id: withdrawalId,
                userId: session.userId,
                payoutMethodId: payoutMethod.id,
                amount: parsed.data.amount,
                provider: payoutMethod.provider,
                accountName: payoutMethod.accountName,
                accountNumber: payoutMethod.accountNumber,
                status: "PENDING",
              },
              select: { id: true },
            });
            await transaction.balance_transaction.create({
              data: {
                userId: session.userId,
                withdrawalId,
                externalReference: `withdrawal:${withdrawalId}:reserve`,
                type: "WITHDRAWAL_RESERVE",
                amount: -parsed.data.amount,
                balanceBefore: currentUser.saldo,
                balanceAfter: currentUser.saldo - parsed.data.amount,
              },
              select: { id: true },
            });
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
        revalidateWithdrawalPaths();
        return { success: true };
      } catch (error) {
        if (shouldRetryTransaction(error, attempt)) continue;
        throw error;
      }
    }
  } catch (error) {
    console.error("Gagal membuat permintaan penarikan:", error);
    return {
      success: false,
      error:
        error instanceof WithdrawalError
          ? error.message
          : "Permintaan penarikan belum dapat dibuat. Silakan coba lagi.",
    };
  }

  return { success: false, error: "Permintaan penarikan gagal setelah beberapa percobaan." };
}

export async function decideWithdrawalRequestAction(
  withdrawalId: unknown,
  decision: unknown,
  adminNote: unknown = "",
): Promise<WithdrawalActionResult> {
  const parsed = withdrawalDecisionSchema.safeParse({
    withdrawalId,
    decision,
    adminNote,
  });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Keputusan penarikan tidak valid.",
    };
  }

  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") {
    return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
  }
  const admin = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true, admin: { select: { id: true } } },
  });
  if (!admin || admin.role !== "ADMIN" || !admin.admin) {
    return { success: false, error: "Hanya Admin yang dapat memproses penarikan." };
  }

  const rateLimit = await consumeRateLimit({
    key: createRateLimitKey("withdrawal:decision:admin", session.userId),
    ...config.security.auth.rateLimit.withdrawalDecisionByAdmin,
  });
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: "Terlalu banyak keputusan penarikan. Coba lagi nanti.",
    };
  }

  try {
    let notificationTarget: { userId: string; amount: number } | null = null;
    for (let attempt = 0; attempt < MAX_TRANSACTION_ATTEMPTS; attempt += 1) {
      try {
        notificationTarget = await prisma.$transaction(
          async (transaction) => {
            const withdrawal = await transaction.withdrawal_request.findUnique({
              where: { id: parsed.data.withdrawalId },
              select: {
                id: true,
                userId: true,
                amount: true,
                status: true,
                user: { select: { saldo: true } },
              },
            });
            if (!withdrawal) {
              throw new WithdrawalError("Permintaan penarikan tidak ditemukan.");
            }
            if (withdrawal.status !== "PENDING") {
              throw new WithdrawalError("Permintaan penarikan sudah diproses.");
            }

            const now = new Date();
            const nextStatus =
              parsed.data.decision === "COMPLETE" ? "COMPLETED" : "REJECTED";
            const claimed = await transaction.withdrawal_request.updateMany({
              where: { id: withdrawal.id, status: "PENDING" },
              data: {
                status: nextStatus,
                adminNote: parsed.data.adminNote || null,
                processedByUserId: session.userId,
                processedAt: now,
              },
            });
            if (claimed.count !== 1) {
              throw new WithdrawalError("Permintaan penarikan sudah diproses.");
            }

            if (parsed.data.decision === "REJECT") {
              const refundedUser = await transaction.user.update({
                where: { id: withdrawal.userId },
                data: { saldo: { increment: withdrawal.amount } },
                select: { saldo: true },
              });
              await transaction.balance_transaction.create({
                data: {
                  userId: withdrawal.userId,
                  withdrawalId: withdrawal.id,
                  externalReference: `withdrawal:${withdrawal.id}:refund`,
                  type: "WITHDRAWAL_REFUND",
                  amount: withdrawal.amount,
                  balanceBefore: refundedUser.saldo - withdrawal.amount,
                  balanceAfter: refundedUser.saldo,
                },
                select: { id: true },
              });
            }

            return { userId: withdrawal.userId, amount: withdrawal.amount };
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
        break;
      } catch (error) {
        if (shouldRetryTransaction(error, attempt)) continue;
        throw error;
      }
    }

    if (!notificationTarget) {
      throw new WithdrawalError("Keputusan penarikan gagal disimpan.");
    }
    const amountLabel = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(notificationTarget.amount);
    const completed = parsed.data.decision === "COMPLETE";
    await createUserNotification({
      userId: notificationTarget.userId,
      type: "PAYMENT",
      title: completed ? "Penarikan selesai" : "Penarikan ditolak",
      message: completed
        ? `Penarikan ${amountLabel} telah diproses oleh Admin.`
        : `Penarikan ${amountLabel} ditolak dan saldo telah dikembalikan.`,
      href: "/dashboard/withdrawals",
      preferenceKey: "pembayaran",
    }).catch((error) => console.error("Notifikasi penarikan gagal:", error));

    revalidateWithdrawalPaths();
    return { success: true };
  } catch (error) {
    console.error("Gagal memproses permintaan penarikan:", error);
    return {
      success: false,
      error:
        error instanceof WithdrawalError
          ? error.message
          : "Permintaan penarikan belum dapat diproses. Silakan coba lagi.",
    };
  }
}
