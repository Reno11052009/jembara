import {
  Briefcase,
  Building2,
  FileText,
  ListChecks,
  Users,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import AdminStatsGrid from "@/components/dashboard/admin/AdminStatsGrid";
import UserGrowthChartCard from "@/components/dashboard/admin/UserGrowthChartCard";
import QuickActionsCard from "@/components/dashboard/admin/QuickActionsCard";
import RecentActivityCard from "@/components/dashboard/admin/RecentActivityCard";
import type {
  AdminDashboardOverview,
  AdminQuickAction,
  AdminStat,
} from "@/types/admin-dashboard";

const statIcons = {
  talent: Users,
  umkm: Building2,
  lowongan: FileText,
  proyek: Briefcase,
  proposal: ListChecks,
};

const quickActionIcons = {
  users: Users,
  projects: Briefcase,
  proposals: ListChecks,
};

interface AdminDashboardViewProps {
  adminName: string;
  data: AdminDashboardOverview;
}

export default function AdminDashboardView({
  adminName,
  data,
}: AdminDashboardViewProps) {
  const stats: AdminStat[] = data.stats.map((stat) => ({
    ...stat,
    icon: statIcons[stat.id as keyof typeof statIcons] ?? Briefcase,
  }));
  const quickActions: AdminQuickAction[] = data.quickActions.map((action) => ({
    ...action,
    icon:
      quickActionIcons[action.id as keyof typeof quickActionIcons] ?? ListChecks,
  }));

  return (
    <>
      <PageHeader
        title="Dashboard Admin Jembara"
        subtitle="Overview performa operasional, talenta, dan UMKM se-Indonesia hari ini."
        userName={adminName}
      />

      <div className="flex flex-col gap-6">
        <AdminStatsGrid stats={stats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <UserGrowthChartCard data={data.userGrowthData} />
          </div>
          <div>
            <QuickActionsCard actions={quickActions} />
          </div>
        </div>

        <RecentActivityCard activities={data.platformActivities} />
      </div>
    </>
  );
}