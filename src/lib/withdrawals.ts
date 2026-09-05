import "server-only";

import { redirect } from "next/navigation";
import type {
  WithdrawalListItem,
  WithdrawalPageData,
  WithdrawalStatus,
} from "@/types/withdrawal";
import { requireAuthenticatedSession } from "./auth-guard";
import prisma from "./prisma";

const KNOWN_STATUSES = new Set<WithdrawalStatus>([
  "PENDING",
  "COMPLETED",
  "REJECTED",
]);

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
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function normalizeStatus(status: string): WithdrawalStatus {
  return KNOWN_STATUSES.has(status as WithdrawalStatus)
    ? (status as WithdrawalStatus)
    : "PENDING";
}

function getStatusLabel(status: WithdrawalStatus) {
  if (status === "COMPLETED") return "Selesai";
  if (status === "REJECTED") return "Ditolak";
  return "Menunggu Admin";
}

function maskAccountNumber(value: string) {
  if (value.length <= 4) return value;
  return `${"•".repeat(Math.min(8, value.length - 4))}${value.slice(-4)}`;
}

type WithdrawalRow = {
  id: string;
  amount: number;
  provider: string;
  accountName: string;
  accountNumber: string;
  status: string;
  adminNote: string | null;
  createdAt: Date;
  processedAt: Date | null;
  user: { name: string | null; email: string };
};

function mapWithdrawal(
  request: WithdrawalRow,
  revealAccountNumber: boolean,
): WithdrawalListItem {
  const status = normalizeStatus(request.status);
  return {
    id: request.id,
    studentName: request.user.name || "Student Jembara",
    studentEmail: request.user.email,
    amount: request.amount,
    amountLabel: formatRupiah(request.amount),
    provider: request.provider,
    accountName: request.accountName,
    accountNumber: revealAccountNumber
      ? request.accountNumber
      : maskAccountNumber(request.accountNumber),
    status,
    statusLabel: getStatusLabel(status),
    adminNote: request.adminNote,
    createdAtLabel: formatDate(request.createdAt),
    processedAtLabel: request.processedAt ? formatDate(request.processedAt) : null,
  };
}

const withdrawalSelect = {
  id: true,
  amount: true,
  provider: true,
  accountName: true,
  accountNumber: true,
  status: true,
  adminNote: true,
  createdAt: true,
  processedAt: true,
  user: { select: { name: true, email: true } },
} as const;

export async function getWithdrawalPageData(): Promise<WithdrawalPageData> {
  const session = await requireAuthenticatedSession();
  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      role: true,
      saldo: true,
      student: { select: { id: true } },
      admin: { select: { id: true } },
      payoutMethods: {
        orderBy: [{ isPrimary: "desc" as const }, { createdAt: "asc" as const }],
        select: {
          id: true,
          provider: true,
          accountName: true,
          accountNumber: true,
          isPrimary: true,
        },
      },
    },
  });
  if (!viewer) throw new Error("Pengguna pada sesi tidak ditemukan");

  if (viewer.role === "STUDENT" && viewer.student) {
    const requests = await prisma.withdrawal_request.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: withdrawalSelect,
    });
    return {
      role: "STUDENT",
      balance: viewer.saldo,
      balanceLabel: formatRupiah(viewer.saldo),
      payoutMethods: viewer.payoutMethods.map((method) => ({
        id: method.id,
        label: `${method.provider} · ${method.accountName} · ${maskAccountNumber(method.accountNumber)}`,
        isPrimary: method.isPrimary,
      })),
      requests: requests.map((request) => mapWithdrawal(request, false)),
    };
  }

  if (viewer.role === "ADMIN" && viewer.admin) {
    const [pendingRequests, processedRequests, pendingCount] = await Promise.all([
      prisma.withdrawal_request.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
        take: 100,
        select: withdrawalSelect,
      }),
      prisma.withdrawal_request.findMany({
        where: { status: { in: ["COMPLETED", "REJECTED"] } },
        orderBy: { processedAt: "desc" },
        take: 50,
        select: withdrawalSelect,
      }),
      prisma.withdrawal_request.count({ where: { status: "PENDING" } }),
    ]);
    return {
      role: "ADMIN",
      pendingCount,
      requests: [...pendingRequests, ...processedRequests].map((request) =>
        mapWithdrawal(request, true),
      ),
    };
  }

  redirect("/forbidden");
}
