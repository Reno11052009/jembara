import "server-only";

import { z } from "zod";
import prisma from "./prisma";
import { formatBudget, formatDeadline } from "./dashboard-utils";
import type { PublicProjectDetailData } from "@/types/public-project";

const projectIdSchema = z.string().uuid();

function formatWorkMode(value: string) {
  if (value === "HYBRID") return "Hybrid";
  if (value === "ONSITE") return "Onsite";
  return "Remote";
}

/**
 * Mengambil hanya field project yang aman ditampilkan tanpa autentikasi.
 * Project yang tidak lagi OPEN tidak diekspos sebagai lowongan publik.
 */
export async function getPublicProjectDetailData(
  projectId: unknown,
): Promise<PublicProjectDetailData | null> {
  const parsedProjectId = projectIdSchema.safeParse(projectId);
  if (!parsedProjectId.success) return null;

  const project = await prisma.project.findFirst({
    where: {
      id: parsedProjectId.data,
      status: "OPEN",
      studentId: null,
    },
    select: {
      id: true,
      title: true,
      description: true,
      budget: true,
      deadline: true,
      workMode: true,
      location: true,
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

  if (!project) return null;

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
        : project.location ||
          project.umkm.user.location ||
          "Lokasi belum ditentukan",
    requiredSkills: project.skillsNeeded.filter(({ required }) => required !== false).map(({ skill }) => skill.name),
    optionalSkills: project.skillsNeeded.filter(({ required }) => !required).map(({ skill }) => skill.name),
  };
}
