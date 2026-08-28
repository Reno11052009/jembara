import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedSession: vi.fn(),
  userFindUnique: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth-guard", () => ({
  requireAuthenticatedSession: mocks.requireAuthenticatedSession,
}));
vi.mock("@/lib/prisma", () => ({
  default: { user: { findUnique: mocks.userFindUnique } },
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import { getPortfolioData } from "@/lib/portfolio";

describe("getPortfolioData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuthenticatedSession.mockResolvedValue({
      userId: "user-1",
      role: "STUDENT",
      name: "Andi",
    });
  });

  it("maps authenticated student portfolio, skill, project, and review data", async () => {
    mocks.userFindUnique.mockResolvedValue({
      role: "STUDENT",
      student: {
        portfolios: [
          {
            id: "portfolio-1",
            title: "Website Kopi",
            description: "Katalog produk",
            link: "example.com/karya",
            image: "https://example.com/image.jpg",
            updatedAt: new Date(),
          },
        ],
        skills: [
          {
            id: "student-skill-1",
            isVerified: true,
            skill: { name: "Web Development", category: "Technology" },
          },
        ],
        projects: [{ id: "project-1" }],
        reviews: [
          {
            id: "review-1",
            rating: 4,
            comment: "Hasilnya bagus",
            project: { title: "Website UMKM" },
            umkm: { nama_usaha: "Kopi Jembara" },
          },
          {
            id: "review-2",
            rating: 5,
            comment: null,
            project: { title: "Landing Page" },
            umkm: { nama_usaha: "Toko Maju" },
          },
        ],
      },
    });

    const data = await getPortfolioData();

    expect(data.summary).toEqual({
      portfolioCount: 1,
      completedProjectCount: 1,
      averageRating: 4.5,
      verifiedSkillCount: 1,
    });
    expect(data.projects[0]).toMatchObject({
      title: "Website Kopi",
      link: "https://example.com/karya",
      imageUrl: "https://example.com/image.jpg",
    });
    expect(data.skills[0]).toMatchObject({
      name: "Web Development",
      isVerified: true,
    });
    expect(data.testimonials[0]).toMatchObject({
      clientName: "Kopi Jembara",
      projectTitle: "Website UMKM",
      rating: 4,
    });
    expect(data.testimonials[1].quote).toBe("Klien belum menambahkan komentar.");
  });

  it("returns an empty portfolio when the student profile is not created yet", async () => {
    mocks.userFindUnique.mockResolvedValue({ role: "STUDENT", student: null });

    const data = await getPortfolioData();

    expect(data.projects).toEqual([]);
    expect(data.skills).toEqual([]);
    expect(data.testimonials).toEqual([]);
    expect(data.summary.portfolioCount).toBe(0);
  });

  it("rejects non-student roles", async () => {
    mocks.userFindUnique.mockResolvedValue({ role: "UMKM", student: null });
    mocks.redirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    await expect(getPortfolioData()).rejects.toThrow("NEXT_REDIRECT");
    expect(mocks.redirect).toHaveBeenCalledWith("/forbidden");
  });
});
