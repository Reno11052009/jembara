import "server-only";

import { cache } from "react";
import { Prisma } from "@/generated/prisma/client";
import prisma from "./prisma";
import { requireAuthenticatedSession } from "./auth-guard";
import {
  calculateProfileCompletion,
  calculateSkillMatch,
  formatBudget,
  formatDeadline,
  formatRelativeDate,
} from "./dashboard-utils";
import type {
  DashboardData,
  DashboardNotification,
  ManagedProject,
  RunningActivity,
} from "@/types/dashboard";
import type { PlatformActivity } from "@/types/admin-dashboard";

const ACTIVE_PROJECT_STATUSES = ["IN_PROGRESS", "REVIEW"];

const createAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

const numberFormatter = new Intl.NumberFormat("id-ID");

function formatCount(value: number) {
  return numberFormatter.format(value);
}

type StudentDashboardStatsRow = {
  proposalCount: bigint;
  activeProjectCount: bigint;
  completedProjectCount: bigint;
  averageRating: number | null;
};

type UmkmDashboardStatsRow = {
  projectCount: bigint;
  openProjectCount: bigint;
  activeProjectCount: bigint;
  completedProjectCount: bigint;
  proposalCount: bigint;
};

type AdminDashboardStatsRow = {
  studentCount: bigint;
  newStudentCount: bigint;
  umkmCount: bigint;
  newUmkmCount: bigint;
  projectCount: bigint;
  openProjectCount: bigint;
  activeProjectCount: bigint;
  completedProjectCount: bigint;
  proposalCount: bigint;
  pendingProposalCount: bigint;
  usersBeforeGrowthWindow: bigint;
};

type MonthlyRegistrationRow = {
  monthKey: string;
  registrationCount: bigint;
};

async function getStudentDashboardStats(studentId: string) {
  const [row] = await prisma.$queryRaw<StudentDashboardStatsRow[]>(Prisma.sql`
    SELECT
      (SELECT COUNT(*) FROM "proposal" WHERE "studentId" = ${studentId}::uuid) AS "proposalCount",
      (SELECT COUNT(*) FROM "project" WHERE "studentId" = ${studentId}::uuid AND "status" IN ('IN_PROGRESS', 'REVIEW')) AS "activeProjectCount",
      (SELECT COUNT(*) FROM "project" WHERE "studentId" = ${studentId}::uuid AND "status" = 'COMPLETED') AS "completedProjectCount",
      (SELECT AVG("rating") FROM "review" WHERE "studentId" = ${studentId}::uuid) AS "averageRating"
  `);

  return {
    proposalCount: Number(row?.proposalCount ?? 0),
    activeProjectCount: Number(row?.activeProjectCount ?? 0),
    completedProjectCount: Number(row?.completedProjectCount ?? 0),
    averageRating: row?.averageRating ?? null,
  };
}

async function getUmkmDashboardStats(umkmId: string) {
  const [row] = await prisma.$queryRaw<UmkmDashboardStatsRow[]>(Prisma.sql`
    WITH "projectStats" AS (
      SELECT
        COUNT(*) AS "projectCount",
        COUNT(*) FILTER (WHERE "status" IN ('OPEN', 'PROPOSAL')) AS "openProjectCount",
        COUNT(*) FILTER (WHERE "status" IN ('IN_PROGRESS', 'REVIEW')) AS "activeProjectCount",
        COUNT(*) FILTER (WHERE "status" = 'COMPLETED') AS "completedProjectCount"
      FROM "project"
      WHERE "umkmId" = ${umkmId}::uuid
    )
    SELECT
      "projectStats".*,
      (
        SELECT COUNT(*)
        FROM "proposal"
        INNER JOIN "project" ON "project"."id" = "proposal"."projectId"
        WHERE "project"."umkmId" = ${umkmId}::uuid
      ) AS "proposalCount"
    FROM "projectStats"
  `);

  return {
    projectCount: Number(row?.projectCount ?? 0),
    openProjectCount: Number(row?.openProjectCount ?? 0),
    activeProjectCount: Number(row?.activeProjectCount ?? 0),
    completedProjectCount: Number(row?.completedProjectCount ?? 0),
    proposalCount: Number(row?.proposalCount ?? 0),
  };
}

