"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const THEME_STORAGE_KEY = "jembara:theme";
const THEME_CHANGE_EVENT = "jembara:theme-changed";
const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

function subscribeToTheme(onStoreChange: () => void) {
  const media = window.matchMedia(DARK_MEDIA_QUERY);
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  media.addEventListener("change", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    media.removeEventListener("change", onStoreChange);
  };
}

function getStoredTheme(): Theme {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" || stored === "system"
    ? stored
    : "light";
}

function getSystemPrefersDark(): boolean {
  return window.matchMedia(DARK_MEDIA_QUERY).matches;
}

interface ThemeContextValue {
  /** The raw preference the user picked: "light" | "dark" | "system" */
  theme: Theme;
  /** The actual theme currently applied to the page ("system" resolved to light/dark) */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore<Theme>(
    subscribeToTheme,
    getStoredTheme,
    () => "light"
  );

  // Subscribed separately so a live OS theme change re-renders us even when
  // the stored preference is untouched (i.e. when theme === "system").
  const systemPrefersDark = useSyncExternalStore<boolean>(
    subscribeToTheme,
    getSystemPrefersDark,
    () => false
  );

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme;

  // Apply the resolved theme to <html>. The inline script in layout.tsx does
  // this synchronously pre-hydration to avoid a flash; this keeps it in sync
  // afterwards (toggling, live system-preference changes, other tabs).
  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = (next: Theme) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
