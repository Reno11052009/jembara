"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?:
    | "primary"
    | "ghost"
    | "outline"
    | "danger"
    | "danger-soft"
    | "danger-outline"
    | "success-soft";
  size?: "md" | "sm";
  fullWidth?: boolean;
}

export default function Button({
  isLoading,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const base = `relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
    fullWidth ? "w-full" : "w-auto"
  }`;

  const sizes: Record<string, string> = {
    md: "px-5 py-2.5 text-sm",
    sm: "px-3.5 py-1.5 text-xs",
  };

  const variants: Record<string, string> = {
    primary: "bg-brand text-white hover:opacity-90",
    ghost:
      "border border-hairline bg-transparent text-ink hover:border-brand hover:text-brand",
    outline:
      "border border-ink bg-transparent text-ink hover:border-brand hover:text-brand",
    danger: "bg-danger text-white hover:opacity-90",
    "danger-soft": "bg-danger-soft text-danger hover:opacity-80",
    "danger-outline": "border border-danger bg-transparent text-danger hover:opacity-80",
    "success-soft": "bg-success/10 text-success hover:opacity-80",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className ?? ""}`}
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