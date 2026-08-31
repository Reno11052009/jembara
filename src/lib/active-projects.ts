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
  ActiveProjectStatus,
  ActiveProjectsData,
  ActiveProjectsViewerRole,
} from "@/types/active-project";

const ACTIVE_PROJECT_STATUSES = ["IN_PROGRESS", "REVIEW", "COMPLETED"];

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
  submission: { select: { notes: true, resultUrl: true, status: true } },
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
          : null,
    submission:
      role !== "STUDENT" && project.submission
        ? {
            notes: project.submission.notes,
            resultUrl: project.submission.resultUrl,
          }
        : null,
  };
}

function sumActiveProjectBudgets(projects: readonly ActiveProjectRecord[]) {
  return projects.reduce(
    (total, project) =>
      project.status === "COMPLETED" ? total : total + (project.budget ?? 0),
    0,
  );
}

export async function getActiveProjectsData(): Promise<ActiveProjectsData> {
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
      ...content,
    };
  }

  const projectRecords = await prisma.project.findMany({
    where: {
      ...ownershipFilter,
      status: { in: ACTIVE_PROJECT_STATUSES },
    },
    orderBy: { updatedAt: "desc" },
    select: projectSelect,
  });
  const projects = projectRecords.map((project) => mapProject(project, role));
  const tabCounts = projects.reduce<Record<ActiveProjectStatus, number>>(
    (counts, project) => {
      counts[project.status] += 1;
      return counts;
    },
    createEmptyCounts(),
  );
  const completedThisMonth = projectRecords.filter((project) => {
    const now = new Date();
    return (
      project.status === "COMPLETED" &&
      project.updatedAt.getFullYear() === now.getFullYear() &&
      project.updatedAt.getMonth() === now.getMonth()
    );
  }).length;
  const activeCount = tabCounts["In Progress"] + tabCounts["In Review"];
  const activeBudgetLabel = formatBudget(sumActiveProjectBudgets(projectRecords));
  const totalProposalCount = projectRecords.reduce(
    (total, project) => total + project._count.proposals,
    0,
  );
  const selectedTalentCount = projectRecords.filter(
    (project) => project.status !== "COMPLETED" && project.student,
  ).length;

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

  return { role, projects, tabCounts, metrics, ...content };
}
