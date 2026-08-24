import AdminStatCard from "@/components/dashboard/admin/AdminStatCard";
import { AdminStat } from "@/types/admin-dashboard";

export default function AdminStatsGrid({ stats }: { stats: AdminStat[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <AdminStatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
