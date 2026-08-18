"use client";

import { useState } from "react";
import { Bookmark, TrendingUp } from "lucide-react";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-black text-ink">
          {project.title}
        </h3>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-base font-display font-black text-brand">
          <TrendingUp size={14} />
          {project.matchPercent}% Match
        </span>
      </div>

      <p className="mt-1 text-sm font-body text-ink-muted">{project.companyName}</p>
      <p className="mt-3 text-sm font-body text-ink-muted">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-canvas px-2.5 py-1 text-sm  font-body text-ink"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
        <div>
          <p className="text-ink-muted">Budget</p>
          <p className="mt-0.5 font-display font-black text-ink text-base">{project.budgetLabel}</p>
        </div>
        <div>
          <p className="text-ink-muted">Deadline</p>
          <p className="mt-0.5 font-display font-black text-ink text-base">{project.deadlineLabel}</p>
        </div>
        <div>
          <p className="text-ink-muted">Lokasi</p>
          <p className="mt-0.5 font-display font-black text-ink text-base">{project.locationLabel}</p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-ink-muted">
          <span>Kecocokan Skill</span>
          <span className="font-medium text-brand">{project.skillMatchPercent}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${project.skillMatchPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button className="rounded-lg bg-brand px-6 py-2.5 text-sm font-body font-black uppercase text-white transition-opacity hover:opacity-90">
          Lihat Project
        </button>
        <button
          aria-label={isSaved ? "Hapus dari simpanan" : "Simpan project"}
          aria-pressed={isSaved}
          onClick={() => setIsSaved((prev) => !prev)}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
            isSaved
              ? "border-brand bg-brand-soft text-brand"
              : "border-hairline-ink text-ink hover:border-brand hover:text-brand"
          }`}
        >
          <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}