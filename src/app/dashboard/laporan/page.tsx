import PageHeader from "@/components/layout/PageHeader";
import AdminReportsView from "@/components/dashboard/admin/reports/AdminReportsView";
import { getAdminReportsData } from "@/lib/admin-reports";
export const instant = false;
export default async function ReportsPage() { const data = await getAdminReportsData(); return <><PageHeader title="Moderasi Laporan" subtitle="Tinjau laporan konten dengan status dan catatan keputusan yang dapat diaudit." userName={data.adminName} /><AdminReportsView reports={data.reports} /></>; }
