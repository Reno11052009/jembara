"use client";

import { useState } from "react";
import {
  privacyPreferences as initialPreferences,
  privacyPreferencesUmkm,
} from "@/lib/mock-privacy-settings";

export default function PrivacyPreferencesCard({ isUmkm = false }: { isUmkm?: boolean }) {
  const [preferences, setPreferences] = useState(
    isUmkm ? privacyPreferencesUmkm : initialPreferences
  );

  const toggle = (id: string) => {
    setPreferences((prev) =>
      prev.map((preference) =>
        preference.id === id
          ? { ...preference, enabled: !preference.enabled }
          : preference
      )
    );
  };

  return (
    <section className="rounded-xl border border-[#ECECEC] dark:border-hairline bg-white dark:bg-card p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-ink mb-2">
        {isUmkm ? "Preferensi Data" : "Preferensi Kehadiran & Data"}
      </h2>

      <div>
        {preferences.map((preference, index) => (
          <div
            key={preference.id}
            className={`flex items-start justify-between gap-6 py-5 first:pt-0 last:pb-0 ${
              index === preferences.length - 1
                ? ""
                : "border-b border-[#ECECEC] dark:border-hairline"
            }`}
          >
            <div>
              <p className="font-body text-sm font-semibold text-neutral-900 dark:text-ink mb-1">
                {preference.title}
              </p>
              <p className="font-body text-sm text-neutral-500 dark:text-ink-muted max-w-xl">
                {preference.description}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={preference.enabled}
              onClick={() => toggle(preference.id)}
              className={`relative shrink-0 w-12 h-7 rounded-full transition-colors duration-200 ${
                preference.enabled ? "bg-orange-500" : "bg-neutral-300 dark:bg-surface"
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white dark:bg-card shadow transition-all duration-200 ${
                  preference.enabled ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}