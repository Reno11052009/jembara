import { ExternalLink, Image as ImageIcon } from "lucide-react";
import type { PortfolioProject } from "@/types/portfolio";

interface PortfolioProjectCardProps {
  project: PortfolioProject;
}

export default function PortfolioProjectCard({ project }: PortfolioProjectCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-hairline bg-card">
      <div className="flex h-40 items-center justify-center overflow-hidden bg-hairline">
        {project.imageUrl ? (
          // URL gambar berasal dari isian portofolio dan dapat menggunakan host berbeda.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageUrl}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon size={28} className="text-ink-muted" />
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display text-base font-black leading-snug text-ink">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 font-body text-sm text-ink-muted">
          {project.description || "Belum ada deskripsi karya."}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="font-body text-xs text-ink-muted">{project.updatedLabel}</p>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
            >
              Lihat karya
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
