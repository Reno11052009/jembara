import { Star } from "lucide-react";
import { PortfolioTestimonial } from "@/types/portfolio";

interface TestimonialCardProps {
  testimonial: PortfolioTestimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const initials = testimonial.clientName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-xl border border-hairline bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-display font-black text-brand">
            {initials}
          </div>
          <div>
            <p className="font-display text-base font-black text-ink">
              {testimonial.clientName}
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {testimonial.projectTitle}
            </p>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1 font-display text-sm font-black text-ink">
          <Star size={14} className="fill-brand text-brand" />
          {testimonial.rating.toFixed(1)}
        </span>
      </div>
      <p className="mt-4 font-body text-sm text-ink-muted">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
    </div>
  );
}
