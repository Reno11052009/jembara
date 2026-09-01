import "server-only";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import prisma from "./prisma";
import { requireAuthenticatedSession } from "./auth-guard";
import {
  createSnapTransaction,
  type MidtransStatusPayload,
} from "./midtrans";
import type {
  ProjectPaymentData,
  ProjectPaymentStatus,
} from "@/types/payment";

const RETRYABLE_PAYMENT_STATUSES = [
  "FAILED",
  "EXPIRED",
  "CANCELLED",
] as const;
const TERMINAL_PAYMENT_STATUSES = [
  "HELD",
  "RELEASED",
  "REFUNDED",
  "CHARGEBACK",
] as const;
const CREATING_LOCK_MS = 60_000;

export class PaymentFlowError extends Error {}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizePaymentStatus(value?: string | null): ProjectPaymentStatus {
  const statuses: ProjectPaymentStatus[] = [
    "CREATING",
    "PENDING",
    "HELD",
    "RELEASED",
    "FAILED",
    "EXPIRED",
    "CANCELLED",
    "REFUNDED",
    "CHARGEBACK",
  ];
  return statuses.includes(value as ProjectPaymentStatus)
    ? (value as ProjectPaymentStatus)
    : "NOT_CREATED";
}

function getPaymentStatusLabel(status: ProjectPaymentStatus) {
  const labels: Record<ProjectPaymentStatus, string> = {
    NOT_CREATED: "Belum dibayar",
    CREATING: "Menyiapkan pembayaran",
    PENDING: "Menunggu pembayaran",
    HELD: "Dana ditahan Jembara",
    RELEASED: "Saldo telah diteruskan",
    FAILED: "Pembayaran gagal",
    EXPIRED: "Pembayaran kedaluwarsa",
    CANCELLED: "Pembayaran dibatalkan",
    REFUNDED: "Dana dikembalikan",
    CHARGEBACK: "Pembayaran ditarik kembali",
  };
  return labels[status];
}

function getApplicationUrl() {
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  const configuredUrl =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    (vercelHost ? `https://${vercelHost}` : undefined) ||
    (process.env.NODE_ENV !== "production" ? "http://localhost:3000" : undefined);
  const parsed = z.string().url().safeParse(configuredUrl);
  if (!parsed.success) {
    throw new PaymentFlowError("NEXT_PUBLIC_APP_URL belum dikonfigurasi dengan benar.");
  }
  const url = new URL(parsed.data);
  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new PaymentFlowError("URL aplikasi pembayaran harus menggunakan HTTPS.");
  }
  return url.origin;
}

function createOrderId(projectId: string) {
  return `JEM-${projectId.replaceAll("-", "").slice(0, 16)}-${randomUUID().replaceAll("-", "").slice(0, 12)}`;
}

function parseProjectAmount(budget: number | null) {
  if (
    budget === null ||
    !Number.isSafeInteger(budget) ||
    budget < 50_000 ||
    budget > 1_000_000_000
  ) {
    throw new PaymentFlowError("Nominal budget proyek tidak valid untuk pembayaran.");
  }
  return budget;
}

async function findOwnedPayableProject(projectId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, umkm: { userId } },
    select: {
      id: true,
      title: true,
      budget: true,
      status: true,
      studentId: true,
      student: { select: { user: { select: { id: true, name: true } } } },
      umkm: {
        select: {
          user: {
            select: { name: true, email: true, no_telepon: true },
          },
        },
      },
      proposals: {
        where: { status: "ACCEPTED" },
        take: 1,
        select: { id: true },
      },
      payment: {
        select: {
          id: true,
          orderId: true,
          status: true,
          redirectUrl: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!project) {
    throw new PaymentFlowError("Proyek tidak ditemukan atau bukan milik UMKM Anda.");
  }
  if (!project.studentId || !project.student || project.proposals.length !== 1) {
    throw new PaymentFlowError("Pilih satu proposal sebelum melakukan pembayaran.");
  }
  return project;
}

export async function getProjectPaymentData(
  projectId: string,
): Promise<ProjectPaymentData> {
  const parsedProjectId = z.string().uuid().safeParse(projectId);
  if (!parsedProjectId.success) throw new PaymentFlowError("Proyek tidak valid.");
  const session = await requireAuthenticatedSession();
  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  });
  if (!viewer || viewer.role !== "UMKM") redirect("/forbidden");

  const project = await findOwnedPayableProject(parsedProjectId.data, session.userId);
  const amount = parseProjectAmount(project.budget);
  const status = normalizePaymentStatus(project.payment?.status);
  const retryable = status === "NOT_CREATED" || RETRYABLE_PAYMENT_STATUSES.includes(
    status as (typeof RETRYABLE_PAYMENT_STATUSES)[number],
  );

  return {
    projectId: project.id,
    projectTitle: project.title,
    studentName: project.student?.user.name || "Talent Jembara",
    amount,
    amountLabel: formatRupiah(amount),
    status,
    statusLabel: getPaymentStatusLabel(status),
    redirectUrl: project.payment?.redirectUrl ?? null,
    canPay:
      project.status === "PROPOSAL" &&
      (retryable || status === "PENDING"),
    canSync: status === "PENDING" || status === "CREATING",
  };
}

