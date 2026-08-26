import PageHeader from "@/components/layout/PageHeader";
import Footer from "@/components/landing/Footer";
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

      <div className="-mx-6 mt-10 sm:-mx-8">
        <Footer />
      </div>
    </>
  );
}
