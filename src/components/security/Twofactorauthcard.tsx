"use client";

import Swal from "sweetalert2";

export default function TwoFactorAuthCard() {
  const handleToggleClick = () => {
    // 2FA belum tersambung ke backend (belum ada verifikasi OTP / pemulihan
    // akun). Toggle sengaja selalu tampil nonaktif dan tidak benar-benar
    // menyalakan apa pun supaya tidak menyesatkan soal status keamanan akun.
    void Swal.fire({
      icon: "info",
      title: "Segera Hadir",
      text: "Autentikasi dua faktor sedang kami siapkan dan akan aktif setelah verifikasi OTP terhubung ke sistem.",
      confirmButtonColor: "#f97316",
    });
  };

  return (
    <section className="rounded-xl border border-[#ECECEC] dark:border-gray bg-white dark:bg-card p-6">
      <h2 className="mb-5 font-display text-lg font-bold text-neutral-900 dark:text-ink">
        Autentikasi Dua Faktor (2FA)
      </h2>

      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="font-body text-sm font-semibold text-neutral-900 dark:text-ink mb-1">
            Aktifkan Autentikasi Dua Faktor
          </p>
          <p className="max-w-xl font-body text-sm text-neutral-500 dark:text-ink-muted">
            Amankan akun Anda dengan mewajibkan kode verifikasi tambahan setiap kali Anda login.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={false}
          aria-label="Aktifkan Autentikasi Dua Faktor (segera hadir)"
          onClick={handleToggleClick}
          className="relative shrink-0 w-12 h-7 rounded-full bg-neutral-300 dark:bg-surface transition-colors duration-200"
        >
          <span className="absolute top-1 left-1 h-5 w-5 rounded-full bg-white dark:bg-card shadow transition-transform duration-200" />
        </button>
      </div>
    </section>
  );
}