"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  options: Array<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
}

export default function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

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
        className={`flex items-center gap-1.5 rounded-[99px] border bg-card px-3.5 py-2 text-sm transition-colors text-body font-medium ${
          isOpen || value
            ? "border-brand text-brand"
            : "border-hairline text-ink hover:border-brand hover:text-brand"
        }`}
      >
        {selected?.label ?? label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-2 w-56 overflow-hidden rounded-2xl border border-hairline bg-card py-2 shadow-xl">
          <button
            type="button"
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-canvas ${
              value ? "text-ink" : "font-medium text-brand"
            }`}
          >
            Semua {label.toLocaleLowerCase("id-ID")}
            {!value && <Check size={14} />}
          </button>
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-canvas ${
                  isSelected ? "font-medium text-brand" : "text-ink"
                }`}
              >
                {option.label}
                {isSelected && <Check size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
