"use client";

import { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon?: "error" | "success";
  title: string;
  description: string;
  footer?: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  icon = "error",
  title,
  description,
  footer,
}: ModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isError = icon === "error";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg border border-line bg-surface p-6 text-center shadow-glow-alert"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 ${
            isError ? "border-alert text-alert" : "border-xp text-xp"
          }`}
        >
          <span className="font-display text-2xl">{isError ? "!" : "✓"}</span>
        </div>

        <h2 id="modal-title" className="mt-4 font-display text-lg font-semibold text-slate-50">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-400">{description}</p>

        {footer && <div className="mt-4 font-mono text-xs text-slate-500">{footer}</div>}

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-md border border-line py-2 text-sm text-slate-300 transition-colors hover:border-queue hover:text-queue"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}