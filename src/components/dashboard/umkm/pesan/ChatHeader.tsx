"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, User, Trash2, Ban } from "lucide-react";
import { Conversation } from "@/types/messages";

interface ChatHeaderProps {
  conversation: Conversation;
  projectLabel?: string;
  onViewProfile?: () => void;
  onClearChat?: () => void;
  onToggleBlock?: () => void;
  isBlocked?: boolean;
}

function useOptionalRouter() {
  try {
    return useRouter();
  } catch {
    return null;
  }
}

export default function ChatHeader({
  conversation,
  projectLabel,
  onViewProfile,
  onClearChat,
  onToggleBlock,
  isBlocked = false,
}: ChatHeaderProps) {
  const router = useOptionalRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleClickOutside(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  function handleProfileClick() {
    setIsMenuOpen(false);
    if (onViewProfile) {
      onViewProfile();
    } else if (router) {
      router.push("/dashboard/profile");
    } else if (typeof window !== "undefined") {
      window.location.href = "/dashboard/profile";
    }
  }

  function handleClearMessages() {
    setIsMenuOpen(false);
    onClearChat?.();
  }

  function handleBlock() {
    setIsMenuOpen(false);
    onToggleBlock?.();
  }

  return (
    <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
      <button
        type="button"
        onClick={handleProfileClick}
        className="group flex items-center gap-3 text-left focus:outline-none"
        title={`Lihat profil ${conversation.contactName}`}
      >
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-display font-black text-brand transition-transform group-hover:scale-105">
          {conversation.contactName
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}

          {conversation.isOnline && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
          )}
        </span>
        <div>
          <p className="font-display text-base font-black text-ink transition-colors group-hover:text-brand">
            {conversation.contactName}
          </p>
          {(conversation.projectName || projectLabel) && (
            <p className="font-body text-xs text-ink-muted">
              Project:{" "}
              <span className="font-semibold font-body text-brand">
                {conversation.projectName || projectLabel}
              </span>
            </p>
          )}
        </div>
      </button>

      {/* Dropdown Opsi */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          aria-label="Opsi lainnya"
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline text-ink-muted transition-colors hover:border-brand hover:text-brand"
        >
          <MoreVertical size={16} />
        </button>

        {isMenuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-hairline bg-card py-2 shadow-xl"
          >
            <button
              type="button"
              role="menuitem"
              onClick={handleProfileClick}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-ink transition hover:bg-canvas hover:text-brand"
            >
              <User size={15} className="shrink-0 text-ink-muted" />
              Profil
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={handleClearMessages}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-ink transition hover:bg-canvas hover:text-brand"
            >
              <Trash2 size={15} className="shrink-0 text-ink-muted" />
              Bersihkan Pesan
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={handleBlock}
              className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium transition ${
                isBlocked
                  ? "text-brand hover:bg-brand-soft"
                  : "text-danger hover:bg-danger-soft"
              }`}
            >
              <Ban size={15} className="shrink-0" />
              {isBlocked ? "Buka Blokir" : "Blokir"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}