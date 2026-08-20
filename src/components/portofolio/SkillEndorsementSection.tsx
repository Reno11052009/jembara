import { SkillEndorsement } from "@/types/portfolio";
import SkillEndorsementCard from "@/components/portofolio/SkillEndorsementCard";

interface SkillEndorsementSectionProps {
  skills: SkillEndorsement[];
}

export default function SkillEndorsementSection({
  skills,
}: SkillEndorsementSectionProps) {
  return (
    <div>
      <h2 className="font-display text-lg font-black text-ink">Skill & Endorsement</h2>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((skill) => (
          <SkillEndorsementCard key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  );
}