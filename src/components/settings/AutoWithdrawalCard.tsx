"use client";

import { useRef, useState } from "react";

export default function AutoWithdrawalCard({ isUmkm = false }: { isUmkm?: boolean }) {
  const [minWithdrawal, setMinWithdrawal] = useState("500.000");
  const [autoWithdrawalEnabled, setAutoWithdrawalEnabled] = useState(false);
  const [autoReleaseBudget, setAutoReleaseBudget] = useState(true);
  const minWithdrawalInputRef = useRef<HTMLInputElement>(null);

  function handleMinWithdrawalChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const rawValue = input.value.replace(/\D/g, "");

    if (rawValue === "") {
      setMinWithdrawal("");
      return;
    }

    const numericValue = Number(rawValue);
    if (Number.isNaN(numericValue)) return;

    const formatted = new Intl.NumberFormat("id-ID").format(numericValue);

    const cursorPosition = input.selectionStart ?? 0;
    const rawBeforeCursor = input.value.slice(0, cursorPosition).replace(/\D/g, "");
    const formattedBeforeCursor = new Intl.NumberFormat("id-ID").format(
      Number(rawBeforeCursor || 0),
    );

    setMinWithdrawal(formatted);

    requestAnimationFrame(() => {
      if (minWithdrawalInputRef.current) {
        const newPosition = formattedBeforeCursor.length;
        minWithdrawalInputRef.current.setSelectionRange(newPosition, newPosition);
      }
    });
  }

  if (isUmkm) {
    return (
      <section className="rounded-xl border border-[#ECECEC] dark:border-hairline bg-white dark:bg-card p-6">
        <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-ink mb-5">
          Pengaturan Pembayaran Otomatis
        </h2>

        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-body text-sm font-semibold text-neutral-900 dark:text-ink mb-1">
              Otomatis Cairkan Budget Setelah Hasil Review Disetujui
            </p>
            <p className="font-body text-sm text-neutral-500 dark:text-ink-muted max-w-xl">
              Sistem langsung mentransfer sisa dana pengerjaan setelah Anda menekan tombol
              setujui hasil kerja di modul proyek.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={autoReleaseBudget}
            onClick={() => setAutoReleaseBudget((prev) => !prev)}
            className={`relative shrink-0 w-12 h-7 rounded-full transition-colors duration-200 ${
              autoReleaseBudget ? "bg-orange-500" : "bg-neutral-300 dark:bg-surface"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white dark:bg-card shadow transition-transform duration-200 ${
                autoReleaseBudget ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-[#ECECEC] dark:border-hairline bg-white dark:bg-card p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-ink mb-5">
        Pengaturan Penarikan Otomatis
      </h2>

      <div className="mb-5">
        <label htmlFor="minWithdrawal" className="mb-1.5 block text-sm font-semibold text-neutral-900 dark:text-ink">
          MINIMAL JUMLAH PENARIKAN
        </label>
        <input
          ref={minWithdrawalInputRef}
          id="minWithdrawal"
          name="minWithdrawal"
          type="text"
          inputMode="numeric"
          value={minWithdrawal}
          onChange={handleMinWithdrawalChange}
          placeholder="Contoh: 500.000"
          className="w-full rounded-xl border border-gray-200 dark:border-hairline bg-white dark:bg-card px-4 py-3 text-right text-sm text-neutral-900 dark:text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <input
          type="hidden"
          name="minWithdrawalRaw"
          value={minWithdrawal.replace(/\D/g, "")}
        />
      </div>

      <div className="flex items-start justify-between gap-6 pt-5 border-t border-[#ECECEC] dark:border-hairline">
        <div>
          <p className="font-body text-sm font-semibold text-neutral-900 dark:text-ink mb-1">
            Pencairan Otomatis Mingguan
          </p>
          <p className="font-body text-sm text-neutral-500 dark:text-ink-muted max-w-xl">
            Setiap hari Jumat, saldo Jembara kamu akan ditarik otomatis ke
            rekening utama jika memenuhi batas minimal.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={autoWithdrawalEnabled}
          onClick={() => setAutoWithdrawalEnabled((prev) => !prev)}
          className={`relative shrink-0 w-12 h-7 rounded-full transition-colors duration-200 ${
            autoWithdrawalEnabled ? "bg-orange-500" : "bg-neutral-300 dark:bg-surface"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white dark:bg-card shadow transition-transform duration-200 ${
              autoWithdrawalEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </section>
  );
}