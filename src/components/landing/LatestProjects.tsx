"use client";

import { Calendar } from "lucide-react";
import type { LandingProject, ProjectBadge } from "@/types/landing";
import { useReveal } from "@/hooks/useReveal";
import { Reveal } from "@/components/ui/Reveal";

const badgeStyles: Record<ProjectBadge, string> = {
  Premium: "bg-brand-soft text-brand",
  Urgent: "bg-danger-soft text-danger",
};

export default function LatestProjects({ projects }: { projects: LandingProject[] }) {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="project"
      className="bg-white dark:bg-canvas px-6 py-20"
    >
      <div className="mx-auto max-w-7xl text-center">
        <Reveal
          as="p"
          active={isVisible}
          delay={1}
          className="font-display text-xs font-black uppercase tracking-[0.15em] text-brand"
        >
          Daftar Project
        </Reveal>
        <Reveal
          as="h2"
          active={isVisible}
          delay={2}
          className="mt-2 font-display text-3xl font-black text-ink"
        >
          Project Terbaru dari UMKM
        </Reveal>
        <Reveal
          as="p"
          active={isVisible}
          delay={3}
          className="font-body mx-auto mt-3 max-w-xl text-sm text-ink-muted"
        >
          Lihat peluang kerja sama terbaru dan mulailah membangun portofolio
          hebat Anda hari ini.
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal
              key={project.id}
              active={isVisible}
              delay={Math.min(i + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6}
              className="flex h-full flex-col rounded-xl border border-hairline bg-[#F9F9F9] dark:bg-card p-6"
            >
              {/* 1. Nama Klien & Badge */}
              <div className="flex items-start justify-between gap-2">
                <p className="font-body text-sm font-black text-ink-muted">
                  {project.clientName}
                </p>
                {project.badge && (
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 font-display text-xs font-black ${badgeStyles[project.badge]}`}
                  >
                    {project.badge}
                  </span>
                )}
              </div>

              {/* 2. Judul Project — tinggi konsisten 2 baris */}
              <h3 className="mt-2 line-clamp-2 min-h-12 font-display text-base font-black text-ink">
                {project.title}
              </h3>

              {/* 3. Estimasi Budget */}
              <div className="mt-4">
                <p className="font-body text-xs text-ink-muted">Estimasi Budget</p>
                <p className="font-display text-sm font-black text-brand">
                  {project.budgetLabel}
                </p>
              </div>

              {/* 4. Durasi */}
              <div className="mt-3 flex items-center gap-1.5 font-body text-xs text-ink">
                <Calendar size={12} />
                {project.durationLabel}
              </div>

              {/* 5. Tags / Skills — selalu di dasar card */}
              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-canvas px-2.5 py-1 font-body text-xs text-ink"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
          {projects.length === 0 && <p className="col-span-full rounded-xl border border-dashed border-hairline p-8 text-center text-ink-muted">Belum ada project OPEN. Jadilah UMKM pertama yang memasang project.</p>}
        </div>
      </div>
    </section>
  );
}
