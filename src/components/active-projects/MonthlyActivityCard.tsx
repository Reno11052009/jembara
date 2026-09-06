"use client";

import type { ActiveProjectMetric, ActiveProjectsViewerRole } from "@/types/active-project";
import { usePreferences } from "@/contexts/PreferencesContext";

interface MonthlyActivityCardProps {
  title?: string;
  metrics: ActiveProjectMetric[];
  viewerRole?: ActiveProjectsViewerRole;
}

const toneStyles = {
  default: "text-ink",
  brand: "text-brand",
  success: "text-success",
};

export default function MonthlyActivityCard({
  title,
  metrics,
  viewerRole = "STUDENT",
}: MonthlyActivityCardProps) {
  const { dict: t } = usePreferences();

  const cardTitle =
    title ||
    (viewerRole === "STUDENT"
      ? t.activeProjects.summaryTitleStudent
      : viewerRole === "UMKM"
        ? t.activeProjects.summaryTitleUmkm
        : t.activeProjects.summaryTitleAdmin);

  const getLocalizedMetric = (metric: ActiveProjectMetric) => {
    let label = metric.label;
    let value = metric.value;

    if (metric.id === "active") {
      label = viewerRole === "STUDENT" ? t.activeProjects.metrics.activeStudent : t.activeProjects.metrics.activeUmkm;
      value = metric.value.replace("Proyek", t.activeProjects.metrics.unitProject);
    } else if (metric.id === "completed") {
      label = t.activeProjects.metrics.completedThisMonth;
      value = metric.value.replace("Proyek", t.activeProjects.metrics.unitProject);
    } else if (metric.id === "value") {
      label = t.activeProjects.metrics.activeValue;
    } else if (metric.id === "rating") {
      label = t.activeProjects.metrics.studentRating;
      if (metric.value === "Belum ada") {
        value = t.activeProjects.metrics.noRating;
      }
    } else if (metric.id === "review") {
      label = viewerRole === "UMKM" ? t.activeProjects.metrics.awaitingReview : t.activeProjects.metrics.inReview;
      value = metric.value.replace("Proyek", t.activeProjects.metrics.unitProject);
    } else if (metric.id === "talent") {
      label = t.activeProjects.metrics.selectedTalent;
      value = metric.value.replace("Talent", t.activeProjects.metrics.unitTalent);
    } else if (metric.id === "proposals") {
      label = t.activeProjects.metrics.totalProposals;
      value = metric.value.replace("Proposal", t.activeProjects.metrics.unitProposal);
    }

    return { label, value };
  };

  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <h3 className="font-display text-sm font-black text-ink">{cardTitle}</h3>
      <div className="mt-4 flex flex-col gap-3.5">
        {metrics.map((metric) => {
          const localized = getLocalizedMetric(metric);
          return (
            <div key={metric.id} className="flex items-center justify-between gap-4">
              <p className="font-body text-sm text-ink-muted">{localized.label}</p>
              <p
                className={`text-right font-display text-sm font-black ${
                  toneStyles[metric.tone ?? "default"]
                }`}
              >
                {localized.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
