"use client";

import { useState } from "react";
import { EarningsChartPoint } from "@/types/earnings";

interface EarningsBarChartProps {
  data: EarningsChartPoint[];
}

// Skala sumbu-Y statis mengikuti mockup (interval nggak rata: 0/600K/1.2M/
// 1.8M/2.5M) — bukan dihitung otomatis dari data. Kalau nanti ada nilai
// amount > 2.5M, label ini perlu disesuaikan manual.
const Y_AXIS_LABELS = ["Rp 2.5M", "Rp 1.8M", "Rp 1.2M", "Rp 600K", "Rp 0"];
const MAX_VALUE = 2500000;

function formatShort(value: number) {
  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(2).replace(/\.?0+$/, "")}M`;
  }
  return `Rp ${(value / 1000).toFixed(0)}K`;
}

export default function EarningsBarChart({ data }: EarningsBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const lastIndex = data.length - 1;

  return (
    <div className="flex gap-4">
      <div className="flex flex-col justify-between py-1 text-right font-body text-xs text-ink-muted">
        {Y_AXIS_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="relative flex-1">
        <div className="absolute inset-0 flex flex-col justify-between">
          {Y_AXIS_LABELS.map((label) => (
            <div key={label} className="border-t border-hairline" />
          ))}
        </div>

        <div className="relative flex h-64 items-end justify-between gap-4 px-2">
          {data.map((point, index) => {
            const isActive =
              hoveredIndex === index || (hoveredIndex === null && index === lastIndex);
            const heightPercent = (point.amount / MAX_VALUE) * 100;

            return (
              <div
              key={point.label}
              className="relative flex h-full flex-1 flex-col items-center justify-end"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {isActive && (
                <span
                  className="absolute mb-2 whitespace-nowrap rounded-md bg-ink px-2.5 py-1 font-body text-xs font-bold text-white"
                  style={{ bottom: `${heightPercent}%` }}
                >
                  {formatShort(point.amount)}
                </span>
              )}

              <div
                className={`w-10 rounded-t-md transition-colors ${
                  isActive ? "bg-brand" : "bg-brand/40"
                }`}
                style={{ height: `${heightPercent}%` }}
              />
            </div>
            );
          })}
        </div>

        <div className="mt-2 flex justify-between gap-4 px-2">
          {data.map((point) => (
            <span
              key={point.label}
              className="flex-1 text-center font-body text-xs font-semibold text-ink"
            >
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}