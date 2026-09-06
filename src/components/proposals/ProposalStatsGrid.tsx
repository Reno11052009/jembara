"use client";

import { Bell, Briefcase, FolderOpen, Settings } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { usePreferences } from "@/contexts/PreferencesContext";
import type { DashboardStat } from "@/types/dashboard";
import type { ProposalSummary } from "@/types/proposal";

interface ProposalStatsGridProps {
  summary: ProposalSummary;
}

export default function ProposalStatsGrid({ summary }: ProposalStatsGridProps) {
  const { language } = usePreferences();

  const totalLabel = language === "en" ? "Total Proposals" : language === "ja" ? "全提案数" : "Total Proposal";
  const pendingLabel = language === "en" ? "Pending Decision" : language === "ja" ? "決定待ち" : "Menunggu Keputusan";
  const acceptedLabel = language === "en" ? "Accepted by UMKM" : language === "ja" ? "企業が承認" : "Disetujui UMKM";
  const rejectedLabel = language === "en" ? "Rejected / Cancelled" : language === "ja" ? "不採用 / キャンセル" : "Ditolak / Batal";

  const pendingUnit = language === "ja" ? "件 保留中" : "Pending";
  const acceptedUnit = language === "ja" ? "件 承認" : "Accepted";
  const rejectedUnit = language === "ja" ? "件 不採用" : "Rejected";

  const stats: DashboardStat[] = [
    { id: "total", label: totalLabel, value: String(summary.total), icon: FolderOpen },
    {
      id: "pending",
      label: pendingLabel,
      value: `${summary.pending} ${pendingUnit}`,
      icon: Bell,
    },
    {
      id: "accepted",
      label: acceptedLabel,
      value: `${summary.accepted} ${acceptedUnit}`,
      icon: Briefcase,
    },
    {
      id: "rejected",
      label: rejectedLabel,
      value: `${summary.rejected} ${rejectedUnit}`,
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
