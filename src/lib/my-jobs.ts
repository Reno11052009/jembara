import "server-only";

import { redirect } from "next/navigation";
import prisma from "./prisma";
import { requireAuthenticatedSession } from "./auth-guard";
import { formatBudget } from "./dashboard-utils";
import type {
  JobListingStatus,
  MyJobsData,
  ProjectCreationData,
  ProjectWorkMode,
} from "@/types/my-jobs";
import type { Prisma } from "@/generated/prisma/client";
import { createPagination, normalizePage } from "./pagination";
import { notFound } from "next/navigation";
import { z } from "zod";

const PAGE_SIZE = 8;
type MyJobsFilter = "Semua" | JobListingStatus;

const createAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

function normalizeWorkMode(value: string): ProjectWorkMode {
  if (value === "HYBRID" || value === "ONSITE") return value;
  return "REMOTE";
}

function formatWorkMode(value: string) {
  const workMode = normalizeWorkMode(value);
  if (workMode === "HYBRID") return "Hybrid";
  if (workMode === "ONSITE") return "Onsite";
  return "Remote";
}

function mapProjectStatus(
  status: string,
  hasSelectedStudent = false,
  paymentStatus?: string | null,
): JobListingStatus {
  if (status === "OPEN") return "Terbuka";
  if (
    status === "PROPOSAL" &&
    hasSelectedStudent &&
    !["HELD", "RELEASED"].includes(paymentStatus ?? "")
  ) {
    return "Menunggu Pembayaran";
  }
  if (status === "PROPOSAL") return "Seleksi";
  if (status === "IN_PROGRESS") return "Berjalan";
  if (status === "REVIEW") return "Dalam Review";
  if (status === "COMPLETED") return "Selesai";
  if (status === "CANCELLED") return "Dibatalkan";
  return "Lainnya";
}

function formatProjectDate(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

async function getUmkmViewer() {
  const session = await requireAuthenticatedSession();
  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      avatar: true,
      role: true,
      location: true,
      umkm: { select: { id: true, nama_usaha: true } },
    },
  });

  if (!viewer || viewer.role !== "UMKM" || !viewer.umkm) {
    redirect("/forbidden");
  }

  const ownerName = viewer.name?.trim() || viewer.umkm.nama_usaha;
  return {
    location: viewer.location,
    umkm: viewer.umkm,
    ownerName,
    ownerAvatarUrl: viewer.avatar || createAvatarUrl(ownerName),
  };
}

export async function getProjectCreationData(): Promise<ProjectCreationData> {
  const viewer = await getUmkmViewer();
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
    select: { id: true, name: true, category: true },
  });

  return {
    ownerName: viewer.ownerName,
    ownerAvatarUrl: viewer.ownerAvatarUrl,
    businessName: viewer.umkm.nama_usaha,
    skillOptions: skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      category: skill.category || "Lainnya",
    })),
  };
}

export async function getProjectEditData(projectId: unknown) {
  const parsed = z.string().uuid().safeParse(projectId);
  if (!parsed.success) notFound();
  const viewer = await getUmkmViewer();
  const [project, skills] = await Promise.all([
    prisma.project.findFirst({ where: { id: parsed.data, umkmId: viewer.umkm.id, status: "OPEN", studentId: null, proposals: { none: {} } }, select: { id: true, title: true, description: true, budget: true, deadline: true, workMode: true, location: true, skillsNeeded: { select: { skillId: true, required: true } } } }),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }], select: { id: true, name: true, category: true } }),
  ]);
  if (!project) notFound();
  return { ...viewer, project, skills };
}

function normalizeJobsFilter(value: unknown): MyJobsFilter {
  const firstValue = Array.isArray(value) ? value[0] : value;
  const allowed: MyJobsFilter[] = [
    "Terbuka", "Seleksi", "Menunggu Pembayaran", "Berjalan",
    "Dalam Review", "Selesai", "Dibatalkan", "Lainnya",
  ];
  return allowed.includes(firstValue as MyJobsFilter)
    ? (firstValue as MyJobsFilter)
    : "Semua";
}

const waitingPaymentFilter: Prisma.projectWhereInput = {
  status: "PROPOSAL",
  studentId: { not: null },
  OR: [
    { payment: { is: null } },
    { payment: { is: { status: { notIn: ["HELD", "RELEASED"] } } } },
  ],
};