async function getAdminDashboardStats(
  sevenDaysAgo: Date,
  growthWindowStart: Date,
) {
  const [row] = await prisma.$queryRaw<AdminDashboardStatsRow[]>(Prisma.sql`
    WITH
      "studentStats" AS (
        SELECT
          COUNT(*) AS "studentCount",
          COUNT(*) FILTER (WHERE "createdAt" >= ${sevenDaysAgo}) AS "newStudentCount"
        FROM "student"
      ),
      "umkmStats" AS (
        SELECT
          COUNT(*) AS "umkmCount",
          COUNT(*) FILTER (WHERE "createdAt" >= ${sevenDaysAgo}) AS "newUmkmCount"
        FROM "umkm"
      ),
      "projectStats" AS (
        SELECT
          COUNT(*) AS "projectCount",
          COUNT(*) FILTER (WHERE "status" IN ('OPEN', 'PROPOSAL')) AS "openProjectCount",
          COUNT(*) FILTER (WHERE "status" IN ('IN_PROGRESS', 'REVIEW')) AS "activeProjectCount",
          COUNT(*) FILTER (WHERE "status" = 'COMPLETED') AS "completedProjectCount"
        FROM "project"
      ),
      "proposalStats" AS (
        SELECT
          COUNT(*) AS "proposalCount",
          COUNT(*) FILTER (WHERE "status" = 'PENDING') AS "pendingProposalCount"
        FROM "proposal"
      )
    SELECT
      "studentStats".*,
      "umkmStats".*,
      "projectStats".*,
      "proposalStats".*,
      (SELECT COUNT(*) FROM "user" WHERE "createdAt" < ${growthWindowStart}) AS "usersBeforeGrowthWindow"
    FROM "studentStats", "umkmStats", "projectStats", "proposalStats"
  `);

  return {
    studentCount: Number(row?.studentCount ?? 0),
    newStudentCount: Number(row?.newStudentCount ?? 0),
    umkmCount: Number(row?.umkmCount ?? 0),
    newUmkmCount: Number(row?.newUmkmCount ?? 0),
    projectCount: Number(row?.projectCount ?? 0),
    openProjectCount: Number(row?.openProjectCount ?? 0),
    activeProjectCount: Number(row?.activeProjectCount ?? 0),
    completedProjectCount: Number(row?.completedProjectCount ?? 0),
    proposalCount: Number(row?.proposalCount ?? 0),
    pendingProposalCount: Number(row?.pendingProposalCount ?? 0),
    usersBeforeGrowthWindow: Number(row?.usersBeforeGrowthWindow ?? 0),
  };
}

async function getMonthlyUserRegistrations(growthWindowStart: Date) {
  return prisma.$queryRaw<MonthlyRegistrationRow[]>(Prisma.sql`
    SELECT
      CONCAT(
        EXTRACT(YEAR FROM "createdAt")::integer,
        '-',
        EXTRACT(MONTH FROM "createdAt")::integer - 1
      ) AS "monthKey",
      COUNT(*) AS "registrationCount"
    FROM "user"
    WHERE "createdAt" >= ${growthWindowStart}
    GROUP BY 1
    ORDER BY 1
  `);
}

function formatWeeklyChange(value: number) {
  return value > 0
    ? `+${formatCount(value)} dalam 7 hari`
    : "Belum ada tambahan dalam 7 hari";
}

function getLastSixMonths(now: Date) {
  return Array.from({ length: 6 }, (_, index) => {
    const monthsAgo = 5 - index;
    const start = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, 1),
    );

    return {
      key: `${start.getUTCFullYear()}-${start.getUTCMonth()}`,
      label: new Intl.DateTimeFormat("id-ID", {
        month: "short",
        timeZone: "UTC",
      }).format(start),
      start,
    };
  });
}

function formatAdminActivityTime(value: Date, now: Date) {
  const elapsedSeconds = Math.max(
    0,
    Math.floor((now.getTime() - value.getTime()) / 1000),
  );

  if (elapsedSeconds < 60) return "Baru saja";
  if (elapsedSeconds < 3600) {
    return `${Math.floor(elapsedSeconds / 60)} menit yang lalu`;
  }
  if (elapsedSeconds < 86_400) {
    return `${Math.floor(elapsedSeconds / 3600)} jam yang lalu`;
  }
  if (elapsedSeconds < 604_800) {
    return `${Math.floor(elapsedSeconds / 86_400)} hari yang lalu`;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: value.getFullYear() === now.getFullYear() ? undefined : "numeric",
  }).format(value);
}

