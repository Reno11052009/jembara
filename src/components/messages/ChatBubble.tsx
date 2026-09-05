import { Check, CheckCheck, Download, FileText } from "lucide-react";
import { formatMessageAttachmentSize } from "@/lib/message-attachment-policy";
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

  return <CheckCheck size={14} className="text-sky-300" />;
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
        {message.attachment ? (
          <a
            href={message.attachment.downloadUrl}
            aria-label={`Unduh ${message.attachment.fileName}`}
            className={`flex min-w-56 items-center gap-3 rounded-xl p-3 text-sm transition-colors ${
              isMe
                ? "bg-white/15 hover:bg-white/25"
                : "bg-card hover:bg-hairline"
            }`}
          >
            <FileText size={24} className="shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">
                {message.attachment.fileName}
              </span>
              <span
                className={`block text-xs ${
                  isMe ? "text-white/70" : "text-ink-muted"
                }`}
              >
                {formatMessageAttachmentSize(message.attachment.sizeBytes)}
              </span>
            </span>
            <Download size={18} className="shrink-0" />
          </a>
        ) : (
          <p>{message.text}</p>
        )}
        <span
          className={`mt-5 flex items-center justify-end gap-1 text-right text-sm ${
            isMe ? "text-white/70" : "text-ink"
          }`}
        >
          {message.timeLabel}
          {message.deliveryStatus === "sending" ? " · Mengirim…" : ""}
          {isMe && <MessageStatusTicks status={message.status} />}
        </span>
      </div>
    </div>
  );
}
