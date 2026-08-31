import { Check, CheckCheck } from "lucide-react";
import { ChatMessage } from "@/types/messages";

interface ChatBubbleProps {
  message: ChatMessage;
}

// Centang gaya WhatsApp — cuma buat pesan yang kita kirim (isMe), soalnya
// yang butuh tau status kirim/terbaca ya cuma pengirimnya sendiri.
// Bubble isMe bg-nya solid brand (oranye), jadi centang "belum dibaca"
// dibikin agak redup (text-white/60, keliatan abu-abu di atas oranye)
// dan centang "sudah dibaca" full text-white biar kontras & jelas beda.
function MessageStatusTicks({ status }: { status: ChatMessage["status"] }) {
  if (!status) return null;

  if (status === "sent") {
    return <Check size={14} className="text-white/60" />;
  }

  if (status === "delivered") {
    return <CheckCheck size={14} className="text-white/60" />;
  }

  return <CheckCheck size={14} className="text-white" />;
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
<<<<<<< HEAD
          className={`mt-5 flex items-center justify-end gap-1 text-right text-sm ${
=======
          className={`mt-5 block text-right text-sm ${
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
            isMe ? "text-white/70" : "text-ink"
          }`}
        >
          {message.timeLabel}
<<<<<<< HEAD
          {isMe && <MessageStatusTicks status={message.status} />}
=======
          {message.deliveryStatus === "sending" ? " · Mengirim…" : ""}
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
        </span>
      </div>
    </div>
  );
}
