import Link from "next/link";

export default function AdminPagination({
  basePath,
  currentPage,
  totalPages,
  summary,
  preservedParams = {},
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  summary: string;
  preservedParams?: Record<string, string>;
}) {
  function pageHref(page: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(preservedParams)) {
      if (value) params.set(key, value);
    }
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  const linkClass =
    "inline-flex items-center justify-center rounded-full border border-hairline px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-ink-muted">{summary}</p>
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          {currentPage > 1 ? (
            <Link href={pageHref(currentPage - 1)} className={linkClass}>
              Sebelumnya
            </Link>
          ) : (
            <span className={`${linkClass} cursor-not-allowed opacity-40`}>Sebelumnya</span>
          )}
          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-brand px-2 text-xs font-semibold text-white">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages ? (
            <Link href={pageHref(currentPage + 1)} className={linkClass}>
              Berikutnya
            </Link>
          ) : (
            <span className={`${linkClass} cursor-not-allowed opacity-40`}>Berikutnya</span>
          )}
        </div>
      )}
    </div>
  );
}
