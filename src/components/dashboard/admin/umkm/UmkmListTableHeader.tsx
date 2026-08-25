export const UMKM_ROW_GRID =
  "grid grid-cols-[64px_minmax(200px,1fr)_170px_100px_120px_150px_110px_150px] items-center gap-4";

export default function UmkmListTableHeader() {
  return (
    <div
      className={`${UMKM_ROW_GRID} border-b border-hairline px-6 py-3 text-sm font-semibold text-ink-muted`}
    >
      <span>Avatar</span>
      <span>Pemilik / UMKM</span>
      <span>Kategori Bisnis</span>
      <span>Lokasi</span>
      <span>Jumlah Loker</span>
      <span>Verifikasi</span>
      <span>Tgl Daftar</span>
      <span>Aksi</span>
    </div>
  );
}
