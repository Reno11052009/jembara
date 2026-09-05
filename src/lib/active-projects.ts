import "server-only";

import { redirect } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import prisma from "./prisma";
import { requireAuthenticatedSession } from "./auth-guard";
import {
  formatBudget,
  formatDeadline,
  formatRelativeDate,
} from "./dashboard-utils";
import type {
  ActiveProject,
  ActiveProjectFilter,
  ActiveProjectStatus,
  ActiveProjectsData,
  ActiveProjectsViewerRole,
} from "@/types/active-project";
import { createPagination, normalizePage } from "./pagination";

const ACTIVE_PROJECT_STATUSES = ["IN_PROGRESS", "REVIEW", "COMPLETED"];
const PAGE_SIZE = 6;

const projectSelect = {
  id: true,
  title: true,
  status: true,
  budget: true,
  deadline: true,
  updatedAt: true,
  umkm: { select: { nama_usaha: true } },
  student: { select: { user: { select: { name: true } } } },
  skillsNeeded: { select: { skill: { select: { name: true } } } },
  _count: { select: { proposals: true } },
  payment: { select: { status: true } },
  submission: {
    select: {
      notes: true,
      resultUrl: true,
      status: true,
      revisionCount: true,
      revisions: { orderBy: { sequence: "desc" }, take: 1, select: { reason: true } },
    },
  },
  review: { select: { id: true } },
} satisfies Prisma.projectSelect;

type ActiveProjectRecord = Prisma.projectGetPayload<{
  select: typeof projectSelect;
}>;

function normalizeRole(role: string): ActiveProjectsViewerRole {
  if (role === "STUDENT" || role === "UMKM" || role === "ADMIN") {
    return role;
  }
  redirect("/forbidden");
}

function mapStatus(status: string): ActiveProjectStatus {
  if (status === "REVIEW") return "In Review";
  if (status === "COMPLETED") return "Completed";
  return "In Progress";
}

function createEmptyCounts(): Record<ActiveProjectStatus, number> {
  return { "In Progress": 0, "In Review": 0, Completed: 0 };
}

function getRoleContent(role: ActiveProjectsViewerRole) {
  if (role === "UMKM") {
    return {
      pageTitle: "Kolaborasi Proyek UMKM",
      pageSubtitle: "Pantau talent, deadline, dan tahap pengerjaan proyek bisnis Anda.",
      emptyMessage: "Belum ada proyek bisnis yang memasuki tahap kolaborasi.",
      collaborationTip:
        "Berikan brief dan umpan balik yang jelas agar talent dapat menyelesaikan pekerjaan sesuai kebutuhan bisnis Anda.",
    };
  }
  if (role === "ADMIN") {
    return {
      pageTitle: "Pengawasan Proyek Aktif",
      pageSubtitle: "Tinjau aktivitas kolaborasi yang sedang berjalan di platform.",
      emptyMessage: "Belum ada kolaborasi aktif di platform.",
      collaborationTip:
        "Gunakan data proyek untuk pengawasan dasar. Perubahan status tetap harus dilakukan oleh pemilik alur yang berwenang.",
    };
  }
  return {
    pageTitle: "Proyek Aktif Saya",
    pageSubtitle: "Pantau deadline dan tahap proyek yang sedang kamu kerjakan.",
    emptyMessage: "Belum ada proyek yang ditugaskan kepadamu.",
    collaborationTip:
      "Komunikasikan perkembangan pekerjaan secara berkala kepada UMKM dan pastikan hasil dikirim sebelum deadline.",
  };
}

function mapProject(
  project: ActiveProjectRecord,
  role: ActiveProjectsViewerRole,
): ActiveProject {
  const counterpartName =
    role === "STUDENT"
      ? project.umkm.nama_usaha
      : project.student?.user.name || "Talent belum dipilih";

  return {
    id: project.id,
    title: project.title,
    clientName: counterpartName,
    counterpartLabel: role === "STUDENT" ? "UMKM" : "Talent",
    status: mapStatus(project.status),
    budgetLabel: formatBudget(project.budget),
    deadlineLabel: formatDeadline(project.deadline),
    tags: project.skillsNeeded.map(({ skill }) => skill.name),
    proposalCount: project._count.proposals,
    updatedLabel: formatRelativeDate(project.updatedAt),
    paymentStatus: project.payment?.status ?? null,
    workflowAction:
      role === "STUDENT" &&
      project.status === "IN_PROGRESS" &&
      project.payment?.status === "HELD"
        ? "SUBMIT_RESULT"
        : role === "UMKM" &&
            project.status === "REVIEW" &&
            project.payment?.status === "HELD" &&
            project.submission?.status === "SUBMITTED"
          ? "APPROVE_RESULT"
          : role === "UMKM" && project.status === "COMPLETED" && !project.review
            ? "LEAVE_REVIEW"
          : null,
    submission:
      project.submission
        ? {
            notes: project.submission.notes,
            resultUrl: project.submission.resultUrl,
            revisionCount: project.submission.revisionCount,
            latestRevisionReason: project.submission.revisions[0]?.reason ?? null,
          }
        : null,
    hasReview: Boolean(project.review),
  };
}

function normalizeFilter(value: unknown): ActiveProjectFilter {
  const firstValue = Array.isArray(value) ? value[0] : value;
  return firstValue === "In Progress" || firstValue === "In Review" || firstValue === "Completed"
    ? firstValue
    : "Semua";
}

