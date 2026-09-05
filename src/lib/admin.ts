import "server-only";

import { redirect } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import type { AdminChatMonitoringData } from "@/types/admin-chat-monitoring";
import type { AdminJobsData, AdminJobStatus } from "@/types/admin-jobs";
import type {
  AdminRelationRow,
  AdminRelationsData,
  RelationContractStatus,
} from "@/types/admin-relations";
import type { AdminUmkmData, AdminUmkmProfileStatus } from "@/types/admin-umkm";
import type { AdminUsersData } from "@/types/admin-users";
import { requireAdminSession } from "./auth-guard";
import { formatBudget } from "./dashboard-utils";
import prisma from "./prisma";

export type AdminSearchParams = Record<string, string | string[] | undefined>;

const PAGE_SIZE = 20;
const MAX_QUERY_LENGTH = 100;
const PROJECT_STATUSES = new Set<AdminJobStatus>([
  "OPEN",
  "PROPOSAL",
  "IN_PROGRESS",
  "REVIEW",
  "COMPLETED",
  "CANCELLED",
]);

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalizedQuery(value: string | string[] | undefined) {
  return firstValue(value).trim().slice(0, MAX_QUERY_LENGTH);
}

function normalizedPage(value: string | string[] | undefined) {
  const page = Number.parseInt(firstValue(value), 10);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function createAvatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
}

async function requireAdminViewer() {
  const session = await requireAdminSession();
  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      avatar: true,
      role: true,
      admin: { select: { id: true } },
    },
  });

  if (!viewer || viewer.role !== "ADMIN" || !viewer.admin) {
    redirect("/forbidden");
  }

  const adminName = viewer.name?.trim() || "Admin Jembara";
  return {
    adminName,
    adminAvatarUrl: viewer.avatar || createAvatarUrl(adminName),
  };
}

function paginationSummary(total: number, page: number) {
  if (total === 0) return "Belum ada data yang dapat ditampilkan.";
  const first = (page - 1) * PAGE_SIZE + 1;
  const last = Math.min(page * PAGE_SIZE, total);
  return `Menampilkan ${formatNumber(first)}-${formatNumber(last)} dari ${formatNumber(total)} data`;
}

