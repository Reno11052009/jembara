"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Paperclip, Send } from "lucide-react";
import { sendMessageAction } from "@/app/actions/messages";
import type { ChatMessage } from "@/types/messages";

interface ChatComposerProps {
  conversationId: string;
  canSend: boolean;
  onOptimisticSend: (message: ChatMessage) => void;
  onSendSuccess: (messageId: string) => void;
  onSendError: (messageId: string) => void;
}

const jakartaClockFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export default function ChatComposer({
  conversationId,
  canSend,
  onOptimisticSend,
  onSendSuccess,
  onSendError,
}: ChatComposerProps) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSend || !draft.trim() || isPending) return;

    const content = draft.trim();
    const optimisticId = `optimistic-${crypto.randomUUID()}`;
    setError("");
    setDraft("");
    onOptimisticSend({
      id: optimisticId,
      sender: "me",
      text: content,
      timeLabel: jakartaClockFormatter.format(new Date()),
      deliveryStatus: "sending",
    });

    startTransition(async () => {
      const result = await sendMessageAction(conversationId, content);
      if (!result.success) {
        onSendError(optimisticId);
        setDraft((currentDraft) => currentDraft || content);
        setError(result.error || "Pesan gagal dikirim.");
        return;
      }

      onSendSuccess(optimisticId);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center gap-3 border-t border-hairline px-6 py-4"
    >
      <button
        type="button"
        aria-label="Lampirkan file"
        title="Lampiran belum tersedia"
        disabled
        className="flex h-10 w-10 shrink-0 cursor-not-allowed items-center justify-center rounded-full text-ink-muted opacity-50"
      >
        <Paperclip size={18} />
      </button>
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        maxLength={2000}
        disabled={!canSend || isPending}
        placeholder={
          canSend ? "Ketik pesan..." : "Percakapan proyek ini sudah ditutup"
        }
        className="flex-1 rounded-full bg-canvas px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      />
      <button
        type="submit"
        aria-label="Kirim pesan"
        disabled={!canSend || !draft.trim() || isPending}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send size={16} />
      </button>
      {error && (
        <p
          role="alert"
          className="absolute bottom-0 left-20 translate-y-full font-body text-xs text-danger"
        >
          {error}
        </p>
      )}
    </form>
  );
}
