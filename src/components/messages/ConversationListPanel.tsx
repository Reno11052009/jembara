"use client";

import { useState } from "react";
import { Conversation, ConversationFilterValue } from "@/types/messages";
import ConversationSearchBar from "@/components/messages/ConversationSearchBar";
import ConversationFilterTabs from "@/components/messages/ConversationFilterTabs";
import ConversationListItem from "@/components/messages/ConversationListItem";

interface ConversationListPanelProps {
  conversations: Conversation[];
  selectedConversationId: string;
  onSelectConversation: (id: string) => void;
}

export default function ConversationListPanel({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationListPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ConversationFilterValue>("Semua");

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.contactName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "Semua"
        ? true
        : activeFilter === "Belum Dibaca"
        ? conversation.unread
        : Boolean(conversation.projectName);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex h-full w-full lg:w-90 shrink-0 flex-col border-r border-hairline bg-card">
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <h1 className="font-display text-xl sm:text-2xl font-black text-ink">Pesan</h1>
        <ConversationSearchBar value={searchQuery} onChange={setSearchQuery} />
        <ConversationFilterTabs active={activeFilter} onChange={setActiveFilter} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <p className="px-5 py-6 text-center font-body text-sm text-ink-muted">
            Nggak ada percakapan yang cocok.
          </p>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isSelected={conversation.id === selectedConversationId}
              onSelect={() => onSelectConversation(conversation.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}