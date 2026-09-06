"use client";

import { BadgeCheck, Clock3 } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { setSkillEvidenceAction } from "@/app/actions/skills";
import SearchableSelect from "@/components/ui/SearchableSelect";
import type { PortfolioProject, PortfolioSkill } from "@/types/portfolio";
import { usePreferences } from "@/contexts/PreferencesContext";

interface SkillEndorsementCardProps {
  skill: PortfolioSkill;
  projects: PortfolioProject[];
}

export default function SkillEndorsementCard({ skill, projects }: SkillEndorsementCardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { dict } = usePreferences();

  function updateEvidence(portfolioId: string) {
    startTransition(async () => {
      const result = await setSkillEvidenceAction(skill.id, portfolioId);
      if (!result.success) await Swal.fire({ icon: "error", title: dict.common.cancel || "Gagal", text: result.error });
      else { await Swal.fire({ icon: "success", title: dict.portfolio?.evidence?.successTitle || "Bukti skill diperbarui", text: dict.portfolio?.evidence?.successDesc || "Admin dapat meninjau portofolio yang dipilih." }); router.refresh(); }
    });
  }

  const evidenceOptions = [
    { code: "", name: dict.portfolio?.evidence?.notSelected || "Belum dipilih" },
    ...projects.map((project) => ({
      code: project.id,
      name: project.title,
    })),
  ];

  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <p className="font-display text-sm font-black text-ink">{skill.name}</p>
      <p className="mt-1 text-xs text-ink-muted">
        {skill.category || (dict.portfolio?.evidence?.unspecifiedCategory || "Kategori belum ditentukan")} · {skill.level.toLocaleLowerCase("id-ID")}
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
          {skill.isVerified ? (dict.common.verified || "Terverifikasi") : (dict.common.unverified || "Belum terverifikasi")}
        </span>
      </div>
      <div className="mt-4">
        <SearchableSelect
          id={`evidence-portfolio-${skill.id}`}
          label={dict.portfolio?.evidence?.label || "Bukti portofolio"}
          labelClassName="block text-xs font-semibold text-ink-muted mb-1"
          value={skill.evidencePortfolioId ?? ""}
          disabled={pending}
          onChange={(portfolioId) => updateEvidence(portfolioId)}
          options={evidenceOptions}
          placeholder={dict.portfolio?.evidence?.placeholder || "Pilih bukti portofolio"}
          showSearch={false}
        />
      </div>
    </div>
  );
}
