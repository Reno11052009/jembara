import { Pencil, Trash2 } from "lucide-react";
import type { MyJobListing } from "@/types/my-jobs";

const statusStyles: Record<MyJobListing["status"], string> = {
  Aktif: "bg-emerald-50 text-success",
  Ditutup: "bg-red-50 text-danger",
  Draft: "bg-amber-50 text-amber-600",
};

export default function MyJobRow({ listing }: { listing: MyJobListing }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-hairline bg-card px-6 py-5">
      {/* Judul + info pelamar */}
      <div>
        <h3 className="font-display text-lg font-black text-ink">{listing.title}</h3>
        <p className="mt-1 text-base font-body text-ink-muted">
          Diposting: {listing.postedDateLabel} <span className="mx-1">·</span>
          {listing.applicantCount} Pelamar
        </p>
      </div>

      {/* Budget di tengah, teks label & angka rata kiri */}
      <div className="flex flex-1 justify-center min-w-40">
        <div className="flex flex-col items-start">
          <p className="text-sm font-body text-ink-muted">Estimasi Budget</p>
          <p className="mt-0.5 font-display text-lg font-black text-ink">
            {listing.budgetLabel}
          </p>
        </div>
      </div>

      {/* Status + aksi */}
      <div className="flex items-center gap-6">
        <span
          className={`rounded-full px-3 py-1 text-sm font-bold ${statusStyles[listing.status]}`}
        >
          {listing.status}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Edit ${listing.title}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-ink transition-colors hover:border-brand hover:text-brand"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            aria-label={`Hapus ${listing.title}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-soft text-danger transition-colors hover:opacity-80"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}