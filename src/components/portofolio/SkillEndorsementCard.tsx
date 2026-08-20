import { SkillEndorsement } from "@/types/portfolio";

interface SkillEndorsementCardProps {
  skill: SkillEndorsement;
}

export default function SkillEndorsementCard({ skill }: SkillEndorsementCardProps) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <p className="font-display text-sm font-black text-ink">{skill.name}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="h-2 min-w-15 flex-1 overflow-hidden rounded-full bg-hairline">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${skill.percent}%` }}
          />
        </div>
        <span className="shrink-0 font-display text-sm font-black text-ink">
          {skill.percent}%
        </span>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand">
          {skill.endorsementCount} Endorsements
        </span>
      </div>
    </div>
  );
}