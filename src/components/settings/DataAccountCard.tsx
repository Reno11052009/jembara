export default function DataAccountCard({ isUmkm = false }: { isUmkm?: boolean }) {
  if (isUmkm) {
    return (
      <section className="rounded-xl border border-[#ECECEC] dark:border-hairline bg-white dark:bg-card p-6">
        <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-ink mb-5">
          Data & Manajemen Akun
        </h2>

        <div className="pb-5 border-b border-[#ECECEC] dark:border-hairline">
          <button
            type="button"
            className="font-body text-sm font-semibold text-neutral-900 dark:text-ink border border-neutral-300 rounded-full px-5 py-2.5 hover:bg-neutral-50 dark:hover:bg-void transition-colors"
          >
            Unduh Data Perusahaan
          </button>
        </div>

        <div className="pt-5">
          <p className="font-body text-sm font-semibold text-red-500 dark:text-red-400 mb-1">
            Hapus Akun Perusahaan
          </p>
          <p className="font-body text-sm text-neutral-500 dark:text-ink-muted max-w-xl mb-4">
            Tindakan ini tidak dapat dibatalkan. Seluruh histori rekrutmen, proyek aktif, dan
            pembayaran akan dihapus permanen.
          </p>

          <button
            type="button"
            className="font-body text-sm font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/15 hover:bg-red-200 dark:hover:bg-red-500/25 transition-colors rounded-full px-5 py-2.5"
          >
            Hapus Akun
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-[#ECECEC] dark:border-hairline bg-white dark:bg-card p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-ink mb-5">
        Data & Akun
      </h2>

      <div className="flex items-start justify-between gap-6 pb-5 border-b border-[#ECECEC] dark:border-hairline">
        <div>
          <p className="font-body text-sm font-semibold text-neutral-900 dark:text-ink mb-1">
            Unduh Informasi Data Pribadi
          </p>
          <p className="font-body text-sm text-neutral-500 dark:text-ink-muted max-w-xl">
            Ekspor seluruh salinan data aktivitas kamu, proyek, dan riwayat
            proposal dalam format file .JSON.
          </p>
        </div>

        <button
          type="button"
          className="font-body text-sm font-semibold text-neutral-900 dark:text-ink border border-neutral-300 rounded-full px-5 py-2.5 hover:bg-neutral-50 dark:hover:bg-void transition-colors shrink-0"
        >
          Unduh Data
        </button>
      </div>

      <div className="flex items-start justify-between gap-6 pt-5">
        <div>
          <p className="font-body text-sm font-semibold text-red-500 dark:text-red-400 mb-1">
            Hapus Akun Permanen
          </p>
          <p className="font-body text-sm text-neutral-500 dark:text-ink-muted max-w-xl">
            Aksi ini akan menghapus akun, portfolio, proposal aktif, dan
            seluruh data kamu selamanya. Aksi tidak dapat dibatalkan.
          </p>
        </div>

        <button
          type="button"
          className="font-body text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors rounded-full px-5 py-2.5 shrink-0"
        >
          Hapus Akun
        </button>
      </div>
    </section>
  );
}