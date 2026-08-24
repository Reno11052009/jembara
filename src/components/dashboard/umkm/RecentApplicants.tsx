import ApplicantListItem from "@/components/dashboard/umkm/ApplicantListItem";
import type { OwnerRecentApplicant } from "@/types/umkm-owner-dashboard";

export default function RecentApplicants({ applicants }: { applicants: OwnerRecentApplicant[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-lg font-black text-ink">Pelamar Terbaru</h2>
      <div className="rounded-xl border border-hairline bg-card px-6 py-6">
        <div className="flex flex-col gap-4">
        {applicants.map((applicant) => (
          <ApplicantListItem key={applicant.id} applicant={applicant} />
        ))}
      </div>
    </div>
  </div>
  );
}