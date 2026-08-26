import ReportedConversationItem from "@/components/dashboard/admin/messages/ReportedConversationItem";
import { ReportedConversation } from "@/types/admin-chat-monitoring";

export default function ReportedConversationsList({
  conversations,
}: {
  conversations: ReportedConversation[];
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-hairline bg-card p-6">
      <h2 className="font-display text-lg font-black text-ink">Daftar Percakapan Dilaporkan</h2>
      <div className="flex flex-col gap-3">
        {conversations.map((conversation) => (
          <ReportedConversationItem key={conversation.id} conversation={conversation} />
        ))}
      </div>
    </div>
  );
}
