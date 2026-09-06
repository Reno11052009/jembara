import OwnerDashboardView from "@/components/dashboard/umkm/OwnerDashboardView";
import AdminDashboardView from "@/components/dashboard/admin/AdminDashboardView";
import StudentDashboardView from "@/components/dashboard/StudentDashboardView";
import { getDashboardData } from "@/lib/dashboard";

export const instant = false;

export default async function DashboardPage() {
  const dashboard = await getDashboardData();

  if (dashboard.role === "UMKM") {
    if (!dashboard.umkmOverview) {
      throw new Error("Data dashboard UMKM tidak tersedia");
    }

    return (
      <OwnerDashboardView
        ownerName={dashboard.userName}
        ownerAvatarUrl={dashboard.avatarUrl}
        data={dashboard.umkmOverview}
      />
    );
  }

  if (dashboard.role === "ADMIN") {
    if (!dashboard.adminOverview) {
      throw new Error("Data dashboard admin tidak tersedia");
    }

    return (
      <AdminDashboardView
        adminName={dashboard.userName}
        data={dashboard.adminOverview}
      />
    );
  }

  return <StudentDashboardView dashboard={dashboard} />;
}