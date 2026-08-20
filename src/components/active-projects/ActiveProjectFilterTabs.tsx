"use client";

import { ActiveProjectStatus } from "@/types/active-project";

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
                ? "bg-ink text-white"
                : "border border-hairline bg-card text-ink hover:border-brand hover:text-brand"
            }`}
          >
            {tab === "Semua" ? tab : `${tab} (${counts[tab]})`}
          </button>
        );
      })}
    </div>
  );
}