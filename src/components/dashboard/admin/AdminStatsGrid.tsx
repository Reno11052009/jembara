import AdminStatCard from "@/components/dashboard/admin/AdminStatCard";
import { AdminStat } from "@/types/admin-dashboard";

const columnClasses: Record<number, string> = {
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

export default function AdminStatsGrid({ stats }: { stats: AdminStat[] }) {
  const columns = columnClasses[stats.length] ?? columnClasses[5];

  return (
    <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${columns}`}>
      {stats.map((stat) => (
        <AdminStatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
