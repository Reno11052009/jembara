"use client";

import Link from "next/link";
import type { PaginationData } from "@/types/pagination";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function ListPagination({
  basePath,
  pagination,
  preservedParams = {},
}: {
  basePath: string;
  pagination: PaginationData;
  preservedParams?: Record<string, string | null | undefined>;
}) {
  const { dict: t } = usePreferences();
  const { currentPage, totalItems, totalPages, pageSize } = pagination;
  if (totalItems === 0) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const hrefFor = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(preservedParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };
  const linkClass =
    "inline-flex items-center justify-center rounded-full border border-hairline px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand";

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-ink-muted">
        {t.common.pagination.showing} {start}-{end} {t.common.pagination.of} {totalItems}
      </p>
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-2">
          {currentPage > 1 ? (
            <Link href={hrefFor(currentPage - 1)} className={linkClass}>
              {t.common.pagination.previous}
            </Link>
          ) : (
            <span className={`${linkClass} cursor-not-allowed opacity-40`}>
              {t.common.pagination.previous}
            </span>
          )}
          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-brand px-2 text-xs font-semibold text-white">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages ? (
            <Link href={hrefFor(currentPage + 1)} className={linkClass}>
              {t.common.pagination.next}
            </Link>
          ) : (
            <span className={`${linkClass} cursor-not-allowed opacity-40`}>
              {t.common.pagination.next}
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
