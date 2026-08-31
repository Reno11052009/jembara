import { describe, expect, it } from "vitest";
import {
  businessCategoryGroupCount,
  businessCategorySeeds,
} from "@/lib/business-category-taxonomy";

describe("business category taxonomy", () => {
  it("contains the complete grouped category dump", () => {
    expect(businessCategoryGroupCount).toBe(25);
    expect(businessCategorySeeds).toHaveLength(127);
    expect(businessCategorySeeds).toContainEqual({
      groupName: "Kuliner",
      groupOrder: 10,
      name: "Restoran dan Warung",
      sortOrder: 10,
    });
    expect(businessCategorySeeds).toContainEqual({
      groupName: "Lainnya",
      groupOrder: 250,
      name: "Lainnya",
      sortOrder: 50,
    });
  });

  it("does not contain duplicate selectable category names", () => {
    const names = businessCategorySeeds.map(({ name }) => name);
    expect(new Set(names).size).toBe(names.length);
  });
});
