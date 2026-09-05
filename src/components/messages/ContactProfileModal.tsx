"use client";

import { useEffect } from "react";
import { Briefcase, Building2, CheckCircle2, Star, User, X } from "lucide-react";
import type { Conversation } from "@/types/messages";

interface ContactProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
}

export default function ContactProfileModal({
  isOpen,
  onClose,
  conversation,
}: ContactProfileModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const initials = conversation.contactName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-profile-name"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-hairline bg-card shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Decorative Banner */}
        <div className="h-24 bg-gradient-to-r from-brand to-brand-soft/80 p-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup profil"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white transition hover:bg-black/40 focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Avatar Card */}
        <div className="relative px-6 pb-6 pt-0">
          <div className="-mt-12 flex justify-between items-end mb-4">
            <span className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-card bg-brand-soft text-2xl font-display font-black text-brand shadow-md">
              {initials}
              {conversation.isOnline && (
                <span
                  title="Sedang Online"
                  className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-card bg-success"
                />
              )}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-canvas px-3 py-1 text-xs font-semibold text-ink-muted">
              <CheckCircle2 size={13} className="text-brand" /> Terverifikasi
            </span>
          </div>

          <div>
            <h2 id="contact-profile-name" className="font-display text-xl font-black text-ink">
              {conversation.contactName}
            </h2>
            {conversation.projectName && (
              <p className="mt-1 flex items-center gap-1.5 font-body text-xs text-ink-muted">
                <Briefcase size={14} className="shrink-0 text-brand" />
                Project:{" "}
                <span className="font-semibold text-brand">
                  {conversation.projectName}
                </span>
              </p>
            )}
          </div>

          <div className="my-5 border-t border-hairline" />

          {/* Quick Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="rounded-xl border border-hairline bg-canvas p-3">
              <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                <Building2 size={14} className="text-brand" />
                <span>Status Kemitraan</span>
              </div>
              <p className="mt-1 font-display text-sm font-bold text-ink">
                {conversation.projectName ? "Kolaborator Proyek" : "Relasi Jembara"}
              </p>
            </div>

            <div className="rounded-xl border border-hairline bg-canvas p-3">
              <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                <Star size={14} className="text-warning fill-warning" />
                <span>Reputasi / Rating</span>
              </div>
              <p className="mt-1 font-display text-sm font-bold text-ink">
                4.9 <span className="text-xs text-ink-muted font-normal">(Terverifikasi)</span>
              </p>
            </div>
          </div>

          {/* Read-Only Notice */}
          <div className="rounded-xl bg-brand-soft/50 border border-brand/20 p-3 text-xs text-ink-muted">
            <p className="flex items-center gap-1.5 font-medium text-brand">
              <User size={14} /> Profil Ringkas (Read-Only)
            </p>
            <p className="mt-1 leading-relaxed">
              Anda sedang melihat rincian profil publik {conversation.contactName}.
            </p>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-hairline py-2.5 font-display text-sm font-bold text-ink transition hover:border-brand hover:text-brand"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
