import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import prisma from "@/lib/prisma";

export type BusinessCategoryOption = {
  code: string;
  name: string;
};

const MAX_FILTER_LENGTH = 100;

function normalizeFilter(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, MAX_FILTER_LENGTH);
}

const getPersistedBusinessCategoryOptions = unstable_cache(async (
  normalizedQuery: string,
  normalizedGroupName: string,
): Promise<BusinessCategoryOption[]> => {
  const categories = await prisma.business_category.findMany({
    where: {
      isActive: true,
      ...(normalizedGroupName
        ? {
            groupName: {
              equals: normalizedGroupName,
              mode: "insensitive" as const,
            },
          }
        : {}),
      ...(normalizedQuery
        ? {
            OR: [
              {
                name: {
                  contains: normalizedQuery,
                  mode: "insensitive" as const,
                },
              },
              {
                groupName: {
                  contains: normalizedQuery,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    },
    orderBy: [
      { groupOrder: "asc" },
      { sortOrder: "asc" },
      { name: "asc" },
    ],
    select: { name: true, groupName: true },
  });

  return categories.map(({ name, groupName }) => ({
    code: name,
    name: groupName ? `${groupName} — ${name}` : name,
  }));
}, ["business-category-options"], {
  revalidate: 3600,
  tags: ["business-category-options"],
});

export const getBusinessCategoryOptions = cache(async (
  query = "",
  groupName = "",
): Promise<BusinessCategoryOption[]> =>
  getPersistedBusinessCategoryOptions(
    normalizeFilter(query),
    normalizeFilter(groupName),
  ));