function formatProjectStatus(status: string) {
  const labels: Record<string, string> = {
    OPEN: "Terbuka",
    PROPOSAL: "Seleksi proposal",
    IN_PROGRESS: "Dikerjakan",
    REVIEW: "Dalam review",
    COMPLETED: "Selesai",
    CANCELLED: "Dibatalkan",
  };

  return labels[status] ?? status;
}

function normalizeRole(role: string): DashboardData["role"] {
  if (role === "UMKM" || role === "ADMIN") return role;
  return "STUDENT";
}

function mapActivityStatus(status: string): RunningActivity["status"] {
  if (status === "COMPLETED") return "completed";
  if (status === "REVIEW") return "review";
  return "in_progress";
}

async function getRecentNotifications(userId: string): Promise<DashboardNotification[]> {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      type: true,
      title: true,
      message: true,
      href: true,
      isRead: true,
      createdAt: true,
    },
  });

  return notifications.map((notification) => ({
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    href: notification.href,
    isRead: notification.isRead,
    createdAtLabel: formatRelativeDate(notification.createdAt),
  }));
}

function mapManagedProject(project: {
  id: string;
  title: string;
  status: string;
  budget: number | null;
  deadline: Date | null;
  umkm: { nama_usaha: string };
  student: { user: { name: string | null } } | null;
  skillsNeeded: Array<{ skill: { name: string } }>;
  _count: { proposals: number };
}): ManagedProject {
  return {
    id: project.id,
    title: project.title,
    companyName: project.umkm.nama_usaha,
    status: project.status,
    proposalCount: project._count.proposals,
    budgetLabel: formatBudget(project.budget),
    deadlineLabel: formatDeadline(project.deadline),
    tags: project.skillsNeeded.map(({ skill }) => skill.name),
    selectedStudentName: project.student?.user.name ?? null,
  };
}

