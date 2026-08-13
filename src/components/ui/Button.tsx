"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "ghost";
}

export default function Button({
  isLoading,
  variant = "primary",
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const base =
    "relative inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 font-display text-sm font-semibold tracking-wide transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";

  const variants: Record<string, string> = {
    primary:
      "bg-queue text-void shadow-glow-queue hover:bg-queue-soft hover:-translate-y-0.5 active:translate-y-0",
    ghost:
      "border border-line bg-transparent text-slate-200 hover:border-queue hover:text-queue",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${className ?? ""}`}
      {...rest}
    >
      {isLoading ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-void/40 border-t-void" />
          Memproses...
        </>
      ) : (
        children
      )}
    </button>
  );
}