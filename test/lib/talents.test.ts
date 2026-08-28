import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedSession: vi.fn(),
  redirect: vi.fn(),
  userFindUnique: vi.fn(),
  projectFindMany: vi.fn(),
  studentFindMany: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/auth-guard", () => ({
  requireAuthenticatedSession: mocks.requireAuthenticatedSession,
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    project: { findMany: mocks.projectFindMany },
    student: { findMany: mocks.studentFindMany },
  },
}));

import { getTalentSearchData } from "@/lib/talents";

describe("getTalentSearchData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.redirect.mockImplementation((path: string) => {
      throw new Error(`NEXT_REDIRECT:${path}`);
    });
  });

  it("loads available talents and ranks skill overlap for an owned project", async () => {
    mocks.requireAuthenticatedSession.mockResolvedValue({
      userId: "owner-user-1",
      role: "UMKM",
      name: "Pemilik",
    });
    mocks.userFindUnique.mockResolvedValue({
      name: "Pemilik",
      avatar: null,
      role: "UMKM",
      umkm: { id: "umkm-1" },
    });
    mocks.projectFindMany.mockResolvedValue([
      {
        id: "project-1",
        title: "Desain Logo",
        skillsNeeded: [{ skill: { name: "Figma" } }],
      },
      {
        id: "project-2",
        title: "Website UMKM",
        skillsNeeded: [
          { skill: { name: "React" } },
          { skill: { name: "TypeScript" } },
        ],
      },
    ]);
    mocks.studentFindMany.mockResolvedValue([
      {
        id: "student-1",
        jurusan: "Rekayasa Perangkat Lunak",
        rating: 0,
        total_project: 2,
        user: {
          name: "Ayu Developer",
          location: "Bandung",
          portfolioUrl: null,
          github: "github.com/ayu",
          linkedin: null,
          behance: null,
        },
        skills: [
          { skill: { name: "React", category: "Web Development" } },
          { skill: { name: "TypeScript", category: "Web Development" } },
        ],
        portfolios: [],
        _count: { portfolios: 0, reviews: 0 },
      },
      {
        id: "student-2",
        jurusan: "Desain Komunikasi Visual",
        rating: 4.8,
        total_project: 4,
        user: {
          name: "Bima Designer",
          location: "Jakarta",
          portfolioUrl: null,
          github: null,
          linkedin: null,
          behance: null,
        },
        skills: [{ skill: { name: "Figma", category: "UI/UX" } }],
        portfolios: [{ link: "https://portfolio.example/bima" }],
        _count: { portfolios: 1, reviews: 3 },
      },
    ]);

    const data = await getTalentSearchData("project-2");

    expect(mocks.projectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          umkmId: "umkm-1",
          status: { in: ["OPEN", "PROPOSAL"] },
        },
      }),
    );
    expect(mocks.studentFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { available: true } }),
    );
    expect(data).toMatchObject({
      ownerName: "Pemilik",
      selectedProjectId: "project-2",
      selectedProjectTitle: "Website UMKM",
      talents: [
        {
          id: "student-1",
          matchPercent: 100,
          rating: null,
          profileUrl: "https://github.com/ayu",
        },
        {
          id: "student-2",
          matchPercent: 0,
          rating: 4.8,
        },
      ],
    });
    expect(data.skillOptions.map(({ value }) => value)).toEqual([
      "Figma",
      "React",
      "TypeScript",
    ]);
  });

  it("rejects users who are not UMKM owners", async () => {
    mocks.requireAuthenticatedSession.mockResolvedValue({
      userId: "student-user-1",
      role: "STUDENT",
      name: "Pelajar",
    });
    mocks.userFindUnique.mockResolvedValue({
      name: "Pelajar",
      avatar: null,
      role: "STUDENT",
      umkm: null,
    });

    await expect(getTalentSearchData()).rejects.toThrow(
      "NEXT_REDIRECT:/forbidden",
    );
    expect(mocks.projectFindMany).not.toHaveBeenCalled();
    expect(mocks.studentFindMany).not.toHaveBeenCalled();
  });
});
