import { describe, expect, it } from "vitest";
import { calculateSmartMatch } from "@/lib/matching";

const baseInput = {
  project: {
    budget: 1_000_000,
    workMode: "REMOTE",
    location: null,
    skills: [
      { id: "web", name: "Web Development", required: true },
      { id: "seo", name: "SEO", required: false },
    ],
  },
  student: {
    skills: [{ id: "web", name: "Web Development" }],
    portfolios: [
      { title: "Website UMKM", description: "Web Development", evidenceSkillIds: ["web"] },
    ],
    rating: 0,
    reviewCount: 0,
    available: true,
    expectedBudgetMin: 800_000,
    expectedBudgetMax: 1_200_000,
    provinceName: "Jawa Barat",
    regencyName: "Bandung",
  },
} as const;

describe("Smart Matching v1", () => {
  it("uses deterministic weighted factors and neutral cold-start rating", () => {
    const result = calculateSmartMatch(baseInput);

    expect(result.eligible).toBe(true);
    expect(result.factors).toEqual({
      skills: 80,
      portfolio: 50,
      rating: 70,
      budget: 100,
      availability: 100,
      location: 100,
    });
    expect(result.totalScore).toBe(78);
  });

  it("marks candidates ineligible when a mandatory skill is missing", () => {
    const result = calculateSmartMatch({
      ...baseInput,
      student: { ...baseInput.student, skills: [] },
    });

    expect(result.eligible).toBe(false);
    expect(result.reasons[0]).toContain("Web Development");
  });

  it("applies the declared hybrid location rule", () => {
    const result = calculateSmartMatch({
      ...baseInput,
      project: { ...baseInput.project, workMode: "HYBRID", location: "Bandung, Jawa Barat" },
    });

    expect(result.factors.location).toBe(100);
  });
});