async function getStudentDashboard(
  user: {
    id: string;
    name: string | null;
    avatar: string | null;
    bio: string | null;
    location: string | null;
    portfolioUrl: string | null;
    github: string | null;
    linkedin: string | null;
    behance: string | null;
    student: {
      id: string;
      school: string | null;
      tingkat_pendidikan: string | null;
      jurusan: string | null;
      semester: number | null;
      available: boolean;
      skills: Array<{ skill: { name: string } }>;
      _count: { portfolios: number };
    } | null;
  },
): Promise<DashboardData> {
  const student = user.student;
  const studentSkills = student?.skills.map(({ skill }) => skill.name) ?? [];

  const profileCompletionPercent = calculateProfileCompletion([
    Boolean(user.name),
    Boolean(user.avatar),
    Boolean(user.bio),
    Boolean(user.location),
    Boolean(student?.school),
    Boolean(student?.tingkat_pendidikan),
    Boolean(student?.jurusan),
    Boolean(student?.semester),
    studentSkills.length > 0,
    Boolean(student?._count.portfolios),
    Boolean(user.portfolioUrl || user.github || user.linkedin || user.behance),
  ]);

  if (!student) {
    return {
      role: "STUDENT",
      userName: user.name || "Pelajar",
      avatarUrl: user.avatar || createAvatarUrl(user.name || "Pelajar"),
      profileCompletionPercent,
      metrics: [
        { id: "proposals", label: "Proposal Terkirim", value: "0 Proposal" },
        { id: "active", label: "Proyek Aktif", value: "0 Aktif" },
        { id: "completed", label: "Proyek Selesai", value: "0 Selesai" },
        { id: "rating", label: "Rating Rata-rata", value: "—" },
      ],
      recommendedProjects: [],
      managedProjects: [],
      runningActivities: [],
      notifications: await getRecentNotifications(user.id),
      projectSectionTitle: "Proyek yang Cocok Untukmu",
      projectSectionEmptyMessage: "Lengkapi profil dan pilih role pelajar untuk menerima rekomendasi proyek.",
    };
  }

  const [
    dashboardStats,
    recommendationCandidates,
    activityProjects,
    notifications,
  ] = await Promise.all([
    getStudentDashboardStats(student.id),
    studentSkills.length > 0
      ? prisma.project.findMany({
          where: {
            status: "OPEN",
            studentId: null,
            proposals: { none: { studentId: student.id } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            id: true,
            title: true,
            budget: true,
            deadline: true,
            createdAt: true,
            umkm: { select: { nama_usaha: true } },
            skillsNeeded: { select: { skill: { select: { name: true } } } },
          },
        })
      : Promise.resolve([]),
    prisma.project.findMany({
      where: {
        studentId: student.id,
        status: { in: [...ACTIVE_PROJECT_STATUSES, "COMPLETED"] },
      },
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        status: true,
        umkm: { select: { nama_usaha: true } },
      },
    }),
    getRecentNotifications(user.id),
  ]);

  const recommendedProjects = recommendationCandidates
    .map((project) => {
      const requiredSkills = project.skillsNeeded.map(({ skill }) => skill.name);
      return {
        id: project.id,
        title: project.title,
        companyName: project.umkm.nama_usaha,
        matchPercent: calculateSkillMatch(studentSkills, requiredSkills),
        budgetLabel: formatBudget(project.budget),
        deadlineLabel: formatDeadline(project.deadline),
        tags: requiredSkills,
        postedLabel: formatRelativeDate(project.createdAt),
      };
    })
    .filter((project) => project.matchPercent > 0)
    .sort((first, second) => second.matchPercent - first.matchPercent)
    .slice(0, 3);

  return {
    role: "STUDENT",
    userName: user.name || "Pelajar",
    avatarUrl: user.avatar || createAvatarUrl(user.name || "Pelajar"),
    profileCompletionPercent,
    metrics: [
      { id: "proposals", label: "Proposal Terkirim", value: `${dashboardStats.proposalCount} Proposal` },
      { id: "active", label: "Proyek Aktif", value: `${dashboardStats.activeProjectCount} Aktif` },
      { id: "completed", label: "Proyek Selesai", value: `${dashboardStats.completedProjectCount} Selesai` },
      {
        id: "rating",
        label: "Rating Rata-rata",
        value: dashboardStats.averageRating === null
          ? "—"
          : `${dashboardStats.averageRating.toFixed(1)} ★`,
      },
    ],
    recommendedProjects,
    managedProjects: [],
    runningActivities: activityProjects.map((project) => ({
      id: project.id,
      title: project.title,
      clientName: project.umkm.nama_usaha,
      status: mapActivityStatus(project.status),
      ...(project.status === "COMPLETED" ? { progressPercent: 100 } : {}),
    })),
    notifications,
    projectSectionTitle: "Proyek yang Cocok Untukmu",
    projectSectionEmptyMessage:
      studentSkills.length === 0
        ? "Tambahkan skill pada profil agar sistem dapat mencari proyek yang cocok."
        : "Belum ada proyek terbuka yang cocok dengan skill kamu.",
  };
}

