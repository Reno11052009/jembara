"use client";

import { useState, FormEvent } from "react";
import { Paperclip, Send } from "lucide-react";

export default function ChatComposer() {
  const [draft, setDraft] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Belum nyambung ke state pesan/backend — submit cuma ngosongin input.
    setDraft("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 border-t border-hairline px-6 py-4"
    >
      <button
        type="button"
        aria-label="Lampirkan file"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-canvas hover:text-ink"
      >
        <Paperclip size={18} />
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
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-opacity hover:opacity-90"
      >
        <Send size={16} />
      </button>
    </form>
  );
}