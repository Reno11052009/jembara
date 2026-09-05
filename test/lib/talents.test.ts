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
        budget: 1_000_000,
        workMode: "REMOTE",
        location: null,
        skillsNeeded: [{ required: true, skill: { id: "figma", name: "Figma", category: "UI/UX" } }],
      },
      {
        id: "project-2",
        title: "Website UMKM",
        budget: 1_000_000,
        workMode: "REMOTE",
        location: null,
        skillsNeeded: [
          { required: true, skill: { id: "react", name: "React", category: "Web Development" } },
          { required: true, skill: { id: "typescript", name: "TypeScript", category: "Web Development" } },
        ],
      },
    ]);
    mocks.studentFindMany.mockResolvedValue([
      {
        id: "student-1",
        jurusan: "Rekayasa Perangkat Lunak",
        rating: 0,
        total_project: 2,
        available: true,
        expectedBudgetMin: null,
        expectedBudgetMax: null,
        provinsi_nama: "Jawa Barat",
        kabupaten_nama: "Bandung",
        user: {
          name: "Ayu Developer",
          location: "Bandung",
          portfolioUrl: null,
          github: "github.com/ayu",
          linkedin: null,
          behance: null,
        },
        skills: [
          { skill: { id: "react", name: "React", category: "Web Development" } },
          { skill: { id: "typescript", name: "TypeScript", category: "Web Development" } },
        ],
        portfolios: [],
        _count: { portfolios: 0, reviews: 0 },
      },
      {
        id: "student-2",
        jurusan: "Desain Komunikasi Visual",
        rating: 4.8,
        total_project: 4,
        available: true,
        expectedBudgetMin: null,
        expectedBudgetMax: null,
        provinsi_nama: "DKI Jakarta",
        kabupaten_nama: "Jakarta",
        user: {
          name: "Bima Designer",
          location: "Jakarta",
          portfolioUrl: null,
          github: null,
          linkedin: null,
          behance: null,
        },
        skills: [{ skill: { id: "figma", name: "Figma", category: "UI/UX" } }],
        portfolios: [{ title: "Logo", description: "Figma", skillEvidence: [{ skillId: "figma" }] }],
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
          matchPercent: 73,
          rating: null,
          profileUrl: "/talent/student-1",
        },
        {
          id: "student-2",
          matchEligible: false,
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
