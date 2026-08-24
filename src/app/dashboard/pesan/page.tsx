import MessagesView from "@/components/dashboard/umkm/pesan/MessagesView";
import { conversations, conversationMessages } from "@/lib/mock-messages";
import { umkmConversations, umkmConversationMessages } from "@/lib/mock-messages-umkm";
import { requireAuthenticatedSession } from "@/lib/auth-guard";

export default async function MessagesPage() {
  const session = await requireAuthenticatedSession();
  const isUmkm = session.role === "UMKM";

// fixed inset-0 ngeluarin elemen ini dari flow sama sekali, jadi nggak
// kepengaruh padding `main` di AppShell.tsx sama sekali (nggak perlu
// hitung ulang kalau padding AppShell berubah). lg:left-60 nggeser
// sesuai lebar Sidebar (w-60) yang cuma tampil di layar lg ke atas.
  return (
    <div className="fixed inset-0 lg:left-60">
      <MessagesView
        conversations={isUmkm ? umkmConversations : conversations}
        conversationMessages={isUmkm ? umkmConversationMessages : conversationMessages}
        projectLabel={isUmkm ? "Lowongan" : "Project"}
      />
    </div>
  );
}