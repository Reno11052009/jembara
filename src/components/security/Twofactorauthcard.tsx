"use client";

import { useState } from "react";

export default function TwoFactorAuthCard() {
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <section className="rounded-xl border border-[#ECECEC] bg-white p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 mb-5">
        Autentikasi Dua Faktor (2FA)
      </h2>

      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="font-body text-sm font-semibold text-neutral-900 mb-1">
            Aktifkan Verifikasi Dua Faktor
          </p>
          <p className="font-body text-sm text-neutral-500 max-w-xl">
            Kirimkan kode OTP unik ke nomor telepon kamu untuk mengamankan
            setiap proses login di perangkat baru.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isEnabled}
          onClick={() => setIsEnabled((prev) => !prev)}
          className={`relative shrink-0 w-12 h-7 rounded-full transition-colors duration-200 ${
            isEnabled ? "bg-orange-500" : "bg-neutral-300"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
              isEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </section>
  );
}