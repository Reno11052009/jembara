import { DashboardStat } from "@/types/dashboard";

interface StatCardProps {
  stat: DashboardStat;
}

export default function StatCard({ stat }: StatCardProps) {
  const Icon = stat.icon;

  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">{stat.label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-3 font-display text-xl font-black text-ink">
        {stat.value}
      </p>
    </div>
  );
}
