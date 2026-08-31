import { Conversation, ChatMessage } from "@/types/messages";
import ChatHeader from "@/components/messages/ChatHeader";
import ChatThread from "@/components/messages/ChatThread";
import ChatComposer from "@/components/messages/ChatComposer";

interface ChatPanelProps {
  conversation: Conversation;
  messages: ChatMessage[];
}

export default function ChatPanel({ conversation, messages }: ChatPanelProps) {
  return (
    <div className="flex h-full flex-1 flex-col bg-card">
      <ChatHeader conversation={conversation} />
      <ChatThread messages={messages} />
      <ChatComposer
        key={conversation.id}
        conversationId={conversation.id}
        canSend={conversation.canSend}
      />
    </div>
  );
}