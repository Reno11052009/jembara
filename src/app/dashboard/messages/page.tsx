import MessagesView from "@/components/messages/MessagesView";
import { getMessagesData } from "@/lib/messages";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string | string[] }>;
}) {
  const rawProjectId = (await searchParams).project;
  const projectId = Array.isArray(rawProjectId) ? rawProjectId[0] : rawProjectId;
  const { conversations, conversationMessages, selectedConversationId } =
    await getMessagesData(projectId);

  return (
// fixed inset-0 ngeluarin elemen ini dari flow sama sekali, jadi nggak
// kepengaruh padding `main` di AppShell.tsx sama sekali (nggak perlu
// hitung ulang kalau padding AppShell berubah). lg:left-60 nggeser
// sesuai lebar Sidebar (w-60) yang cuma tampil di layar lg ke atas.
    <div className="fixed inset-0 lg:left-60">
      <MessagesView
        conversations={conversations}
        conversationMessages={conversationMessages}
        selectedConversationId={selectedConversationId}
      />
    </div>
  );
}
