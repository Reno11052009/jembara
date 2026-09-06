"use client";

import UserGrowthBarChart from "@/components/dashboard/admin/UserGrowthBarChart";
import { UserGrowthPoint } from "@/types/admin-dashboard";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function UserGrowthChartCard({ data }: { data: UserGrowthPoint[] }) {
  const { dict } = usePreferences();

  const periodLabel =
    dict.sidebar.dashboard === "Dashboard"
      ? dict.landing.nav.login === "Log In"
        ? "Last 6 Months"
        : dict.landing.nav.login === "ログイン"
        ? "過去6ヶ月"
        : "6 Bulan Terakhir"
      : "6 Bulan Terakhir";

  return (
    <div className="rounded-xl border border-hairline bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-black text-ink">
          {dict.admin.userGrowthTitle}
        </h2>
        <span className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
          {periodLabel}
        </span>
      </div>
      <div className="mt-6">
        <UserGrowthBarChart data={data} />
      </div>
    </div>
  );
}
