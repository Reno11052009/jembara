import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  TrendingUp,
} from "lucide-react";
import ProposalForm from "@/components/projects/ProposalForm";
import { getProjectDetailData } from "@/lib/project-detail";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectDetailData(projectId);

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/dashboard/find-projects"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-brand"
      >
        <ArrowLeft size={16} /> Kembali ke marketplace
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <main className="rounded-xl border border-hairline bg-card p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
                <BriefcaseBusiness size={14} /> Project OPEN
              </span>
              <h1 className="mt-3 font-display text-2xl font-black text-ink sm:text-3xl">
                {project.title}
              </h1>
              <p className="mt-2 font-semibold text-ink-muted">
                {project.businessName} · {project.businessLocation}
              </p>
            </div>
            {project.viewerRole === "STUDENT" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-2 text-sm font-black text-white">
                <TrendingUp size={16} /> {project.skillMatchPercent}% skill cocok
              </span>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-canvas p-4">
              <p className="text-xs text-ink-muted">Budget Tetap</p>
              <p className="mt-1 font-display font-black text-ink">
                {project.budgetLabel}
              </p>
            </div>
            <div className="rounded-xl bg-canvas p-4">
              <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                <CalendarDays size={13} /> Deadline
              </p>
              <p className="mt-1 font-display font-black text-ink">
                {project.deadlineLabel}
              </p>
            </div>
            <div className="rounded-xl bg-canvas p-4">
              <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                <MapPin size={13} /> Mode & Lokasi
              </p>
              <p className="mt-1 font-display font-black text-ink">
                {project.workModeLabel} · {project.locationLabel}
              </p>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="font-display text-lg font-black text-ink">
              Deskripsi Project
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink-muted">
              {project.description}
            </p>
          </section>

          <section className="mt-8">
            <h2 className="font-display text-lg font-black text-ink">
              Skill Wajib
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.requiredSkills.map((skill) => {
                const matched = project.matchedSkills.includes(skill);
                return (
                  <span
                    key={skill}
                    className={matched
                      ? "rounded-full bg-success/10 px-3 py-1.5 text-sm font-semibold text-success"
                      : "rounded-full bg-canvas px-3 py-1.5 text-sm font-semibold text-ink"}
                  >
                    {skill}{matched ? " · cocok" : ""}
                  </span>
                );
              })}
            </div>
            {project.viewerRole === "STUDENT" && project.missingSkills.length > 0 && (
              <p className="mt-3 text-sm text-ink-muted">
                Skill wajib yang belum tercantum di profil Anda: {project.missingSkills.join(", ")}.
              </p>
            )}
          </section>
        </main>

        <aside className="h-fit rounded-xl border border-hairline bg-card p-6 lg:sticky lg:top-6">
          <h2 className="font-display text-lg font-black text-ink">
            Ajukan Proposal
          </h2>
          {project.canApply ? (
            <ProposalForm
              projectId={project.id}
              budgetLabel={project.budgetLabel}
            />
          ) : (
            <div className="mt-4 rounded-xl bg-canvas p-4">
              <p className="text-sm font-semibold text-ink">
                {project.applyDisabledReason}
              </p>
              {project.existingProposalStatus && (
                <p className="mt-2 text-xs text-ink-muted">
                  Status proposal: {project.existingProposalStatus}
                </p>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}