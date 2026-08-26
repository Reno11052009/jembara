import { Star } from "lucide-react";
import Button from "@/components/ui/Button";
import type { Talent } from "@/types/talent";

export default function TalentCard({ talent }: { talent: Talent }) {
  const initials = talent.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-sm font-black text-brand">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-black text-ink">
              {talent.name}
            </h3>
            <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-display font-black text-brand">
              {talent.matchPercent}% Match
            </span>
          </div>
          <p className="text-sm font-body text-ink-muted">{talent.role}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-body font-bold text-ink">
        <Star size={14} className="fill-brand text-brand" />
        {talent.rating.toFixed(1)}
        <span></span>
        {talent.rateLabel}
        <span></span>
        {talent.location}
        {talent.isRemote && <span> Remote</span>}
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

      <div className="mt-5 flex items-center gap-4 font-display font-black text-ink">
        <Button variant="primary" className="flex-1">
          Hubungi
        </Button>
        <Button variant="outline" className="flex-1">
          Lihat Profil
        </Button>
      </div>
    </div>
  );
}