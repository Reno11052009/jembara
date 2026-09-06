"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
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
const PREFERENCES_CHANGE_EVENT = "jembara:preferences-changed";

function subscribeToPreferences(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(PREFERENCES_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(PREFERENCES_CHANGE_EVENT, onStoreChange);
  };
}

function getStoredLanguage(): Language {
  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return storedLanguage && storedLanguage in dictionary
    ? (storedLanguage as Language)
    : "id";
}

function getStoredFontSize(): FontSize {
  const storedFontSize = window.localStorage.getItem(FONT_SIZE_STORAGE_KEY);
  return storedFontSize && storedFontSize in FONT_SIZE_PX
    ? (storedFontSize as FontSize)
    : "medium";
}

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

  // Sync initial state from localStorage after hydration mount
  useEffect(() => {
    const storedLang = getStoredLanguage();
    const storedFont = getStoredFontSize();
    setLanguageState(storedLang);
    setFontSizeState(storedFont);

    const handleSync = () => {
      setLanguageState(getStoredLanguage());
      setFontSizeState(getStoredFontSize());
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener(PREFERENCES_CHANGE_EVENT, handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener(PREFERENCES_CHANGE_EVENT, handleSync);
    };
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
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    setLanguageState(next);
    window.dispatchEvent(new Event(PREFERENCES_CHANGE_EVENT));
  };

  const setFontSize = (next: FontSize) => {
    window.localStorage.setItem(FONT_SIZE_STORAGE_KEY, next);
    setFontSizeState(next);
    window.dispatchEvent(new Event(PREFERENCES_CHANGE_EVENT));
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

const defaultContextValue: PreferencesContextValue = {
  language: "id",
  setLanguage: () => {},
  fontSize: "medium",
  setFontSize: () => {},
  dict: dictionary.id,
};

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  return ctx ?? defaultContextValue;
}
