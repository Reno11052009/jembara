"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

export type SearchableSelectOption = {
  code: string;
  name: string;
};

type SearchableSelectProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (code: string) => void;
  options: SearchableSelectOption[];
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  placeholder: string;
  searchPlaceholder?: string;
  labelClassName?: string;
  showSearch?: boolean;
};

const defaultLabelClassName =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500";

export default function SearchableSelect({
  id,
  name,
  label,
  value,
  onChange,
  options,
  loading = false,
  disabled = false,
  required = false,
  placeholder,
  searchPlaceholder = "Cari...",
  labelClassName = defaultLabelClassName,
  showSearch = true,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((option) => option.code === value);
  const isDisabled = disabled || loading;

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const normalizedQuery = query.trim().toLocaleLowerCase("id-ID");
    return options.filter((option) =>
      option.name.toLocaleLowerCase("id-ID").includes(normalizedQuery),
    );
  }, [options, query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && showSearch) {
      searchInputRef.current?.focus();
    }
  }, [isOpen, showSearch]);

  function toggleOpen() {
    if (isDisabled) return;
    setIsOpen((prev) => !prev);
    if (isOpen) setQuery("");
  }

  function handleSelect(code: string) {
    onChange(code);
    setIsOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className={labelClassName}>
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>

      <button
        type="button"
        id={id}
        onClick={toggleOpen}
        disabled={isDisabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`flex w-full items-center justify-between rounded-xl border bg-white px-4 py-2.5 text-left text-sm text-gray-900 outline-none transition disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 ${
          isOpen
            ? "border-brand ring-1 ring-brand"
            : "border-gray-200 hover:border-brand hover:ring-1 hover:ring-brand"
        }`}
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {loading
            ? `Memuat ${label.toLocaleLowerCase("id-ID")}...`
            : selected?.name ?? placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Native select tersembunyi (bukan display:none) supaya "required" tetap
         divalidasi browser, dan value ini yang beneran ikut ke-submit lewat form. */}
      <select
        aria-hidden="true"
        tabIndex={-1}
        name={name}
        required={required}
        value={value}
        onChange={() => {}}
        className="sr-only"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {option.name}
          </option>
        ))}
      </select>

      {isOpen ? (
        <div className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          {showSearch ? (
            <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
              <Search size={14} className="shrink-0 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm text-gray-900 outline-none focus:outline-none focus:ring-0 placeholder:text-gray-400 font-body"
              />
            </div>
          ) : null}

          <div className="max-h-56 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400 font-body">
                Tidak ditemukan
              </p>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.code === value;
                return (
                  <button
                    type="button"
                    key={option.code}
                    onClick={() => handleSelect(option.code)}
                    className={`block w-full px-4 py-2.5 text-left text-sm font-body transition hover:bg-brand/10 hover:text-brand ${
                      isSelected
                        ? "bg-brand/10 font-medium text-brand"
                        : "text-gray-900"
                    }`}
                  >
                    {option.name}
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}