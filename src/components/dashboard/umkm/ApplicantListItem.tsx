import type { OwnerRecentApplicant } from "@/types/umkm-owner-dashboard";

export default function ApplicantListItem({ applicant }: { applicant: OwnerRecentApplicant }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-canvas p-4">
      <img
        src={applicant.avatarUrl}
        alt={`Foto profil ${applicant.name}`}
        className="mt-1 h-10 w-10 shrink-0 rounded-full object-cover"
      />
      <div className="flex-1">
        <p className="font-display text-sm font-bold text-ink">{applicant.name}</p>
        <p className="font-body text-xs text-ink-muted">{applicant.role}</p>
        {applicant.projectTitle && (
          <p className="mt-1 line-clamp-1 font-body text-xs text-ink-muted">
            {applicant.projectTitle}
          </p>
        )}
        <span className="mt-1.5 inline-block rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand">
          {applicant.matchPercent}% skill cocok
        </span>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-body text-sm text-ink-muted">{applicant.appliedAtLabel}</span>
      </div>
    </div>
  );
}
