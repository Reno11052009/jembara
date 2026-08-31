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
}

export default function MessagesView({
  conversations,
  conversationMessages,
  selectedConversationId: initialSelectedConversationId,
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

  return (
    <div className="flex h-full">
      <ConversationListPanel
        conversations={conversations}
        selectedConversationId={initialSelectedConversationId}
        onSelectConversation={handleSelectConversation}
      />
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
        />
      ) : (
        <div className="flex flex-1 items-center justify-center bg-card">
          <p className="font-body text-sm text-ink-muted">Pilih percakapan.</p>
        </div>
      )}
    </div>
  );
}
