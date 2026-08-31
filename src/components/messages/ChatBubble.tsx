import { ChatMessage } from "@/types/messages";

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isMe = message.sender === "me";

  return (
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 font-body text-xl ${
          isMe ? "bg-brand text-white" : "bg-canvas text-ink"
        }`}
      >
        <p>{message.text}</p>
        <span
          className={`mt-5 block text-right text-sm ${
            isMe ? "text-white/70" : "text-ink"
          }`}
        >
          {message.timeLabel}
          {message.deliveryStatus === "sending" ? " · Mengirim…" : ""}
        </span>
      </div>
    </div>
  );
}
