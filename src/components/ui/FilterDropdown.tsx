"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  options: string[];
}

export default function FilterDropdown({ label, options }: FilterDropdownProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 rounded-xl border bg-card px-3.5 py-2 text-sm transition-colors ${
          isOpen || selected
            ? "border-brand text-brand"
            : "border-hairline text-ink-muted hover:border-brand hover:text-brand"
        }`}
      >
        {selected ?? label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-2 w-56 overflow-hidden rounded-2xl border border-hairline bg-card py-2 shadow-xl">
          {options.map((option) => {
            const isSelected = option === selected;
            return (
              <button
                key={option}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-canvas ${
                  isSelected ? "font-medium text-brand" : "text-ink"
                }`}
              >
                {option}
                {isSelected && <Check size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}