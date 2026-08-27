import { CheckCircle2, Clock, FileText, Users } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import AdminStatsGrid from "@/components/dashboard/admin/AdminStatsGrid";
import JobsTable from "@/components/dashboard/admin/jobs/JobsTable";
import type { AdminJobsData } from "@/types/admin-jobs";

const statIcons = { total: FileText, aktif: CheckCircle2, matched: Users, expired: Clock };

export default function AdminJobsView({ data }: { data: AdminJobsData }) {
  const stats = data.stats.map((stat) => ({ ...stat, icon: statIcons[stat.id as keyof typeof statIcons] ?? FileText }));
  return (
    <>
      <PageHeader title="Manajemen Lowongan Kerja" subtitle="Tinjau seluruh kebutuhan tenaga kerja UMKM yang tayang di sistem." userName={data.adminName} avatarUrl={data.adminAvatarUrl} />
      <div className="flex flex-col gap-6"><AdminStatsGrid stats={stats} /><JobsTable rows={data.rows} /></div>
    </>
  );
}
