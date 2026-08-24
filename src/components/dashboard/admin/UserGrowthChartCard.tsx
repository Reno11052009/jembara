import UserGrowthBarChart from "@/components/dashboard/admin/UserGrowthBarChart";
import { UserGrowthPoint } from "@/types/admin-dashboard";

export default function UserGrowthChartCard({ data }: { data: UserGrowthPoint[] }) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-black text-ink">
          Grafik Pertumbuhan Pengguna
        </h2>
        <span className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
          6 Bulan Terakhir
        </span>
      </div>
      <div className="mt-6">
        <UserGrowthBarChart data={data} />
      </div>
    </div>
  );
}