export async function getAdminUsersData(
  searchParams: AdminSearchParams = {},
): Promise<AdminUsersData> {
  const viewer = await requireAdminViewer();
  const query = normalizedQuery(searchParams.q);
  const rawAvailability = firstValue(searchParams.availability);
  const availability = ["tersedia", "tidak_tersedia"].includes(rawAvailability)
    ? rawAvailability
    : "";
  const skill = normalizedQuery(searchParams.skill);

  const where: Prisma.studentWhereInput = {
    user: { role: "STUDENT" },
    ...(availability
      ? { available: availability === "tersedia" }
      : {}),
    ...(skill
      ? {
          skills: {
            some: { skill: { name: { equals: skill, mode: "insensitive" } } },
          },
        }
      : {}),
    ...(query
      ? {
          OR: [
            { user: { name: { contains: query, mode: "insensitive" } } },
            { user: { email: { contains: query, mode: "insensitive" } } },
            {
              skills: {
                some: {
                  skill: { name: { contains: query, mode: "insensitive" } },
                },
              },
            },
          ],
        }
      : {}),
  };

  const [total, skillRecords] = await Promise.all([
    prisma.student.count({ where }),
    prisma.skill.findMany({
      where: { studentSkills: { some: {} } },
      orderBy: { name: "asc" },
      select: { name: true },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(normalizedPage(searchParams.page), totalPages);
  const students = await prisma.student.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      available: true,
      rating: true,
      createdAt: true,
      user: { select: { id: true, name: true, email: true, createdAt: true } },
      skills: {
        orderBy: { createdAt: "asc" },
        take: 2,
        select: { skill: { select: { name: true } } },
      },
      _count: { select: { reviews: true } },
    },
  });

  return {
    ...viewer,
    users: students.map((student) => ({
      id: student.user.id,
      name: student.user.name?.trim() || "Pelajar Jembara",
      email: student.user.email,
      skill:
        student.skills.map(({ skill: item }) => item.name).join(", ") ||
        "Belum ada skill",
      rating: student._count.reviews > 0 ? student.rating : null,
      availability: student.available ? "tersedia" : "tidak_tersedia",
      joinedDate: formatDate(student.user.createdAt),
    })),
    summary: paginationSummary(total, currentPage),
    skillOptions: skillRecords.map(({ name }) => ({ label: name, value: name })),
    filters: { query, availability, skill },
    currentPage,
    totalPages,
  };
}

export async function getAdminUmkmData(
  searchParams: AdminSearchParams = {},
): Promise<AdminUmkmData> {
  const viewer = await requireAdminViewer();
  const query = normalizedQuery(searchParams.q);
  const rawProfileStatus = firstValue(searchParams.profileStatus);
  const profileStatus = ["lengkap", "perlu_dilengkapi"].includes(rawProfileStatus)
    ? rawProfileStatus
    : "";
  const completeProfileWhere: Prisma.umkmWhereInput = {
    kategori_usaha: { not: null },
    user: { name: { not: null }, location: { not: null }, role: "UMKM" },
  };

  const filters: Prisma.umkmWhereInput[] = [];
  if (query) {
    filters.push({
      OR: [
            { nama_usaha: { contains: query, mode: "insensitive" } },
            { kategori_usaha: { contains: query, mode: "insensitive" } },
            { user: { name: { contains: query, mode: "insensitive" } } },
            { user: { email: { contains: query, mode: "insensitive" } } },
      ],
    });
  }
  if (profileStatus === "lengkap") {
    filters.push(completeProfileWhere);
  } else if (profileStatus === "perlu_dilengkapi") {
    filters.push({
      OR: [
        { kategori_usaha: null },
        { user: { name: null } },
        { user: { location: null } },
      ],
    });
  }
  const where: Prisma.umkmWhereInput = {
    user: { role: "UMKM" },
    ...(filters.length > 0 ? { AND: filters } : {}),
  };

  const total = await prisma.umkm.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(normalizedPage(searchParams.page), totalPages);
  const businesses = await prisma.umkm.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      nama_usaha: true,
      kategori_usaha: true,
      kabupaten_nama: true,
      provinsi_nama: true,
      createdAt: true,
      user: { select: { name: true, email: true, location: true } },
      _count: { select: { projects: true } },
    },
  });

  return {
    ...viewer,
    rows: businesses.map((business) => {
      const isComplete = Boolean(
        business.user.name && business.user.location && business.kategori_usaha,
      );
      return {
        id: business.id,
        ownerName: business.user.name?.trim() || "Pemilik UMKM",
        businessName: business.nama_usaha,
        email: business.user.email,
        category: business.kategori_usaha || "Belum diisi",
        location:
          business.kabupaten_nama ||
          business.provinsi_nama ||
          business.user.location ||
          "Belum diisi",
        jobCount: business._count.projects,
        profileStatus: (isComplete ? "lengkap" : "perlu_dilengkapi") as AdminUmkmProfileStatus,
        registeredDate: formatDate(business.createdAt),
      };
    }),
    summary: paginationSummary(total, currentPage),
    statusOptions: [
      { label: "Profil lengkap", value: "lengkap" },
      { label: "Perlu dilengkapi", value: "perlu_dilengkapi" },
    ],
    filters: { query, profileStatus },
    currentPage,
    totalPages,
  };
}

function normalizeProjectStatus(status: string): AdminJobStatus {
  return PROJECT_STATUSES.has(status as AdminJobStatus)
    ? (status as AdminJobStatus)
    : "UNKNOWN";
}

export async function getAdminJobsData(): Promise<AdminJobsData> {
  const viewer = await requireAdminViewer();
  const now = new Date();
  const activeWhere: Prisma.projectWhereInput = {
    status: { in: ["OPEN", "PROPOSAL"] },
    OR: [{ deadline: null }, { deadline: { gte: now } }],
  };
  const expiredWhere: Prisma.projectWhereInput = {
    status: { in: ["OPEN", "PROPOSAL"] },
    deadline: { lt: now },
  };

  const [total, active, matched, expired, projects] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: activeWhere }),
    prisma.project.count({ where: { studentId: { not: null } } }),
    prisma.project.count({ where: expiredWhere }),
    prisma.project.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 50,
      select: {
        id: true,
        title: true,
        budget: true,
        status: true,
        umkm: { select: { nama_usaha: true } },
        skillsNeeded: {
          orderBy: { createdAt: "asc" },
          take: 1,
          select: { skill: { select: { name: true, category: true } } },
        },
        _count: { select: { proposals: true } },
      },
    }),
  ]);

  return {
    ...viewer,
    stats: [
      { id: "total", label: "Total Lowongan", value: formatNumber(total) },
      { id: "aktif", label: "Aktif Terbuka", value: formatNumber(active) },
      { id: "matched", label: "Talent Terpilih", value: formatNumber(matched) },
      { id: "expired", label: "Tenggat Terlewat", value: formatNumber(expired) },
    ],
    rows: projects.map((project) => {
      const primarySkill = project.skillsNeeded[0]?.skill;
      return {
        id: project.id,
        title: project.title,
        ownerBusinessName: project.umkm.nama_usaha,
        category: primarySkill?.category || primarySkill?.name || "Lainnya",
        budgetLabel: formatBudget(project.budget),
        applicantCount: project._count.proposals,
        status: normalizeProjectStatus(project.status),
      };
    }),
  };
}

