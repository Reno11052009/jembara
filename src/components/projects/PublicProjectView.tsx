"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
} from "lucide-react";
import ShareProjectButton from "@/components/projects/ShareProjectButton";
import { usePreferences } from "@/contexts/PreferencesContext";
import type { getPublicProjectDetailData } from "@/lib/public-project";

type PublicProjectData = NonNullable<Awaited<ReturnType<typeof getPublicProjectDetailData>>>;

export default function PublicProjectView({
  project,
}: {
  project: PublicProjectData;
}) {
  const { dict } = usePreferences();
  const projDict = dict.projects;

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-hairline bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-md bg-brand" />
            <span className="font-display text-lg font-black text-ink">
              Jem<span className="text-brand">Bara</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-ink hover:text-brand"
            >
              {projDict.login}
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white hover:opacity-90"
            >
              {projDict.register}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-8 sm:py-12">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-brand"
        >
          <ArrowLeft size={16} aria-hidden="true" /> {projDict.backToJembara}
        </Link>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
                  <BriefcaseBusiness size={14} aria-hidden="true" /> {projDict.projectOpen}
                </span>
                <h1 className="mt-3 font-display text-2xl font-black text-ink sm:text-3xl">
                  {project.title}
                </h1>
                <p className="mt-2 font-semibold text-ink-muted">
                  {project.businessName} · {project.businessLocation}
                </p>
              </div>
              <ShareProjectButton
                projectId={project.id}
                projectTitle={project.title}
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-canvas p-4">
                <p className="text-xs text-ink-muted">{projDict.fixedBudget}</p>
                <p className="mt-1 font-display font-black text-ink">
                  {project.budgetLabel}
                </p>
              </div>
              <div className="rounded-xl bg-canvas p-4">
                <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <CalendarDays size={13} aria-hidden="true" /> {projDict.deadlineLabel}
                </p>
                <p className="mt-1 font-display font-black text-ink">
                  {project.deadlineLabel}
                </p>
              </div>
              <div className="rounded-xl bg-canvas p-4">
                <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <MapPin size={13} aria-hidden="true" /> {projDict.modeAndLocation}
                </p>
                <p className="mt-1 font-display font-black text-ink">
                  {project.workModeLabel} · {project.locationLabel}
                </p>
              </div>
            </div>

            <section className="mt-8">
              <h2 className="font-display text-lg font-black text-ink">
                {projDict.projectDescription}
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink-muted">
                {project.description}
              </p>
            </section>
            {project.optionalSkills.length > 0 && (
              <section className="mt-6">
                <h2 className="font-display text-lg font-black text-ink">
                  {projDict.optionalSkills}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.optionalSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-hairline px-3 py-1.5 text-sm font-semibold text-ink-muted"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-8">
              <h2 className="font-display text-lg font-black text-ink">
                {projDict.requiredSkills}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-canvas px-3 py-1.5 text-sm font-semibold text-ink"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </article>

          <aside className="h-fit rounded-2xl border border-hairline bg-card p-6 lg:sticky lg:top-6">
            <h2 className="font-display text-lg font-black text-ink">
              {projDict.interestedTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              {projDict.interestedDesc}
            </p>
            <Link
              href={`/dashboard/find-projects/${project.id}`}
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              {projDict.viewAndApply}
            </Link>
            <p className="mt-3 text-center text-xs text-ink-muted">
              {projDict.noAccount}{" "}
              <Link href="/register" className="font-semibold text-brand">
                {projDict.registerFree}
              </Link>
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}
