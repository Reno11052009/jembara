"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { X, Send, ArrowUpRight, Sparkles } from "lucide-react";

const AI_AVATAR_IMAGE_SRC = "/images/ai-avatar-placeholder.svg";

interface MessageLink {
  href: string;
  label: string;
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
  avatarSrc?: string;
  userId?: string;
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

type DockEdge = "left" | "right" | "top" | "bottom";
type DragPhase = "idle" | "dragging" | "snapping";

const LONG_PRESS_MS = 1000;
const DRAG_THRESHOLD_PX = 6;
const BALL_SIZE = 56;
const EDGE_MARGIN_PERCENT = 6;
const SNAP_TRANSITION_MS = 300;
const MAX_STORED_MESSAGES = 30;
const CHAT_HISTORY_STORAGE_PREFIX = "jembara:jelita-history:v1";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getDockContainerStyle(edge: DockEdge, pos: number): React.CSSProperties {
  switch (edge) {
    case "right":
      return { right: 0, top: `${pos}%`, transform: "translateY(-50%)" };
    case "left":
      return { left: 0, top: `${pos}%`, transform: "translateY(-50%)" };
    case "top":
      return { top: 0, left: `${pos}%`, transform: "translateX(-50%)" };
    case "bottom":
      return { bottom: 0, left: `${pos}%`, transform: "translateX(-50%)" };
  }
}

function getRoundedClass(edge: DockEdge) {
  return {
    right: "rounded-l-3xl",
    left: "rounded-r-3xl",
    top: "rounded-b-3xl",
    bottom: "rounded-t-3xl",
  }[edge];
}

function getHoverTranslateClass(edge: DockEdge) {
  return {
    right: "hover:-translate-x-1.5",
    left: "hover:translate-x-1.5",
    top: "hover:translate-y-1.5",
    bottom: "hover:-translate-y-1.5",
  }[edge];
}

function getModalPositionClass(edge: DockEdge) {
  return {
    right: "bottom-6 right-16 sm:right-20",
    left: "bottom-6 left-16 sm:left-20",
    top: "top-16 right-6 sm:right-10",
    bottom: "bottom-16 right-6 sm:right-10",
  }[edge];
}

function edgePosToPixels(edge: DockEdge, pos: number) {
  const half = BALL_SIZE / 2;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  switch (edge) {
    case "right":
      return { x: vw - half, y: (pos / 100) * vh };
    case "left":
      return { x: half, y: (pos / 100) * vh };
    case "top":
      return { x: (pos / 100) * vw, y: half };
    case "bottom":
      return { x: (pos / 100) * vw, y: vh - half };
  }
}

export default function ChatBubbleWidget({
  role = "STUDENT",
  avatarSrc = AI_AVATAR_IMAGE_SRC,
  userId = "anonymous",
}: ChatBubbleWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [readyHistoryKey, setReadyHistoryKey] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [dockEdge, setDockEdge] = useState<DockEdge>("right");
  const [dockPos, setDockPos] = useState(50);
  const [dragPhase, setDragPhase] = useState<DragPhase>("idle");
  const [ballPos, setBallPos] = useState({ x: 0, y: 0 });

  const isPressedRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const pressTimerRef = useRef<number | null>(null);

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

  // Restore riwayat percakapan dari sessionStorage
  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (!active) return;

      let restoredMessages: Message[] = [];
      try {
        const storedHistory = window.localStorage.getItem(historyStorageKey);
        restoredMessages = storedHistory
          ? (JSON.parse(storedHistory) as Message[])
          : [];
      } catch {
        // Data rusak atau storage diblokir dianggap kosong
      }

      setMessages(restoredMessages);
      setReadyHistoryKey(historyStorageKey);
    });

    return () => {
      active = false;
    };
  }, [historyStorageKey]);

  // Simpan riwayat ke sessionStorage
  useEffect(() => {
    if (!historyReady) return;

    try {
      if (messages.length === 0) {
        window.localStorage.removeItem(historyStorageKey);
      } else {
        window.localStorage.setItem(
          historyStorageKey,
          JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)),
        );
      }
    } catch {
      // Chat tetap berfungsi jika localStorage diblokir
    }
  }, [historyReady, historyStorageKey, messages]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading || !historyReady) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
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
        id: crypto.randomUUID(),
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
        id: crypto.randomUUID(),
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

  /* ==========================================================================
   * ASSISTIVETOUCH DRAG HANDLERS
   * ========================================================================== */
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (isOpen) return;

    isPressedRef.current = true;
    hasDraggedRef.current = false;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    setBallPos({ x: e.clientX, y: e.clientY });

    e.currentTarget.setPointerCapture(e.pointerId);

    pressTimerRef.current = window.setTimeout(() => {
      if (isPressedRef.current) {
        setDragPhase("dragging");
      }
    }, LONG_PRESS_MS);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isPressedRef.current) return;

    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
      hasDraggedRef.current = true;
    }

    if (dragPhase === "dragging") {
      const half = BALL_SIZE / 2;
      setBallPos({
        x: clamp(e.clientX, half, window.innerWidth - half),
        y: clamp(e.clientY, half, window.innerHeight - half),
      });
    }
  };

  const finishPress = () => {
    isPressedRef.current = false;
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handlePointerUp = () => {
    const wasDragging = dragPhase === "dragging";
    finishPress();

    if (wasDragging) {
      const { x, y } = ballPos;
      const distLeft = x;
      const distRight = window.innerWidth - x;
      const distTop = y;
      const distBottom = window.innerHeight - y;
      const minDist = Math.min(distLeft, distRight, distTop, distBottom);

      let edge: DockEdge = "right";
      let pos = 50;

      if (minDist === distLeft) {
        edge = "left";
        pos = clamp((y / window.innerHeight) * 100, EDGE_MARGIN_PERCENT, 100 - EDGE_MARGIN_PERCENT);
      } else if (minDist === distRight) {
        edge = "right";
        pos = clamp((y / window.innerHeight) * 100, EDGE_MARGIN_PERCENT, 100 - EDGE_MARGIN_PERCENT);
      } else if (minDist === distTop) {
        edge = "top";
        pos = clamp((x / window.innerWidth) * 100, EDGE_MARGIN_PERCENT, 100 - EDGE_MARGIN_PERCENT);
      } else {
        edge = "bottom";
        pos = clamp((x / window.innerWidth) * 100, EDGE_MARGIN_PERCENT, 100 - EDGE_MARGIN_PERCENT);
      }

      setDragPhase("snapping");

      requestAnimationFrame(() => {
        const target = edgePosToPixels(edge, pos);
        setBallPos(target);
        setDockEdge(edge);
        setDockPos(pos);
        window.setTimeout(() => setDragPhase("idle"), SNAP_TRANSITION_MS);
      });
    // } else if (!hasDraggedRef.current) {
    //   setIsOpen((prev) => !prev);
   }
  };

  const handlePointerCancel = () => {
    finishPress();
    if (dragPhase === "dragging") {
      setDragPhase("idle");
    }
  };

  const isBallMode = dragPhase === "dragging" || dragPhase === "snapping";
  const roundedClass = getRoundedClass(dockEdge);
  const hoverTranslateClass = getHoverTranslateClass(dockEdge);

  const containerStyle: React.CSSProperties = isBallMode
    ? { left: ballPos.x - BALL_SIZE / 2, top: ballPos.y - BALL_SIZE / 2 }
    : getDockContainerStyle(dockEdge, dockPos);

  const containerTransitionClass =
    dragPhase === "idle"
      ? "transition-[right,left,top,bottom] duration-300"
      : dragPhase === "snapping"
      ? "transition-[left,top] duration-300 ease-out"
      : "";

  return (
    <>
      {/* Floating AI Trigger */}
      <div
        className={`fixed z-50 select-none ${containerTransitionClass}`}
        style={containerStyle}
      >
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onClick={() => {
            if (dragPhase === "idle") {
              setIsOpen((prev) => !prev);
            }
          }}
          aria-label={isOpen ? "Tutup Asisten AI" : "Buka Asisten AI Jembara"}
          title="Tanya Jelita AI"
          style={{
            touchAction: "none",
            ...(isBallMode ? { width: BALL_SIZE, height: BALL_SIZE } : {}),
          }}
          className={
            isBallMode
              ? "flex items-center justify-center rounded-full bg-amber-600 shadow-2xl active:scale-95"
              : `group relative flex items-center justify-center ${roundedClass} bg-amber-600 p-2.5 shadow-2xl transition-all duration-300 ${hoverTranslateClass} hover:bg-amber-500 active:scale-95`
          }
        >
          {isBallMode ? (
            <img
              src={avatarSrc}
              alt=""
              className="h-10 w-10 rounded-full border-2 border-white object-cover"
              draggable={false}
            />
          ) : (
            <>
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white p-0.5 shadow-md transition-transform duration-300 group-hover:scale-105">
                <img
                  src={avatarSrc}
                  alt="Jelita AI Avatar"
                  className="h-full w-full rounded-full object-cover"
                  draggable={false}
                />
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                </span>
              </div>

              <span className="max-w-0 overflow-hidden whitespace-nowrap font-display text-xs font-bold text-white opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-xs group-hover:pr-1 group-hover:opacity-100">
                Jelita AI
              </span>
            </>
          )}
        </button>
      </div>

      {/* Modal Chat */}
      {isOpen && (
        <div
          className={`fixed z-50 flex h-140 max-h-[calc(100vh-4rem)] w-140 max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-hairline bg-white shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${getModalPositionClass(
            dockEdge
          )}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-hairline bg-canvas/80 px-4 py-3.5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-600/10 p-0.5">
                <img
                  src={avatarSrc}
                  alt="Jelita AI"
                  className="h-full w-full rounded-full object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-sm font-bold text-ink">Jelita AI</h3>
                  <Sparkles size={13} className="text-amber-500 fill-amber-500/20" />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  Online AI Assistant
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

          {/* Messages */}
          <div className="flex flex-1 flex-col overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="my-auto flex flex-col items-center text-center">
                <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-600/10 p-1 ring-8 ring-amber-600/5">
                  <img
                    src={avatarSrc}
                    alt="Jelita AI Logo"
                    className="h-full w-full rounded-full object-cover shadow-sm"
                  />
                </div>
                <h4 className="max-w-65 font-display text-base font-bold text-ink">
                  Halo, saya Jelita
                </h4>
                <p className="mt-1 max-w-67.5 font-body text-xs text-ink-muted">
                  Asisten cerdas platform Jembara. Ada yang bisa saya bantu terkait proyek atau fitur platform?
                </p>

                <div className="mt-6 flex w-full max-w-75 flex-col gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSend(suggestion)}
                      className="rounded-xl border border-hairline bg-canvas/50 px-3.5 py-2.5 text-left font-body text-xs text-ink transition-all hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-600"
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
                          ? "rounded-tr-xs bg-amber-600 text-white"
                          : "rounded-tl-xs border border-hairline bg-canvas text-ink"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {msg.sender === "assistant" && msg.links && msg.links.length > 0 && (
                        <div className="mt-2.5 flex flex-col gap-1.5">
                          {msg.links.map((link) => (
                            <a
                              key={`${msg.id}-${link.href}`}
                              href={link.href}
                              className="inline-flex items-center justify-between gap-2 rounded-lg border border-brand/20 bg-white px-2.5 py-2 font-semibold text-brand transition-colors hover:border-brand/50 hover:bg-brand-soft"
                            >
                              <span>{link.label}</span>
                              <ArrowUpRight size={13} className="shrink-0" />
                            </a>
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
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-hairline bg-white p-3"
          >
            <div className="flex items-center gap-2 rounded-full border border-hairline bg-canvas/60 px-3.5 py-1.5 focus-within:border-amber-500/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/10">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tulis pertanyaan Anda..."
                disabled={isLoading}
                className="flex-1 bg-transparent font-body text-xs text-ink placeholder:text-ink-muted focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || !historyReady}
                aria-label="Kirim pesan"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white transition-all hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
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