"use client";

import { BadgeCheck, BriefcaseBusiness, FolderOpen, Star } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import type { PortfolioSummary } from "@/types/portfolio";
import { usePreferences } from "@/contexts/PreferencesContext";

interface PortfolioStatsGridProps {
  summary: PortfolioSummary;
}

export default function PortfolioStatsGrid({ summary }: PortfolioStatsGridProps) {
  const { dict } = usePreferences();

  const stats = [
    {
      id: "portfolio",
      label: dict.portfolio?.stats?.portfolioWorks || "Karya Portofolio",
      value: summary.portfolioCount.toString(),
      icon: FolderOpen,
    },
    {
      id: "completed",
      label: dict.portfolio?.stats?.completedProjects || "Proyek Selesai",
      value: summary.completedProjectCount.toString(),
      icon: BriefcaseBusiness,
    },
    {
      id: "rating",
      label: dict.portfolio?.stats?.averageRating || "Rata-rata Rating",
      value: summary.averageRating ? summary.averageRating.toFixed(1) : (dict.portfolio?.stats?.noRating || "Belum ada"),
      icon: Star,
    },
    {
      id: "verified",
      label: dict.portfolio?.stats?.verifiedSkills || "Skill Terverifikasi",
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
