"use client";

import { Search } from "lucide-react";
import FilterDropdown from "@/components/ui/FilterDropdown";
import type { TalentFilterOption, TalentFilters } from "@/types/talent";

interface TalentFilterBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  filters: TalentFilters;
  onFilterChange: (name: keyof TalentFilters, value: string) => void;
  skillOptions: TalentFilterOption[];
  locationOptions: TalentFilterOption[];
  ratingOptions: TalentFilterOption[];
}

export default function TalentFilterBar({
  query,
  onQueryChange,
  filters,
  onFilterChange,
  skillOptions,
  locationOptions,
  ratingOptions,
}: TalentFilterBarProps) {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Cari talent berdasarkan nama, keahlian, atau kategori..."
          className="w-full rounded-lg border border-hairline bg-card py-3 pl-11 pr-4 text-sm font-body text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-ink">
        <FilterDropdown
          label="Skill"
          options={skillOptions}
          value={filters.skill}
          onChange={(value) => onFilterChange("skill", value)}
        />
        <FilterDropdown
          label="Lokasi"
          options={locationOptions}
          value={filters.location}
          onChange={(value) => onFilterChange("location", value)}
        />
        <FilterDropdown
          label="Rating"
          options={ratingOptions}
          value={filters.rating}
          onChange={(value) => onFilterChange("rating", value)}
        />
      </div>
    </div>
  );
}
