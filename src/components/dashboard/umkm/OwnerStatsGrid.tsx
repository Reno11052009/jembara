import StatCard from "@/components/dashboard/StatCard";
import type { DashboardStat } from "@/types/dashboard";

export default function OwnerStatsGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
