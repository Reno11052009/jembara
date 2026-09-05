import "server-only";

import { notFound } from "next/navigation";
import { z } from "zod";
import prisma from "./prisma";
import { requireAuthenticatedSession } from "./auth-guard";
import {
  calculateSkillMatch,
  formatBudget,
  formatDeadline,
} from "./dashboard-utils";
import type { ProjectDetailData } from "@/types/project-detail";

const projectIdSchema = z.string().uuid();

function normalizeSkill(value: string) {
  return value.trim().toLocaleLowerCase("id-ID");
}

function normalizeRole(role: string): ProjectDetailData["viewerRole"] {
  if (role === "STUDENT" || role === "UMKM" || role === "ADMIN") return role;
  throw new Error("Role pengguna tidak dikenali");
}

function formatWorkMode(value: string) {
  if (value === "HYBRID") return "Hybrid";
  if (value === "ONSITE") return "Onsite";
  return "Remote";
}

function getApplyDisabledReason(input: {
  viewerRole: ProjectDetailData["viewerRole"];
  hasStudentProfile: boolean;
  projectStatus: string;
  hasSelectedStudent: boolean;
  deadline: Date | null;
  existingProposalStatus: string | null;
  missingRequiredSkills: string[];
}) {
  if (input.viewerRole !== "STUDENT") {
    return "Hanya akun pelajar yang dapat mengirim proposal.";
  }
  if (!input.hasStudentProfile) {
    return "Lengkapi profil pelajar sebelum mengirim proposal.";
  }
  if (input.existingProposalStatus) {
    return "Anda sudah mengirim proposal untuk project ini.";
  }
  if (input.missingRequiredSkills.length > 0) {
    return `Lengkapi skill wajib: ${input.missingRequiredSkills.join(", ")}.`;
  }
  if (input.projectStatus !== "OPEN" || input.hasSelectedStudent) {
    return "Project ini sudah tidak menerima proposal.";
  }
  if (input.deadline && input.deadline <= new Date()) {
    return "Deadline project sudah berakhir.";
  }
  return null;
}

export async function getProjectDetailData(
  projectId: unknown,
): Promise<ProjectDetailData> {
  const parsedProjectId = projectIdSchema.safeParse(projectId);
  if (!parsedProjectId.success) notFound();

  const session = await requireAuthenticatedSession();
  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      role: true,
      student: {
        select: {
          id: true,
          skills: { select: { skill: { select: { name: true } } } },
        },
      },
    },
  });
  if (!viewer) throw new Error("Pengguna pada sesi tidak ditemukan");

  const project = await prisma.project.findUnique({
    where: { id: parsedProjectId.data },
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
      umkm: {
        select: {
          nama_usaha: true,
          user: { select: { location: true } },
        },
      },
      skillsNeeded: {
        select: { required: true, skill: { select: { name: true } } },
      },
    },
  });
  if (!project) notFound();

  const existingProposal = viewer.student
    ? await prisma.proposal.findUnique({
        where: {
          projectId_studentId: {
            projectId: project.id,
            studentId: viewer.student.id,
          },
        },
        select: { status: true },
      })
    : null;
  const viewerRole = normalizeRole(viewer.role);
  const studentSkills = viewer.student?.skills.map(({ skill }) => skill.name) ?? [];
  const requiredSkills = project.skillsNeeded.filter(({ required }) => required !== false).map(({ skill }) => skill.name);
  const optionalSkills = project.skillsNeeded.filter(({ required }) => !required).map(({ skill }) => skill.name);
  const normalizedStudentSkills = new Set(studentSkills.map(normalizeSkill));
  const matchedSkills = requiredSkills.filter((skill) =>
    normalizedStudentSkills.has(normalizeSkill(skill)),
  );
  const missingSkills = requiredSkills.filter(
    (skill) => !normalizedStudentSkills.has(normalizeSkill(skill)),
  );
  const existingProposalStatus = existingProposal?.status ?? null;
  const applyDisabledReason = getApplyDisabledReason({
    viewerRole,
    hasStudentProfile: Boolean(viewer.student),
    projectStatus: project.status,
    hasSelectedStudent: Boolean(project.studentId),
    deadline: project.deadline,
    existingProposalStatus,
    missingRequiredSkills: missingSkills,
  });

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    businessName: project.umkm.nama_usaha,
    businessLocation: project.umkm.user.location || "Lokasi UMKM belum diatur",
    budgetLabel: formatBudget(project.budget),
    deadlineLabel: formatDeadline(project.deadline),
    workModeLabel: formatWorkMode(project.workMode),
    locationLabel:
      project.workMode === "REMOTE"
        ? "Remote"
        : project.location || project.umkm.user.location || "Lokasi belum ditentukan",
    requiredSkills,
    optionalSkills,
    matchedSkills,
    missingSkills,
    skillMatchPercent: calculateSkillMatch(studentSkills, requiredSkills),
    viewerRole,
    canApply: applyDisabledReason === null,
    existingProposalStatus,
    applyDisabledReason,
  };
}
