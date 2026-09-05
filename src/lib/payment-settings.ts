import "server-only";

import { cache } from "react";
import type {
  PaymentMethod,
  PaymentSettingsData,
  Transaction,
} from "@/types/settings";
import { requireAuthenticatedSession } from "./auth-guard";
import prisma from "./prisma";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

function maskAccountNumber(value: string) {
  if (value.length <= 4) return value;
  return `${"•".repeat(Math.min(8, value.length - 4))}${value.slice(-4)}`;
}

const PROJECT_PAYMENT_STATUS: Record<string, string> = {
  PENDING: "Menunggu Pembayaran",
  HELD: "Dana Ditahan",
  RELEASED: "Selesai",
  FAILED: "Gagal",
  EXPIRED: "Kedaluwarsa",
  CANCELLED: "Dibatalkan",
  REFUNDED: "Dikembalikan",
  CHARGEBACK: "Ditarik Kembali",
};

function getProjectPaymentAmountType(status: string): Transaction["amountType"] {
  if (status === "RELEASED") return "credit";
  if (status === "REFUNDED" || status === "CHARGEBACK") return "debit";
  return "neutral";
}

function getWithdrawalStatus(status: string) {
  if (status === "COMPLETED") return "Selesai";
  if (status === "REJECTED") return "Ditolak";
  return "Menunggu Admin";
}

export const getPaymentSettingsData = cache(
  async (): Promise<PaymentSettingsData> => {
    const session = await requireAuthenticatedSession();
    const viewer = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        role: true,
        saldo: true,
        student: { select: { id: true } },
      },
    });
    if (!viewer) throw new Error("Pengguna pada sesi tidak ditemukan");

    const canManagePayoutMethods = viewer.role === "STUDENT" && Boolean(viewer.student);
    if (!canManagePayoutMethods) {
      return {
        canManagePayoutMethods: false,
        balanceLabel: formatRupiah(viewer.saldo),
        paymentMethods: [],
        transactions: [],
      };
    }

    const [methods, projectPayments, withdrawals] = await Promise.all([
      prisma.payout_method.findMany({
        where: { userId: session.userId },
        orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
        select: {
          id: true,
          provider: true,
          accountName: true,
          accountNumber: true,
          isPrimary: true,
        },
      }),
      prisma.project_payment.findMany({
        where: {
          status: { not: "CREATING" },
          OR: [
            { releasedToUserId: session.userId },
            { project: { student: { is: { userId: session.userId } } } },
          ],
        },
        orderBy: { updatedAt: "desc" },
        take: 30,
        select: {
          id: true,
          amount: true,
          reversedAmount: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          paidAt: true,
          heldAt: true,
          releasedAt: true,
          project: { select: { title: true } },
        },
      }),
      prisma.withdrawal_request.findMany({
        where: { userId: session.userId },
        orderBy: { updatedAt: "desc" },
        take: 30,
        select: {
          id: true,
          amount: true,
          provider: true,
          accountNumber: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          processedAt: true,
        },
      }),
    ]);

    const paymentMethods: PaymentMethod[] = methods.map((method) => ({
      id: method.id,
      name: method.provider,
      detailLine: `${method.accountName} · ${maskAccountNumber(method.accountNumber)}`,
      isPrimary: method.isPrimary,
    }));
    const transactionRows = [
      ...projectPayments.map((payment) => {
        const occurredAt =
          payment.releasedAt ??
          payment.heldAt ??
          payment.paidAt ??
          payment.updatedAt ??
          payment.createdAt;
        const displayedAmount =
          payment.status === "REFUNDED" || payment.status === "CHARGEBACK"
            ? payment.reversedAmount || payment.amount
            : payment.amount;
        return {
          occurredAt,
          transaction: {
            id: `payment-${payment.id}`,
            date: formatDate(occurredAt),
            description: `Pembayaran proyek: ${payment.project.title}`,
            amount: formatRupiah(displayedAmount),
            amountType: getProjectPaymentAmountType(payment.status),
            status: PROJECT_PAYMENT_STATUS[payment.status] ?? payment.status,
          } satisfies Transaction,
        };
      }),
      ...withdrawals.map((withdrawal) => {
        const occurredAt =
          withdrawal.processedAt ?? withdrawal.updatedAt ?? withdrawal.createdAt;
        return {
          occurredAt,
          transaction: {
            id: `withdrawal-${withdrawal.id}`,
            date: formatDate(occurredAt),
            description: `Penarikan ke ${withdrawal.provider} · ${maskAccountNumber(withdrawal.accountNumber)}`,
            amount: formatRupiah(withdrawal.amount),
            amountType:
              withdrawal.status === "REJECTED" ? "neutral" : "debit",
            status: getWithdrawalStatus(withdrawal.status),
          } satisfies Transaction,
        };
      }),
    ];
    const transactions = transactionRows
      .sort((left, right) => right.occurredAt.getTime() - left.occurredAt.getTime())
      .slice(0, 30)
      .map(({ transaction }) => transaction);

    return {
      canManagePayoutMethods,
      balanceLabel: formatRupiah(viewer.saldo),
      paymentMethods,
      transactions,
    };
  },
);
