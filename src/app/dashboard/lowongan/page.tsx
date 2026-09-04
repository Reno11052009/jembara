import AdminJobsView from "@/components/dashboard/admin/jobs/AdminJobsView";
import { getAdminJobsData } from "@/lib/admin";

export const instant = false;

export default async function LowonganPage() {
  const data = await getAdminJobsData();
  return <AdminJobsView data={data} />;
}
