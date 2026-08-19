"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Search,
  Sparkles,
  Clock,
  Timer,
  TrendingUp,
} from "lucide-react";
import FilterDropdown from "@/components/ui/FilterDropdown";

const filterGroups = [
  {
    label: "Category",
    options: [
      "Web Development",
      "UI/UX Design",
      "Social Media",
      "Content Writing",
      "Mobile App",
      "Data Analytics",
    ],
  },
  {
    label: "Skills",
    options: [
      "Figma",
      "UI/UX Design",
      "React Native",
      "HTML/CSS/JS",
      "Copywriting",
      "Data Visualization",
    ],
  },
  {
    label: "Location",
    options: ["Remote", "Malang", "Surabaya", "Jakarta", "Bandung"],
  },
  {
    label: "Budget",
    options: [
      "< Rp 1.000.000",
      "Rp 1.000.000 - 3.000.000",
      "Rp 3.000.000 - 5.000.000",
      "> Rp 5.000.000",
    ],
  },
  {
    label: "Project Type",
    options: ["Sekali Selesai", "Kontrak Jangka Panjang", "Magang/Kolaborasi"],
  },
];

const sortOptions = [
  { label: "Recommended", icon: Sparkles },
  { label: "Terbaru", icon: Clock },
  { label: "Deadline Terdekat", icon: Timer },
  { label: "Budget Tertinggi", icon: TrendingUp },
];

export default function FilterBar() {
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-6">
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink"
        />
        <input
          type="text"
          placeholder="Cari project berdasarkan nama, skill, atau kategori..."
          className="w-full rounded-lg border border-hairline bg-card py-3 pl-11 pr-4 text-sm font-body text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-ink">
          {filterGroups.map((group) => (
            <FilterDropdown
              key={group.label}
              label={group.label}
              options={group.options}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm" ref={sortRef}>
          <span className="text-ink font-body">Urutkan :</span>

          <div className="relative">
            <button
              onClick={() => setIsSortOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 rounded-[99px] border bg-card px-3.5 py-2 transition-colors font-body font-semibold ${
                isSortOpen
                  ? "border-brand text-brand"
                  : "border-hairline text-ink hover:border-brand hover:text-brand"
              }`}
            >
              {sortBy.label}
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full z-10 mt-2 w-56 overflow-hidden rounded-2xl border font-body text-ink border-hairline bg-card py-2 shadow-xl">
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = option.label === sortBy.label;
                  return (
                    <button
                      key={option.label}
                      onClick={() => {
                        setSortBy(option);
                        setIsSortOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-canvas ${
                        isSelected ? "font-body text-brand" : "text-ink"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={isSelected ? "text-brand" : "text-ink"}
                      />
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