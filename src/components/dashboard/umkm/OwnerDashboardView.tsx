import { Briefcase, CheckCircle2, FileText, Users } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import OwnerStatsGrid from "@/components/dashboard/umkm/OwnerStatsGrid";
import RecentJobListings from "@/components/dashboard/umkm/RecentJobListings";
import RecentApplicants from "@/components/dashboard/umkm/RecentApplicants";
import type { DashboardStat } from "@/types/dashboard";
import type { OwnerDashboardOverview } from "@/types/umkm-owner-dashboard";

const statIcons = {
  "lowongan-aktif": FileText,
  "total-pelamar": Users,
  "proyek-berjalan": Briefcase,
  "proyek-selesai": CheckCircle2,
};

interface OwnerDashboardViewProps {
  ownerName: string;
  ownerAvatarUrl: string;
  data: OwnerDashboardOverview;
}

export default function OwnerDashboardView({
  ownerName,
  ownerAvatarUrl,
  data,
}: OwnerDashboardViewProps) {
  const stats: DashboardStat[] = data.stats.map((stat) => ({
    ...stat,
    icon: statIcons[stat.id as keyof typeof statIcons] ?? Briefcase,
  }));

  return (
    <>
      <PageHeader
        title={`Halo, ${ownerName}!`}
        subtitle={`Selamat datang di dashboard bisnis ${data.businessName}. Pantau aktivitas pencarian talenta Anda.`}
        userName={ownerName}
        avatarUrl={ownerAvatarUrl}
      />

      <div className="flex flex-col gap-6">
        <OwnerStatsGrid stats={stats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentJobListings listings={data.recentJobListings} />
          </div>
          <div>
            <RecentApplicants applicants={data.recentApplicants} />
          </div>
        </div>
      </div>
    </>
  );
}