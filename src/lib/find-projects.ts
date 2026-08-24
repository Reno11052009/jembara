import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import prisma from "./prisma";
import { requireAuthenticatedSession } from "./auth-guard";
import { calculateSkillMatch, formatBudget, formatDeadline } from "./dashboard-utils";
import type {
  FindProjectFilters,
  FindProjectsData,
  Project,
  ProjectBudgetFilter,
  ProjectSort,
} from "@/types/project";

const PAGE_SIZE = 6;
const MAX_QUERY_LENGTH = 100;
const PROJECT_SORTS = new Set<ProjectSort>([
  "recommended",
  "latest",
  "deadline",
  "budget",
]);
const BUDGET_FILTERS = new Set<ProjectBudgetFilter>([
  "under-1m",
  "1m-3m",
  "3m-5m",
  "over-5m",
]);

export type FindProjectsSearchParams = Record<
  string,
  string | string[] | undefined
>;

type MarketplaceViewerRole = FindProjectsData["viewerRole"];

function getViewerRole(role: string): MarketplaceViewerRole {
  if (role === "STUDENT" || role === "UMKM" || role === "ADMIN") {
    return role;
  }

  throw new Error("Role pengguna tidak dikenali");
}

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function parseFindProjectFilters(
  searchParams: FindProjectsSearchParams,
): FindProjectFilters {
  const rawSort = getFirstValue(searchParams.sort);
  const rawBudget = getFirstValue(searchParams.budget);
  const rawPage = Number.parseInt(getFirstValue(searchParams.page), 10);

  return {
    query: getFirstValue(searchParams.q).trim().slice(0, MAX_QUERY_LENGTH),
    skill: getFirstValue(searchParams.skill).trim().slice(0, MAX_QUERY_LENGTH),
    location: getFirstValue(searchParams.location)
      .trim()
      .slice(0, MAX_QUERY_LENGTH),
    budget: BUDGET_FILTERS.has(rawBudget as ProjectBudgetFilter)
      ? (rawBudget as ProjectBudgetFilter)
      : "",
    sort: PROJECT_SORTS.has(rawSort as ProjectSort)
      ? (rawSort as ProjectSort)
      : "recommended",
    page: Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1,
  };
}

function getBudgetWhere(
  budget: FindProjectFilters["budget"],
): Prisma.FloatNullableFilter<"project"> | undefined {
  switch (budget) {
    case "under-1m":
      return { lt: 1_000_000 };
    case "1m-3m":
      return { gte: 1_000_000, lt: 3_000_000 };
    case "3m-5m":
      return { gte: 3_000_000, lte: 5_000_000 };
    case "over-5m":
      return { gt: 5_000_000 };
    default:
      return undefined;
  }
}

function buildProjectWhere(filters: FindProjectFilters): Prisma.projectWhereInput {
  const queryFilter: Prisma.projectWhereInput | undefined = filters.query
    ? {
        OR: [
          { title: { contains: filters.query, mode: "insensitive" } },
          { description: { contains: filters.query, mode: "insensitive" } },
          {
            umkm: {
              nama_usaha: { contains: filters.query, mode: "insensitive" },
            },
          },
          {
            skillsNeeded: {
              some: {
                skill: {
                  name: { contains: filters.query, mode: "insensitive" },
                },
              },
            },
          },
        ],
      }
    : undefined;

  return {
    status: "OPEN",
    studentId: null,
    ...(queryFilter ?? {}),
    ...(filters.skill
      ? {
          skillsNeeded: {
            some: {
              skill: { name: { equals: filters.skill, mode: "insensitive" } },
            },
          },
        }
      : {}),
    ...(filters.location
      ? {
          umkm: {
            user: {
              location: {
                equals: filters.location,
                mode: "insensitive",
              },
            },
          },
        }
      : {}),
    ...(filters.budget ? { budget: getBudgetWhere(filters.budget) } : {}),
  };
}

const projectSelect = {
  id: true,
  title: true,
  description: true,
  budget: true,
  deadline: true,
  createdAt: true,
  umkm: {
    select: {
      nama_usaha: true,
      user: { select: { location: true } },
    },
  },
  skillsNeeded: {
    select: { skill: { select: { name: true } } },
  },
} satisfies Prisma.projectSelect;

type MarketplaceProjectRecord = Prisma.projectGetPayload<{
  select: typeof projectSelect;
}>;

function normalizeSkill(skill: string) {
  return skill.trim().toLocaleLowerCase("id-ID");
}

