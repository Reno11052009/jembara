"use client";

import { useState, FormEvent, useRef, ChangeEvent } from "react";
import { Paperclip, Send } from "lucide-react";

interface ChatComposerProps {
  contactFirstName?: string;
}

export default function ChatComposer({ contactFirstName }: ChatComposerProps) {
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setAttachment(file);
    // TODO: nanti sambungin ke state pesan/backend
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Belum nyambung ke state pesan/backend — submit cuma ngosongin input.
    setDraft("");
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <form
      onSubmit={handleSubmit}
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
          placeholder={contactFirstName ? `Ketik pesan untuk ${contactFirstName}...` : "Ketik pesan..."}
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
    </form>
  );
}