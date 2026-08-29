"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

type DatePickerProps = {
  id: string;
  name: string;
  label?: string;
  value: string; // format "YYYY-MM-DD", sama seperti <input type="date">
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  minDate?: string; // "YYYY-MM-DD", default: hari ini (deadline nggak boleh masa lalu)
  placeholder?: string;
  labelClassName?: string;
  className?: string;
};

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const WEEKDAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseISODate(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarGrid(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const cells: Date[] = [];

  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push(new Date(year, month, -i));
  }
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  while (cells.length < 42) {
    const last = cells[cells.length - 1];
    cells.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
  }
  return cells;
}

export default function DatePicker({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  minDate,
  placeholder = "Pilih tanggal",
  labelClassName = "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500",
  className,
}: DatePickerProps) {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const effectiveMinDate = useMemo(
    () => parseISODate(minDate ?? toISODate(today)) ?? today,
    [minDate, today],
  );

  const selectedDate = parseISODate(value);
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => selectedDate ?? today);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function openPicker() {
    if (disabled) return;
    setViewDate(selectedDate ?? today);
    setIsOpen(true);
  }

  function changeMonth(delta: number) {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  function handlePick(date: Date) {
    if (date < effectiveMinDate) return;
    onChange(toISODate(date));
    setIsOpen(false);
  }

  const cells = useMemo(
    () => buildCalendarGrid(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate],
  );

  const displayLabel = selectedDate
    ? `${selectedDate.getDate()} ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
    : placeholder;

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      {label ? (
        <label htmlFor={id} className={labelClassName}>
          <span>
            {label} {required ? <span className="text-red-500">*</span> : null}
          </span>
        </label>
      ) : null}

      <button
        type="button"
        id={id}
        onClick={openPicker}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`flex w-full items-center justify-between rounded-lg bg-canvas px-4 py-3 text-left text-sm font-body outline-none transition focus:ring-2 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-60 ${
          isOpen ? "ring-2 ring-brand/30" : ""
        }`}
      >
        <span className={selectedDate ? "text-ink" : "text-ink-muted"}>{displayLabel}</span>
        <Calendar size={16} className="shrink-0 text-ink-muted" />
      </button>

      {/* Input asli tersembunyi (sr-only, bukan display:none) supaya "required"
         tetap divalidasi browser dan value ini yang beneran ke-submit. */}
      <input
        type="text"
        id={`${id}-value`}
        name={name}
        required={required}
        value={value}
        onChange={() => {}}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {isOpen ? (
        <div className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-xl border border-hairline bg-card shadow-xl">
          <div className="flex items-center justify-between px-4 pt-4">
            <p className="font-display text-sm font-black text-ink">
              {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
            </p>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="rounded-lg p-1.5 text-ink-muted transition hover:bg-brand/10 hover:text-brand"
                aria-label="Bulan sebelumnya"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="rounded-lg p-1.5 text-ink-muted transition hover:bg-brand/10 hover:text-brand"
                aria-label="Bulan berikutnya"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-1 px-4 pt-3 text-center text-xs font-bold text-ink-muted">
            {WEEKDAY_LABELS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 px-4 pb-2 pt-1 text-center text-sm font-body">
            {cells.map((cellDate) => {
              const inCurrentMonth = cellDate.getMonth() === viewDate.getMonth();
              const isSelected = selectedDate ? isSameDay(cellDate, selectedDate) : false;
              const isToday = isSameDay(cellDate, today);
              const isDisabled = cellDate < effectiveMinDate;

              return (
                <button
                  key={cellDate.toISOString()}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handlePick(cellDate)}
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full transition ${
                    isSelected
                      ? "bg-brand font-bold text-white"
                      : isDisabled
                        ? "cursor-not-allowed text-ink-muted/40"
                        : inCurrentMonth
                          ? "text-ink hover:bg-brand/10 hover:text-brand"
                          : "text-ink-muted/50 hover:bg-brand/10 hover:text-brand"
                  } ${isToday && !isSelected ? "border border-brand" : ""}`}
                >
                  {cellDate.getDate()}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-hairline px-4 py-2.5 text-sm font-semibold">
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-ink-muted transition hover:text-brand"
            >
              Hapus
            </button>
            <button
              type="button"
              onClick={() => handlePick(today)}
              disabled={today < effectiveMinDate}
              className="text-brand transition hover:text-brand disabled:cursor-not-allowed disabled:text-ink-muted/40"
            >
              Hari ini
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}