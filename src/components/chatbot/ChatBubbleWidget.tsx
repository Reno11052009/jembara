"use client";

import Link from "next/link";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { ArrowUpRight, Bot, X, Send } from "lucide-react";

interface MessageLink {
  label: string;
  href: string;
}

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timeLabel: string;
  links?: MessageLink[];
}

interface ChatBubbleWidgetProps {
  role?: string;
  userId: string;
}

const MAX_STORED_MESSAGES = 30;
const CHAT_HISTORY_STORAGE_PREFIX = "jembara:jelita-history:v1";

const STUDENT_SUGGESTIONS = [
  "Rekomendasikan project yang cocok untuk saya",
  "Bagaimana cara mendaftar proyek?",
  "Apa fungsi Skill Passport?",
];

const UMKM_SUGGESTIONS = [
  "Rekomendasikan talent untuk project saya",
  "Bagaimana cara memasang proyek baru?",
  "Apa kriteria Smart Matching?",
];

function getSafeInternalLinks(value: unknown): MessageLink[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (link): link is MessageLink =>
        typeof link === "object" &&
        link !== null &&
        typeof (link as MessageLink).label === "string" &&
        typeof (link as MessageLink).href === "string" &&
        (link as MessageLink).label.trim().length > 0 &&
        (link as MessageLink).label.length <= 100 &&
        (link as MessageLink).href.startsWith("/dashboard/"),
    )
    .slice(0, 5);
}

function getSafeStoredMessages(value: unknown): Message[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (message): message is Message =>
        typeof message === "object" &&
        message !== null &&
        typeof (message as Message).id === "string" &&
        (message as Message).id.length <= 40 &&
        ((message as Message).sender === "user" ||
          (message as Message).sender === "assistant") &&
        typeof (message as Message).text === "string" &&
        (message as Message).text.length > 0 &&
        (message as Message).text.length <= 6_000 &&
        typeof (message as Message).timeLabel === "string" &&
        (message as Message).timeLabel.length <= 20,
    )
    .map((message) => {
      const links = getSafeInternalLinks(message.links);
      return {
        id: message.id,
        sender: message.sender,
        text: message.text,
        timeLabel: message.timeLabel,
        ...(links.length > 0 ? { links } : {}),
      };
    })
    .slice(-MAX_STORED_MESSAGES);
}

export default function ChatBubbleWidget({
  role = "STUDENT",
  userId,
}: ChatBubbleWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [readyHistoryKey, setReadyHistoryKey] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  const suggestions = role === "UMKM" ? UMKM_SUGGESTIONS : STUDENT_SUGGESTIONS;
  const historyStorageKey = `${CHAT_HISTORY_STORAGE_PREFIX}:${userId}:${role}`;
  const historyReady = readyHistoryKey === historyStorageKey;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (!active) return;

      let restoredMessages: Message[] = [];
      try {
        const storedHistory = window.sessionStorage.getItem(historyStorageKey);
        restoredMessages = storedHistory
          ? getSafeStoredMessages(JSON.parse(storedHistory) as unknown)
          : [];
      } catch {
        // Data rusak atau storage diblokir diperlakukan sebagai riwayat kosong.
      }

      messageIdRef.current = restoredMessages.reduce((highestId, message) => {
        const numericId = Number.parseInt(message.id, 10);
        return Number.isSafeInteger(numericId)
          ? Math.max(highestId, numericId)
          : highestId;
      }, 0);
      setMessages(restoredMessages);
      setReadyHistoryKey(historyStorageKey);
    });

    return () => {
      active = false;
    };
  }, [historyStorageKey]);

  useEffect(() => {
    if (!historyReady) return;

    try {
      if (messages.length === 0) {
        window.sessionStorage.removeItem(historyStorageKey);
      } else {
        window.sessionStorage.setItem(
          historyStorageKey,
          JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)),
        );
      }
    } catch {
      // Chat tetap berfungsi jika sessionStorage diblokir atau kuotanya penuh.
    }
  }, [historyReady, historyStorageKey, messages]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading || !historyReady) return;

    messageIdRef.current += 1;

    const userMsg: Message = {
      id: String(messageIdRef.current),
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
          messages: nextMessages.slice(-9).map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
        links?: unknown;
      };
      const botReplyText =
        data.message || data.error || "Maaf, terjadi kendala saat merespon.";
      const botReplyLinks = getSafeInternalLinks(data.links);

      const botMsg: Message = {
        id: String((messageIdRef.current += 1)),
        sender: "assistant",
        text: botReplyText,
        ...(botReplyLinks.length > 0 ? { links: botReplyLinks } : {}),
        timeLabel: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg].slice(-MAX_STORED_MESSAGES));
    } catch {
      const errorMsg: Message = {
        id: String((messageIdRef.current += 1)),
        sender: "assistant",
        text: "Maaf, gagal menghubungkan ke layanan AI. Pastikan koneksi internet Anda stabil.",
        timeLabel: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg].slice(-MAX_STORED_MESSAGES));
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
                      disabled={!historyReady}
                      className="rounded-xl border border-hairline bg-canvas/50 px-3.5 py-2.5 text-left font-body text-xs text-ink transition-all hover:border-brand/40 hover:bg-brand-soft hover:text-brand disabled:cursor-wait disabled:opacity-60"
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
                      {msg.sender === "assistant" &&
                        msg.links &&
                        msg.links.length > 0 && (
                          <div className="mt-2.5 flex flex-col gap-1.5">
                            {msg.links.map((link) => (
                              <Link
                                key={`${msg.id}-${link.href}`}
                                href={link.href}
                                className="inline-flex items-center justify-between gap-2 rounded-lg border border-brand/20 bg-white px-2.5 py-2 font-semibold text-brand transition-colors hover:border-brand/50 hover:bg-brand-soft"
                              >
                                <span>{link.label}</span>
                                <ArrowUpRight size={13} className="shrink-0" />
                              </Link>
                            ))}
                          </div>
                        )}
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
                placeholder="Tanyakan sesuatu..."
                maxLength={2000}
                disabled={isLoading || !historyReady}
                className="flex-1 bg-transparent font-body text-xs text-ink placeholder:text-ink-muted focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || !historyReady}
                aria-label="Kirim pesan"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-all hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={14} />
              </button>
            </div>
            <p className="mt-1.5 px-2 text-center font-body text-[9px] text-ink-muted">
              Jangan kirim password, nomor telepon, atau data pembayaran.
            </p>
          </form>
        </div>
      )}
    </>
  );
}
