"use client";

import { useState } from "react";
import { UserGrowthPoint } from "@/types/admin-dashboard";

// Skala sumbu-Y statis mengikuti mockup (0/6K/9K/12K/15K), sama seperti
// pola di EarningsBarChart. Sesuaikan manual kalau nanti ada nilai > 15K.
const Y_AXIS_LABELS = ["15K", "12K", "9K", "6K", "0"];
const MAX_VALUE = 15000;

function formatShort(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return `${value}`;
}

export default function UserGrowthBarChart({ data }: { data: UserGrowthPoint[] }) {
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
            <div key={label} className="border-t border-dashed border-hairline" />
          ))}
        </div>

        <div className="relative flex h-64 items-end justify-between gap-4 px-2">
          {data.map((point, index) => {
            const isActive =
              hoveredIndex === index || (hoveredIndex === null && index === lastIndex);
            const heightPercent = (point.value / MAX_VALUE) * 100;

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
                    {formatShort(point.value)}
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
