"use client";

import { useState, useTransition } from "react";
import { updateProfileVisibilityAction } from "@/app/actions/privacy";
import type { PrivacySettingsData } from "@/lib/privacy";

const options = [
  {
    isPublic: true,
    title: "Publik",
    description: "Profil dapat tampil di halaman talenta. Kontak dan alamat lengkap tetap dirahasiakan.",
  },
  {
    isPublic: false,
    title: "Privat",
    description: "Profil tidak ditampilkan pada halaman talenta publik.",
  },
] as const;

export default function ProfileVisibilityCard({
  initialData,
}: {
  initialData: PrivacySettingsData;
}) {
  const isUmkm = initialData.role === "UMKM";
  const [isPublic, setIsPublic] = useState(initialData.isPublicProfile);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  if (initialData.role !== "STUDENT") {
    return (
      <section className="rounded-xl border border-[#ECECEC] bg-white p-6 dark:border-hairline dark:bg-card">
        <h2 className="mb-2 font-display text-lg font-bold text-neutral-900 dark:text-ink">Visibilitas Profil</h2>
        <p className="font-body text-sm text-neutral-500 dark:text-ink-muted">
          Profil UMKM tampil melalui proyek yang dipublikasikan. Informasi kontak dan alamat lengkap tidak ditampilkan secara publik.
        </p>
      </section>
    );
  }

  function updateVisibility(nextValue: boolean) {
    if (isPending || nextValue === isPublic) return;
    const previous = isPublic;
    setIsPublic(nextValue);
    setMessage("");
    startTransition(async () => {
      const result = await updateProfileVisibilityAction({ isPublicProfile: nextValue });
      if (!result.success) {
        setIsPublic(previous);
        setMessage(result.error || "Pengaturan belum dapat disimpan.");
        return;
      }
      setMessage("Pengaturan visibilitas tersimpan.");
    });
  }

  return (
    <section className="rounded-xl border border-[#ECECEC] dark:border-[#2A2A2A] bg-white dark:bg-card p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-ink mb-5">
        {isUmkm ? "Visibilitas Profil Perusahaan" : "Visibilitas Profil"}
      </h2>

      <div className="flex flex-col gap-5">
        {options.map((option) => {
          const isSelected = option.isPublic === isPublic;

          return (
            <button
              key={option.title}
              type="button"
              disabled={isPending}
              onClick={() => updateVisibility(option.isPublic)}
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
        {message ? (
          <p role="status" className={`text-sm ${message.includes("tersimpan") ? "text-emerald-600" : "text-red-600"}`}>
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
