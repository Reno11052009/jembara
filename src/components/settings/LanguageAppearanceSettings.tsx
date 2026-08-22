"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { usePreferences, FontSize } from "@/contexts/PreferencesContext";
import { languageOptions, Language } from "@/lib/i18n/dictionary";

type ThemeOption = "light" | "dark" | "system";

const fontSizeOrder: FontSize[] = ["small", "medium", "large"];
const themeOrder: ThemeOption[] = ["light", "dark", "system"];

export default function LanguageAppearanceSettings() {
  const { language, setLanguage, fontSize, setFontSize, dict } = usePreferences();

  // Theme is a placeholder only — the backend teammate will wire up real theming later.
  const [theme, setTheme] = useState<ThemeOption>("light");

  return (
    <div className="flex flex-col gap-6">
      {/* Bahasa Sistem */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-display text-lg font-bold text-neutral-900 mb-5">
          {dict.settings.language.cardTitle}
        </h2>

        <label className="font-body text-xs font-semibold tracking-wide text-neutral-500 mb-2 block">
          {dict.settings.language.selectLabel}
        </label>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 py-3 font-body text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
          />
        </div>
      </section>

      {/* Tema Aplikasi — placeholder, no real functionality yet */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-display text-lg font-bold text-neutral-900 mb-5">
          {dict.settings.theme.cardTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themeOrder.map((option) => {
            const isActive = theme === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setTheme(option)}
                className={`text-left rounded-xl border p-3 transition-colors ${
                  isActive
                    ? "border-orange-500 ring-1 ring-orange-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="aspect-video w-full rounded-lg bg-neutral-100 border border-gray-100 mb-3" />
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${
                      isActive ? "bg-orange-500" : "bg-neutral-300"
                    }`}
                  />
                  <span className="font-body text-sm font-semibold text-neutral-900">
                    {dict.settings.theme[option].title}
                  </span>
                </div>
                <p className="font-body text-xs text-neutral-500">
                  {dict.settings.theme[option].desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Ukuran Huruf — fully functional */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-display text-lg font-bold text-neutral-900 mb-5">
          {dict.settings.fontSize.cardTitle}
        </h2>

        <div className="flex flex-col divide-y divide-gray-100">
          {fontSizeOrder.map((option) => {
            const isActive = fontSize === option;
            return (
              <label
                key={option}
                className="flex items-start gap-3 py-4 first:pt-0 last:pb-0 cursor-pointer"
              >
                <span className="relative shrink-0 mt-0.5">
                  <input
                    type="radio"
                    name="font-size"
                    checked={isActive}
                    onChange={() => setFontSize(option)}
                    className="peer sr-only"
                  />
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                      isActive ? "border-orange-500" : "border-neutral-300"
                    }`}
                  >
                    {isActive && (
                      <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                    )}
                  </span>
                </span>
                <span>
                  <span className="font-body text-sm font-semibold text-neutral-900 block mb-1">
                    {dict.settings.fontSize[option].title}
                  </span>
                  <span className="font-body text-sm text-neutral-500">
                    {dict.settings.fontSize[option].desc}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          className="font-body text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors rounded-full px-8 py-3"
        >
          {dict.settings.save}
        </button>
      </div>
    </div>
  );
}
