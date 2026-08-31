import "server-only";

import { redirect } from "next/navigation";
import { requireAuthenticatedSession } from "./auth-guard";
import { calculateSkillMatch } from "./dashboard-utils";
import prisma from "./prisma";
import type {
  Talent,
  TalentFilterOption,
  TalentSearchData,
} from "@/types/talent";

const SEARCHABLE_PROJECT_STATUSES = ["OPEN", "PROPOSAL"];
const MAX_TALENTS = 60;

const createAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

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

function createOptions(values: string[]): TalentFilterOption[] {
  return [...new Set(values.filter(Boolean))]
    .sort((first, second) => first.localeCompare(second, "id-ID"))
    .map((value) => ({ label: value, value }));
}

export async function getTalentSearchData(
  requestedProjectId?: unknown,
): Promise<TalentSearchData> {
  const session = await requireAuthenticatedSession();
  const owner = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      avatar: true,
      role: true,
      umkm: { select: { id: true } },
    },
  });

  if (!owner || owner.role !== "UMKM" || !owner.umkm) {
    redirect("/forbidden");
  }

  const [projects, students] = await Promise.all([
    prisma.project.findMany({
      where: {
        umkmId: owner.umkm.id,
        status: { in: SEARCHABLE_PROJECT_STATUSES },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: {
        id: true,
        title: true,
        skillsNeeded: { select: { skill: { select: { name: true } } } },
      },
    }),
    prisma.student.findMany({
      where: { available: true },
      orderBy: [{ rating: "desc" }, { total_project: "desc" }, { createdAt: "desc" }],
      take: MAX_TALENTS,
      select: {
        id: true,
        jurusan: true,
        rating: true,
        total_project: true,
        user: {
          select: {
            name: true,
            location: true,
            portfolioUrl: true,
            github: true,
            linkedin: true,
            behance: true,
          },
        },
        skills: {
          select: { skill: { select: { name: true, category: true } } },
        },
        portfolios: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { link: true },
        },
        _count: { select: { portfolios: true, reviews: true } },
      },
    }),
  ]);

  const requestedProject =
    typeof requestedProjectId === "string"
      ? projects.find((project) => project.id === requestedProjectId)
      : undefined;
  const selectedProject = requestedProject ?? projects[0] ?? null;
  const requiredSkills =
    selectedProject?.skillsNeeded.map(({ skill }) => skill.name) ?? [];

  const talents = students
    .map<Talent>((student) => {
      const skills = student.skills.map(({ skill }) => skill.name);
      const primaryCategory = student.skills.find(
        ({ skill }) => skill.category,
      )?.skill.category;
      const name = student.user.name || "Talent Jembara";
      const profileUrl =
        normalizeExternalUrl(student.portfolios[0]?.link) ??
        normalizeExternalUrl(student.user.portfolioUrl) ??
        normalizeExternalUrl(student.user.github) ??
        normalizeExternalUrl(student.user.linkedin) ??
        normalizeExternalUrl(student.user.behance);

      return {
        id: student.id,
        name,
        role: student.jurusan || primaryCategory || skills[0] || "Talent Jembara",
        matchPercent: selectedProject
          ? calculateSkillMatch(skills, requiredSkills)
          : 0,
        rating: student._count.reviews > 0 ? student.rating : null,
        location: student.user.location || "Lokasi belum diisi",
        skills,
        completedProjectCount: student.total_project,
        portfolioCount: student._count.portfolios,
        profileUrl,
      };
    })
    .sort((first, second) => {
      if (selectedProject && second.matchPercent !== first.matchPercent) {
        return second.matchPercent - first.matchPercent;
      }

      if (
        (second.completedProjectCount ?? 0) !==
        (first.completedProjectCount ?? 0)
      ) {
        return (
          (second.completedProjectCount ?? 0) -
          (first.completedProjectCount ?? 0)
        );
      }

      return (second.rating ?? 0) - (first.rating ?? 0);
    });

  const ownerName = owner.name || "Pemilik UMKM";

  return {
    ownerName,
    ownerAvatarUrl: owner.avatar || createAvatarUrl(ownerName),
    talents,
    projects: projects.map(({ id, title }) => ({ id, title })),
    selectedProjectId: selectedProject?.id ?? null,
    selectedProjectTitle: selectedProject?.title ?? null,
    skillOptions: createOptions(talents.flatMap(({ skills }) => skills)),
    locationOptions: createOptions(
      talents
        .map(({ location }) => location)
        .filter((location) => location !== "Lokasi belum diisi"),
    ),
    ratingOptions: [
      { label: "4.5 ke atas", value: "4.5" },
      { label: "4.0 ke atas", value: "4.0" },
      { label: "3.5 ke atas", value: "3.5" },
    ],
  };
}
