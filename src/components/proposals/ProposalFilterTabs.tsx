"use client";

import type { ProposalFilter } from "@/types/proposal";
import { usePreferences } from "@/contexts/PreferencesContext";

interface ProposalFilterTabsProps {
  active: ProposalFilter;
  counts: Record<ProposalFilter, number>;
  onChange: (value: ProposalFilter) => void;
}

const tabs: ProposalFilter[] = ["Semua", "Pending", "Accepted", "Rejected"];

export default function ProposalFilterTabs({
  active,
  counts,
  onChange,
}: ProposalFilterTabsProps) {
  const { dict } = usePreferences();

  const getTabLabel = (tab: ProposalFilter) => {
    switch (tab) {
      case "Semua":
        return dict.proposals.all || "Semua";
      case "Pending":
        return dict.proposals.submitted || "Pending";
      case "Accepted":
        return dict.proposals.accepted || "Accepted";
      case "Rejected":
        return dict.proposals.rejected || "Rejected";
      default:
        return tab;
    }
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
            {getTabLabel(tab)} ({counts[tab]})
          </button>
        );
      })}
    </div>
  );
}
