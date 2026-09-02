"use client";

import { ConversationFilterValue } from "@/types/messages";

interface ConversationFilterTabsProps {
  active: ConversationFilterValue;
  onChange: (value: ConversationFilterValue) => void;
}

const tabs: ConversationFilterValue[] = ["Semua", "Belum Dibaca", "Project"];

export default function ConversationFilterTabs({
  active,
  onChange,
}: ConversationFilterTabsProps) {
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
            {tab}
          </button>
        );
      })}
    </div>
  );
}