function whereForJobsFilter(filter: MyJobsFilter): Prisma.projectWhereInput {
  if (filter === "Terbuka") return { status: "OPEN" };
  if (filter === "Seleksi") return { status: "PROPOSAL", NOT: waitingPaymentFilter };
  if (filter === "Menunggu Pembayaran") return waitingPaymentFilter;
  if (filter === "Berjalan") return { status: "IN_PROGRESS" };
  if (filter === "Dalam Review") return { status: "REVIEW" };
  if (filter === "Selesai") return { status: "COMPLETED" };
  if (filter === "Dibatalkan") return { status: "CANCELLED" };
  if (filter === "Lainnya") {
    return { status: { notIn: ["OPEN", "PROPOSAL", "IN_PROGRESS", "REVIEW", "COMPLETED", "CANCELLED"] } };
  }
  // "Semua" — tampilkan semua status KECUALI Dibatalkan.
  // Dibatalkan cuma muncul lewat tab filter "Dibatalkan" sendiri.
  return { status: { not: "CANCELLED" } };
}

export async function getMyJobsData(options: {
  page?: unknown;
  status?: unknown;
} = {}): Promise<MyJobsData> {
  const viewer = await getUmkmViewer();
  const activeFilter = normalizeJobsFilter(options.status);
  const [statusGroups, waitingPaymentCount] = await Promise.all([
    prisma.project.groupBy({
      by: ["status"],
      where: { umkmId: viewer.umkm.id },
      _count: { _all: true },
    }),
    prisma.project.count({
      where: { umkmId: viewer.umkm.id, ...waitingPaymentFilter },
    }),
  ]);
  const countFor = (status: string) =>
    statusGroups.find((group) => group.status === status)?._count._all ?? 0;
  const knownStatuses = new Set(["OPEN", "PROPOSAL", "IN_PROGRESS", "REVIEW", "COMPLETED", "CANCELLED"]);
  const tabCounts: MyJobsData["tabCounts"] = {
    // Semua — total dikurangi yang Dibatalkan, biar konsisten sama query
    // di whereForJobsFilter (kalau nggak, angka di tombol beda sama jumlah
    // card yang beneran tampil, keliatan kayak bug).
    Semua: statusGroups.reduce(
      (total, group) => total + (group.status === "CANCELLED" ? 0 : group._count._all),
      0,
    ),
    Terbuka: countFor("OPEN"),
    Seleksi: Math.max(0, countFor("PROPOSAL") - waitingPaymentCount),
    "Menunggu Pembayaran": waitingPaymentCount,
    Berjalan: countFor("IN_PROGRESS"),
    "Dalam Review": countFor("REVIEW"),
    Selesai: countFor("COMPLETED"),
    Dibatalkan: countFor("CANCELLED"),
    Lainnya: statusGroups.reduce(
      (total, group) => total + (knownStatuses.has(group.status) ? 0 : group._count._all),
      0,
    ),
  };
  const pagination = createPagination(
    normalizePage(options.page),
    tabCounts[activeFilter],
    PAGE_SIZE,
  );
  const projects = await prisma.project.findMany({
    where: { umkmId: viewer.umkm.id, ...whereForJobsFilter(activeFilter) },
    orderBy: { createdAt: "desc" },
    skip: (pagination.currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      title: true,
      description: true,
      budget: true,
      deadline: true,
      workMode: true,
      location: true,
      status: true,
      studentId: true,
      payment: { select: { status: true } },
      createdAt: true,
      skillsNeeded: {
        select: { skill: { select: { name: true } } },
      },
      _count: { select: { proposals: true } },
    },
  });

  return {
    ownerName: viewer.ownerName,
    ownerAvatarUrl: viewer.ownerAvatarUrl,
    businessName: viewer.umkm.nama_usaha,
    activeFilter,
    tabCounts,
    pagination,
    listings: projects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      postedDateLabel: formatProjectDate(project.createdAt),
      applicantCount: project._count.proposals,
      budgetLabel: formatBudget(project.budget),
      deadlineLabel: project.deadline
        ? formatProjectDate(project.deadline)
        : "Fleksibel",
      workModeLabel: formatWorkMode(project.workMode),
      locationLabel:
        normalizeWorkMode(project.workMode) === "REMOTE"
          ? "Remote"
          : project.location || viewer.location || "Lokasi belum ditentukan",
      skills: project.skillsNeeded.map(({ skill }) => skill.name),
      status: mapProjectStatus(
        project.status,
        Boolean(project.studentId),
        project.payment?.status,
      ),
      statusCode: project.status,
      paymentStatus: project.payment?.status ?? null,
      hasSelectedStudent: Boolean(project.studentId),
    })),
  };
}