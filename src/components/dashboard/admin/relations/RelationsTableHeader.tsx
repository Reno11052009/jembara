export const RELATION_ROW_GRID =
  "grid grid-cols-[1fr_1fr_1fr_150px_170px_90px] items-center gap-4";

export default function RelationsTableHeader() {
  return (
    <div
      className={`${RELATION_ROW_GRID} border-b border-hairline px-6 py-3 text-sm font-semibold text-ink-muted`}
    >
      <span>Pemilik UMKM</span>
      <span>Talent Terpilih</span>
      <span>Nama Proyek</span>
      <span>Nilai Kontrak</span>
      <span>Status</span>
      <span>Rating</span>
    </div>
  );
}
