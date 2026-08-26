import "server-only";

import { BarChart3, Calendar, Clock, Wallet } from "lucide-react";
import { redirect } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import prisma from "./prisma";
import { requireAuthenticatedSession } from "./auth-guard";
import type {
  EarningsChartPoint,
  EarningsData,
  Transaction,
  TransactionStatus,
} from "@/types/earnings";

const EARNINGS_PROJECT_STATUSES = ["IN_PROGRESS", "REVIEW", "COMPLETED"];

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
  completedProjects: readonly { budget: number | null; updatedAt: Date }[],
  now: Date,
): EarningsChartPoint[] {
  const currentMonth = startOfMonth(now);
  const defaultStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const earliestCompletion = completedProjects.reduce<Date | null>(
    (earliest, project) =>
      !earliest || project.updatedAt < earliest ? project.updatedAt : earliest,
    null,
  );
  const firstMonth = earliestCompletion
    ? new Date(
        Math.min(defaultStart.getTime(), startOfMonth(earliestCompletion).getTime()),
      )
    : defaultStart;
  const totals = completedProjects.reduce<Map<string, number>>((result, project) => {
    const key = monthKey(project.updatedAt.getFullYear(), project.updatedAt.getMonth());
    result.set(key, (result.get(key) ?? 0) + (project.budget ?? 0));
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

function createEmptyData(now: Date): EarningsData {
  return {
    stats: [
      { id: "total", label: "Total Nilai Proyek Selesai", value: formatRupiah(0), icon: Wallet },
      { id: "month", label: "Nilai Selesai Bulan Ini", value: formatRupiah(0), icon: Calendar },
      { id: "pending", label: "Nilai Dalam Review", value: formatRupiah(0), icon: Clock },
      { id: "average", label: "Rata-rata Proyek Selesai", value: formatRupiah(0), icon: BarChart3 },
    ],
    chartData: buildChartData([], now),
    transactions: [],
  };
}

export async function getEarningsData(now = new Date()): Promise<EarningsData> {
  const session = await requireAuthenticatedSession();
  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      role: true,
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
    return createEmptyData(now);
  }

  const projects = await prisma.project.findMany({
    where: {
      ...ownershipFilter,
      status: { in: EARNINGS_PROJECT_STATUSES },
    },
    orderBy: { updatedAt: "desc" },
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
  const completedProjects = projects.filter(
    (project) => project.status === "COMPLETED",
  );
  const completedProjectsWithBudget = completedProjects.filter(
    (project) => project.budget !== null,
  );
  const totalCompleted = completedProjectsWithBudget.reduce(
    (total, project) => total + (project.budget ?? 0),
    0,
  );
  const completedThisMonth = completedProjectsWithBudget.reduce(
    (total, project) =>
      project.updatedAt.getFullYear() === now.getFullYear() &&
      project.updatedAt.getMonth() === now.getMonth()
        ? total + (project.budget ?? 0)
        : total,
    0,
  );
  const pendingReview = projects.reduce(
    (total, project) =>
      project.status === "REVIEW" ? total + (project.budget ?? 0) : total,
    0,
  );
  const averageCompleted = completedProjectsWithBudget.length
    ? totalCompleted / completedProjectsWithBudget.length
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
    chartData: buildChartData(completedProjectsWithBudget, now),
    transactions,
  };
}
