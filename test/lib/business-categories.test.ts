import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findMany: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({
  default: {
    business_category: { findMany: mocks.findMany },
  },
}));

import { getBusinessCategoryOptions } from "@/lib/business-categories";

describe("business category options", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads active categories from the database in configured order", async () => {
    mocks.findMany.mockResolvedValue([
      { name: "Restoran dan Warung", groupName: "Kuliner" },
      { name: "Jasa IT", groupName: "Elektronik dan Teknologi" },
    ]);

    await expect(getBusinessCategoryOptions()).resolves.toEqual([
      {
        code: "Restoran dan Warung",
        name: "Kuliner — Restoran dan Warung",
      },
      {
        code: "Jasa IT",
        name: "Elektronik dan Teknologi — Jasa IT",
      },
    ]);
    expect(mocks.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: [
        { groupOrder: "asc" },
        { sortOrder: "asc" },
        { name: "asc" },
      ],
      select: { name: true, groupName: true },
    });
  });

  it("pushes normalized group and search filters into the SQL query", async () => {
    mocks.findMany.mockResolvedValue([]);

    await getBusinessCategoryOptions("  kedai   kopi  ", "  Kuliner  ");

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          isActive: true,
          groupName: { equals: "Kuliner", mode: "insensitive" },
          OR: [
            { name: { contains: "kedai kopi", mode: "insensitive" } },
            {
              groupName: {
                contains: "kedai kopi",
                mode: "insensitive",
              },
            },
          ],
        },
      }),
    );
  });
});
