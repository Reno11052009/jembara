import type { PaginationData } from "@/types/pagination";

export function normalizePage(value: unknown) {
  const firstValue = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(typeof firstValue === "string" ? firstValue : "", 10);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function createPagination(
  requestedPage: number,
  totalItems: number,
  pageSize: number,
): PaginationData {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return {
    currentPage: Math.min(requestedPage, totalPages),
    totalPages,
    totalItems,
    pageSize,
  };
}