export async function createOrReuseProjectPayment(
  projectId: string,
  userId: string,
) {
  const project = await findOwnedPayableProject(projectId, userId);
  const amount = parseProjectAmount(project.budget);
  const currentStatus = normalizePaymentStatus(project.payment?.status);

  if (project.payment?.redirectUrl && currentStatus === "PENDING") {
    return { redirectUrl: project.payment.redirectUrl, status: currentStatus };
  }
  if (
    currentStatus === "CREATING" &&
    Date.now() - project.payment!.updatedAt.getTime() < CREATING_LOCK_MS
  ) {
    throw new PaymentFlowError("Pembayaran sedang disiapkan. Tunggu sebentar lalu muat ulang halaman.");
  }
  if (
    project.status !== "PROPOSAL" ||
    TERMINAL_PAYMENT_STATUSES.includes(
      currentStatus as (typeof TERMINAL_PAYMENT_STATUSES)[number],
    )
  ) {
    throw new PaymentFlowError("Pembayaran proyek ini sudah diproses.");
  }

  const orderId = createOrderId(project.id);
  if (project.payment) {
    const reset = await prisma.project_payment.updateMany({
      where: {
        id: project.payment.id,
        orderId: project.payment.orderId,
        status: { in: [...RETRYABLE_PAYMENT_STATUSES, "CREATING"] },
      },
      data: {
        orderId,
        amount,
        status: "CREATING",
        snapToken: null,
        redirectUrl: null,
        midtransTransactionId: null,
        paymentType: null,
        fraudStatus: null,
        rawStatus: undefined,
        paidAt: null,
        heldAt: null,
      },
    });
    if (reset.count !== 1) {
      throw new PaymentFlowError("Pembayaran sedang diproses. Muat ulang halaman.");
    }
  } else {
    await prisma.project_payment.create({
      data: { projectId: project.id, orderId, amount, status: "CREATING" },
      select: { id: true },
    });
  }

  try {
    const snap = await createSnapTransaction({
      orderId,
      amount,
      projectTitle: project.title,
      customer: {
        firstName: project.umkm.user.name || "Pemilik UMKM",
        email: project.umkm.user.email,
        phone: project.umkm.user.no_telepon,
      },
      finishUrl: `${getApplicationUrl()}/dashboard/payments/${project.id}?payment=finish`,
    });
    const updated = await prisma.project_payment.updateMany({
      where: { projectId: project.id, orderId, status: "CREATING" },
      data: {
        status: "PENDING",
        snapToken: snap.token,
        redirectUrl: snap.redirect_url,
      },
    });
    if (updated.count !== 1) {
      throw new PaymentFlowError("Status pembayaran berubah. Muat ulang halaman.");
    }
    return { redirectUrl: snap.redirect_url, status: "PENDING" as const };
  } catch (error) {
    await prisma.project_payment.updateMany({
      where: { projectId: project.id, orderId, status: "CREATING" },
      data: { status: "FAILED" },
    });
    throw error;
  }
}

