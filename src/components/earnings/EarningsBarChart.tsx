"use client";

import { useState } from "react";
import { EarningsChartPoint } from "@/types/earnings";

interface EarningsBarChartProps {
  data: EarningsChartPoint[];
}

function formatShort(value: number) {
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  }
  if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}K`;
  return `Rp ${Math.round(value)}`;
}

function calculateAxisMax(data: EarningsChartPoint[]) {
  const highestValue = Math.max(0, ...data.map((point) => point.amount));
  if (highestValue === 0) return 1_000_000;

  const magnitude = 10 ** Math.floor(Math.log10(highestValue));
  const normalized = highestValue / magnitude;
  const rounded =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return rounded * magnitude;
}

export default function EarningsBarChart({ data }: EarningsBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const lastIndex = data.length - 1;
  const axisMax = calculateAxisMax(data);
  const yAxisLabels = [1, 0.75, 0.5, 0.25, 0].map((ratio) =>
    formatShort(axisMax * ratio),
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      <div className="flex shrink-0 flex-col justify-between py-1 text-right font-body text-xs text-ink-muted">
        {yAxisLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div
        className="relative flex-1"
        style={{ minWidth: `${Math.max(480, data.length * 72)}px` }}
      >
        <div className="absolute inset-0 flex flex-col justify-between">
          {yAxisLabels.map((label) => (
            <div key={label} className="border-t border-hairline" />
          ))}
        </div>

        <div className="relative flex h-64 items-end justify-between gap-4 px-2">
          {data.map((point, index) => {
            const isActive =
              hoveredIndex === index ||
              (hoveredIndex === null && index === lastIndex);
            const heightPercent = Math.min(100, (point.amount / axisMax) * 100);

            return (
              <div
                key={point.period}
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
              key={point.period}
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
