import Link from "next/link";
import type { OwnerJobListing } from "@/types/umkm-owner-dashboard";

export default function JobListingCard({ listing }: { listing: OwnerJobListing }) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-xl font-black text-ink">{listing.title}</h3>
        <span className="shrink-0 rounded-full bg-brand-soft px-3 py-1 text-xs font-display font-black text-brand">
          {listing.budgetLabel ?? `${listing.matchPercent ?? 0}% Match`}
        </span>
      </div>
      <p className="mt-1 font-body text-sm text-ink-muted">{listing.companyName}</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 font-body text-sm text-ink-muted">
          <span>{listing.applicantCount} Pelamar</span>
          <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-success">
            {listing.status}
          </span>
        </div>
        <Link
          href="/dashboard/pelamar"
          className="w-60 rounded-full border-2 border-ink px-5 py-2 text-center text-sm font-display font-black text-ink transition-colors hover:bg-ink hover:text-white"
        >
          Lihat Pelamar
        </Link>
      </div>
    </div>
  );
}
