"use client";

import { ChevronDown, Search } from "lucide-react";

const filters = ["Category", "Skills", "Location", "Budget", "Project Type"];

export default function FilterBar() {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="text"
          placeholder="Cari project berdasarkan nama, skill, atau kategori..."
          className="w-full rounded-lg border border-hairline bg-card py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              className="flex items-center gap-1.5 rounded-lg border border-hairline bg-card px-3 py-2 text-sm text-ink-muted hover:border-brand hover:text-brand"
            >
              {filter}
              <ChevronDown size={14} />
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-brand">
          Urutkan: Recommended
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
}