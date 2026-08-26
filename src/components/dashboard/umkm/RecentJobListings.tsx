import JobListingCard from "@/components/dashboard/umkm/JobListingCard";
import type { OwnerJobListing } from "@/types/umkm-owner-dashboard";

export default function RecentJobListings({ listings }: { listings: OwnerJobListing[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-lg font-black text-ink">Lowongan Terbaru</h2>
      <div className="flex flex-col gap-4">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <JobListingCard key={listing.id} listing={listing} />
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-hairline bg-card p-8 text-center text-sm text-ink-muted">
            Belum ada lowongan yang dibuat.
          </p>
        )}
      </div>
    </div>
  );
}
