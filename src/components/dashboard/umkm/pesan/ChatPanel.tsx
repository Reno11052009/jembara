"use client";

import { useState } from "react";
import { Conversation, ChatMessage } from "@/types/messages";
import ChatHeader from "@/components/dashboard/umkm/pesan/ChatHeader";
import ChatThread from "@/components/messages/ChatThread";
import ChatComposer from "@/components/dashboard/umkm/pesan/ChatComposer";
import ContactProfileModal from "@/components/messages/ContactProfileModal";

interface ChatPanelProps {
  conversation: Conversation;
  messages: ChatMessage[];
  projectLabel?: string;
}

export default function ChatPanel({ conversation, messages, projectLabel }: ChatPanelProps) {
  const [displayMessages, setDisplayMessages] = useState(messages);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  function handleClearChat() {
    setDisplayMessages([]);
  }

  function handleToggleBlock() {
    setIsBlocked((prev) => {
      const nextBlocked = !prev;
      const systemMessage: ChatMessage = {
        id: "system-block-" + Date.now(),
        sender: "contact",
        text: nextBlocked
          ? "🔒 Kamu telah memblokir kontak ini."
          : "🔓 Kamu telah membuka blokir kontak ini.",
        timeLabel: new Intl.DateTimeFormat("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      };
      setDisplayMessages((curr) => [...curr, systemMessage]);
      return nextBlocked;
    });
  }

  return (
    <div className="flex h-full flex-1 flex-col bg-card">
      <ChatHeader
        conversation={conversation}
        projectLabel={projectLabel}
        onViewProfile={() => setIsProfileOpen(true)}
        onClearChat={handleClearChat}
        onToggleBlock={handleToggleBlock}
        isBlocked={isBlocked}
      />
      <ChatThread messages={displayMessages} />
      {isBlocked && (
        <div className="border-t border-hairline bg-danger-soft/40 px-6 py-2.5 text-center text-xs font-medium text-danger">
          Kontak ini telah diblokir. Buka blokir dari menu opsi di atas untuk mengirim pesan kembali.
        </div>
      )}
      <ChatComposer contactFirstName={conversation.contactName.split(" ")[0]} />

      <ContactProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        conversation={conversation}
      />
    </div>
  );
}