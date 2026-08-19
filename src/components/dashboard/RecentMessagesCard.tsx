import Link from "next/link";
import { MessagePreview } from "@/types/dashboard";

interface RecentMessagesCardProps {
  messages: MessagePreview[];
}

export default function RecentMessagesCard({
  messages,
}: RecentMessagesCardProps) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-display font-black text-ink">Pesan Terbaru</h3>
        <Link
          href="/dashboard/messages"
          className="text-xs font-medium text-brand hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-3 rounded-lg bg-canvas p-4">
            <span className="h-8 w-8 shrink-0 rounded-full bg-hairline" />
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-display font-black text-ink">
                  {message.senderName}
                </p>
                <span className="shrink-0 text-[11px] text-ink-muted">
                  {message.timeLabel}
                </span>
              </div>
              <p className="mt-0.5 truncate text-[12px] text-ink-muted">
                {message.snippet}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}