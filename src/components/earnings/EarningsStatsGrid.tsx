"use client";

import { BarChart3, Calendar, Clock, Wallet } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import type { DashboardMetric } from "@/types/dashboard";
import { usePreferences } from "@/contexts/PreferencesContext";

interface EarningsStatsGridProps {
  stats: DashboardMetric[];
}

const statIcons: Record<string, typeof Wallet> = {
  total: Wallet,
  month: Calendar,
  pending: Clock,
  average: BarChart3,
};

export default function EarningsStatsGrid({ stats }: EarningsStatsGridProps) {
  const { language } = usePreferences();

  const getLocalizedLabel = (id: string, defaultLabel: string) => {
    if (id === "total") {
      return language === "en"
        ? "Total Value of Completed Projects"
        : language === "ja"
        ? "完了したプロジェクトの総額"
        : "Total Nilai Proyek Selesai";
    }
    if (id === "month") {
      return language === "en"
        ? "Completed Value This Month"
        : language === "ja"
        ? "今月の完了プロジェクト額"
        : "Nilai Selesai Bulan Ini";
    }
    if (id === "pending") {
      return language === "en"
        ? "Value Under Review"
        : language === "ja"
        ? "レビュー中のプロジェクト額"
        : "Nilai Dalam Review";
    }
    if (id === "average") {
      return language === "en"
        ? "Average Completed Project Value"
        : language === "ja"
        ? "完了プロジェクトの平均額"
        : "Rata-rata Proyek Selesai";
    }
    return defaultLabel;
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((metric) => {
        const Icon = statIcons[metric.id] ?? Wallet;
        const localizedLabel = getLocalizedLabel(metric.id, metric.label);
        return (
          <StatCard
            key={metric.id}
            stat={{
              id: metric.id,
              label: localizedLabel,
              value: metric.value,
              icon: Icon,
            }}
          />
        );
      })}
    </div>
  );
}