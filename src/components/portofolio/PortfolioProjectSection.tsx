import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import { PortfolioProject } from "@/types/portfolio";
import PortfolioProjectCard from "@/components/portofolio/PortfolioProjectCard";

interface PortfolioProjectSectionProps {
  projects: PortfolioProject[];
}

export default function PortfolioProjectSection({
  projects,
}: PortfolioProjectSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-black text-ink">Karya Terbaikmu</h2>
        <Button variant="primary" className="gap-1.5 px-5 py-2.5 text-xs uppercase">
          <Plus size={14} />
          Tambah Project
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <PortfolioProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}