function mapProject(
  project: MarketplaceProjectRecord,
  studentSkills: readonly string[],
): Project & { createdAt: Date; budget: number | null; deadline: Date | null } {
  const requiredSkills = project.skillsNeeded.map(({ skill }) => skill.name);
  const uniqueRequiredSkills = new Set(requiredSkills.map(normalizeSkill));
  const normalizedStudentSkills = new Set(studentSkills.map(normalizeSkill));
  const matchedSkillCount = [...uniqueRequiredSkills].filter((skill) =>
    normalizedStudentSkills.has(skill),
  ).length;
  const skillMatchPercent = calculateSkillMatch(studentSkills, requiredSkills);

  let skillMatchReason = "Proyek belum menetapkan skill";
  if (requiredSkills.length > 0 && studentSkills.length === 0) {
    skillMatchReason = "Tambahkan skill untuk melihat kecocokan";
  } else if (requiredSkills.length > 0) {
    skillMatchReason = `${matchedSkillCount} dari ${uniqueRequiredSkills.size} skill cocok`;
  }

  return {
    id: project.id,
    title: project.title,
    companyName: project.umkm.nama_usaha,
    description: project.description,
    tags: requiredSkills,
    budgetLabel: formatBudget(project.budget),
    deadlineLabel: formatDeadline(project.deadline),
    locationLabel: project.umkm.user.location || "Lokasi belum ditentukan",
    skillMatchPercent,
    skillMatchReason,
    createdAt: project.createdAt,
    budget: project.budget,
    deadline: project.deadline,
  };
}

function sortProjects(
  projects: Array<ReturnType<typeof mapProject>>,
  sort: FindProjectFilters["sort"],
) {
  return projects.sort((first, second) => {
    if (sort === "latest") {
      return second.createdAt.getTime() - first.createdAt.getTime();
    }
    if (sort === "deadline") {
      return (
        (first.deadline?.getTime() ?? Number.MAX_SAFE_INTEGER) -
        (second.deadline?.getTime() ?? Number.MAX_SAFE_INTEGER)
      );
    }
    if (sort === "budget") {
      return (second.budget ?? -1) - (first.budget ?? -1);
    }

    return (
      second.skillMatchPercent - first.skillMatchPercent ||
      second.createdAt.getTime() - first.createdAt.getTime()
    );
  });
}

function toPublicProject(
  project: ReturnType<typeof mapProject>,
): Project {
  return {
    id: project.id,
    title: project.title,
    companyName: project.companyName,
    description: project.description,
    tags: project.tags,
    budgetLabel: project.budgetLabel,
    deadlineLabel: project.deadlineLabel,
    locationLabel: project.locationLabel,
    skillMatchPercent: project.skillMatchPercent,
    skillMatchReason: project.skillMatchReason,
  };
}

export async function getFindProjectsData(
  searchParams: FindProjectsSearchParams,
): Promise<FindProjectsData> {
  const session = await requireAuthenticatedSession();
  const filters = parseFindProjectFilters(searchParams);
  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      role: true,
      student: {
        select: {
          skills: { select: { skill: { select: { name: true } } } },
        },
      },
    },
  });

  if (!viewer) {
    throw new Error("Pengguna pada sesi tidak ditemukan");
  }
  const viewerRole = getViewerRole(viewer.role);

  const where = buildProjectWhere(filters);
  const [projectRecords, skillRecords, businessRecords] = await Promise.all([
    prisma.project.findMany({ where, select: projectSelect }),
    prisma.skill.findMany({
      where: {
        projectSkills: {
          some: { project: { status: "OPEN", studentId: null } },
        },
      },
      orderBy: { name: "asc" },
      select: { name: true },
    }),
    prisma.umkm.findMany({
      where: {
        projects: { some: { status: "OPEN", studentId: null } },
        user: { location: { not: null } },
      },
      select: { user: { select: { location: true } } },
    }),
  ]);

  const studentSkills =
    viewerRole === "STUDENT"
      ? viewer.student?.skills.map(({ skill }) => skill.name) ?? []
      : [];
  const sortedProjects = sortProjects(
    projectRecords.map((project) => mapProject(project, studentSkills)),
    filters.sort,
  );
  const totalProjects = sortedProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalProjects / PAGE_SIZE));
  const currentPage = Math.min(filters.page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const uniqueLocations = [
    ...new Set(
      businessRecords
        .map(({ user }) => user.location?.trim())
        .filter((location): location is string => Boolean(location)),
    ),
  ].sort((first, second) => first.localeCompare(second, "id-ID"));

  return {
    projects: sortedProjects
      .slice(pageStart, pageStart + PAGE_SIZE)
      .map(toPublicProject),
    filters: { ...filters, page: currentPage },
    skillOptions: skillRecords.map(({ name }) => ({ label: name, value: name })),
    locationOptions: uniqueLocations.map((location) => ({
      label: location,
      value: location,
    })),
    totalProjects,
    totalPages,
    currentPage,
    hasStudentSkills: studentSkills.length > 0,
    viewerRole,
    canApply: viewerRole === "STUDENT",
  };
}
