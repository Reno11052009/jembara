"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

export type MultiSelectDropdownOption = {
  code: string;
  name: string;
  group?: string;
};

type MultiSelectDropdownProps = {
  id: string;
  name: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: MultiSelectDropdownOption[];
  placeholder: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxSelections?: number;
  disabled?: boolean;
  invalid?: boolean;
};

export default function MultiSelectDropdown({
  id,
  name,
  values,
  onChange,
  options,
  placeholder,
  searchPlaceholder = "Cari pilihan...",
  emptyMessage = "Pilihan tidak ditemukan",
  maxSelections,
  disabled = false,
  invalid = false,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOptions = useMemo(
    () => options.filter((option) => values.includes(option.code)),
    [options, values],
  );
  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id-ID");
    const filteredOptions = normalizedQuery
      ? options.filter((option) =>
          option.name.toLocaleLowerCase("id-ID").includes(normalizedQuery),
        )
      : options;

    return filteredOptions.reduce<Record<string, MultiSelectDropdownOption[]>>(
      (groups, option) => {
        (groups[option.group || "Pilihan"] ??= []).push(option);
        return groups;
      },
      {},
    );
  }, [options, query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (isOpen) searchInputRef.current?.focus();
  }, [isOpen]);

  function toggleOption(code: string) {
    if (values.includes(code)) {
      onChange(values.filter((value) => value !== code));
      return;
    }
    if (maxSelections !== undefined && values.length >= maxSelections) return;
    onChange([...values, code]);
  }

  const selectionSummary =
    selectedOptions.length === 0
      ? placeholder
      : selectedOptions.length === 1
        ? selectedOptions[0].name
        : `${selectedOptions.length} skill dipilih`;
  const hasFilteredOptions = Object.keys(filteredGroups).length > 0;
  const reachedLimit =
    maxSelections !== undefined && values.length >= maxSelections;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-options`}
        onClick={() => setIsOpen((current) => !current)}
        className={`flex w-full items-center justify-between rounded-lg border bg-white dark:bg-card px-4 py-3 text-left text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-surface ${
          invalid
            ? "border-danger ring-1 ring-danger/20"
            : isOpen
              ? "border-brand ring-2 ring-brand/20"
              : "border-gray-200 dark:border-hairline hover:border-brand"
        }`}
      >
        <span className={selectedOptions.length ? "font-semibold text-ink" : "text-ink-muted"}>
          {selectionSummary}
        </span>
        <ChevronDown
          size={17}
          className={`shrink-0 text-ink-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {selectedOptions.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2" aria-label="Skill wajib terpilih">
          {selectedOptions.map((option) => (
            <span
              key={option.code}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-sm font-semibold text-brand"
            >
              {option.name}
              <button
                type="button"
                onClick={() => toggleOption(option.code)}
                aria-label={`Hapus ${option.name}`}
                className="rounded-full p-0.5 transition hover:bg-brand/15"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {values.map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}

      {isOpen ? (
        <div className="absolute left-0 top-full z-30 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 dark:border-hairline bg-white dark:bg-card shadow-xl">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-hairline px-3 py-2.5">
            <Search size={15} className="shrink-0 text-gray-400 dark:text-ink-muted" />
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-gray-400 dark:placeholder:text-ink-muted"
            />
          </div>

          <div
            id={`${id}-options`}
            role="listbox"
            aria-multiselectable="true"
            className="max-h-72 overflow-y-auto py-1"
          >
            {!hasFilteredOptions ? (
              <p className="px-4 py-4 text-sm text-ink-muted">{emptyMessage}</p>
            ) : (
              Object.entries(filteredGroups).map(([group, groupOptions]) => (
                <div key={group} role="group" aria-label={group}>
                  <p className="px-4 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                    {group}
                  </p>
                  {groupOptions.map((option) => {
                    const selected = values.includes(option.code);
                    const optionDisabled = reachedLimit && !selected;
                    return (
                      <button
                        key={option.code}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        disabled={optionDisabled}
                        onClick={() => toggleOption(option.code)}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition ${
                          selected
                            ? "bg-brand/10 font-semibold text-brand"
                            : "text-ink hover:bg-brand/5 hover:text-brand"
                        } disabled:cursor-not-allowed disabled:opacity-40`}
                      >
                        <span
                          aria-hidden="true"
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            selected ? "border-brand bg-brand text-white" : "border-gray-300 dark:border-hairline bg-white dark:bg-card"
                          }`}
                        >
                          {selected ? <Check size={11} strokeWidth={3} /> : null}
                        </span>
                        {option.name}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {maxSelections !== undefined ? (
            <p className="border-t border-gray-100 dark:border-hairline px-4 py-2 text-xs text-ink-muted">
              {values.length} dari maksimal {maxSelections} skill dipilih
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
