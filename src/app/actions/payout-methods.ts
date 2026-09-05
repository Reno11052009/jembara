"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { config } from "@/config/unifiedConfig";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { consumeRateLimit, createRateLimitKey } from "@/lib/rate-limit";
import { verifySession } from "@/lib/session";

const MAX_PAYOUT_METHODS = 5;
const MAX_TRANSACTION_ATTEMPTS = 3;

const payoutMethodSchema = z.object({
  provider: z.string().trim().min(2, "Nama bank/e-wallet minimal 2 karakter.").max(80),
  accountName: z.string().trim().min(2, "Nama pemilik rekening minimal 2 karakter.").max(120),
  accountNumber: z
    .string()
    .transform((value) => value.replace(/[\s-]/g, ""))
    .pipe(z.string().regex(/^\d{6,30}$/, "Nomor rekening/e-wallet harus terdiri dari 6-30 digit.")),
  isPrimary: z.boolean(),
});

const payoutMethodIdSchema = z.string().uuid("Metode pencairan tidak valid.");

export interface PayoutMethodActionResult {
  success: boolean;
  error?: string;
}

class PayoutMethodError extends Error {}

function revalidatePaymentSettings() {
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/settings/pembayaran");
  revalidatePath("/dashboard/withdrawals");
}

async function requireStudentViewer() {
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") {
    throw new PayoutMethodError("Sesi tidak valid. Silakan login kembali.");
  }
  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true, student: { select: { id: true } } },
  });
  if (!viewer || viewer.role !== "STUDENT" || !viewer.student) {
    throw new PayoutMethodError("Hanya Student yang dapat mengelola metode pencairan.");
  }
  const rateLimit = await consumeRateLimit({
    key: createRateLimitKey("payout-method:mutation:user", session.userId),
    ...config.security.auth.rateLimit.payoutMethodMutationByUser,
  });
  if (!rateLimit.allowed) {
    throw new PayoutMethodError("Terlalu banyak perubahan metode pencairan. Coba lagi nanti.");
  }
  return session.userId;
}

function shouldRetry(error: unknown, attempt: number) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2034" &&
    attempt < MAX_TRANSACTION_ATTEMPTS - 1
  );
}

function actionError(error: unknown): PayoutMethodActionResult {
  console.error("Gagal mengelola metode pencairan:", error);
  if (error instanceof PayoutMethodError) {
    return { success: false, error: error.message };
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return { success: false, error: "Rekening tersebut sudah tersimpan." };
  }
  return { success: false, error: "Metode pencairan belum dapat disimpan. Silakan coba lagi." };
}

export async function createPayoutMethodAction(
  formData: FormData,
): Promise<PayoutMethodActionResult> {
  const parsed = payoutMethodSchema.safeParse({
    provider: formData.get("provider"),
    accountName: formData.get("accountName"),
    accountNumber: formData.get("accountNumber"),
    isPrimary: formData.get("isPrimary") === "on",
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Data rekening tidak valid." };
  }

  try {
    const userId = await requireStudentViewer();
    for (let attempt = 0; attempt < MAX_TRANSACTION_ATTEMPTS; attempt += 1) {
      try {
        await prisma.$transaction(
          async (transaction) => {
            const methodCount = await transaction.payout_method.count({ where: { userId } });
            if (methodCount >= MAX_PAYOUT_METHODS) {
              throw new PayoutMethodError(`Maksimal ${MAX_PAYOUT_METHODS} metode pencairan.`);
            }
            const isPrimary = methodCount === 0 || parsed.data.isPrimary;
            if (isPrimary) {
              await transaction.payout_method.updateMany({
                where: { userId, isPrimary: true },
                data: { isPrimary: false },
              });
            }
            await transaction.payout_method.create({
              data: { userId, ...parsed.data, isPrimary },
              select: { id: true },
            });
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
        revalidatePaymentSettings();
        return { success: true };
      } catch (error) {
        if (shouldRetry(error, attempt)) continue;
        throw error;
      }
    }
  } catch (error) {
    return actionError(error);
  }
  return { success: false, error: "Metode pencairan gagal disimpan." };
}

export async function setPrimaryPayoutMethodAction(
  rawMethodId: unknown,
): Promise<PayoutMethodActionResult> {
  const parsedId = payoutMethodIdSchema.safeParse(rawMethodId);
  if (!parsedId.success) return { success: false, error: parsedId.error.issues[0]?.message };

  try {
    const userId = await requireStudentViewer();
    await prisma.$transaction(async (transaction) => {
      const ownedMethod = await transaction.payout_method.findFirst({
        where: { id: parsedId.data, userId },
        select: { id: true, isPrimary: true },
      });
      if (!ownedMethod) throw new PayoutMethodError("Metode pencairan tidak ditemukan.");
      if (ownedMethod.isPrimary) return;
      await transaction.payout_method.updateMany({
        where: { userId, isPrimary: true },
        data: { isPrimary: false },
      });
      await transaction.payout_method.update({
        where: { id: ownedMethod.id },
        data: { isPrimary: true },
        select: { id: true },
      });
    });
    revalidatePaymentSettings();
    return { success: true };
  } catch (error) {
    return actionError(error);
  }
}

export async function deletePayoutMethodAction(
  rawMethodId: unknown,
): Promise<PayoutMethodActionResult> {
  const parsedId = payoutMethodIdSchema.safeParse(rawMethodId);
  if (!parsedId.success) return { success: false, error: parsedId.error.issues[0]?.message };

  try {
    const userId = await requireStudentViewer();
    await prisma.$transaction(
      async (transaction) => {
        const ownedMethod = await transaction.payout_method.findFirst({
          where: { id: parsedId.data, userId },
          select: { id: true, isPrimary: true },
        });
        if (!ownedMethod) throw new PayoutMethodError("Metode pencairan tidak ditemukan.");
        await transaction.payout_method.delete({ where: { id: ownedMethod.id } });
        if (ownedMethod.isPrimary) {
          const replacement = await transaction.payout_method.findFirst({
            where: { userId },
            orderBy: { createdAt: "asc" },
            select: { id: true },
          });
          if (replacement) {
            await transaction.payout_method.update({
              where: { id: replacement.id },
              data: { isPrimary: true },
              select: { id: true },
            });
          }
        }
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    revalidatePaymentSettings();
    return { success: true };
  } catch (error) {
    return actionError(error);
  }
}
