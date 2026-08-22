"use client";

import { useState } from "react";
import { profileVisibilityOptions, defaultProfileVisibility } from "@/lib/mock-privacy-settings";

export default function ProfileVisibilityCard() {
  const [selected, setSelected] = useState(defaultProfileVisibility);

  return (
    <section className="rounded-xl border border-[#ECECEC] bg-white p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 mb-5">
        Visibilitas Profil
      </h2>

      <div className="flex flex-col gap-5">
        {profileVisibilityOptions.map((option) => {
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
                  isSelected ? "border-orange-500" : "border-neutral-300"
                }`}
              >
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                )}
              </span>

              <div>
                <p
                  className={`font-body text-sm font-semibold mb-1 transition-colors ${
                    isSelected ? "text-orange-600" : "text-neutral-900"
                  }`}
                >
                  {option.title}
                </p>
                <p className="font-body text-sm text-neutral-500 max-w-2xl">
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