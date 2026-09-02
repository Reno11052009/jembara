import DashboardRouteSkeleton from "@/components/layout/DashboardRouteSkeleton";

export default function DashboardShellSkeleton() {
  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="hidden h-screen w-60 shrink-0 bg-sidebar lg:block" aria-hidden="true">
        <div className="animate-pulse space-y-5 px-6 py-8">
          <div className="h-6 w-28 rounded bg-white/15" />
          {Array.from({ length: 7 }, (_, index) => (
            <div key={index} className="h-10 rounded-lg bg-white/10" />
          ))}
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-6 py-8 sm:px-8">
        <DashboardRouteSkeleton />
      </main>
    </div>
  );
}
