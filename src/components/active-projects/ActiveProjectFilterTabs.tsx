"use client";

import { ActiveProjectStatus } from "@/types/active-project";
import { usePreferences } from "@/contexts/PreferencesContext";

type FilterValue = "Semua" | ActiveProjectStatus;

interface ActiveProjectFilterTabsProps {
  active: FilterValue;
  counts: Record<ActiveProjectStatus, number>;
  onChange: (value: FilterValue) => void;
}

const tabs: FilterValue[] = ["Semua", "In Progress", "In Review", "Completed"];

export default function ActiveProjectFilterTabs({
  active,
  counts,
  onChange,
}: ActiveProjectFilterTabsProps) {
  const { dict } = usePreferences();

  const getTabLabel = (tab: FilterValue) => {
    if (tab === "Semua") return dict.activeProjects.all;
    if (tab === "In Progress") return `${dict.common.status.IN_PROGRESS} (${counts[tab]})`;
    if (tab === "In Review") return `${dict.common.status.REVIEW} (${counts[tab]})`;
    if (tab === "Completed") return `${dict.common.status.COMPLETED} (${counts[tab]})`;
    return `${tab} (${counts[tab]})`;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`rounded-full px-4 py-2 text-sm font-body font-semibold transition-colors ${
              isActive
                ? "bg-ink text-white dark:text-canvas"
                : "border border-hairline bg-card text-ink hover:border-brand hover:text-brand"
            }`}
          >
            {getTabLabel(tab)}
          </button>
        );
      })}
    </div>
  );
}