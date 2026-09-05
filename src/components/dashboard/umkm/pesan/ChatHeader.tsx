"use client";

import { useRef, useState, useEffect } from "react";
import { MoreVertical, User, Trash2, Ban } from "lucide-react";
import Swal from "sweetalert2";
import { Conversation } from "@/types/messages";

interface ChatHeaderProps {
  conversation: Conversation;
  projectLabel?: string;
}

export default function ChatHeader({
  conversation,
  projectLabel = "Project",
}: ChatHeaderProps) {
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
    // TODO: arahkan ke halaman profil lawan bicara bila sudah tersedia.
    // window.location.href = `/dashboard/profile/${conversation.id}`;
    void Swal.fire({
      icon: "info",
      title: "Profil belum tersedia",
      text: `Halaman profil ${conversation.contactName} belum tersedia.`,
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#FF6B35",
    });
  }

  function handleClearMessages() {
    setIsMenuOpen(false);
    // TODO: integrasikan dengan server action untuk membersihkan percakapan.
    void Swal.fire({
      icon: "info",
      title: "Fitur belum tersedia",
      text: `Percakapan dengan ${conversation.contactName} belum dapat dibersihkan.`,
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#FF6B35",
    });
  }

  function handleBlock() {
    setIsMenuOpen(false);
    // TODO: integrasikan dengan server action untuk memblokir kontak.
    void Swal.fire({
      icon: "info",
      title: "Fitur belum tersedia",
      text: `${conversation.contactName} belum dapat diblokir saat ini.`,
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#FF6B35",
    });
  }

  return (
    <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-display font-black text-brand">
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
          <p className="font-display text-base font-black text-ink">
            {conversation.contactName}
          </p>
          {conversation.projectName && (
            <p className="font-body text-xs text-ink-muted">
              {projectLabel}:{" "}
              <span className="font-semibold font-body text-brand">
                {conversation.projectName}
              </span>
            </p>
          )}
        </div>
      </div>

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
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-danger transition hover:bg-danger-soft"
            >
              <Ban size={15} className="shrink-0" />
              Blokir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
