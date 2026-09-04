import "server-only";

import { Calendar } from "lucide-react";
import { cacheLife } from "next/cache";
import { formatBudget, formatDeadline } from "@/lib/dashboard-utils";
import prisma from "@/lib/prisma";

export default async function LatestProjects() {
  "use cache";
  cacheLife("minutes");

  const latestProjects = await prisma.project.findMany({
    where: { status: "OPEN", studentId: null },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take: 3,
    select: {
      id: true,
      title: true,
      budget: true,
      deadline: true,
      umkm: { select: { nama_usaha: true } },
      skillsNeeded: {
        select: { skill: { select: { name: true } } },
      },
    },
  });

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
          {latestProjects.map((project, index) => {
            const tags = project.skillsNeeded
              .map(({ skill }) => skill.name)
              .sort((first, second) => first.localeCompare(second, "id-ID"))
              .slice(0, 3);

            return (
              <div
                key={project.id}
                className={`animate-reveal animate-reveal-d${Math.min(index + 1, 6)} rounded-xl border border-hairline bg-[#F9F9F9] dark:bg-card p-6`}
              >
                <p className="font-body text-sm font-black text-ink-muted">
                  {project.umkm.nama_usaha}
                </p>

                <h3 className="mt-2 font-display text-base font-black text-ink">
                  {project.title}
                </h3>

                <p className="font-body mt-4 text-xs text-ink-muted">
                  Estimasi Budget
                </p>
                <p className="font-display text-sm font-black text-brand">
                  {formatBudget(project.budget)}
                </p>

                <div className="font-body mt-3 flex items-center gap-1.5 text-xs text-ink">
                  <Calendar size={12} />
                  {formatDeadline(project.deadline)}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-roboto rounded-md bg-canvas px-2.5 py-1 text-xs text-ink"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
          {latestProjects.length === 0 && (
            <p className="col-span-full rounded-xl border border-hairline bg-[#F9F9F9] p-10 text-center font-body text-sm text-ink-muted dark:bg-card">
              Belum ada project terbuka saat ini.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
