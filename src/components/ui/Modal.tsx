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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-hairline bg-card p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            isError ? "bg-danger-soft text-danger" : "bg-brand-soft text-brand"
          }`}
        >
          <span className="text-2xl font-bold">{isError ? "!" : "✓"}</span>
        </div>

        <h2 id="modal-title" className="mt-4 text-lg font-semibold text-ink">
          {title}
        </h2>
        <p className="mt-2 text-sm text-ink-muted">{description}</p>

        {footer && <div className="mt-4 text-xs text-ink-muted">{footer}</div>}

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg border border-hairline py-2 text-sm text-ink transition-colors hover:border-brand hover:text-brand"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}