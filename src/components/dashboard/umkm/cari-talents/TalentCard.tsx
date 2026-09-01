import { Star } from "lucide-react";
import type { Talent } from "@/types/talent";

export default function TalentCard({
  talent,
  showSkillMatch,
}: {
  talent: Talent;
  showSkillMatch: boolean;
}) {
  const initials = talent.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      id={`talent-${talent.id}`}
      className="scroll-mt-6 rounded-xl border border-hairline bg-card p-5 target:border-brand target:ring-2 target:ring-brand/20"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-sm font-black text-brand">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-black text-ink">
              {talent.name}
            </h3>
            {showSkillMatch && (
              <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-display font-black text-brand">
                {talent.matchPercent}% skill cocok
              </span>
            )}
          </div>
          <p className="text-sm font-body text-ink-muted">{talent.role}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-body font-bold text-ink">
        <Star size={14} className="fill-brand text-brand" />
        {talent.rating === null ? "Talent baru" : talent.rating.toFixed(1)}
        <span>·</span>
        {talent.completedProjectCount ?? 0} proyek
        <span>·</span>
        {talent.portfolioCount ?? 0} portofolio
        <span>·</span>
        {talent.location}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {talent.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-md bg-canvas px-2.5 py-1 text-sm font-body text-ink"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-5 font-display font-black text-ink">
        {talent.profileUrl ? (
          <a
            href={talent.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Lihat Portofolio
          </a>
        ) : (
          <span className="inline-flex w-full items-center justify-center rounded-full bg-canvas px-5 py-2.5 text-sm font-semibold text-ink-muted">
            Portofolio belum tersedia
          </span>
        )}
      </div>
    </div>
  );
}
