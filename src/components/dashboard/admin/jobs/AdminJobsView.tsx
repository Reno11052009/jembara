import PageHeader from "@/components/layout/PageHeader";
import AdminStatsGrid from "@/components/dashboard/admin/AdminStatsGrid";
import JobsTable from "@/components/dashboard/admin/jobs/JobsTable";
import { adminName } from "@/lib/mock-admin-dashboard";
import { adminJobRows, jobStats } from "@/lib/mock-admin-jobs";

export default function AdminJobsView() {
  return (
    <>
      <PageHeader
        title="Manajemen Lowongan Kerja"
        subtitle="Tinjau seluruh kebutuhan tenaga kerja UMKM yang tayang di sistem."
        userName={adminName}
      />

      <div className="flex flex-col gap-6">
        <AdminStatsGrid stats={jobStats} />
        <JobsTable rows={adminJobRows} />
      </div>
    </>
  );
}