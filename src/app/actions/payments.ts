"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { config } from "@/config/unifiedConfig";
import { createUserNotification } from "@/lib/notifications";
import {
  applyMidtransStatus,
  createOrReuseProjectPayment,
  PaymentFlowError,
} from "@/lib/payments";
import prisma from "@/lib/prisma";
import { consumeRateLimit, createRateLimitKey } from "@/lib/rate-limit";
import { verifySession } from "@/lib/session";
import { getMidtransTransactionStatus, MidtransError } from "@/lib/midtrans";
import {
  PROJECT_PAYMENT_STATUSES,
  type PaymentActionResult,
} from "@/types/payment";

const projectIdSchema = z.string().uuid("Proyek tidak valid.");
const paymentStatusSchema = z.enum(PROJECT_PAYMENT_STATUSES);

async function requireUmkmPaymentViewer(projectId: unknown) {
  const parsed = projectIdSchema.safeParse(projectId);
  if (!parsed.success) throw new PaymentFlowError(parsed.error.issues[0]?.message);
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") {
    throw new PaymentFlowError("Sesi tidak valid. Silakan login kembali.");
  }
  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true, umkm: { select: { id: true } } },
  });
  if (!viewer || viewer.role !== "UMKM" || !viewer.umkm) {
    throw new PaymentFlowError("Hanya pemilik UMKM yang dapat membayar proyek.");
  }
  const ownedProject = await prisma.project.findFirst({
    where: { id: parsed.data, umkmId: viewer.umkm.id },
    select: { id: true },
  });
  if (!ownedProject) {
    throw new PaymentFlowError("Proyek tidak ditemukan atau tidak dapat diakses.");
  }
  return { projectId: parsed.data, userId: session.userId };
}

function revalidatePaymentPaths(projectId: string) {
  revalidatePath(`/dashboard/payments/${projectId}`);
  revalidatePath("/dashboard/pelamar");
  revalidatePath("/dashboard/lowongan-saya");
  revalidatePath("/dashboard/active-projects");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/settings/pembayaran");
  revalidatePath("/dashboard");
}

export async function createProjectPaymentAction(
  projectId: unknown,
): Promise<PaymentActionResult> {
  try {
    const viewer = await requireUmkmPaymentViewer(projectId);
    const rateLimit = await consumeRateLimit({
      key: createRateLimitKey("payment:create:project", viewer.projectId),
      ...config.security.auth.rateLimit.paymentCreateByProject,
    });
    if (!rateLimit.allowed) {
      return { success: false, error: "Terlalu banyak percobaan pembayaran. Coba lagi nanti." };
    }
    const payment = await createOrReuseProjectPayment(
      viewer.projectId,
      viewer.userId,
    );
    revalidatePaymentPaths(viewer.projectId);
    return {
      success: true,
      redirectUrl: payment.redirectUrl,
      snapToken: payment.snapToken || undefined,
      status: payment.status,
    };
  } catch (error) {
    console.error("Gagal menyiapkan pembayaran Midtrans:", error);
    const message =
      error instanceof PaymentFlowError || error instanceof MidtransError
        ? error.message
        : "Pembayaran belum dapat disiapkan. Silakan coba lagi.";
    return { success: false, error: message };
  }
}

export async function syncProjectPaymentAction(
  projectId: unknown,
): Promise<PaymentActionResult> {
  try {
    const viewer = await requireUmkmPaymentViewer(projectId);
    const rateLimit = await consumeRateLimit({
      key: createRateLimitKey("payment:sync:project", viewer.projectId),
      ...config.security.auth.rateLimit.paymentSyncByProject,
    });
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: "Status terlalu sering diperiksa. Tunggu sebentar lalu coba lagi.",
      };
    }
    const payment = await prisma.project_payment.findFirst({
      where: { projectId: viewer.projectId, project: { umkm: { userId: viewer.userId } } },
      select: { orderId: true },
    });
    if (!payment) throw new PaymentFlowError("Pembayaran proyek belum dibuat.");

    const status = await getMidtransTransactionStatus(payment.orderId);
    const outcome = await applyMidtransStatus(status);
    if (outcome.newlyHeld && outcome.project.student) {
      await Promise.allSettled([
        createUserNotification({
          userId: outcome.project.student.userId,
          type: "PAYMENT",
          title: "Dana proyek telah diamankan",
          message: `Pembayaran ${outcome.project.title} sudah diterima. Anda dapat mulai mengerjakan proyek.`,
          href: "/dashboard/active-projects",
          preferenceKey: "pembayaran",
        }),
        createUserNotification({
          userId: outcome.project.umkm.userId,
          type: "PAYMENT",
          title: "Pembayaran berhasil",
          message: `Dana ${outcome.project.title} ditahan sampai hasil kerja disetujui.`,
          href: "/dashboard/active-projects",
          preferenceKey: "pembayaran",
        }),
      ]);
    }
    const refreshed = await prisma.project_payment.findUnique({
      where: { orderId: payment.orderId },
      select: { status: true },
    });
    const refreshedStatus = paymentStatusSchema.safeParse(refreshed?.status);
    revalidatePaymentPaths(viewer.projectId);
    return {
      success: true,
      status: refreshedStatus.success ? refreshedStatus.data : undefined,
    };
  } catch (error) {
    console.error("Gagal menyinkronkan pembayaran Midtrans:", error);
    let message = "Status pembayaran belum dapat diperbarui.";
    if (error instanceof MidtransError) {
      message =
        error.status === 404
          ? "Transaksi belum tercatat di Midtrans. Silakan lakukan pembayaran terlebih dahulu."
          : error.message;
    } else if (error instanceof PaymentFlowError) {
      message = error.message;
    }
    return { success: false, error: message };
  }
}
