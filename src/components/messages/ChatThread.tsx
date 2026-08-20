import { ChatMessage } from "@/types/messages";
import ChatBubble from "@/components/messages/ChatBubble";
import ChatDateDivider from "@/components/messages/ChatDateDivider";

interface ChatThreadProps {
  messages: ChatMessage[];
}

export default function ChatThread({ messages }: ChatThreadProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="font-body text-sm text-ink-muted">Belum ada riwayat pesan.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5">
      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <div key={message.id}>
            {message.dateDividerLabel && (
              <ChatDateDivider label={message.dateDividerLabel} />
            )}
            <ChatBubble message={message} />
          </div>
        ))}
      </div>
    </div>
  );
}