import StatCard from "@/components/dashboard/StatCard";
import { DashboardStat } from "@/types/dashboard";

interface PortfolioStatsGridProps {
  stats: DashboardStat[];
}

export default function PortfolioStatsGrid({ stats }: PortfolioStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}