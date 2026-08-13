"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, id, className, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-md border bg-surface px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all duration-200 ${
            error
              ? "border-alert/60 focus:border-alert focus:shadow-glow-alert"
              : "border-line focus:border-queue focus:shadow-glow-queue"
          } ${className ?? ""}`}
          {...rest}
        />
        {error && (
          <p id={errorId} className="font-mono text-xs text-alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;