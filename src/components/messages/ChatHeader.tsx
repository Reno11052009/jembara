import { MoreVertical } from "lucide-react";
import { Conversation } from "@/types/messages";

interface ChatHeaderProps {
  conversation: Conversation;
}

export default function ChatHeader({ conversation }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-display font-black text-brand">
      {conversation.contactName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    
      {conversation.isOnline && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
      )}
    </span>
        <div>
          <p className="font-display text-base font-black text-ink">
            {conversation.contactName}
          </p>
          {conversation.projectName && (
            <p className="font-body text-xs text-ink-muted">
              Project :{" "}
              <span className="font-semibold font-body text-brand">
                {conversation.projectName}
              </span>
            </p>
          )}
        </div>
      </div>
      <button
        aria-label="Opsi lainnya"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline text-ink-muted transition-colors hover:border-brand hover:text-brand"
      >
        <MoreVertical size={16} />
      </button>
    </div>
  );
}