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

function mapProjectStatus(status: string): JobListingStatus {
  if (status === "OPEN") return "Terbuka";
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

export async function getMyJobsData(): Promise<MyJobsData> {
  const viewer = await getUmkmViewer();
  const projects = await prisma.project.findMany({
    where: { umkmId: viewer.umkm.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      budget: true,
      deadline: true,
      workMode: true,
      location: true,
      status: true,
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
      status: mapProjectStatus(project.status),
      statusCode: project.status,
    })),
  };
}
