"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import dictionary, { Dictionary, Language } from "@/lib/i18n/dictionary";

export type FontSize = "small" | "medium" | "large";

const FONT_SIZE_PX: Record<FontSize, string> = {
  small: "12px",
  medium: "14px",
  large: "16px",
};

const LANGUAGE_STORAGE_KEY = "jembara:language";
const FONT_SIZE_STORAGE_KEY = "jembara:font-size";

interface PreferencesContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
  dict: Dictionary;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(
  undefined
);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");

  // Load saved preferences once on mount (client-only; localStorage isn't available during SSR)
  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(
      LANGUAGE_STORAGE_KEY
    ) as Language | null;
    const storedFontSize = window.localStorage.getItem(
      FONT_SIZE_STORAGE_KEY
    ) as FontSize | null;

    if (storedLanguage && dictionary[storedLanguage]) {
      setLanguageState(storedLanguage);
    }
    if (storedFontSize && FONT_SIZE_PX[storedFontSize]) {
      setFontSizeState(storedFontSize);
    }
  }, []);

  // Apply font size to the document root so every rem-based text on the site scales
  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SIZE_PX[fontSize];
  }, [fontSize]);

  // Apply language to the <html lang="..."> attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
  };

  const setFontSize = (next: FontSize) => {
    setFontSizeState(next);
    window.localStorage.setItem(FONT_SIZE_STORAGE_KEY, next);
  };

  return (
    <PreferencesContext.Provider
      value={{
        language,
        setLanguage,
        fontSize,
        setFontSize,
        dict: dictionary[language],
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error(
      "usePreferences must be used within a PreferencesProvider"
    );
  }
  return ctx;
}
