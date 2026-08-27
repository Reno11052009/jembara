import PageHeader from "@/components/layout/PageHeader";
import AdminStatsGrid from "@/components/dashboard/admin/AdminStatsGrid";
import ReportedConversationsList from "@/components/dashboard/admin/messages/ReportedConversationsList";
import ReportedTransactionPanel from "@/components/dashboard/admin/messages/ReportedTransactionPanel";
import { adminName } from "@/lib/mock-admin-dashboard";
import {
  chatMonitoringStats,
  reportedConversations,
  reportedTransactionMessages,
} from "@/lib/mock-admin-chat-monitoring";

export default function AdminChatMonitoringView() {
  return (
    <>
      <PageHeader
        title="Monitor Pesan & Komunikasi"
        subtitle="Jaga keamanan transaksi dan obrolan platform dari potensi kecurangan/abuse."
        userName={adminName}
      />

      <div className="flex flex-col gap-6">
        <AdminStatsGrid stats={chatMonitoringStats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ReportedConversationsList conversations={reportedConversations} />
          <ReportedTransactionPanel messages={reportedTransactionMessages} />
        </div>
      </div>
    </>
  );
}