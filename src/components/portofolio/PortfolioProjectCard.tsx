import { Image as ImageIcon, Star } from "lucide-react";
import { PortfolioProject } from "@/types/portfolio";

interface PortfolioProjectCardProps {
  project: PortfolioProject;
}

export default function PortfolioProjectCard({ project }: PortfolioProjectCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-card">
      {/* Placeholder gambar — ganti <div> ini dengan <Image src={project.imageUrl} .../>
          dari next/image begitu foto asli tersedia */}
      <div className="flex h-40 items-center justify-center bg-hairline">
        <ImageIcon size={28} className="text-ink-muted" />
      </div>

      <div className="p-5">
        <h3 className="font-display text-base font-black leading-snug text-ink">
          {project.title}
        </h3>
        <p className="mt-1 font-body text-sm text-ink-muted">{project.clientName}</p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-canvas px-2.5 py-1 text-xs font-body font-semibold text-ink"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="flex shrink-0 items-center gap-1 font-display text-sm font-black text-ink">
            <Star size={14} className="fill-brand text-brand" />
            {project.rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="font-body text-xs text-ink-muted">{project.completedLabel}</p>
          {project.verified && (
            <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
              Verified
            </span>
          )}
        </div>
      </div>
    </div>
  );
}