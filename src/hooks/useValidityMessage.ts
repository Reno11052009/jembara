"use client";

import { useCallback, useState, type FormEvent } from "react";

type FormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

type ValidityMessages = Partial<Record<keyof ValidityState, string>> & {
  fallback?: string;
};

export function useValidityMessage(messages: ValidityMessages) {
  const [error, setError] = useState("");

    const onInvalid = useCallback(
    (event: FormEvent<FormElement>) => {
      event.preventDefault();
      const validity = event.currentTarget.validity;
      const matchedKey = (Object.keys(messages) as (keyof ValidityMessages)[]).find(
        (key): key is keyof ValidityState =>
          key !== "fallback" && validity[key as keyof ValidityState],
      );
      setError(
        (matchedKey ? messages[matchedKey] : undefined) ||
          messages.fallback ||
          "Isian belum valid.",
      );
    },
    [messages],
  );

  const clearError = useCallback(() => setError(""), []);

  return { error, onInvalid, clearError, setError };
}