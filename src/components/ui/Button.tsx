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
    "relative inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";

  const variants: Record<string, string> = {
    primary: "bg-brand text-white hover:opacity-90",
    ghost:
      "border border-hairline bg-transparent text-ink hover:border-brand hover:text-brand",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${className ?? ""}`}
      {...rest}
    >
      {isLoading ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Memproses...
        </>
      ) : (
        children
      )}
    </button>
  );
}