async function getUmkmDashboard(
  user: {
    id: string;
    name: string | null;
    avatar: string | null;
    bio: string | null;
    location: string | null;
    umkm: {
      id: string;
      nama_usaha: string;
      kategori_usaha: string | null;
      website: string | null;
    } | null;
  },
): Promise<DashboardData> {
  const business = user.umkm;
  const ownerName = user.name || "Pemilik UMKM";
  const businessName = business?.nama_usaha || "UMKM Jembara";
  const profileCompletionPercent = calculateProfileCompletion([
    Boolean(user.name),
    Boolean(user.avatar),
    Boolean(user.bio),
    Boolean(user.location),
    Boolean(business?.nama_usaha),
    Boolean(business?.kategori_usaha),
    Boolean(business?.website),
  ]);

  if (!business) {
    return {
      role: "UMKM",
      userName: ownerName,
      avatarUrl: user.avatar || createAvatarUrl(ownerName),
      profileCompletionPercent,
      metrics: [
        { id: "projects", label: "Total Proyek", value: "0 Proyek" },
        { id: "proposals_received", label: "Proposal Masuk", value: "0 Proposal" },
        { id: "active", label: "Proyek Aktif", value: "0 Aktif" },
        { id: "completed", label: "Proyek Selesai", value: "0 Selesai" },
      ],
      recommendedProjects: [],
      managedProjects: [],
      runningActivities: [],
      notifications: await getRecentNotifications(user.id),
      projectSectionTitle: "Proyek Terbaru Anda",
      projectSectionEmptyMessage: "Lengkapi profil bisnis sebelum membuat proyek pertama.",
      umkmOverview: {
        businessName,
        stats: [
          { id: "lowongan-aktif", label: "Lowongan Aktif", value: "0 Lowongan" },
          { id: "total-pelamar", label: "Total Pelamar", value: "0 Orang" },
          { id: "proyek-berjalan", label: "Proyek Berjalan", value: "0 Proyek" },
          { id: "proyek-selesai", label: "Proyek Selesai", value: "0 Proyek" },
        ],
        recentJobListings: [],
        recentApplicants: [],
      },
    };
  }

  const [
    dashboardStats,
    recentProjects,
    recentProposals,
    activityProjects,
    notifications,
  ] = await Promise.all([
    getUmkmDashboardStats(business.id),
    prisma.project.findMany({
      where: { umkmId: business.id },
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        status: true,
        budget: true,
        deadline: true,
        umkm: { select: { nama_usaha: true } },
        student: { select: { user: { select: { name: true } } } },
        skillsNeeded: { select: { skill: { select: { name: true } } } },
        _count: { select: { proposals: true } },
      },
    }),
    prisma.proposal.findMany({
      where: { project: { umkmId: business.id } },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        createdAt: true,
        project: {
          select: {
            title: true,
            skillsNeeded: { select: { skill: { select: { name: true } } } },
          },
        },
        student: {
          select: {
            jurusan: true,
            user: { select: { name: true, avatar: true } },
            skills: { select: { skill: { select: { name: true } } } },
          },
        },
      },
    }),
    prisma.project.findMany({
      where: {
        umkmId: business.id,
        status: { in: [...ACTIVE_PROJECT_STATUSES, "COMPLETED"] },
      },
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        status: true,
        student: { select: { user: { select: { name: true } } } },
      },
    }),
    getRecentNotifications(user.id),
  ]);

  const {
    projectCount,
    openProjectCount,
    activeProjectCount,
    completedProjectCount,
    proposalCount,
  } = dashboardStats;

  return {
    role: "UMKM",
    userName: ownerName,
    avatarUrl: user.avatar || createAvatarUrl(ownerName),
    profileCompletionPercent,
    metrics: [
      { id: "projects", label: "Total Proyek", value: `${projectCount} Proyek` },
      { id: "proposals_received", label: "Proposal Masuk", value: `${proposalCount} Proposal` },
      { id: "active", label: "Proyek Aktif", value: `${activeProjectCount} Aktif` },
      { id: "completed", label: "Proyek Selesai", value: `${completedProjectCount} Selesai` },
    ],
    recommendedProjects: [],
    managedProjects: recentProjects.map(mapManagedProject),
    runningActivities: activityProjects.map((project) => ({
      id: project.id,
      title: project.title,
      clientName: project.student?.user.name || "Talent belum dipilih",
      status: mapActivityStatus(project.status),
      ...(project.status === "COMPLETED" ? { progressPercent: 100 } : {}),
    })),
    notifications,
    projectSectionTitle: "Proyek Terbaru Anda",
    projectSectionEmptyMessage: "Belum ada proyek yang dibuat oleh bisnis Anda.",
    umkmOverview: {
      businessName,
      stats: [
        {
          id: "lowongan-aktif",
          label: "Lowongan Aktif",
          value: `${formatCount(openProjectCount)} Lowongan`,
        },
        {
          id: "total-pelamar",
          label: "Total Pelamar",
          value: `${formatCount(proposalCount)} Orang`,
        },
        {
          id: "proyek-berjalan",
          label: "Proyek Berjalan",
          value: `${formatCount(activeProjectCount)} Proyek`,
        },
        {
          id: "proyek-selesai",
          label: "Proyek Selesai",
          value: `${formatCount(completedProjectCount)} Proyek`,
        },
      ],
      recentJobListings: recentProjects.map((project) => ({
        id: project.id,
        title: project.title,
        companyName: businessName,
        budgetLabel: formatBudget(project.budget),
        applicantCount: project._count.proposals,
        status: (["OPEN", "PROPOSAL"].includes(project.status)
          ? "Aktif"
          : "Ditutup") as "Aktif" | "Ditutup",
      })),
      recentApplicants: recentProposals.map((proposal) => {
        const studentSkills = proposal.student.skills.map(({ skill }) => skill.name);
        const requiredSkills = proposal.project.skillsNeeded.map(({ skill }) => skill.name);
        const applicantName = proposal.student.user.name || "Talent Jembara";

        return {
          id: proposal.id,
          name: applicantName,
          role: proposal.student.jurusan || studentSkills[0] || "Talent Jembara",
          avatarUrl: proposal.student.user.avatar || createAvatarUrl(applicantName),
          matchPercent: calculateSkillMatch(studentSkills, requiredSkills),
          appliedAtLabel: formatRelativeDate(proposal.createdAt),
          projectTitle: proposal.project.title,
        };
      }),
    },
  };
}

