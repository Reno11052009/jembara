export default function DashboardRouteSkeleton() {
  return (
    <div role="status" aria-label="Memuat halaman" className="animate-pulse">
      <span className="sr-only">Memuat halaman…</span>
      <div className="mb-7 flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="h-7 w-48 rounded-lg bg-slate-200 dark:bg-line" />
          <div className="h-4 w-72 max-w-[70vw] rounded bg-slate-100 dark:bg-line" />
        </div>
        <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-line" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-28 rounded-2xl border border-hairline bg-card p-5">
            <div className="h-4 w-24 rounded bg-slate-100 dark:bg-line" />
            <div className="mt-5 h-7 w-20 rounded bg-slate-200 dark:bg-line" />
          </div>
        ))}
      </div>

      <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-32 rounded-2xl border border-hairline bg-card" />
          ))}
        </div>
        <div className="h-72 rounded-2xl border border-hairline bg-card" />
      </div>
    </div>
  );
}
