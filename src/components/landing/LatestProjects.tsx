import { Calendar } from "lucide-react";
import { latestProjects } from "@/lib/mock-landing";
import { ProjectBadge } from "@/types/landing";

const badgeStyles: Record<ProjectBadge, string> = {
  Premium: "bg-brand-soft text-brand",
  Urgent: "bg-danger-soft text-danger",
};

export default function LatestProjects() {
  return (
    <section
      id="project"
      className="animate-reveal bg-white dark:bg-canvas px-6 py-20"
    >
      <div className="mx-auto max-w-7xl text-center">
        <p className="animate-reveal animate-reveal-d1 font-display text-xs font-black uppercase tracking-[0.15em] text-brand">
          Daftar Project
        </p>
        <h2 className="animate-reveal animate-reveal-d2 mt-2 font-display text-3xl font-black text-ink">
          Project Terbaru dari UMKM
        </h2>
        <p className="animate-reveal animate-reveal-d3 font-body mx-auto mt-3 max-w-xl text-sm text-ink-muted">
          Lihat peluang kerja sama terbaru dan mulailah membangun portofolio
          hebat Anda hari ini.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
          {latestProjects.map((project, i) => (
            <div
              key={project.id}
              className={`animate-reveal animate-reveal-d${Math.min(i + 1, 6)} rounded-xl border border-hairline bg-[#F9F9F9] dark:bg-card p-6`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-body font-black text-sm text-ink-muted">{project.clientName}</p>
                {project.badge && (
                  <span
                    className={`font-display shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${badgeStyles[project.badge]}`}
                  >
                    {project.badge}
                  </span>
                )}
              </div>

              <h3 className="mt-2 font-display text-base font-black text-ink">{project.title}</h3>

              <p className="font-body mt-4 text-xs text-ink-muted">Estimasi Budget</p>
              <p className="font-display text-sm font-black text-brand">{project.budgetLabel}</p>

              <div className="font-body mt-3 flex items-center gap-1.5 text-xs text-ink">
                <Calendar size={12} />
                {project.durationLabel}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-roboto rounded-md bg-canvas px-2.5 py-1 text-xs text-ink"
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