export async function getActiveProjectsData(options: {
  page?: unknown;
  status?: unknown;
} = {}): Promise<ActiveProjectsData> {
  const session = await requireAuthenticatedSession();
  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      role: true,
      student: { select: { id: true, rating: true } },
      umkm: { select: { id: true } },
    },
  });

  if (!viewer) {
    throw new Error("Pengguna pada sesi tidak ditemukan");
  }

  const role = normalizeRole(viewer.role);
  const content = getRoleContent(role);
  const activeFilter = normalizeFilter(options.status);
  const ownershipFilter: Prisma.projectWhereInput | null =
    role === "STUDENT"
      ? viewer.student
        ? { studentId: viewer.student.id }
        : null
      : role === "UMKM"
        ? viewer.umkm
          ? { umkmId: viewer.umkm.id }
          : null
        : {};

  if (ownershipFilter === null) {
    return {
      role,
      projects: [],
      tabCounts: createEmptyCounts(),
      metrics: [],
      activeFilter,
      pagination: createPagination(normalizePage(options.page), 0, PAGE_SIZE),
      ...content,
    };
  }

  const baseWhere: Prisma.projectWhereInput = {
    ...ownershipFilter,
    status: { in: ACTIVE_PROJECT_STATUSES },
  };
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const [statusGroups, completedThisMonth, selectedTalentCount, totalProposalCount] =
    await Promise.all([
      prisma.project.groupBy({
        by: ["status"],
        where: baseWhere,
        _count: { _all: true },
        _sum: { budget: true },
      }),
      prisma.project.count({
        where: {
          ...ownershipFilter,
          status: "COMPLETED",
          updatedAt: { gte: monthStart, lt: nextMonthStart },
        },
      }),
      prisma.project.count({
        where: {
          ...ownershipFilter,
          status: { in: ["IN_PROGRESS", "REVIEW"] },
          studentId: { not: null },
        },
      }),
      prisma.proposal.count({ where: { project: baseWhere } }),
    ]);
  const groupFor = (status: string) =>
    statusGroups.find((group) => group.status === status);
  const tabCounts: Record<ActiveProjectStatus, number> = {
    "In Progress": groupFor("IN_PROGRESS")?._count._all ?? 0,
    "In Review": groupFor("REVIEW")?._count._all ?? 0,
    Completed: groupFor("COMPLETED")?._count._all ?? 0,
  };
  const selectedStatus =
    activeFilter === "Semua"
      ? undefined
      : activeFilter === "In Progress"
        ? "IN_PROGRESS"
        : activeFilter === "In Review"
          ? "REVIEW"
          : "COMPLETED";
  const filteredTotal = selectedStatus
    ? tabCounts[activeFilter as ActiveProjectStatus]
    : Object.values(tabCounts).reduce((total, count) => total + count, 0);
  const pagination = createPagination(
    normalizePage(options.page),
    filteredTotal,
    PAGE_SIZE,
  );
  const projectRecords = await prisma.project.findMany({
    where: {
      ...ownershipFilter,
      status: selectedStatus ?? { in: ACTIVE_PROJECT_STATUSES },
    },
    orderBy: { updatedAt: "desc" },
    skip: (pagination.currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: projectSelect,
  });
  const projects = projectRecords.map((project) => mapProject(project, role));
  const activeCount = tabCounts["In Progress"] + tabCounts["In Review"];
  const activeBudgetLabel = formatBudget(
    (groupFor("IN_PROGRESS")?._sum.budget ?? 0) +
      (groupFor("REVIEW")?._sum.budget ?? 0),
  );

  const metrics =
    role === "STUDENT"
      ? [
          { id: "active", label: "Sedang Berjalan", value: `${activeCount} Proyek` },
          {
            id: "completed",
            label: "Selesai Bulan Ini",
            value: `${completedThisMonth} Proyek`,
            tone: "success" as const,
          },
          {
            id: "value",
            label: "Nilai Proyek Aktif",
            value: activeBudgetLabel,
            tone: "brand" as const,
          },
          {
            id: "rating",
            label: "Rating Pelajar",
            value:
              viewer.student && viewer.student.rating > 0
                ? `${viewer.student.rating.toFixed(1)} ★`
                : "Belum ada",
          },
        ]
      : role === "UMKM"
        ? [
            { id: "active", label: "Kolaborasi Berjalan", value: `${activeCount} Proyek` },
            {
              id: "review",
              label: "Menunggu Review",
              value: `${tabCounts["In Review"]} Proyek`,
              tone: "brand" as const,
            },
            {
              id: "talent",
              label: "Talent Terpilih",
              value: `${selectedTalentCount} Talent`,
            },
            { id: "proposals", label: "Total Proposal", value: `${totalProposalCount} Proposal` },
          ]
        : [
            { id: "active", label: "Kolaborasi Berjalan", value: `${activeCount} Proyek` },
            { id: "review", label: "Dalam Review", value: `${tabCounts["In Review"]} Proyek` },
            { id: "completed", label: "Selesai Bulan Ini", value: `${completedThisMonth} Proyek` },
            { id: "value", label: "Nilai Proyek Aktif", value: activeBudgetLabel },
          ];

  return { role, projects, tabCounts, metrics, activeFilter, pagination, ...content };
}
