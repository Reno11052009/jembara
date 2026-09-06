"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";

export interface FormattedNumericInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange?: (formattedValue: string, rawValue: string) => void;
  onValueChange?: (formattedValue: string, rawValue: string) => void;
  name?: string;
  hiddenName?: string;
}

export function formatRupiahDots(val: string | number | null | undefined): string {
  if (val === null || val === undefined || val === "") return "";
  const digits = String(val).replace(/\D/g, "");
  if (!digits) return "";
  return new Intl.NumberFormat("id-ID").format(Number(digits));
}

export const FormattedNumericInput = forwardRef<
  HTMLInputElement,
  FormattedNumericInputProps
>(({ value, onChange, onValueChange, name, hiddenName, className = "", placeholder, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current!);

  const formattedValue = formatRupiahDots(value);
  const rawValue = formattedValue.replace(/\D/g, "");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const valBeforeChange = input.value;
    const cursorStart = input.selectionStart ?? valBeforeChange.length;

    // Count how many DIGITS were before the cursor in e.target.value
    const digitsBeforeCursor = valBeforeChange.slice(0, cursorStart).replace(/\D/g, "").length;

    const newRaw = valBeforeChange.replace(/\D/g, "");
    const newFormatted = newRaw ? new Intl.NumberFormat("id-ID").format(Number(newRaw)) : "";

    // Find the new cursor position in newFormatted that corresponds to digitsBeforeCursor
    let newCursorPos = 0;
    if (digitsBeforeCursor === 0) {
      newCursorPos = 0;
    } else {
      let digitCount = 0;
      for (let i = 0; i < newFormatted.length; i++) {
        if (/\d/.test(newFormatted[i])) {
          digitCount++;
        }
        if (digitCount === digitsBeforeCursor) {
          newCursorPos = i + 1;
          break;
        }
      }
      if (digitCount < digitsBeforeCursor) {
        newCursorPos = newFormatted.length;
      }
    }

    if (onValueChange) {
      onValueChange(newFormatted, newRaw);
    }
    if (onChange) {
      onChange(newFormatted, newRaw);
    }

    // Maintain the cursor position after React DOM update
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    });
  }

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={formattedValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
        {...props}
      />
      {hiddenName && (
        <input type="hidden" name={hiddenName} value={rawValue} />
      )}
    </>
  );
});

FormattedNumericInput.displayName = "FormattedNumericInput";
export default FormattedNumericInput;
