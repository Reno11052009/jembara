export default function DataAccountCard() {
  return (
    <section className="rounded-xl border border-[#ECECEC] bg-white p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 mb-5">
        Data & Akun
      </h2>

      <div className="flex items-start justify-between gap-6 pb-5 border-b border-[#ECECEC]">
        <div>
          <p className="font-body text-sm font-semibold text-neutral-900 mb-1">
            Unduh Informasi Data Pribadi
          </p>
          <p className="font-body text-sm text-neutral-500 max-w-xl">
            Ekspor seluruh salinan data aktivitas kamu, proyek, dan riwayat
            proposal dalam format file .JSON.
          </p>
        </div>

        <button
          type="button"
          className="font-body text-sm font-semibold text-neutral-900 border border-neutral-300 rounded-full px-5 py-2.5 hover:bg-neutral-50 transition-colors shrink-0"
        >
          Unduh Data
        </button>
      </div>

      <div className="flex items-start justify-between gap-6 pt-5">
        <div>
          <p className="font-body text-sm font-semibold text-red-500 mb-1">
            Hapus Akun Permanen
          </p>
          <p className="font-body text-sm text-neutral-500 max-w-xl">
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
