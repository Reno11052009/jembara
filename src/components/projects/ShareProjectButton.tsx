"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Share2 } from "lucide-react";

interface ShareProjectButtonProps {
  projectId: string;
  projectTitle: string;
  className?: string;
}

type ShareState = "idle" | "copied" | "error";

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();

  if (!copied) throw new Error("Clipboard tidak tersedia");
}

export default function ShareProjectButton({
  projectId,
  projectTitle,
  className,
}: ShareProjectButtonProps) {
  const [shareState, setShareState] = useState<ShareState>("idle");
  const resetTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    },
    [],
  );

  const resetStateLater = () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => setShareState("idle"), 2500);
  };

  const handleShare = async () => {
    const url = new URL(`/projects/${projectId}`, window.location.origin).toString();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${projectTitle} | Jembara`,
          text: `Lihat project “${projectTitle}” di Jembara.`,
          url,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await copyToClipboard(url);
      setShareState("copied");
    } catch {
      setShareState("error");
    }
    resetStateLater();
  };

  const label =
    shareState === "copied"
      ? "Tautan disalin"
      : shareState === "error"
        ? "Gagal menyalin"
        : "Bagikan";

  return (
    <button
      type="button"
      onClick={handleShare}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 rounded-full border border-hairline bg-card px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
      }
      aria-label={`Bagikan project ${projectTitle}`}
    >
      {shareState === "copied" ? (
        <Check size={16} aria-hidden="true" />
      ) : (
        <Share2 size={16} aria-hidden="true" />
      )}
      <span aria-live="polite">{label}</span>
    </button>
  );
}
