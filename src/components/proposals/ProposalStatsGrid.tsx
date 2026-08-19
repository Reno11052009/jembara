import StatCard from "@/components/dashboard/StatCard";
import { DashboardStat } from "@/types/dashboard";

interface ProposalStatsGridProps {
  stats: DashboardStat[];
}

export default function ProposalStatsGrid({ stats }: ProposalStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}