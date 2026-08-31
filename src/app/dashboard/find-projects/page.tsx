import Link from "next/link";
import DashboardPageHeader from "@/components/layout/DashboardPageHeader";
import FilterBar from "@/components/projects/FilterBar";
import ProjectCard from "@/components/projects/ProjectCard";
import {
  getFindProjectsData,
  type FindProjectsSearchParams,
} from "@/lib/find-projects";
import type { FindProjectFilters } from "@/types/project";

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

export default async function FindProjectsPage({
  searchParams,
}: {
  searchParams: Promise<FindProjectsSearchParams>;
}) {
  const data = await getFindProjectsData(await searchParams);

  return (
    <>
      <DashboardPageHeader
        title="Find Projects"
        subtitle={
          data.canApply
            ? "Temukan project yang sesuai dengan skill kamu."
            : "Jelajahi project terbuka di platform Jembara."
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
          {data.canApply ? "Project yang Mungkin Cocok Untukmu" : "Project Terbuka"}
        </h2>
        <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-body font-bold text-brand">
          {data.totalProjects} project ditemukan
        </span>
      </div>

      {!data.canApply && (
        <div className="mb-5 rounded-xl border border-hairline bg-card px-5 py-4 text-sm text-ink">
          Anda sedang melihat marketplace dalam mode lihat saja. Hanya akun pelajar yang dapat mendaftar atau mengirim proposal ke project.
        </div>
      )}

      {data.canApply && !data.hasStudentSkills && (
        <div className="mb-5 rounded-xl border border-brand/20 bg-brand-soft px-5 py-4 text-sm text-ink">
          Tambahkan skill pada profil agar proyek dapat diurutkan berdasarkan kecocokan.
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
            Belum ada project yang sesuai
          </h3>
          <p className="mt-2 text-sm font-body text-ink-muted">
            Coba ubah kata pencarian atau hapus beberapa filter.
          </p>
          <Link
            href="/dashboard/find-projects"
            className="mt-5 inline-flex rounded-[99px] bg-brand px-5 py-2.5 text-sm font-display font-bold uppercase text-white"
          >
            Reset Filter
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
              Sebelumnya
            </Link>
          )}
          <span className="text-sm font-body text-ink-muted">
            Halaman {data.currentPage} dari {data.totalPages}
          </span>
          {data.currentPage < data.totalPages && (
            <Link
              href={createPageHref(data.filters, data.currentPage + 1)}
              className="rounded-[99px] border border-hairline bg-card px-4 py-2 text-sm font-body font-semibold text-ink hover:border-brand hover:text-brand"
            >
              Berikutnya
            </Link>
          )}
        </nav>
      )}
    </>
  );
}