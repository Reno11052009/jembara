import { TransactionMessage } from "@/types/admin-chat-monitoring";

export default function TransactionMessageBubble({ message }: { message: TransactionMessage }) {
  if (message.flagged) {
    return (
      <div className="ml-auto w-fit max-w-md rounded-xl border border-danger bg-danger-soft/60 p-4">
        <p className="text-sm font-bold text-danger">
          {message.senderName} {message.senderRole}{" "}
          {message.flaggedLabel && <span>{message.flaggedLabel}</span>}
        </p>
        <p className="mt-1.5 text-sm text-ink">{message.content}</p>
        {message.detectionNote && (
          <p className="mt-2 text-xs font-semibold italic text-danger">{message.detectionNote}</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-fit max-w-md rounded-xl bg-canvas p-4">
      <p className="text-sm font-bold text-ink">
        {message.senderName} {message.senderRole}
      </p>
      <p className="mt-1.5 text-sm text-ink">{message.content}</p>
    </div>
  );
}
