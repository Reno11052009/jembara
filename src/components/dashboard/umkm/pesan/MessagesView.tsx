"use client";

import { useState } from "react";
import { Conversation, ChatMessage } from "@/types/messages";
import ConversationListPanel from "@/components/messages/ConversationListPanel";
import ChatPanel from "@/components/dashboard/umkm/pesan/ChatPanel";

interface MessagesViewProps {
  conversations: Conversation[];
  conversationMessages: Record<string, ChatMessage[]>;
  projectLabel?: string;
}

export default function MessagesView({
  conversations,
  conversationMessages,
  projectLabel,
}: MessagesViewProps) {
  const [selectedConversationId, setSelectedConversationId] = useState(
    conversations[0]?.id ?? ""
  );

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  return (
    <div className="flex h-full">
      <ConversationListPanel
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
      />
      {selectedConversation ? (
        <ChatPanel
          conversation={selectedConversation}
          messages={conversationMessages[selectedConversation.id] ?? []}
          projectLabel={projectLabel}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center bg-card">
          <p className="font-body text-sm text-ink-muted">Pilih percakapan.</p>
        </div>
      )}
    </div>
  );
}