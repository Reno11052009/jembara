import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  projectFindFirst: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({
  default: {
    project: { findFirst: mocks.projectFindFirst },
  },
}));

import { getPublicProjectDetailData } from "@/lib/public-project";

const PROJECT_ID = "11111111-1111-4111-8111-111111111111";

describe("getPublicProjectDetailData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.projectFindFirst.mockResolvedValue({
      id: PROJECT_ID,
      title: "Website Katalog",
      description: "Membangun website katalog produk UMKM.",
      budget: 2_500_000,
      deadline: new Date("2030-12-31T00:00:00.000Z"),
      workMode: "HYBRID",
      location: "Malang",
      umkm: {
        nama_usaha: "Kopi Rina",
        user: { location: "Batu" },
      },
      skillsNeeded: [
        { skill: { name: "React" } },
        { skill: { name: "Figma" } },
      ],
    });
  });

  it("returns only public project information without requiring a session", async () => {
    const data = await getPublicProjectDetailData(PROJECT_ID);

    expect(mocks.projectFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: PROJECT_ID, status: "OPEN", studentId: null },
      }),
    );
    expect(data).toMatchObject({
      id: PROJECT_ID,
      title: "Website Katalog",
      businessName: "Kopi Rina",
      workModeLabel: "Hybrid",
      locationLabel: "Malang",
      requiredSkills: ["React", "Figma"],
    });
  });

  it("does not query the database for an invalid project ID", async () => {
    await expect(getPublicProjectDetailData("invalid")).resolves.toBeNull();
    expect(mocks.projectFindFirst).not.toHaveBeenCalled();
  });

  it("returns null when an open public project is not found", async () => {
    mocks.projectFindFirst.mockResolvedValue(null);

    await expect(getPublicProjectDetailData(PROJECT_ID)).resolves.toBeNull();
  });
});
