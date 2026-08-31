export default function TwoFactorAuthCard() {
  return (
    <section className="rounded-xl border border-[#ECECEC] bg-white p-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="mb-2 font-display text-lg font-bold text-neutral-900">
            Autentikasi Dua Faktor (2FA)
          </h2>
          <p className="max-w-xl font-body text-sm text-neutral-500">
            2FA belum tersedia. Fitur ini tidak dianggap aktif sampai verifikasi OTP
            dan pemulihan akun benar-benar terhubung ke backend.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600">
          Belum tersedia
        </span>
      </div>
    </section>
  );
}
