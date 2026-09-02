import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { Prisma } from "@/generated/prisma/client";
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

const getMarketplaceFilterOptions = unstable_cache(
  async () => {
    const [skillRecords, businessRecords] = await Promise.all([
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

    return { skillRecords, businessRecords };
  },
  ["marketplace-filter-options"],
  { revalidate: 300, tags: ["marketplace-filter-options"] },
);

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

function getProjectOrderBy(
  sort: Exclude<FindProjectFilters["sort"], "recommended">,
): Prisma.projectOrderByWithRelationInput[] {
  if (sort === "deadline") {
    return [
      { deadline: { sort: "asc", nulls: "last" } },
      { createdAt: "desc" },
      { id: "asc" },
    ];
  }

  if (sort === "budget") {
    return [
      { budget: { sort: "desc", nulls: "last" } },
      { createdAt: "desc" },
      { id: "asc" },
    ];
  }

  return [{ createdAt: "desc" }, { id: "asc" }];
}

type RankedProjectRow = { id: string };

function buildRecommendedSqlWhere(filters: FindProjectFilters) {
  const conditions: Prisma.Sql[] = [
    Prisma.sql`p."status" = 'OPEN'`,
    Prisma.sql`p."studentId" IS NULL`,
  ];

  if (filters.query) {
    const containsQuery = `%${filters.query}%`;
    conditions.push(Prisma.sql`(
      p."title" ILIKE ${containsQuery}
      OR p."description" ILIKE ${containsQuery}
      OR business."nama_usaha" ILIKE ${containsQuery}
      OR EXISTS (
        SELECT 1
        FROM "project_skill" searched_project_skill
        INNER JOIN "skill" searched_skill
          ON searched_skill."id" = searched_project_skill."skillId"
        WHERE searched_project_skill."projectId" = p."id"
          AND searched_skill."name" ILIKE ${containsQuery}
      )
    )`);
  }

  if (filters.skill) {
    conditions.push(Prisma.sql`EXISTS (
      SELECT 1
      FROM "project_skill" filtered_project_skill
      INNER JOIN "skill" filtered_skill
        ON filtered_skill."id" = filtered_project_skill."skillId"
      WHERE filtered_project_skill."projectId" = p."id"
        AND LOWER(filtered_skill."name") = LOWER(${filters.skill})
    )`);
  }

  if (filters.location) {
    conditions.push(
      Prisma.sql`LOWER(owner."location") = LOWER(${filters.location})`,
    );
  }

  switch (filters.budget) {
    case "under-1m":
      conditions.push(Prisma.sql`p."budget" < 1000000`);
      break;
    case "1m-3m":
      conditions.push(
        Prisma.sql`p."budget" >= 1000000 AND p."budget" < 3000000`,
      );
      break;
    case "3m-5m":
      conditions.push(
        Prisma.sql`p."budget" >= 3000000 AND p."budget" <= 5000000`,
      );
      break;
    case "over-5m":
      conditions.push(Prisma.sql`p."budget" > 5000000`);
      break;
  }

  return Prisma.join(conditions, " AND ");
}

async function getRecommendedProjectIds(
  filters: FindProjectFilters,
  studentSkillIds: readonly string[],
  skip: number,
) {
  const matchedSkillCount =
    studentSkillIds.length > 0
      ? Prisma.sql`COUNT(project_skill."id") FILTER (
          WHERE project_skill."skillId" IN (${Prisma.join(studentSkillIds)})
        )`
      : Prisma.sql`0`;

  const rows = await prisma.$queryRaw<RankedProjectRow[]>(Prisma.sql`
    SELECT p."id"
    FROM "project" p
    INNER JOIN "umkm" business ON business."id" = p."umkmId"
    INNER JOIN "user" owner ON owner."id" = business."userId"
    LEFT JOIN "project_skill" project_skill
      ON project_skill."projectId" = p."id"
    WHERE ${buildRecommendedSqlWhere(filters)}
    GROUP BY p."id"
    ORDER BY
      CASE
        WHEN COUNT(project_skill."id") = 0 THEN 0
        ELSE ROUND(
          100 * ${matchedSkillCount}::double precision
            / COUNT(project_skill."id")::double precision
        )
      END DESC,
      p."createdAt" DESC,
      p."id" ASC
    LIMIT ${PAGE_SIZE}
    OFFSET ${skip}
  `);

  return rows.map(({ id }) => id);
}

async function getProjectPage(
  filters: FindProjectFilters,
  where: Prisma.projectWhereInput,
  studentSkillIds: readonly string[],
  skip: number,
) {
  if (filters.sort !== "recommended") {
    return prisma.project.findMany({
      where,
      orderBy: getProjectOrderBy(filters.sort),
      skip,
      take: PAGE_SIZE,
      select: projectSelect,
    });
  }

  const projectIds = await getRecommendedProjectIds(
    filters,
    studentSkillIds,
    skip,
  );
  if (projectIds.length === 0) return [];

  const projects = await prisma.project.findMany({
    where: { id: { in: projectIds } },
    select: projectSelect,
  });
  const projectOrder = new Map(projectIds.map((id, index) => [id, index]));

  return projects.sort(
    (first, second) =>
      (projectOrder.get(first.id) ?? Number.MAX_SAFE_INTEGER) -
      (projectOrder.get(second.id) ?? Number.MAX_SAFE_INTEGER),
  );
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

const getCachedFindProjectsData = cache(async (
  query: string,
  skill: string,
  location: string,
  budget: FindProjectFilters["budget"],
  sort: FindProjectFilters["sort"],
  page: number,
): Promise<FindProjectsData> => {
  const filters: FindProjectFilters = {
    query,
    skill,
    location,
    budget,
    sort,
    page,
  };
  const session = await requireAuthenticatedSession();
  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      role: true,
      student: {
        select: {
          skills: {
            select: { skill: { select: { id: true, name: true } } },
          },
        },
      },
    },
  });

  if (!viewer) {
    throw new Error("Pengguna pada sesi tidak ditemukan");
  }
  const viewerRole = getViewerRole(viewer.role);

  const where = buildProjectWhere(filters);
  const [totalProjects, filterOptions] = await Promise.all([
    prisma.project.count({ where }),
    getMarketplaceFilterOptions(),
  ]);
  const { skillRecords, businessRecords } = filterOptions;

  const studentSkillRecords =
    viewerRole === "STUDENT"
      ? viewer.student?.skills.map(({ skill }) => skill) ?? []
      : [];
  const studentSkills = studentSkillRecords.map(({ name }) => name);
  const studentSkillIds = studentSkillRecords.map(({ id }) => id);
  const totalPages = Math.max(1, Math.ceil(totalProjects / PAGE_SIZE));
  const currentPage = Math.min(filters.page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const projectRecords =
    totalProjects === 0
      ? []
      : await getProjectPage(
          filters,
          where,
          studentSkillIds,
          pageStart,
        );
  const uniqueLocations = [
    ...new Set(
      businessRecords
        .map(({ user }) => user.location?.trim())
        .filter((location): location is string => Boolean(location)),
    ),
  ].sort((first, second) => first.localeCompare(second, "id-ID"));

  return {
    projects: projectRecords
      .map((project) => mapProject(project, studentSkills))
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
});

export function getFindProjectsData(
  searchParams: FindProjectsSearchParams,
): Promise<FindProjectsData> {
  const filters = parseFindProjectFilters(searchParams);
  return getCachedFindProjectsData(
    filters.query,
    filters.skill,
    filters.location,
    filters.budget,
    filters.sort,
    filters.page,
  );
}
