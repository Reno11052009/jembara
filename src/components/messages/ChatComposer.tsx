"use client";

<<<<<<< HEAD
import { useState, FormEvent, useRef, ChangeEvent } from "react";
=======
import { useState, useTransition, type FormEvent } from "react";
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
import { Paperclip, Send } from "lucide-react";
import { sendMessageAction } from "@/app/actions/messages";
import type { ChatMessage } from "@/types/messages";

interface ChatComposerProps {
  conversationId: string;
<<<<<<< HEAD
  canSend?: boolean;
}

export default function ChatComposer({ canSend = true }: ChatComposerProps) {
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setAttachment(file);
    // TODO: nanti sambungin ke state pesan/backend (pakai conversationId)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: kirim { conversationId, draft, attachment } ke backend
    setDraft("");
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  if (!canSend) {
    return (
      <div className="border-t border-hairline px-6 py-4">
        <p className="text-center text-sm text-ink-muted">
          Percakapan ini sudah tidak bisa menerima pesan baru.
        </p>
      </div>
    );
  }
=======
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
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63

  return (
    <form
      onSubmit={handleSubmit}
<<<<<<< HEAD
      className="flex flex-col gap-2 border-t border-hairline px-6 py-4"
    >
      {attachment && (
        <div className="flex items-center gap-2 self-start rounded-full bg-canvas px-3 py-1.5 text-xs text-ink-muted">
          <Paperclip size={12} />
          <span className="max-w-50 truncate">{attachment.name}</span>
          <button
            type="button"
            aria-label="Hapus lampiran"
            onClick={() => {
              setAttachment(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="font-bold text-ink-muted hover:text-danger"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* sr-only, bukan `hidden` (display:none) — beberapa browser lama
            gak reliable men-trigger .click() programatik ke input file
            yang display:none. sr-only tetap ada di layout (posisi absolute
            1px, gak keliatan) jadi .click()-nya konsisten kepicu. */}
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          onChange={handleFileChange}
        />

        <button
          type="button"
          aria-label="Lampirkan file"
          onClick={() => fileInputRef.current?.click()}
          className="relative z-10 flex h-15 w-15 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-canvas hover:text-ink"
        >
          <Paperclip size={25} />
        </button>

        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ketik pesan..."
          className="flex-1 rounded-full bg-canvas px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none"
        />

        <button
          type="submit"
          aria-label="Kirim pesan"
          className="flex h-15 w-15 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-opacity hover:opacity-90"
        >
          <Send size={24} />
        </button>
      </div>
=======
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
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
    </form>
  );
}
