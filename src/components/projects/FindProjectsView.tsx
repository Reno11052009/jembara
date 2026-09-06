"use client";

import Link from "next/link";
import { usePreferences } from "@/contexts/PreferencesContext";
import PageHeader from "@/components/layout/PageHeader";
import FilterBar from "@/components/projects/FilterBar";
import ProjectCard from "@/components/projects/ProjectCard";
import type { FindProjectsData, FindProjectFilters } from "@/types/project";

function createPageHref(filters: FindProjectFilters, page: number) {
  const searchParams = new URLSearchParams();
  if (filters.query) searchParams.set("q", filters.query);
  if (filters.skill) searchParams.set("skill", filters.skill);
  if (filters.location) searchParams.set("location", filters.location);
  if (filters.budget) searchParams.set("budget", filters.budget);
  if (filters.sort !== "recommended") searchParams.set("sort", filters.sort);
  if (page > 1) searchParams.set("page", String(page));

  const queryString = searchParams.toString();
  return queryString
    ? `/dashboard/find-projects?${queryString}`
    : "/dashboard/find-projects";
}

interface FindProjectsViewProps {
  data: FindProjectsData;
}

export default function FindProjectsView({ data }: FindProjectsViewProps) {
  const { dict } = usePreferences();
  const t = dict.projects;

  const projectsFoundText = t.projectsFound
    .replace("{count}", String(data.totalProjects))
    .replace("{plural}", data.totalProjects === 1 ? "" : "s");

  const pageOfText = t.paginationPageOf
    .replace("{current}", String(data.currentPage))
    .replace("{total}", String(data.totalPages));

  return (
    <>
      <PageHeader
        title={t.findProjectsTitle}
        subtitle={
          data.canApply
            ? t.findProjectsSubtitleApply
            : t.findProjectsSubtitleExplore
        }
      />
      <FilterBar
        key={`${data.filters.query}:${data.filters.skill}:${data.filters.location}:${data.filters.budget}:${data.filters.sort}`}
        filters={data.filters}
        skillOptions={data.skillOptions}
        locationOptions={data.locationOptions}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 className="font-display text-lg font-black text-ink">
          {data.canApply ? t.recommendedSectionTitle : t.openSectionTitle}
        </h2>
        <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-body font-bold text-brand">
          {projectsFoundText}
        </span>
      </div>

      {!data.canApply && (
        <div className="mb-5 rounded-xl border border-hairline bg-card px-5 py-4 text-sm text-ink">
          {t.viewOnlyNotice}
        </div>
      )}

      {data.canApply && !data.hasStudentSkills && (
        <div className="mb-5 rounded-xl border border-brand/20 bg-brand-soft px-5 py-4 text-sm text-ink">
          {t.noSkillsNotice}
        </div>
      )}

      {data.projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {data.projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              showStudentFeatures={data.canApply}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-hairline bg-card px-6 py-12 text-center">
          <h3 className="font-display text-base font-black text-ink">
            {t.emptyStateTitle}
          </h3>
          <p className="mt-2 text-sm font-body text-ink-muted">
            {t.emptyStateDesc}
          </p>
          <Link
            href="/dashboard/find-projects"
            className="mt-5 inline-flex rounded-[99px] bg-brand px-5 py-2.5 text-sm font-display font-bold uppercase text-white transition-colors hover:bg-brand/90"
          >
            {t.resetFilterBtn}
          </Link>
        </div>
      )}

      {data.totalPages > 1 && (
        <nav
          aria-label="Pagination project"
          className="mt-8 flex items-center justify-center gap-3"
        >
          {data.currentPage > 1 && (
            <Link
              href={createPageHref(data.filters, data.currentPage - 1)}
              className="rounded-[99px] border border-hairline bg-card px-4 py-2 text-sm font-body font-semibold text-ink hover:border-brand hover:text-brand"
            >
              {t.paginationPrevious}
            </Link>
          )}
          <span className="text-sm font-body text-ink-muted">
            {pageOfText}
          </span>
          {data.currentPage < data.totalPages && (
            <Link
              href={createPageHref(data.filters, data.currentPage + 1)}
              className="rounded-[99px] border border-hairline bg-card px-4 py-2 text-sm font-body font-semibold text-ink hover:border-brand hover:text-brand"
            >
              {t.paginationNext}
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
