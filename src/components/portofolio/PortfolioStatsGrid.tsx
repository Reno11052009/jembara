import { BadgeCheck, BriefcaseBusiness, FolderOpen, Star } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import type { PortfolioSummary } from "@/types/portfolio";

interface PortfolioStatsGridProps {
  summary: PortfolioSummary;
}

export default function PortfolioStatsGrid({ summary }: PortfolioStatsGridProps) {
  const stats = [
    {
      id: "portfolio",
      label: "Karya Portofolio",
      value: summary.portfolioCount.toString(),
      icon: FolderOpen,
    },
    {
      id: "completed",
      label: "Proyek Selesai",
      value: summary.completedProjectCount.toString(),
      icon: BriefcaseBusiness,
    },
    {
      id: "rating",
      label: "Rata-rata Rating",
      value: summary.averageRating ? summary.averageRating.toFixed(1) : "Belum ada",
      icon: Star,
    },
    {
      id: "verified",
      label: "Skill Terverifikasi",
      value: summary.verifiedSkillCount.toString(),
      icon: BadgeCheck,
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