function relationStatus(status: string): RelationContractStatus {
  if (status === "REVIEW") return "review";
  if (status === "COMPLETED") return "selesai";
  if (status === "CANCELLED") return "dibatalkan";
  return "aktif";
}

export async function getAdminRelationsData(
  searchParams: AdminSearchParams = {},
): Promise<AdminRelationsData> {
  const viewer = await requireAdminViewer();
  const rawFilter = firstValue(searchParams.status);
  const activeFilter = ["aktif", "review", "selesai", "dibatalkan"].includes(rawFilter)
    ? rawFilter
    : "semua";
  const statusByFilter: Record<string, string[]> = {
    aktif: ["IN_PROGRESS"],
    review: ["REVIEW"],
    selesai: ["COMPLETED"],
    dibatalkan: ["CANCELLED"],
  };
  const statuses = statusByFilter[activeFilter] ?? [
    "IN_PROGRESS",
    "REVIEW",
    "COMPLETED",
    "CANCELLED",
  ];
  const projects = await prisma.project.findMany({
    where: { studentId: { not: null }, status: { in: statuses } },
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    take: 50,
    select: {
      id: true,
      title: true,
      budget: true,
      status: true,
      umkm: {
        select: {
          nama_usaha: true,
          user: { select: { name: true } },
        },
      },
      student: {
        select: {
          school: true,
          user: { select: { name: true } },
        },
      },
      review: { select: { rating: true } },
    },
  });

  const rows = projects.flatMap<AdminRelationRow>((project) => {
    if (!project.student) return [];
    return [{
      id: project.id,
      umkmOwnerName: project.umkm.user.name?.trim() || "Pemilik UMKM",
      umkmBusinessName: project.umkm.nama_usaha,
      talentName: project.student.user.name?.trim() || "Pelajar Jembara",
      talentInstitution: project.student.school || "Institusi belum diisi",
      projectName: project.title,
      contractValue: formatBudget(project.budget),
      status: relationStatus(project.status),
      ...(project.review ? { rating: project.review.rating } : {}),
    }];
  });

  return { ...viewer, rows, activeFilter };
}

function startOfJakartaDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return new Date(
    Date.UTC(Number(value.year), Number(value.month) - 1, Number(value.day)) -
      7 * 60 * 60 * 1000,
  );
}

export async function getAdminChatMonitoringData(): Promise<AdminChatMonitoringData> {
  const viewer = await requireAdminViewer();
  const [conversationCount, todayMessageCount, openReportCount] = await Promise.all([
    prisma.project.count({ where: { messages: { some: {} } } }),
    prisma.message.count({ where: { createdAt: { gte: startOfJakartaDay() } } }),
    prisma.content_report?.count({ where: { status: { in: ["OPEN", "REVIEWING"] } } }) ?? Promise.resolve(0),
  ]);

  return {
    ...viewer,
    stats: [
      {
        id: "total",
        label: "Total Percakapan Proyek",
        value: formatNumber(conversationCount),
      },
      {
        id: "masuk",
        label: "Pesan Masuk Hari Ini",
        value: formatNumber(todayMessageCount),
      },
      {
        id: "laporan",
        label: "Laporan Pelanggaran",
        value: formatNumber(openReportCount),
        subLabel: "Laporan terbuka atau sedang ditinjau",
      },
    ],
    conversations: [],
    selectedProjectId: null,
    selectedProjectTitle: null,
    messages: [],
  };
}
