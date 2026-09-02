import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedSession: vi.fn(),
  redirect: vi.fn(),
  userFindUnique: vi.fn(),
  skillFindMany: vi.fn(),
  projectFindMany: vi.fn(),
  projectGroupBy: vi.fn(),
  projectCount: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/auth-guard", () => ({
  requireAuthenticatedSession: mocks.requireAuthenticatedSession,
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    skill: { findMany: mocks.skillFindMany },
    project: { findMany: mocks.projectFindMany, groupBy: mocks.projectGroupBy, count: mocks.projectCount },
  },
}));

import { getMyJobsData, getProjectCreationData } from "@/lib/my-jobs";

describe("UMKM project data", () => {
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
      location: "Malang",
      umkm: { id: "umkm-1", nama_usaha: "Kopi Rina" },
    });
    mocks.redirect.mockImplementation((path: string) => {
      throw new Error(`NEXT_REDIRECT:${path}`);
    });
    mocks.projectGroupBy.mockResolvedValue([]);
    mocks.projectCount.mockResolvedValue(0);
  });

  it("loads the trusted skill taxonomy for the creation form", async () => {
    mocks.skillFindMany.mockResolvedValue([
      { id: "skill-1", name: "Figma", category: "Design" },
      { id: "skill-2", name: "SEO", category: null },
    ]);

    const data = await getProjectCreationData();

    expect(data).toMatchObject({
      ownerName: "Rina",
      businessName: "Kopi Rina",
      skillOptions: [
        { id: "skill-1", name: "Figma", category: "Design" },
        { id: "skill-2", name: "SEO", category: "Lainnya" },
      ],
    });
  });

  it("only loads projects owned by the authenticated UMKM", async () => {
    mocks.projectFindMany.mockResolvedValue([
      {
        id: "project-1",
        title: "Website Katalog",
        description: "Membangun katalog produk",
        budget: 2_500_000,
        deadline: new Date("2030-12-31T00:00:00.000Z"),
        workMode: "HYBRID",
        location: "Batu",
        status: "OPEN",
        createdAt: new Date("2026-08-26T00:00:00.000Z"),
        skillsNeeded: [{ skill: { name: "React" } }],
        _count: { proposals: 3 },
      },
    ]);
    mocks.projectGroupBy.mockResolvedValue([{ status: "OPEN", _count: { _all: 1 } }]);

    const data = await getMyJobsData();

    expect(mocks.projectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { umkmId: "umkm-1" } }),
    );
    expect(data.listings[0]).toMatchObject({
      id: "project-1",
      applicantCount: 3,
      status: "Terbuka",
      workModeLabel: "Hybrid",
      locationLabel: "Batu",
      skills: ["React"],
    });
  });

  it("rejects authenticated users without an UMKM profile", async () => {
    mocks.userFindUnique.mockResolvedValue({
      name: "Andi",
      avatar: null,
      role: "STUDENT",
      location: "Malang",
      umkm: null,
    });

    await expect(getMyJobsData()).rejects.toThrow(
      "NEXT_REDIRECT:/forbidden",
    );
    expect(mocks.projectFindMany).not.toHaveBeenCalled();
  });
});
