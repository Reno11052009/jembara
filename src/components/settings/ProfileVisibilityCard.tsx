"use client";

import { useState } from "react";
import {
  profileVisibilityOptions,
  defaultProfileVisibility,
  profileVisibilityOptionsUmkm,
  defaultProfileVisibilityUmkm,
} from "@/lib/mock-privacy-settings";

export default function ProfileVisibilityCard({ isUmkm = false }: { isUmkm?: boolean }) {
  const options = isUmkm ? profileVisibilityOptionsUmkm : profileVisibilityOptions;
  const [selected, setSelected] = useState(
    isUmkm ? defaultProfileVisibilityUmkm : defaultProfileVisibility
  );

  return (
    <section className="rounded-xl border border-[#ECECEC] dark:border-[#2A2A2A] bg-white dark:bg-card p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-ink mb-5">
        {isUmkm ? "Visibilitas Profil Perusahaan" : "Visibilitas Profil"}
      </h2>

      <div className="flex flex-col gap-5">
        {options.map((option) => {
          const isSelected = option.id === selected;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelected(option.id)}
              className="flex items-start gap-3 text-left"
            >
              <span
                className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                  isSelected ? "border-orange-500" : "border-neutral-300 dark:border-line"
                }`}
              >
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                )}
              </span>

              <div>
                <p
                  className={`font-body text-sm font-semibold mb-1 transition-colors ${
                    isSelected ? "text-orange-600 dark:text-orange-400" : "text-neutral-900 dark:text-ink"
                  }`}
                >
                  {option.title}
                </p>
                <p className="font-body text-sm text-neutral-500 dark:text-ink-muted max-w-2xl">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}