"use client";

import { DashboardStat } from "@/types/dashboard";
import { usePreferences } from "@/contexts/PreferencesContext";

interface StatCardProps {
  stat: DashboardStat;
}

export default function StatCard({ stat }: StatCardProps) {
  const { dict: t } = usePreferences();
  const Icon = stat.icon;

  const getLocalizedStat = () => {
    let label = stat.label;
    let value = stat.value;

    const countNumber = stat.value.match(/\d+/)?.[0] ?? "0";

    if (stat.id === "proposals") {
      label = t.dashboard.stats.proposalsSubmitted;
      value = `${countNumber} ${t.dashboard.stats.unitProposal}`;
    } else if (stat.id === "active" || stat.id === "proyek-berjalan") {
      label = t.dashboard.stats.activeProjects;
      value = `${countNumber} ${t.dashboard.stats.unitActive}`;
    } else if (stat.id === "completed" || stat.id === "proyek-selesai") {
      label = t.dashboard.stats.completedProjects;
      value = `${countNumber} ${t.dashboard.stats.unitCompleted}`;
    } else if (stat.id === "rating") {
      label = t.dashboard.stats.averageRating;
      value = stat.value === "—" ? "—" : stat.value;
    } else if (stat.id === "projects") {
      label = t.dashboard.stats.totalProjects;
      value = `${countNumber} ${t.dashboard.stats.unitProject}`;
    } else if (stat.id === "proposals_received") {
      label = t.dashboard.stats.proposalsReceived;
      value = `${countNumber} ${t.dashboard.stats.unitProposal}`;
    } else if (stat.id === "lowongan-aktif") {
      label = t.dashboard.stats.openJobs;
      value = `${countNumber} ${t.dashboard.stats.unitListing}`;
    } else if (stat.id === "total-pelamar") {
      label = t.dashboard.stats.totalApplicants;
      value = `${countNumber} ${t.dashboard.stats.unitPeople}`;
    }

    return { label, value };
  };

  const localized = getLocalizedStat();

  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">{localized.label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-3 font-display text-xl font-black text-ink">
        {localized.value}
      </p>
    </div>
  );
}
