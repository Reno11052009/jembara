import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedSession: vi.fn(),
  redirect: vi.fn(),
  userFindUnique: vi.fn(),
  projectFindMany: vi.fn(),
  proposalFindMany: vi.fn(),
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
    proposal: { findMany: mocks.proposalFindMany },
  },
}));

import { getApplicantsData } from "@/lib/applicants";

const PROJECT_ID = "11111111-1111-4111-8111-111111111111";

describe("getApplicantsData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuthenticatedSession.mockResolvedValue({
      userId: "owner-user-1",
      role: "UMKM",
      name: "Rina",
    });
    mocks.userFindUnique.mockResolvedValue({
      name: "Rina",
      avatar: null,
      role: "UMKM",
      umkm: { id: "umkm-1", nama_usaha: "Kopi Rina" },
    });
    mocks.projectFindMany.mockResolvedValue([
      {
        id: PROJECT_ID,
        title: "Website Katalog",
        status: "OPEN",
        workMode: "REMOTE",
        skillsNeeded: [{ skill: { name: "React" } }],
      },
    ]);
    mocks.proposalFindMany.mockResolvedValue([
      {
        id: "proposal-1",
        coverLetter: "Saya siap mengerjakan project ini dengan pengalaman React.",
        budgetMatch: true,
        status: "PENDING",
        createdAt: new Date("2026-08-26T00:00:00.000Z"),
        student: {
          rating: 0,
          user: {
            name: "Ayu",
            location: "Bandung",
            portfolioUrl: "portfolio.example/ayu",
          },
          skills: [{ skill: { name: "React" } }],
          portfolios: [],
          _count: { reviews: 0 },
        },
      },
    ]);
    mocks.redirect.mockImplementation((path: string) => {
      throw new Error(`NEXT_REDIRECT:${path}`);
    });
  });

  it("loads proposals only for a project owned by the authenticated UMKM", async () => {
    const data = await getApplicantsData(PROJECT_ID);

    expect(mocks.projectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { umkmId: "umkm-1" } }),
    );
    expect(mocks.proposalFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          projectId: PROJECT_ID,
          project: { umkmId: "umkm-1" },
        },
      }),
    );
    expect(data.applicants[0]).toMatchObject({
      name: "Ayu",
      rating: null,
      matchPercent: 100,
      status: "Pending",
      budgetMatch: true,
      portfolioUrl: "https://portfolio.example/ayu",
    });
  });

  it("rejects users who are not UMKM owners", async () => {
    mocks.userFindUnique.mockResolvedValue({
      name: "Ayu",
      avatar: null,
      role: "STUDENT",
      umkm: null,
    });

    await expect(getApplicantsData()).rejects.toThrow(
      "NEXT_REDIRECT:/forbidden",
    );
    expect(mocks.projectFindMany).not.toHaveBeenCalled();
  });
});
