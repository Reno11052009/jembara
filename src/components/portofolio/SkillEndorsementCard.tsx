"use client";

import { BadgeCheck, Clock3 } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { setSkillEvidenceAction } from "@/app/actions/skills";
import type { PortfolioProject, PortfolioSkill } from "@/types/portfolio";

interface SkillEndorsementCardProps {
  skill: PortfolioSkill;
  projects: PortfolioProject[];
}

export default function SkillEndorsementCard({ skill, projects }: SkillEndorsementCardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function updateEvidence(portfolioId: string) {
    startTransition(async () => {
      const result = await setSkillEvidenceAction(skill.id, portfolioId);
      if (!result.success) await Swal.fire({ icon: "error", title: "Gagal", text: result.error });
      else { await Swal.fire({ icon: "success", title: "Bukti skill diperbarui", text: "Admin dapat meninjau portofolio yang dipilih." }); router.refresh(); }
    });
  }
  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <p className="font-display text-sm font-black text-ink">{skill.name}</p>
      <p className="mt-1 text-xs text-ink-muted">
        {skill.category || "Kategori belum ditentukan"} · {skill.level.toLocaleLowerCase("id-ID")}
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
      <label className="mt-4 block text-xs font-semibold text-ink-muted">Bukti portofolio
        <select value={skill.evidencePortfolioId ?? ""} disabled={pending} onChange={(event) => updateEvidence(event.target.value)} className="mt-1 w-full rounded-lg border border-hairline bg-card px-2 py-2 text-xs text-ink">
          <option value="">Belum dipilih</option>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
        </select>
      </label>
    </div>
  );
}
