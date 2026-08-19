import { MonthlyActivityStats } from "@/types/active-project";

interface MonthlyActivityCardProps {
  stats: MonthlyActivityStats;
}

export default function MonthlyActivityCard({ stats }: MonthlyActivityCardProps) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <h3 className="font-display text-sm font-black text-ink">Aktivitas Bulan Ini</h3>
      <div className="mt-4 flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <p className="font-body text-sm text-ink-muted">Active Projects</p>
          <p className="font-display text-sm font-black text-ink">
            {stats.activeProjectsLabel}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-body text-sm text-ink-muted">Selesai Bulan Ini</p>
          <p className="font-display text-sm font-black text-success">
            {stats.completedThisMonthLabel}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-body text-sm text-ink-muted">Total Penghasilan</p>
          <p className="font-display text-sm font-black text-brand">
            {stats.totalEarningsLabel}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-body text-sm text-ink-muted">Rating Rata-rata</p>
          <p className="font-display text-sm font-black text-ink">
            {stats.averageRatingLabel}
          </p>
        </div>
      </div>
    </div>
  );
}