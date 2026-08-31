import type { PortfolioSkill } from "@/types/portfolio";
import SkillEndorsementCard from "@/components/portofolio/SkillEndorsementCard";

interface SkillEndorsementSectionProps {
  skills: PortfolioSkill[];
}

export default function SkillEndorsementSection({
  skills,
}: SkillEndorsementSectionProps) {
  return (
    <div>
      <h2 className="font-display text-lg font-black text-ink">Skill Passport</h2>
      {skills.length ? (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill) => (
            <SkillEndorsementCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-hairline bg-card p-8 text-center text-sm text-ink-muted">
          Belum ada skill. Tambahkan skill melalui pengaturan profil.
        </div>
      )}
    </div>
  );
}
