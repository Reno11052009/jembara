import AdminChatMonitoringView from "@/components/dashboard/admin/messages/AdminChatMonitoringView";
import { getAdminChatMonitoringData } from "@/lib/admin";

export const instant = false;

export default async function MonitorPesanPage() {
  const data = await getAdminChatMonitoringData();
  return <AdminChatMonitoringView data={data} />;
}
