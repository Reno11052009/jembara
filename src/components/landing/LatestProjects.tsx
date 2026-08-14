"use client";
import { Calendar } from "lucide-react";
import { latestProjects } from "@/lib/mock-landing";
import { ProjectBadge } from "@/types/landing";
import { useReveal } from "@/hooks/useReveal";

const badgeStyles: Record<ProjectBadge, string> = {
  Premium: "bg-brand-soft text-brand",
  Urgent: "bg-danger-soft text-danger",
  Popular: "bg-success/10 text-success",
};

export default function LatestProjects() {
  const { ref, isVisible } = useReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      id="project"
      className={`px-6 py-20 transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">
          Daftar Project
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink">
          Project Terbaru dari UMKM
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-muted">
          Lihat peluang kerja sama terbaru dan mulailah membangun portofolio
          hebat Anda hari ini.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
          {latestProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-hairline bg-card p-6"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-ink-muted">{project.clientName}</p>
                {project.badge && (
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${badgeStyles[project.badge]}`}
                  >
                    {project.badge}
                  </span>
                )}
              </div>

              <h3 className="mt-2 font-semibold text-ink">{project.title}</h3>

              <p className="mt-4 text-xs text-ink-muted">Estimasi Budget</p>
              <p className="text-sm font-semibold text-ink">{project.budgetLabel}</p>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-muted">
                <Calendar size={12} />
                {project.durationLabel}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-canvas px-2.5 py-1 text-xs text-ink-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}