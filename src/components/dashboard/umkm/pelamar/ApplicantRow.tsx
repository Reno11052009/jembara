import { Star } from "lucide-react";
import Button from "@/components/ui/Button";
import type { Applicant } from "@/types/applicant";

export default function ApplicantRow({ applicant }: { applicant: Applicant }) {
  const initials = applicant.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-xl border border-hairline bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-sm font-black text-brand">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-black text-ink">
                {applicant.name}
              </h3>
              <span className="flex items-center gap-1 text-sm font-body text-ink-muted">
                {applicant.rating.toFixed(1)}
                <Star size={13} className="fill-brand text-brand" />
              </span>
            </div>
            <p className="text-sm font-body text-ink-muted">
              {`${applicant.location}${applicant.isRemote ? " · Remote" : ""} · ${applicant.appliedAtLabel}`}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-brand-soft px-3 py-1 text-sm font-display font-black text-brand">
          {applicant.matchPercent}% Match
        </span>
      </div>  

      <div className="mt-5">
        <p className="text-base font-bold text-ink">Proposal Singkat</p>
        <p className="mt-1 text-base font-body text-ink">
          &quot;{applicant.proposal}&quot;
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {applicant.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-canvas px-2.5 py-1 text-sm font-body text-ink"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full border-2 border-[#EF4444] px-5 py-2.5 text-base font-display font-black uppercase text-[#EF4444] transition-colors hover:bg-[#EF4444] hover:text-white"
          >
            Tolak
          </button>
          <Button variant="outline" className="uppercase">
            Shortlist
          </Button>
          <Button variant="primary" className="uppercase">
            Hubungi
          </Button>
        </div>
      </div>
    </div>
  );
}
