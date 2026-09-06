"use client";

import type { PortfolioProject, PortfolioSkill } from "@/types/portfolio";
import SkillEndorsementCard from "@/components/portofolio/SkillEndorsementCard";
import { usePreferences } from "@/contexts/PreferencesContext";

interface SkillEndorsementSectionProps {
  skills: PortfolioSkill[];
  projects: PortfolioProject[];
}

export default function SkillEndorsementSection({
  skills, projects,
}: SkillEndorsementSectionProps) {
  const { dict } = usePreferences();

  return (
    <div>
      <h2 className="font-display text-lg font-black text-ink">{dict.portfolio?.skillPassportTitle || "Skill Passport"}</h2>
      {skills.length ? (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill) => (
            <SkillEndorsementCard key={skill.id} skill={skill} projects={projects} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-hairline bg-card p-8 text-center text-sm text-ink-muted">
          {dict.portfolio?.noSkills || "Belum ada skill. Tambahkan skill melalui pengaturan profil."}
        </div>
      )}
    </div>
  );
}
