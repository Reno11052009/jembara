"use client";

import { useState } from "react";
import { Conversation, ChatMessage } from "@/types/messages";
import ChatHeader from "@/components/messages/ChatHeader";
import ChatThread from "@/components/messages/ChatThread";
import ChatComposer from "@/components/messages/ChatComposer";

interface ChatPanelProps {
  conversation: Conversation;
  messages: ChatMessage[];
}

export default function ChatPanel({ conversation, messages }: ChatPanelProps) {
  const [displayMessages, setDisplayMessages] = useState(messages);

  function addOptimisticMessage(message: ChatMessage) {
    setDisplayMessages((currentMessages) => {
      const hasTodayDivider = currentMessages.some(
        ({ dateDividerLabel }) => dateDividerLabel === "Hari ini",
      );
      return [
        ...currentMessages,
        {
          ...message,
          ...(!hasTodayDivider ? { dateDividerLabel: "Hari ini" } : {}),
        },
      ];
    });
  }

  function confirmOptimisticMessage(messageId: string) {
    setDisplayMessages((currentMessages) =>
      currentMessages.map((message) =>
        message.id === messageId
          ? { ...message, deliveryStatus: undefined }
          : message,
      ),
    );
  }

  function removeOptimisticMessage(messageId: string) {
    setDisplayMessages((currentMessages) =>
      currentMessages.filter(({ id }) => id !== messageId),
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col bg-card">
      <ChatHeader conversation={conversation} />
<<<<<<< HEAD
      <ChatThread messages={messages} />
      <ChatComposer
        key={conversation.id}
        conversationId={conversation.id}
        canSend={conversation.canSend}
=======
      <ChatThread messages={displayMessages} />
      <ChatComposer
        conversationId={conversation.id}
        canSend={conversation.canSend}
        onOptimisticSend={addOptimisticMessage}
        onSendSuccess={confirmOptimisticMessage}
        onSendError={removeOptimisticMessage}
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
      />
    </div>
  );
}