async function getAdminDashboard(user: {
  id: string;
  name: string | null;
  avatar: string | null;
}): Promise<DashboardData> {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const growthMonths = getLastSixMonths(now);
  const growthWindowStart = growthMonths[0].start;

  const [
    dashboardStats,
    monthlyRegistrationRows,
    recentUsers,
    recentProjects,
    notifications,
  ] = await Promise.all([
    getAdminDashboardStats(sevenDaysAgo, growthWindowStart),
    getMonthlyUserRegistrations(growthWindowStart),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        budget: true,
        deadline: true,
        createdAt: true,
        updatedAt: true,
        umkm: { select: { nama_usaha: true } },
        student: { select: { user: { select: { name: true } } } },
        skillsNeeded: { select: { skill: { select: { name: true } } } },
        _count: { select: { proposals: true } },
      },
    }),
    getRecentNotifications(user.id),
  ]);

  const {
    studentCount,
    newStudentCount,
    umkmCount,
    newUmkmCount,
    projectCount,
    openProjectCount,
    activeProjectCount,
    completedProjectCount,
    proposalCount,
    pendingProposalCount,
    usersBeforeGrowthWindow,
  } = dashboardStats;

  const monthlyRegistrations = new Map<string, number>();
  for (const registration of monthlyRegistrationRows) {
    monthlyRegistrations.set(
      registration.monthKey,
      Number(registration.registrationCount),
    );
  }

  let cumulativeUserCount = usersBeforeGrowthWindow;
  const userGrowthData = growthMonths.map((month) => {
    cumulativeUserCount += monthlyRegistrations.get(month.key) ?? 0;
    return { label: month.label, value: cumulativeUserCount };
  });

  const userActivities = recentUsers.map((registeredUser) => {
    const actorName = registeredUser.name || registeredUser.email;
    const roleLabel =
      registeredUser.role === "UMKM"
        ? "Pemilik UMKM"
        : registeredUser.role === "ADMIN"
          ? "Admin"
          : "Talent";

    return {
      occurredAt: registeredUser.createdAt,
      activity: {
        id: `user-${registeredUser.id}`,
        actorName,
        title: `${actorName} (${roleLabel}) baru saja mendaftar`,
        subtitle: registeredUser.email,
        timeLabel: formatAdminActivityTime(registeredUser.createdAt, now),
      } satisfies PlatformActivity,
    };
  });

  const projectActivities = recentProjects.map((project) => {
    const isCompleted = project.status === "COMPLETED";
    const actorName = project.umkm.nama_usaha;
    const subtitleParts = [
      `Status: ${formatProjectStatus(project.status)}`,
      `Budget: ${formatBudget(project.budget)}`,
    ];

    if (project.student?.user.name) {
      subtitleParts.push(`Talent: ${project.student.user.name}`);
    }

    return {
      occurredAt: project.updatedAt,
      activity: {
        id: `project-${project.id}`,
        actorName,
        title: isCompleted
          ? `Proyek "${project.title}" selesai`
          : `${actorName} memperbarui proyek "${project.title}"`,
        subtitle: subtitleParts.join(" · "),
        timeLabel: formatAdminActivityTime(project.updatedAt, now),
      } satisfies PlatformActivity,
    };
  });

  const platformActivities = [...userActivities, ...projectActivities]
    .sort((first, second) => second.occurredAt.getTime() - first.occurredAt.getTime())
    .slice(0, 5)
    .map(({ activity }) => activity);

  const displayName = user.name || "Admin";
  const completionRate =
    projectCount === 0
      ? "Belum ada proyek"
      : `${Math.round((completedProjectCount / projectCount) * 100)}% proyek selesai`;

  return {
    role: "ADMIN",
    userName: displayName,
    avatarUrl: user.avatar || createAvatarUrl(displayName),
    profileCompletionPercent: 100,
    metrics: [
      {
        id: "users",
        label: "Total Pengguna",
        value: `${formatCount(studentCount + umkmCount)} Pengguna`,
      },
      { id: "projects", label: "Total Proyek", value: `${formatCount(projectCount)} Proyek` },
      { id: "open", label: "Proyek Terbuka", value: `${formatCount(openProjectCount)} Terbuka` },
      {
        id: "completed",
        label: "Proyek Selesai",
        value: `${formatCount(completedProjectCount)} Selesai`,
      },
    ],
    recommendedProjects: [],
    managedProjects: recentProjects.map(mapManagedProject),
    runningActivities: [],
    notifications,
    projectSectionTitle: "Proyek Terbaru di Platform",
    projectSectionEmptyMessage: "Belum ada proyek di platform.",
    adminOverview: {
      stats: [
        {
          id: "talent",
          label: "Total User Talent",
          value: formatCount(studentCount),
          subLabel: formatWeeklyChange(newStudentCount),
        },
        {
          id: "umkm",
          label: "Total Pemilik UMKM",
          value: formatCount(umkmCount),
          subLabel: formatWeeklyChange(newUmkmCount),
        },
        {
          id: "lowongan",
          label: "Total Lowongan",
          value: formatCount(projectCount),
          subLabel: `${formatCount(openProjectCount)} menerima proposal`,
        },
        {
          id: "proyek",
          label: "Total Proyek Aktif",
          value: formatCount(activeProjectCount),
          subLabel: completionRate,
        },
        {
          id: "proposal",
          label: "Total Proposal",
          value: formatCount(proposalCount),
          subLabel: `${formatCount(pendingProposalCount)} menunggu keputusan`,
        },
      ],
      userGrowthData,
      quickActions: [
        { id: "reports", label: "Moderasi Laporan", href: "/dashboard/laporan" },
        { id: "skills", label: "Verifikasi Skill", href: "/dashboard/verifikasi-skill" },
        {
          id: "users",
          label: `Kelola ${formatCount(studentCount + umkmCount)} pengguna`,
          href: "/dashboard/daftar-user",
        },
        {
          id: "projects",
          label: `Pantau ${formatCount(openProjectCount)} lowongan terbuka`,
          href: "/dashboard/lowongan",
        },
        {
          id: "proposals",
          label: `Tinjau ${formatCount(pendingProposalCount)} proposal menunggu`,
          href: "/dashboard/lowongan",
        },
      ],
      platformActivities,
    },
  };
}

export const getDashboardData = cache(async (): Promise<DashboardData> => {
  const session = await requireAuthenticatedSession();
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      avatar: true,
      bio: true,
      location: true,
      portfolioUrl: true,
      github: true,
      linkedin: true,
      behance: true,
      role: true,
      student: {
        select: {
          id: true,
          school: true,
          tingkat_pendidikan: true,
          jurusan: true,
          semester: true,
          available: true,
          skills: { select: { skill: { select: { name: true } } } },
          _count: { select: { portfolios: true } },
        },
      },
      umkm: {
        select: {
          id: true,
          nama_usaha: true,
          kategori_usaha: true,
          website: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("Pengguna pada sesi tidak ditemukan");
  }

  const role = normalizeRole(user.role);
  if (role === "UMKM") return getUmkmDashboard(user);
  if (role === "ADMIN") return getAdminDashboard(user);
  return getStudentDashboard(user);
});
