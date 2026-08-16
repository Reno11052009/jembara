import PageHeader from "@/components/layout/PageHeader";
import FilterBar from "@/components/projects/FilterBar";
import ProjectCard from "@/components/projects/ProjectCard";
import { mockProjects } from "@/lib/mock-projects";

export default function FindProjectsPage() {
  return (
    <>
      <PageHeader
        title="Find Projects"
        subtitle="Temukan project yang sesuai dengan skill kamu."
      />
      <FilterBar />

      <div className="mb-4 flex items-center gap-2">
        <h2 className="font-display text-lg font-black text-ink">
          Project yang Mungkin Cocok Untukmu
        </h2>
        <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-body font-bold text-brand">
          Cocok dengan skill kamu
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}