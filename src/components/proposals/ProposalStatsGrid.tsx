import { Bell, Briefcase, FolderOpen, Settings } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import type { DashboardStat } from "@/types/dashboard";
import type { ProposalSummary } from "@/types/proposal";

interface ProposalStatsGridProps {
  summary: ProposalSummary;
}

export default function ProposalStatsGrid({ summary }: ProposalStatsGridProps) {
  const stats: DashboardStat[] = [
    { id: "total", label: "Total Proposal", value: String(summary.total), icon: FolderOpen },
    {
      id: "pending",
      label: "Menunggu Keputusan",
      value: `${summary.pending} Pending`,
      icon: Bell,
    },
    {
      id: "accepted",
      label: "Disetujui UMKM",
      value: `${summary.accepted} Accepted`,
      icon: Briefcase,
    },
    {
      id: "rejected",
      label: "Ditolak / Batal",
      value: `${summary.rejected} Rejected`,
      icon: Settings,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
