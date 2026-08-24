"use client";

import { useEffect, useRef, useState } from "react";
import Form from "next/form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronDown,
  Clock,
  Search,
  Sparkles,
  Timer,
  TrendingUp,
} from "lucide-react";
import FilterDropdown from "@/components/ui/FilterDropdown";
import type {
  FindProjectFilters,
  ProjectFilterOption,
  ProjectSort,
} from "@/types/project";

const budgetOptions: ProjectFilterOption[] = [
  { label: "< Rp 1.000.000", value: "under-1m" },
  { label: "Rp 1.000.000 - 3.000.000", value: "1m-3m" },
  { label: "Rp 3.000.000 - 5.000.000", value: "3m-5m" },
  { label: "> Rp 5.000.000", value: "over-5m" },
];

const sortOptions: Array<{
  label: string;
  value: ProjectSort;
  icon: typeof Sparkles;
}> = [
  { label: "Paling Cocok", value: "recommended", icon: Sparkles },
  { label: "Terbaru", value: "latest", icon: Clock },
  { label: "Deadline Terdekat", value: "deadline", icon: Timer },
  { label: "Budget Tertinggi", value: "budget", icon: TrendingUp },
];

interface FilterBarProps {
  filters: FindProjectFilters;
  skillOptions: ProjectFilterOption[];
  locationOptions: ProjectFilterOption[];
}

export default function FilterBar({
  filters,
  skillOptions,
  locationOptions,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();
  const [query, setQuery] = useState(filters.query);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const selectedSort =
    sortOptions.find((option) => option.value === filters.sort) ?? sortOptions[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function updateFilter(name: string, value: string) {
    const nextSearchParams = new URLSearchParams(currentSearchParams.toString());
    if (value) nextSearchParams.set(name, value);
    else nextSearchParams.delete(name);
    nextSearchParams.delete("page");

    const queryString = nextSearchParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  return (
    <div className="mb-6">
      <Form action={pathname} className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink"
        />
        <input
          type="search"
          name="q"
          value={query}
          maxLength={100}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari project berdasarkan nama, skill, atau UMKM..."
          className="w-full rounded-lg border border-hairline bg-card py-3 pl-11 pr-24 text-sm font-body text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none"
        />
        {filters.skill && <input type="hidden" name="skill" value={filters.skill} />}
        {filters.location && (
          <input type="hidden" name="location" value={filters.location} />
        )}
        {filters.budget && <input type="hidden" name="budget" value={filters.budget} />}
        {filters.sort !== "recommended" && (
          <input type="hidden" name="sort" value={filters.sort} />
        )}
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-brand px-4 py-2 text-xs font-display font-bold uppercase text-white transition-opacity hover:opacity-90"
        >
          Cari
        </button>
      </Form>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-ink">
          <FilterDropdown
            label="Skill"
            options={skillOptions}
            value={filters.skill}
            onChange={(value) => updateFilter("skill", value)}
          />
          <FilterDropdown
            label="Lokasi"
            options={locationOptions}
            value={filters.location}
            onChange={(value) => updateFilter("location", value)}
          />
          <FilterDropdown
            label="Budget"
            options={budgetOptions}
            value={filters.budget}
            onChange={(value) => updateFilter("budget", value)}
          />
        </div>

        <div className="flex items-center gap-2 text-sm" ref={sortRef}>
          <span className="font-body text-ink">Urutkan:</span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortOpen((open) => !open)}
              className={`flex items-center gap-1.5 rounded-[99px] border bg-card px-3.5 py-2 font-body font-semibold transition-colors ${
                isSortOpen
                  ? "border-brand text-brand"
                  : "border-hairline text-ink hover:border-brand hover:text-brand"
              }`}
            >
              {selectedSort.label}
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full z-10 mt-2 w-56 overflow-hidden rounded-2xl border border-hairline bg-card py-2 font-body text-ink shadow-xl">
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = option.value === filters.sort;
                  return (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => {
                        updateFilter("sort", option.value);
                        setIsSortOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-canvas ${
                        isSelected ? "text-brand" : "text-ink"
                      }`}
                    >
                      <Icon size={16} />
                      <span className="flex-1">{option.label}</span>
                      {isSelected && <Check size={14} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
