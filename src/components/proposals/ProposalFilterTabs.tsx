"use client";

import type { ProposalFilter } from "@/types/proposal";

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
            {tab} ({counts[tab]})
          </button>
        );
      })}
    </div>
  );
}
