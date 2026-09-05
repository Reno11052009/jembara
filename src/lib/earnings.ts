import "server-only";

import { BarChart3, Calendar, Clock, Wallet } from "lucide-react";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import prisma from "./prisma";
import { requireAuthenticatedSession } from "./auth-guard";
import type {
  EarningsChartPoint,
  EarningsData,
  Transaction,
  TransactionStatus,
} from "@/types/earnings";
import { createPagination, normalizePage } from "./pagination";

const EARNINGS_PROJECT_STATUSES = ["IN_PROGRESS", "REVIEW", "COMPLETED"];
const PAGE_SIZE = 8;

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTransactionDate(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

function getTransactionStatus(status: string): TransactionStatus {
  if (status === "COMPLETED") return "Selesai";
  if (status === "REVIEW") return "Dalam Review";
  return "Berjalan";
}

function monthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function startOfMonth(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), 1);
}

function buildChartData(
  monthlyTotals: readonly { period: Date; amount: number }[],
  now: Date,
): EarningsChartPoint[] {
  const currentMonth = startOfMonth(now);
  const defaultStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const earliestCompletion = monthlyTotals[0]?.period ?? null;
  const firstMonth = earliestCompletion
    ? new Date(
        Math.min(defaultStart.getTime(), startOfMonth(earliestCompletion).getTime()),
      )
    : defaultStart;
  const totals = monthlyTotals.reduce<Map<string, number>>((result, item) => {
    const key = monthKey(item.period.getFullYear(), item.period.getMonth());
    result.set(key, Number(item.amount));
    return result;
  }, new Map());
  const points: EarningsChartPoint[] = [];

  for (
    let cursor = firstMonth;
    cursor <= currentMonth;
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
  ) {
    const period = monthKey(cursor.getFullYear(), cursor.getMonth());
    points.push({
      period,
      label: new Intl.DateTimeFormat("id-ID", {
        month: "short",
        year: "numeric",
      }).format(cursor),
      amount: totals.get(period) ?? 0,
    });
  }

  return points;
}

function createEmptyData(
  now: Date,
  page: unknown,
  canWithdraw: boolean,
): EarningsData {
  return {
    walletBalanceLabel: formatRupiah(0),
    canWithdraw,
    stats: [
      { id: "total", label: "Total Nilai Proyek Selesai", value: formatRupiah(0), icon: Wallet },
      { id: "month", label: "Nilai Selesai Bulan Ini", value: formatRupiah(0), icon: Calendar },
      { id: "pending", label: "Nilai Dalam Review", value: formatRupiah(0), icon: Clock },
      { id: "average", label: "Rata-rata Proyek Selesai", value: formatRupiah(0), icon: BarChart3 },
    ],
    chartData: buildChartData([], now),
    transactions: [],
    pagination: createPagination(normalizePage(page), 0, PAGE_SIZE),
  };
}

