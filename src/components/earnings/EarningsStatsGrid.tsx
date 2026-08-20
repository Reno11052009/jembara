import StatCard from "@/components/dashboard/StatCard";
import { DashboardStat } from "@/types/dashboard";

interface EarningsStatsGridProps {
  stats: DashboardStat[];
}

export default function EarningsStatsGrid({ stats }: EarningsStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}