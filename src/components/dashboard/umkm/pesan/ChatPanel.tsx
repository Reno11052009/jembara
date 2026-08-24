import { Conversation, ChatMessage } from "@/types/messages";
import ChatHeader from "@/components/dashboard/umkm/pesan/ChatHeader";
import ChatThread from "@/components/messages/ChatThread";
import ChatComposer from "@/components/dashboard/umkm/pesan/ChatComposer";

interface ChatPanelProps {
  conversation: Conversation;
  messages: ChatMessage[];
  projectLabel?: string;
}

export default function ChatPanel({ conversation, messages, projectLabel }: ChatPanelProps) {
  return (
    <div className="flex h-full flex-1 flex-col bg-card">
      <ChatHeader conversation={conversation} projectLabel={projectLabel} />
      <ChatThread messages={messages} />
      <ChatComposer contactFirstName={conversation.contactName.split(" ")[0]} />
    </div>
  );
}