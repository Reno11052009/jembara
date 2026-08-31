import { describe, expect, it } from "vitest";
import {
  getCanonicalSkillName,
  skillTaxonomy,
  skillTaxonomyGroups,
} from "@/lib/skill-taxonomy";

describe("skill taxonomy", () => {
  it("contains unique, categorized skill names", () => {
    const normalizedNames = skillTaxonomy.map(({ name }) =>
      name.toLocaleLowerCase("id-ID"),
    );

    expect(new Set(normalizedNames).size).toBe(skillTaxonomy.length);
    expect(skillTaxonomy.every(({ name, category }) => name && category)).toBe(true);
    expect(skillTaxonomy.length).toBeGreaterThan(150);
    expect(skillTaxonomyGroups.length).toBeGreaterThan(10);
  });

  it("includes the requested cross-platform development capabilities", () => {
    const names = new Set<string>(skillTaxonomy.map(({ name }) => name));

    for (const expectedSkill of [
      "Full-Stack Web Development",
      "Next.js Server Actions",
      "PostgreSQL",
      "Docker",
      "Flutter",
      "Java Swing",
      "Git",
      "Nginx",
      "Cloudflare",
      "Debugging",
    ]) {
      expect(names.has(expectedSkill), expectedSkill).toBe(true);
    }
  });

  it("normalizes common aliases to one canonical skill", () => {
    expect(getCanonicalSkillName("React.js")).toBe("React");
    expect(getCanonicalSkillName("next.js development")).toBe("Next.js");
    expect(getCanonicalSkillName("WebSocket dasar")).toBe("WebSocket");
  });
});
