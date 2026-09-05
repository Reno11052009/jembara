"use client";

// import { ChevronDown } from "lucide-react";
import { usePreferences, FontSize } from "@/contexts/PreferencesContext";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import { languageOptions, Language } from "@/lib/i18n/dictionary";
import SearchableSelect from "@/components/ui/SearchableSelect";

const fontSizeOrder: FontSize[] = ["small", "medium", "large"];
const themeOrder: Theme[] = ["light", "dark", "system"];

/** Tiny mock "browser window" so the user can see what each option looks like. */
function ThemePreview({ option }: { option: Theme }) {
  const halves =
    option === "system"
      ? ["#F7F7F5", "#0A0D16"]
      : option === "dark"
      ? ["#0A0D16", "#0A0D16"]
      : ["#F7F7F5", "#F7F7F5"];

  return (
    <div
      aria-hidden="true"
      className="aspect-video w-full rounded-lg border border-hairline overflow-hidden flex"
    >
      {halves.map((bg, i) => (
        <div key={i} style={{ background: bg }} className="flex-1 h-full p-2 flex flex-col gap-1.5">
          <div
            className="h-1.5 w-1/2 rounded-full"
            style={{ background: bg === "#0A0D16" ? "#232B3D" : "#E8E8E6" }}
          />
          <div
            className="h-1.5 w-3/4 rounded-full"
            style={{ background: bg === "#0A0D16" ? "#232B3D" : "#E8E8E6" }}
          />
          <div className="h-1.5 w-2/3 rounded-full" style={{ background: "#FF6B35" }} />
        </div>
      ))}
    </div>
  );
}

export default function LanguageAppearanceSettings() {
  const { language, setLanguage, fontSize, setFontSize, dict } = usePreferences();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-6">
      {/* Bahasa Sistem */}
      <section className="bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-hairline shadow-sm p-6">
        <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-ink mb-5">
          {dict.settings.language.cardTitle}
        </h2>

        <SearchableSelect
          id="language"
          name="language"
          label={dict.settings.language.selectLabel}
          labelClassName="font-body text-xs font-semibold tracking-wide text-neutral-500 dark:text-ink-muted mb-2 block"
          value={language}
          onChange={(code) => setLanguage(code as Language)}
          options={languageOptions.map((option) => ({
            code: option.value,
            name: option.label,
          }))}
          placeholder="Pilih bahasa"
          searchPlaceholder="Cari bahasa..."
          required
        />
      </section>

      {/* Tema Aplikasi */}
      <section className="bg-card rounded-2xl border border-hairline shadow-sm p-6">
        <h2 className="font-display text-lg font-bold text-ink mb-5">
          {dict.settings.theme.cardTitle}
        </h2>

        <div
          role="radiogroup"
          aria-label={dict.settings.theme.cardTitle}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {themeOrder.map((option) => {
            const isActive = theme === option;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setTheme(option)}
                className={`text-left rounded-xl border p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
                  isActive
                    ? "border-orange-500 ring-1 ring-orange-500"
                    : "border-hairline hover:border-neutral-400 dark:hover:border-line"
                }`}
              >
                <ThemePreview option={option} />
                <div className="flex items-center gap-2 mb-1 mt-3">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${
                      isActive ? "bg-orange-500" : "bg-neutral-300 dark:bg-surface dark:bg-line"
                    }`}
                  />
                  <span className="font-body text-sm font-semibold text-ink">
                    {dict.settings.theme[option].title}
                  </span>
                </div>
                <p className="font-body text-xs text-ink-muted">
                  {dict.settings.theme[option].desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Ukuran Huruf — fully functional */}
      <section className="bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-hairline shadow-sm p-6">
        <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-ink mb-5">
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
                      isActive ? "border-orange-500" : "border-neutral-300 dark:border-line"
                    }`}
                  >
                    {isActive && (
                      <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                    )}
                  </span>
                </span>
                <span>
                  <span className="font-body text-sm font-semibold text-neutral-900 dark:text-ink block mb-1">
                    {dict.settings.fontSize[option].title}
                  </span>
                  <span className="font-body text-sm text-neutral-500 dark:text-ink-muted">
                    {dict.settings.fontSize[option].desc}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <p className="text-right text-xs text-ink-muted">Perubahan bahasa, tema, dan ukuran huruf tersimpan otomatis di perangkat ini.</p>
    </div>
  );
}
