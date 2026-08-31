import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedSession: vi.fn(),
  userFindUnique: vi.fn(),
  projectFindMany: vi.fn(),
  skillFindMany: vi.fn(),
  umkmFindMany: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth-guard", () => ({
  requireAuthenticatedSession: mocks.requireAuthenticatedSession,
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    project: { findMany: mocks.projectFindMany },
    skill: { findMany: mocks.skillFindMany },
    umkm: { findMany: mocks.umkmFindMany },
  },
}));

import { getFindProjectsData, parseFindProjectFilters } from "@/lib/find-projects";

describe("parseFindProjectFilters", () => {
  it("normalizes untrusted search parameters", () => {
    expect(
      parseFindProjectFilters({
        q: "  website kopi  ",
        budget: "invalid",
        sort: "budget",
        page: "-2",
      }),
    ).toEqual({
      query: "website kopi",
      skill: "",
      location: "",
      budget: "",
      sort: "budget",
      page: 1,
    });
  });
});

describe("getFindProjectsData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuthenticatedSession.mockResolvedValue({
      userId: "user-1",
      role: "STUDENT",
      name: "Andi",
    });
    mocks.userFindUnique.mockResolvedValue({
      role: "STUDENT",
      student: {
        skills: [{ skill: { name: "Figma" } }, { skill: { name: "UI/UX" } }],
      },
    });
    mocks.skillFindMany.mockResolvedValue([
      { name: "Figma" },
      { name: "UI/UX" },
    ]);
    mocks.umkmFindMany.mockResolvedValue([
      { user: { location: "Malang" } },
      { user: { location: "Malang" } },
    ]);
  });

  it("loads open projects and ranks them by the student's skill match", async () => {
    mocks.projectFindMany.mockResolvedValue([
      {
        id: "project-low",
        title: "Konten UMKM",
        description: "Membuat konten promosi",
        budget: 1_000_000,
        deadline: null,
        createdAt: new Date("2026-08-24T00:00:00.000Z"),
        umkm: { nama_usaha: "Usaha Satu", user: { location: "Malang" } },
        skillsNeeded: [{ skill: { name: "Copywriting" } }],
      },
      {
        id: "project-high",
        title: "Desain Aplikasi",
        description: "Mendesain aplikasi UMKM",
        budget: 2_000_000,
        deadline: new Date("2026-09-24T00:00:00.000Z"),
        createdAt: new Date("2026-08-23T00:00:00.000Z"),
        umkm: { nama_usaha: "Usaha Dua", user: { location: "Bandung" } },
        skillsNeeded: [
          { skill: { name: "Figma" } },
          { skill: { name: "UI/UX" } },
        ],
      },
    ]);

    const data = await getFindProjectsData({});

    expect(mocks.projectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: "OPEN", studentId: null }),
      }),
    );
    expect(data.projects.map((project) => project.id)).toEqual([
      "project-high",
      "project-low",
    ]);
    expect(data.projects[0]).toMatchObject({
      skillMatchPercent: 100,
      skillMatchReason: "2 dari 2 skill cocok",
      companyName: "Usaha Dua",
    });
    expect(data.locationOptions).toEqual([{ label: "Malang", value: "Malang" }]);
  });

  it("pushes search, skill, location, and budget filters into SQL", async () => {
    mocks.projectFindMany.mockResolvedValue([]);

    await getFindProjectsData({
      q: "kopi",
      skill: "Figma",
      location: "Malang",
      budget: "1m-3m",
    });

    expect(mocks.projectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: "OPEN",
          studentId: null,
          budget: { gte: 1_000_000, lt: 3_000_000 },
          OR: expect.arrayContaining([
            { title: { contains: "kopi", mode: "insensitive" } },
          ]),
          skillsNeeded: {
            some: {
              skill: { name: { equals: "Figma", mode: "insensitive" } },
            },
          },
          umkm: {
            user: {
              location: { equals: "Malang", mode: "insensitive" },
            },
          },
        }),
      }),
    );
  });

  it("allows a student account whose student profile is not created yet", async () => {
    mocks.userFindUnique.mockResolvedValue({
      role: "STUDENT",
      student: null,
    });
    mocks.projectFindMany.mockResolvedValue([]);

    const data = await getFindProjectsData({});

    expect(data).toMatchObject({
      projects: [],
      hasStudentSkills: false,
      totalProjects: 0,
      viewerRole: "STUDENT",
      canApply: true,
    });
  });

  it.each(["UMKM", "ADMIN"])(
    "allows %s to browse projects in read-only mode",
    async (role) => {
      mocks.userFindUnique.mockResolvedValue({ role, student: null });
      mocks.projectFindMany.mockResolvedValue([]);

      const data = await getFindProjectsData({});

      expect(data).toMatchObject({
        viewerRole: role,
        canApply: false,
        hasStudentSkills: false,
      });
    },
  );
});
