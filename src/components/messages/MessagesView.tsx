"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markMessagesAsReadAction } from "@/app/actions/messages";
import { Conversation, ChatMessage } from "@/types/messages";
import ConversationListPanel from "@/components/messages/ConversationListPanel";
import ChatPanel from "@/components/messages/ChatPanel";

interface MessagesViewProps {
  conversations: Conversation[];
  conversationMessages: Record<string, ChatMessage[]>;
  selectedConversationId: string;
  attachmentsEnabled?: boolean;
}

export default function MessagesView({
  conversations,
  conversationMessages,
  selectedConversationId: initialSelectedConversationId,
  attachmentsEnabled = true,
}: MessagesViewProps) {
  const router = useRouter();
  const selectedConversation = conversations.find(
    (conversation) => conversation.id === initialSelectedConversationId,
  );

  useEffect(() => {
    if (!selectedConversation?.unread) return;
    void markMessagesAsReadAction(selectedConversation.id);
  }, [selectedConversation?.id, selectedConversation?.unread]);

  const handleSelectConversation = (id: string) => {
    router.replace(`/dashboard/messages?project=${encodeURIComponent(id)}`, {
      scroll: false,
    });
  };

  const handleBackToList = () => {
    router.replace(`/dashboard/messages`, {
      scroll: false,
    });
  };

  const hasSelected = Boolean(initialSelectedConversationId && selectedConversation);

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* 
        Di layar mobile (< lg):
        - Jika belum ada obrolan dipilih (!hasSelected), tampilkan daftar percakapan.
        - Jika obrolan dipilih (hasSelected), tampilkan ChatPanel saja dengan tombol kembali.
        Di layar desktop (>= lg): Tampilkan kedua panel bersisian.
      */}
      <div
        className={`h-full w-full lg:w-90 shrink-0 ${
          hasSelected ? "hidden lg:block" : "block"
        }`}
      >
        <ConversationListPanel
          conversations={conversations}
          selectedConversationId={initialSelectedConversationId}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      <div
        className={`h-full flex-1 ${
          hasSelected ? "block" : "hidden lg:block"
        }`}
      >
        {selectedConversation ? (
          <ChatPanel
            key={
              selectedConversation.id +
              ":" +
              ((conversationMessages[selectedConversation.id] ?? []).at(-1)?.id ??
                "empty")
            }
            conversation={selectedConversation}
            messages={conversationMessages[selectedConversation.id] ?? []}
            onBack={handleBackToList}
            attachmentsEnabled={attachmentsEnabled}
          />
        ) : (
          <div className="flex h-full flex-1 items-center justify-center bg-card p-6 text-center">
            <p className="font-body text-sm text-ink-muted">
              Pilih percakapan untuk memulai obrolan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
