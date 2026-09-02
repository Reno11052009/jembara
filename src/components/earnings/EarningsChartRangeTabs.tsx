"use client";

type RangeValue = "6 Bulan" | "1 Tahun" | "Semua";

interface EarningsChartRangeTabsProps {
  active: RangeValue;
  onChange: (value: RangeValue) => void;
}

const ranges: RangeValue[] = ["6 Bulan", "1 Tahun", "Semua"];

export default function EarningsChartRangeTabs({
  active,
  onChange,
}: EarningsChartRangeTabsProps) {
  return (
    <div className="flex gap-2">
      {ranges.map((range) => {
        const isActive = range === active;
        return (
          <button
            key={range}
            onClick={() => onChange(range)}
            className={`rounded-full px-4 py-2 text-sm font-body font-semibold transition-colors ${
              isActive
                ? "bg-ink text-white dark:text-canvas"
                : "border border-hairline bg-card text-ink hover:border-brand hover:text-brand"
            }`}
          >
            {range}
          </button>
        );
      })}
    </div>
  );
}