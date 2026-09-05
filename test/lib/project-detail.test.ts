import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedSession: vi.fn(),
  notFound: vi.fn(),
  userFindUnique: vi.fn(),
  projectFindUnique: vi.fn(),
  proposalFindUnique: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ notFound: mocks.notFound }));
vi.mock("@/lib/auth-guard", () => ({
  requireAuthenticatedSession: mocks.requireAuthenticatedSession,
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    project: { findUnique: mocks.projectFindUnique },
    proposal: { findUnique: mocks.proposalFindUnique },
  },
}));

import { getProjectDetailData } from "@/lib/project-detail";

const PROJECT_ID = "11111111-1111-4111-8111-111111111111";

describe("getProjectDetailData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.notFound.mockImplementation(() => {
      throw new Error("NEXT_NOT_FOUND");
    });
    mocks.requireAuthenticatedSession.mockResolvedValue({
      userId: "student-user-1",
      role: "STUDENT",
      name: "Ayu",
    });
    mocks.userFindUnique.mockResolvedValue({
      role: "STUDENT",
      student: {
        id: "student-1",
        skills: [{ skill: { name: "React" } }],
      },
    });
    mocks.projectFindUnique.mockResolvedValue({
      id: PROJECT_ID,
      title: "Website Katalog",
      description: "Membangun website katalog produk UMKM.",
      budget: 2_500_000,
      deadline: new Date("2030-12-31T00:00:00.000Z"),
      workMode: "HYBRID",
      location: "Malang",
      status: "OPEN",
      studentId: null,
      umkm: {
        nama_usaha: "Kopi Rina",
        user: { location: "Batu" },
      },
      skillsNeeded: [
        { required: true, skill: { name: "React" } },
        { required: false, skill: { name: "Figma" } },
      ],
    });
    mocks.proposalFindUnique.mockResolvedValue(null);
  });

  it("returns explainable skill matching and allows an eligible student", async () => {
    const data = await getProjectDetailData(PROJECT_ID);

    expect(data).toMatchObject({
      id: PROJECT_ID,
      skillMatchPercent: 100,
      matchedSkills: ["React"],
      missingSkills: [],
      workModeLabel: "Hybrid",
      locationLabel: "Malang",
      canApply: true,
    });
  });

  it("prevents a duplicate proposal", async () => {
    mocks.proposalFindUnique.mockResolvedValue({ status: "PENDING" });

    const data = await getProjectDetailData(PROJECT_ID);

    expect(data.canApply).toBe(false);
    expect(data.existingProposalStatus).toBe("PENDING");
    expect(data.applyDisabledReason).toContain("sudah mengirim");
  });

  it("returns not found for an invalid project ID", async () => {
    await expect(getProjectDetailData("invalid")).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );
    expect(mocks.projectFindUnique).not.toHaveBeenCalled();
  });
});
