import { Conversation } from "@/types/messages";

interface ConversationListItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ConversationListItem({
  conversation,
  isSelected,
  onSelect,
}: ConversationListItemProps) {
  const initials = conversation.contactName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
        isSelected ? "bg-canvas" : "hover:bg-canvas/60"
      }`}
    >
      <span className="relative h-11 w-11 shrink-0 rounded-full bg-brand-soft flex items-center justify-center text-sm font-display font-black text-brand">
        {initials}
        {conversation.unread && (
          <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-brand" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`truncate font-display text-sm text-ink ${
              conversation.unread ? "font-black" : "font-bold"
            }`}
          >
            {conversation.contactName}
          </p>
          <span className="shrink-0 text-[11px] text-ink-muted">
            {conversation.timeLabel}
          </span>
        </div>
        <p
          className={`mt-0.5 truncate font-body text-xs ${
            conversation.unread ? "font-semibold text-ink" : "text-ink-muted"
          }`}
        >
          {conversation.lastMessagePreview}
        </p>
      </div>
    </button>
  );
}