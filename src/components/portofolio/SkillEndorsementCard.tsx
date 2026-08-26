import { BadgeCheck, Clock3 } from "lucide-react";
import type { PortfolioSkill } from "@/types/portfolio";

interface SkillEndorsementCardProps {
  skill: PortfolioSkill;
}

export default function SkillEndorsementCard({ skill }: SkillEndorsementCardProps) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <p className="font-display text-sm font-black text-ink">{skill.name}</p>
      <p className="mt-1 text-xs text-ink-muted">
        {skill.category || "Kategori belum ditentukan"}
      </p>
      <div className="mt-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            skill.isVerified
              ? "bg-success/10 text-success"
              : "bg-canvas text-ink-muted"
          }`}
        >
          {skill.isVerified ? <BadgeCheck size={14} /> : <Clock3 size={14} />}
          {skill.isVerified ? "Terverifikasi" : "Belum terverifikasi"}
        </span>
      </div>
    </div>
  );
}
