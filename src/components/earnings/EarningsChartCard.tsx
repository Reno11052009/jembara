"use client";

import { useState } from "react";
import { EarningsChartPoint } from "@/types/earnings";
import EarningsChartRangeTabs from "@/components/earnings/EarningsChartRangeTabs";
import EarningsBarChart from "@/components/earnings/EarningsBarChart";

interface EarningsChartCardProps {
  data: EarningsChartPoint[];
}

export default function EarningsChartCard({ data }: EarningsChartCardProps) {
  const [range, setRange] = useState<"6 Bulan" | "1 Tahun" | "Semua">("6 Bulan");

  return (
    <div className="rounded-xl border border-hairline bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-black text-ink">Grafik Pendapatan</h2>
        <EarningsChartRangeTabs active={range} onChange={setRange} />
      </div>
      <div className="mt-6">
        <EarningsBarChart data={data} />
      </div>
    </div>
  );
}