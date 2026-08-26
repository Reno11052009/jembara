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

const projectIdSchema = z.string().uuid();

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

  const proposalRecords = selectedProject
    ? await prisma.proposal.findMany({
        where: {
          projectId: selectedProject.id,
          project: { umkmId: owner.umkm.id },
        },
        orderBy: { createdAt: "desc" },
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
  };
}
