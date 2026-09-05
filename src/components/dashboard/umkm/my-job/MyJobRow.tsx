import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { MyJobListing } from "@/types/my-jobs";

const statusStyles: Record<MyJobListing["status"], string> = {
  Terbuka: "bg-emerald-50 dark:bg-emerald-500/15 text-success",
  Seleksi: "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400",
  "Menunggu Pembayaran": "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Berjalan: "bg-brand-soft text-brand",
  "Dalam Review": "bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400",
  Selesai: "bg-slate-100 dark:bg-line text-slate-700 dark:text-ink-muted",
  Dibatalkan: "bg-danger-soft text-danger",
  Lainnya: "bg-neutral-100 dark:bg-surface text-neutral-600 dark:text-ink-muted",
};

export default function MyJobRow({ listing }: { listing: MyJobListing }) {
  const collaborationStarted = [
    "IN_PROGRESS",
    "REVIEW",
    "COMPLETED",
  ].includes(listing.statusCode);

  return (
    <article className="rounded-xl border border-hairline bg-card px-6 py-5">
      <div className="flex items-start gap-4">
        {/* Kolom kiri: title/badge/desc/skills — lebar fleksibel, boleh
            tumbuh/menyusut, tapi TIDAK mempengaruhi lebar kolom kanan. */}
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-3">
            <h3
              title={listing.title}
              className="truncate font-display text-lg font-black text-ink"
            >
              {listing.title}
            </h3>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusStyles[listing.status]}`}
            >
              {listing.status}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
            {listing.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {listing.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-canvas px-2.5 py-1 text-xs text-ink"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Kolom kanan: Budget/Proposal/Tanggal/Lokasi — LEBAR FIXED (w-72),
            bukan min-w. shrink-0 biar flex parent nggak pernah nyusutin dia.
            Ini kunci alignment: box ini selalu punya lebar sama persis di
            SEMUA card, nggak peduli sepanjang apa teks di dalamnya. */}
        <div className="grid w-72 shrink-0 grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div className="min-w-0">
            <p className="text-xs text-ink-muted">Budget</p>
            <p className="mt-0.5 truncate font-display font-black text-ink">
              {listing.budgetLabel}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-ink-muted">Proposal Masuk</p>
            <p className="mt-0.5 truncate font-display font-black text-ink">
              {listing.applicantCount} proposal
            </p>
          </div>
          <p className="flex min-w-0 items-center gap-1.5 text-ink-muted">
            <CalendarDays size={14} className="shrink-0" />
            <span className="truncate">{listing.deadlineLabel}</span>
          </p>
          <p
            title={`${listing.workModeLabel} · ${listing.locationLabel}`}
            className="flex min-w-0 items-center gap-1.5 text-ink-muted"
          >
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">
              {listing.workModeLabel} · {listing.locationLabel}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4">
        <p className="text-xs text-ink-muted">
          Dipublikasikan {listing.postedDateLabel}
        </p>
        {listing.status === "Menunggu Pembayaran" ? (
          <Link
            href={`/dashboard/payments/${encodeURIComponent(listing.id)}`}
            className="rounded-full bg-brand px-4 py-2 text-xs font-display font-bold uppercase text-white hover:opacity-90"
          >
            Bayar / Cek Status
          </Link>
        ) : collaborationStarted ? (
          <Link
            href={`/dashboard/messages?project=${encodeURIComponent(listing.id)}`}
            className="rounded-full border border-ink px-4 py-2 text-xs font-display font-bold uppercase text-ink hover:border-brand hover:text-brand"
          >
            Buka Kolaborasi
          </Link>
        ) : listing.statusCode === "OPEN" ||
          (listing.statusCode === "PROPOSAL" && !listing.hasSelectedStudent) ? (
          <div className="flex flex-wrap items-center gap-2">
            {listing.applicantCount > 0 && (
              <Link
                href={`/dashboard/pelamar?project=${encodeURIComponent(listing.id)}`}
                className="rounded-full border border-ink px-4 py-2 text-xs font-display font-bold uppercase text-ink hover:border-brand hover:text-brand"
              >
                Lihat Pelamar
              </Link>
            )}
            <Link
              href={`/dashboard/cari-talent?project=${encodeURIComponent(listing.id)}`}
              className="rounded-full bg-brand px-4 py-2 text-xs font-display font-bold uppercase text-white hover:opacity-90"
            >
              Cari Talent
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}