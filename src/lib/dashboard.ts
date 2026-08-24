import "server-only";

import { cache } from "react";
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

const ACTIVE_PROJECT_STATUSES = ["IN_PROGRESS", "REVIEW"];

const createAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

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
    proposalCount,
    activeProjectCount,
    completedProjectCount,
    ratingAggregate,
    recommendationCandidates,
    activityProjects,
    notifications,
  ] = await Promise.all([
    prisma.proposal.count({ where: { studentId: student.id } }),
    prisma.project.count({
      where: { studentId: student.id, status: { in: ACTIVE_PROJECT_STATUSES } },
    }),
    prisma.project.count({ where: { studentId: student.id, status: "COMPLETED" } }),
    prisma.review.aggregate({
      where: { studentId: student.id },
      _avg: { rating: true },
    }),
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
      { id: "proposals", label: "Proposal Terkirim", value: `${proposalCount} Proposal` },
      { id: "active", label: "Proyek Aktif", value: `${activeProjectCount} Aktif` },
      { id: "completed", label: "Proyek Selesai", value: `${completedProjectCount} Selesai` },
      {
        id: "rating",
        label: "Rating Rata-rata",
        value: ratingAggregate._avg.rating === null
          ? "—"
          : `${ratingAggregate._avg.rating.toFixed(1)} ★`,
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
  const displayName = business?.nama_usaha || user.name || "UMKM";
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
      userName: displayName,
      avatarUrl: user.avatar || createAvatarUrl(displayName),
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
    };
  }

  const [
    projectCount,
    proposalCount,
    activeProjectCount,
    completedProjectCount,
    recentProjects,
    activityProjects,
    notifications,
  ] = await Promise.all([
    prisma.project.count({ where: { umkmId: business.id } }),
    prisma.proposal.count({ where: { project: { umkmId: business.id } } }),
    prisma.project.count({
      where: { umkmId: business.id, status: { in: ACTIVE_PROJECT_STATUSES } },
    }),
    prisma.project.count({ where: { umkmId: business.id, status: "COMPLETED" } }),
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

  return {
    role: "UMKM",
    userName: displayName,
    avatarUrl: user.avatar || createAvatarUrl(displayName),
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
  };
}

async function getAdminDashboard(user: {
  id: string;
  name: string | null;
  avatar: string | null;
}): Promise<DashboardData> {
  const [userCount, projectCount, openProjectCount, completedProjectCount, recentProjects, notifications] =
    await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.project.count({ where: { status: "OPEN" } }),
      prisma.project.count({ where: { status: "COMPLETED" } }),
      prisma.project.findMany({
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
      getRecentNotifications(user.id),
    ]);

  const displayName = user.name || "Admin";

  return {
    role: "ADMIN",
    userName: displayName,
    avatarUrl: user.avatar || createAvatarUrl(displayName),
    profileCompletionPercent: 100,
    metrics: [
      { id: "users", label: "Total Pengguna", value: `${userCount} Pengguna` },
      { id: "projects", label: "Total Proyek", value: `${projectCount} Proyek` },
      { id: "open", label: "Proyek Terbuka", value: `${openProjectCount} Terbuka` },
      { id: "completed", label: "Proyek Selesai", value: `${completedProjectCount} Selesai` },
    ],
    recommendedProjects: [],
    managedProjects: recentProjects.map(mapManagedProject),
    runningActivities: [],
    notifications,
    projectSectionTitle: "Proyek Terbaru di Platform",
    projectSectionEmptyMessage: "Belum ada proyek di platform.",
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