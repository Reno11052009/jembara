"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Bot, X, Send } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timeLabel: string;
}

interface ChatBubbleWidgetProps {
  role?: string;
}

const STUDENT_SUGGESTIONS = [
  "Apa itu Smart Matching?",
  "Bagaimana cara mendaftar proyek?",
  "Apa fungsi Skill Passport?",
];

const UMKM_SUGGESTIONS = [
  "Bagaimana cara memasang proyek baru?",
  "Bagaimana cara memilih talent terbaik?",
  "Apa kriteria Smart Matching?",
];

export default function ChatBubbleWidget({ role = "STUDENT" }: ChatBubbleWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = role === "UMKM" ? UMKM_SUGGESTIONS : STUDENT_SUGGESTIONS;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: "user",
      text: trimmed,
      timeLabel: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      const data = (await response.json()) as { message?: string; error?: string };
      const botReplyText =
        data.message || data.error || "Maaf, terjadi kendala saat merespon.";

      const botMsg: Message = {
        id: String(Date.now() + 1),
        sender: "assistant",
        text: botReplyText,
        timeLabel: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: Message = {
        id: String(Date.now() + 1),
        sender: "assistant",
        text: "Maaf, gagal menghubungkan ke layanan AI. Pastikan koneksi internet Anda stabil.",
        timeLabel: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Buka Asisten AI Jembara"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-brand px-4 py-3 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-brand/90 active:scale-95"
        >
          <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
            <Bot size={18} className="text-white" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          </div>
          <span className="font-display text-sm font-bold tracking-wide">
            Jelita AI
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[580px] max-h-[calc(100vh-3rem)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-hairline bg-white shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between border-b border-hairline bg-canvas/60 px-4 py-3.5 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-ink">
                  Jelita AI
                </h3>
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Online AI Support
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup Asisten"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-canvas hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="my-auto flex flex-col items-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-brand ring-8 ring-brand/5">
                  <Bot size={44} />
                </div>
                <h4 className="max-w-[260px] font-display text-base font-bold text-ink">
                  Halo, saya Jelita (Asisten AI Jembara).
                </h4>
                <p className="mt-1 max-w-[260px] font-body text-xs text-ink-muted">
                  Ada yang bisa saya bantu terkait platform Jembara hari ini?
                </p>

                <div className="mt-6 flex w-full max-w-[300px] flex-col gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSend(suggestion)}
                      className="rounded-xl border border-hairline bg-canvas/50 px-3.5 py-2.5 text-left font-body text-xs text-ink transition-all hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-2.5 font-body text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "rounded-tr-xs bg-brand text-white"
                          : "rounded-tl-xs border border-hairline bg-canvas text-ink"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <span
                        className={`mt-1 block text-[10px] ${
                          msg.sender === "user"
                            ? "text-right text-white/70"
                            : "text-ink-muted"
                        }`}
                      >
                        {msg.timeLabel}
                      </span>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start">
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-xs border border-hairline bg-canvas px-4 py-3">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-hairline bg-white p-3"
          >
            <div className="flex items-center gap-2 rounded-full border border-hairline bg-canvas/60 px-3.5 py-1.5 focus-within:border-brand/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/10">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1 bg-transparent font-body text-xs text-ink placeholder:text-ink-muted focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Kirim pesan"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-all hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
