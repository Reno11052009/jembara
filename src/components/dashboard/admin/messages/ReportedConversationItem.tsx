import { ReportedConversation } from "@/types/admin-chat-monitoring";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ReportedConversationItem({
  conversation,
}: {
  conversation: ReportedConversation;
}) {
  const isSensitive = conversation.tag === "sensitif";

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl border p-4 ${
        isSensitive ? "border-danger bg-danger-soft/40" : "border-hairline bg-canvas"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-xs font-black text-brand">
          {getInitials(conversation.participantsLabel)}
        </span>
        <div>
          <p className="font-display text-sm font-bold text-ink">
            {conversation.participantsLabel}
          </p>
          <p className="mt-0.5 text-xs text-ink-muted">{conversation.previewMessage}</p>
        </div>
      </div>

      <span
        className={`shrink-0 text-xs font-bold uppercase ${
          isSensitive ? "text-danger" : "text-ink-muted"
        }`}
      >
        {isSensitive ? "Sensitif" : "Aman"}
      </span>
    </div>
  );
}
