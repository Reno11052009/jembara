import { CheckCircle2, Star } from "lucide-react";
import type { Applicant } from "@/types/applicant";

const statusStyles: Record<Applicant["status"], string> = {
  Pending: "bg-brand-soft text-brand",
  Diterima: "bg-success/10 text-success",
  Ditolak: "bg-danger-soft text-danger",
};

export default function ApplicantRow({ applicant }: { applicant: Applicant }) {
  const initials = applicant.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="rounded-xl border border-hairline bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-sm font-black text-brand">
            {initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base font-black text-ink">
                {applicant.name}
              </h3>
              <span className="flex items-center gap-1 text-sm text-ink-muted">
                {applicant.rating === null
                  ? "Talent baru"
                  : `${applicant.rating.toFixed(1)} (${applicant.reviewCount})`}
                <Star size={13} className="fill-brand text-brand" />
              </span>
            </div>
            <p className="text-sm text-ink-muted">
              {applicant.location}
              {applicant.isRemote ? " · Project remote" : ""}
              {` · ${applicant.appliedAtLabel}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-display font-black text-brand">
            {applicant.matchPercent}% skill cocok
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[applicant.status]}`}>
            {applicant.status}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-bold text-ink">Proposal</p>
        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-ink-muted">
          {applicant.proposal}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {applicant.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-canvas px-2.5 py-1 text-sm text-ink"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {applicant.budgetMatch && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
              <CheckCircle2 size={14} /> Menyetujui budget
            </span>
          )}
          {applicant.portfolioUrl ? (
            <a
              href={applicant.portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ink px-4 py-2 text-xs font-display font-bold uppercase text-ink hover:border-brand hover:text-brand"
            >
              Lihat Portofolio
            </a>
          ) : (
            <span className="text-xs text-ink-muted">Portofolio belum tersedia</span>
          )}
        </div>
      </div>
    </article>
  );
}
