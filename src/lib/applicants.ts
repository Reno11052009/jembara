import "server-only";

import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "./prisma";
import { requireAuthenticatedSession } from "./auth-guard";
import { calculateSkillMatch, formatRelativeDate } from "./dashboard-utils";
import type {
  Applicant,
  ApplicantStatus,
  ApplicantsData,
} from "@/types/applicant";
import { createPagination, normalizePage } from "./pagination";

const projectIdSchema = z.string().uuid();
const PAGE_SIZE = 8;

const createAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

function mapProposalStatus(status: string): ApplicantStatus {
  if (status === "ACCEPTED") return "Diterima";
  if (status === "REJECTED") return "Ditolak";
  return "Pending";
}

function normalizeExternalUrl(value: string | null | undefined) {
  const normalizedValue = value?.trim();
  if (!normalizedValue) return null;
  try {
    const url = new URL(
      /^https?:\/\//i.test(normalizedValue)
        ? normalizedValue
        : `https://${normalizedValue}`,
    );
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export async function getApplicantsData(
  requestedProjectId?: unknown,
  options: { page?: unknown; status?: unknown } = {},
): Promise<ApplicantsData> {
  const session = await requireAuthenticatedSession();
  const owner = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      avatar: true,
      role: true,
      umkm: { select: { id: true, nama_usaha: true } },
    },
  });
  if (!owner || owner.role !== "UMKM" || !owner.umkm) {
    redirect("/forbidden");
  }

  const projects = await prisma.project.findMany({
    where: { umkmId: owner.umkm.id },
    orderBy: { updatedAt: "desc" },
    take: 50,
    select: {
      id: true,
      title: true,
      status: true,
      workMode: true,
      skillsNeeded: { select: { skill: { select: { name: true } } } },
    },
  });
  const parsedRequestedProjectId = projectIdSchema.safeParse(requestedProjectId);
  const selectedProject = parsedRequestedProjectId.success
    ? projects.find((project) => project.id === parsedRequestedProjectId.data) ?? projects[0]
    : projects[0];

  const firstStatus = Array.isArray(options.status)
    ? options.status[0]
    : options.status;
  const activeFilter =
    firstStatus === "Pending" || firstStatus === "Diterima" || firstStatus === "Ditolak"
      ? firstStatus
      : "Semua";
  const statusGroups = selectedProject
    ? await prisma.proposal.groupBy({
        by: ["status"],
        where: {
          projectId: selectedProject.id,
          project: { umkmId: owner.umkm.id },
        },
        _count: { _all: true },
      })
    : [];
  const countFor = (status: string) =>
    statusGroups.find((group) => group.status === status)?._count._all ?? 0;
  const tabCounts = {
    Semua: statusGroups.reduce((total, group) => total + group._count._all, 0),
    Pending: countFor("PENDING"),
    Diterima: countFor("ACCEPTED"),
    Ditolak: countFor("REJECTED"),
  };
  const selectedStatus =
    activeFilter === "Semua"
      ? undefined
      : activeFilter === "Diterima"
        ? "ACCEPTED"
        : activeFilter === "Ditolak"
          ? "REJECTED"
          : "PENDING";
  const filteredTotal = selectedStatus ? countFor(selectedStatus) : tabCounts.Semua;
  const pagination = createPagination(
    normalizePage(options.page),
    filteredTotal,
    PAGE_SIZE,
  );

  const proposalRecords = selectedProject
    ? await prisma.proposal.findMany({
        where: {
          projectId: selectedProject.id,
          project: { umkmId: owner.umkm.id },
          ...(selectedStatus ? { status: selectedStatus } : {}),
        },
        orderBy: { createdAt: "desc" },
        skip: (pagination.currentPage - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          coverLetter: true,
          budgetMatch: true,
          status: true,
          createdAt: true,
          student: {
            select: {
              rating: true,
              user: {
                select: {
                  name: true,
                  location: true,
                  portfolioUrl: true,
                },
              },
              skills: { select: { skill: { select: { name: true } } } },
              portfolios: {
                orderBy: { updatedAt: "desc" },
                take: 1,
                select: { link: true },
              },
              _count: { select: { reviews: true } },
            },
          },
        },
      })
    : [];
  const requiredSkills =
    selectedProject?.skillsNeeded.map(({ skill }) => skill.name) ?? [];
  const applicants = proposalRecords.map<Applicant>((proposal) => {
    const skills = proposal.student.skills.map(({ skill }) => skill.name);
    return {
      id: proposal.id,
      name: proposal.student.user.name || "Pelajar Jembara",
      rating:
        proposal.student._count.reviews > 0 ? proposal.student.rating : null,
      reviewCount: proposal.student._count.reviews,
      location: proposal.student.user.location || "Lokasi belum diisi",
      isRemote: selectedProject?.workMode === "REMOTE",
      appliedAtLabel: `Diajukan ${formatRelativeDate(proposal.createdAt).toLocaleLowerCase("id-ID")}`,
      matchPercent: calculateSkillMatch(skills, requiredSkills),
      proposal:
        proposal.coverLetter?.trim() || "Pelamar tidak menambahkan surat proposal.",
      skills,
      status: mapProposalStatus(proposal.status),
      budgetMatch: proposal.budgetMatch,
      portfolioUrl:
        normalizeExternalUrl(proposal.student.portfolios[0]?.link) ??
        normalizeExternalUrl(proposal.student.user.portfolioUrl),
    };
  });

  const ownerName = owner.name?.trim() || owner.umkm.nama_usaha;
  return {
    ownerName,
    ownerAvatarUrl: owner.avatar || createAvatarUrl(ownerName),
    projects: projects.map(({ id, title, status }) => ({ id, title, status })),
    selectedProjectId: selectedProject?.id ?? null,
    selectedProjectTitle: selectedProject?.title ?? null,
    applicants,
    activeFilter,
    tabCounts,
    pagination,
  };
}