export async function applyMidtransStatus(payload: MidtransStatusPayload) {
  const transactionStatus = payload.transaction_status.toLowerCase();
  const fraudStatus = payload.fraud_status?.toLowerCase();
  const grossAmount = Number(payload.gross_amount);
  if (!Number.isSafeInteger(grossAmount)) {
    throw new PaymentFlowError("Nominal notifikasi Midtrans tidak valid.");
  }

  return prisma.$transaction(async (transaction) => {
    const payment = await transaction.project_payment.findUnique({
      where: { orderId: payload.order_id },
      select: {
        id: true,
        amount: true,
        status: true,
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            studentId: true,
            umkm: { select: { userId: true } },
            student: { select: { userId: true } },
          },
        },
      },
    });
    if (!payment) throw new PaymentFlowError("Order pembayaran tidak ditemukan.");
    if (payment.amount !== grossAmount) {
      throw new PaymentFlowError("Nominal notifikasi tidak cocok dengan proyek.");
    }

    const commonData = {
      midtransTransactionId: payload.transaction_id ?? null,
      paymentType: payload.payment_type ?? null,
      fraudStatus: payload.fraud_status ?? null,
      rawStatus: JSON.parse(JSON.stringify(payload)) as Prisma.InputJsonValue,
    };
    // Tidak semua metode pembayaran Midtrans diperiksa oleh FDS. Jika field
    // fraud_status tersedia, hanya "accept" yang boleh dianggap berhasil.
    const hasAcceptedFraudStatus =
      fraudStatus === undefined || fraudStatus === "accept";
    const isSuccessful =
      payload.status_code === "200" &&
      (transactionStatus === "capture" || transactionStatus === "settlement") &&
      hasAcceptedFraudStatus;

    if (isSuccessful) {
      if (payment.status === "RELEASED" || payment.status === "HELD") {
        return { newlyHeld: false, project: payment.project };
      }
      if (!payment.project.studentId || !payment.project.student) {
        throw new PaymentFlowError("Proyek belum memiliki student terpilih.");
      }
      const now = new Date();
      const claimed = await transaction.project_payment.updateMany({
        where: {
          id: payment.id,
          status: { in: ["CREATING", "PENDING", "FAILED"] },
        },
        data: {
          ...commonData,
          status: "HELD",
          paidAt: now,
          heldAt: now,
        },
      });
      if (claimed.count !== 1) {
        return { newlyHeld: false, project: payment.project };
      }
      const started = await transaction.project.updateMany({
        where: {
          id: payment.project.id,
          status: "PROPOSAL",
          studentId: payment.project.studentId,
        },
        data: { status: "IN_PROGRESS" },
      });
      if (started.count !== 1) {
        throw new PaymentFlowError("Status proyek tidak dapat dimulai.");
      }
      return { newlyHeld: true, project: payment.project };
    }

    if (transactionStatus === "pending") {
      if (!["HELD", "RELEASED"].includes(payment.status)) {
        await transaction.project_payment.updateMany({
          where: { id: payment.id, status: { notIn: ["HELD", "RELEASED"] } },
          data: { ...commonData, status: "PENDING" },
        });
      }
      return { newlyHeld: false, project: payment.project };
    }

    const failureMap: Record<string, string> = {
      deny: "FAILED",
      failure: "FAILED",
      expire: "EXPIRED",
      cancel: "CANCELLED",
      refund: "REFUNDED",
      partial_refund: "REFUNDED",
      chargeback: "CHARGEBACK",
      partial_chargeback: "CHARGEBACK",
    };
    const nextStatus = failureMap[transactionStatus];
    if (nextStatus) {
      const refundableStatuses = [
        "CREATING",
        "PENDING",
        "FAILED",
        "EXPIRED",
        "CANCELLED",
        "HELD",
        "REFUNDED",
        "CHARGEBACK",
      ];
      const prePaymentFailureStatuses = [
        "CREATING",
        "PENDING",
        "FAILED",
        "EXPIRED",
        "CANCELLED",
      ];
      const allowedCurrentStatuses = ["REFUNDED", "CHARGEBACK"].includes(nextStatus)
        ? refundableStatuses
        : prePaymentFailureStatuses;

      // Midtrans dapat mengirim notifikasi tidak berurutan. Filter status pada
      // UPDATE mencegah event pending/expire lama menurunkan pembayaran HELD.
      await transaction.project_payment.updateMany({
        where: { id: payment.id, status: { in: allowedCurrentStatuses } },
        data: { ...commonData, status: nextStatus },
      });
    }
    return { newlyHeld: false, project: payment.project };
  });
}
