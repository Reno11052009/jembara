import { describe, expect, it } from "vitest";
import {
  calculateProfileCompletion,
  calculateSkillMatch,
  formatBudget,
  formatDeadline,
  formatRelativeDate,
} from "./dashboard-utils";

describe("dashboard utilities", () => {
  it("calculates rounded profile completion from explicit checks", () => {
    expect(calculateProfileCompletion([true, false, true])).toBe(67);
    expect(calculateProfileCompletion([])).toBe(0);
  });

  it("calculates a case-insensitive skill match without counting duplicates", () => {
    expect(
      calculateSkillMatch(
        ["Figma", "Next.js"],
        ["figma", "SEO", "FIGMA"],
      ),
    ).toBe(50);
    expect(calculateSkillMatch(["Figma"], [])).toBe(0);
  });

  it("formats optional budgets for Indonesian users", () => {
    expect(formatBudget(null)).toBe("Dapat dinegosiasikan");
    expect(formatBudget(1_500_000)).toContain("1.500.000");
  });

  it("formats future, current, and expired deadlines", () => {
    const now = new Date("2026-08-22T00:00:00.000Z");

    expect(formatDeadline(new Date("2026-08-25T00:00:00.000Z"), now)).toBe(
      "3 hari lagi",
    );
    expect(formatDeadline(new Date("2026-08-22T00:00:00.000Z"), now)).toBe(
      "Hari ini",
    );
    expect(formatDeadline(new Date("2026-08-21T00:00:00.000Z"), now)).toBe(
      "Tenggat terlewat",
    );
    expect(formatDeadline(null, now)).toBe("Fleksibel");
  });

  it("formats recent timestamps into concise relative labels", () => {
    const now = new Date("2026-08-22T12:00:00.000Z");

    expect(formatRelativeDate(new Date("2026-08-22T11:45:00.000Z"), now)).toBe(
      "15 menit lalu",
    );
    expect(formatRelativeDate(new Date("2026-08-20T12:00:00.000Z"), now)).toBe(
      "2 hari lalu",
    );
  });
});
