import PageHeader from "@/components/layout/PageHeader";
import Footer from "@/components/landing/Footer";
import AdminStatsGrid from "@/components/dashboard/admin/AdminStatsGrid";
import UserGrowthChartCard from "@/components/dashboard/admin/UserGrowthChartCard";
import QuickActionsCard from "@/components/dashboard/admin/QuickActionsCard";
import RecentActivityCard from "@/components/dashboard/admin/RecentActivityCard";
import {
  adminName,
  adminQuickActions,
  adminStats,
  platformActivities,
  userGrowthData,
} from "@/lib/mock-admin-dashboard";

export default function AdminDashboardView() {
  return (
    <>
      <PageHeader
        title="Dashboard Admin Jembatan Karya"
        subtitle="Overview performa operasional, talenta, dan UMKM se-Indonesia hari ini."
        userName={adminName}
      />

      <div className="flex flex-col gap-6">
        <AdminStatsGrid stats={adminStats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <UserGrowthChartCard data={userGrowthData} />
          </div>
          <div>
            <QuickActionsCard actions={adminQuickActions} />
          </div>
        </div>

        <RecentActivityCard activities={platformActivities} />
      </div>

      <div className="-mx-6 mt-10 sm:-mx-8">
        <Footer />
      </div>
    </>
  );
}
