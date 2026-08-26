"use client";

import { useState } from "react";
import { relationFilterTabs } from "@/lib/mock-admin-relations";

export default function RelationsFilterTabs() {
  const [active, setActive] = useState(relationFilterTabs[0].value);

  return (
    <div className="flex flex-wrap gap-3">
      {relationFilterTabs.map((tab) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActive(tab.value)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-brand text-white"
                : "border border-hairline bg-card text-ink hover:border-brand hover:text-brand"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