export async function getEarningsData(
  now = new Date(),
  options: { page?: unknown } = {},
): Promise<EarningsData> {
  const session = await requireAuthenticatedSession();
  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      role: true,
      saldo: true,
      student: { select: { id: true } },
      umkm: { select: { id: true } },
    },
  });

  if (!viewer) {
    throw new Error("Pengguna pada sesi tidak ditemukan");
  }
  const ownershipFilter: Prisma.projectWhereInput | null =
    viewer.role === "STUDENT"
      ? viewer.student
        ? { studentId: viewer.student.id }
        : null
      : viewer.role === "UMKM"
        ? viewer.umkm
          ? { umkmId: viewer.umkm.id }
          : null
        : viewer.role === "ADMIN"
          ? {}
          : redirect("/forbidden");

  if (ownershipFilter === null) {
    return createEmptyData(now, options.page, viewer.role === "STUDENT");
  }

  const projectsWhere: Prisma.projectWhereInput = {
    ...ownershipFilter,
    status: { in: EARNINGS_PROJECT_STATUSES },
    budget: { not: null },
  };
  const ownerSql = viewer.role === "STUDENT"
    ? Prisma.sql`AND "studentId" = ${viewer.student!.id}::uuid`
    : viewer.role === "UMKM"
      ? Prisma.sql`AND "umkmId" = ${viewer.umkm!.id}::uuid`
      : Prisma.empty;
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const [statusGroups, currentMonthAggregate, monthlyTotals] = await Promise.all([
    prisma.project.groupBy({
      by: ["status"],
      where: projectsWhere,
      _count: { _all: true },
      _sum: { budget: true },
    }),
    prisma.project.aggregate({
      where: {
        ...ownershipFilter,
        status: "COMPLETED",
        budget: { not: null },
        updatedAt: { gte: monthStart, lt: nextMonthStart },
      },
      _sum: { budget: true },
    }),
    prisma.$queryRaw<{ period: Date; amount: number }[]>(Prisma.sql`
      SELECT date_trunc('month', "updatedAt") AS period,
             SUM(budget)::float8 AS amount
      FROM project
      WHERE status = 'COMPLETED'
        AND budget IS NOT NULL
        ${ownerSql}
      GROUP BY date_trunc('month', "updatedAt")
      ORDER BY period ASC
    `),
  ]);
  const groupFor = (status: string) =>
    statusGroups.find((group) => group.status === status);
  const totalTransactions = statusGroups.reduce(
    (total, group) => total + group._count._all,
    0,
  );
  const pagination = createPagination(
    normalizePage(options.page),
    totalTransactions,
    PAGE_SIZE,
  );
  const projects = await prisma.project.findMany({
    where: {
      ...projectsWhere,
    },
    orderBy: { updatedAt: "desc" },
    skip: (pagination.currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      title: true,
      budget: true,
      status: true,
      updatedAt: true,
      umkm: { select: { nama_usaha: true } },
      student: { select: { user: { select: { name: true } } } },
    },
  });
  const completedGroup = groupFor("COMPLETED");
  const totalCompleted = completedGroup?._sum.budget ?? 0;
  const completedThisMonth = currentMonthAggregate._sum.budget ?? 0;
  const pendingReview = groupFor("REVIEW")?._sum.budget ?? 0;
  const completedCount = completedGroup?._count._all ?? 0;
  const averageCompleted = completedCount
    ? totalCompleted / completedCount
    : 0;
  const transactions = projects
    .filter((project) => project.budget !== null)
    .map<Transaction>((project) => ({
      id: project.id,
      title: project.title,
      clientName:
        viewer.role === "STUDENT"
          ? project.umkm.nama_usaha
          : viewer.role === "UMKM"
            ? project.student?.user.name || "Pelajar belum dipilih"
            : `${project.umkm.nama_usaha} · ${project.student?.user.name || "Tanpa pelajar"}`,
      amount: project.budget ?? 0,
      dateLabel: formatTransactionDate(project.updatedAt),
      status: getTransactionStatus(project.status),
    }));

  return {
    walletBalanceLabel: formatRupiah(viewer.saldo ?? 0),
    canWithdraw: viewer.role === "STUDENT",
    stats: [
      {
        id: "total",
        label: "Total Nilai Proyek Selesai",
        value: formatRupiah(totalCompleted),
        icon: Wallet,
      },
      {
        id: "month",
        label: "Nilai Selesai Bulan Ini",
        value: formatRupiah(completedThisMonth),
        icon: Calendar,
      },
      {
        id: "pending",
        label: "Nilai Dalam Review",
        value: formatRupiah(pendingReview),
        icon: Clock,
      },
      {
        id: "average",
        label: "Rata-rata Proyek Selesai",
        value: formatRupiah(averageCompleted),
        icon: BarChart3,
      },
    ],
    chartData: buildChartData(monthlyTotals, now),
    transactions,
    pagination,
  };
}
