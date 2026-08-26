export const JOB_ROW_GRID =
  "grid grid-cols-[110px_150px_130px_130px_100px_140px_1fr] items-center gap-4";

export default function JobsTableHeader() {
  return (
    <div
      className={`${JOB_ROW_GRID} border-b border-hairline px-6 py-3 text-sm font-semibold text-ink-muted`}
    >
      <span>Judul Lowongan</span>
      <span>Pemilik UMKM</span>
      <span>Kategori</span>
      <span>Budget</span>
      <span>Pelamar</span>
      <span>Status</span>
      <span>Aksi</span>
    </div>
  );
}
