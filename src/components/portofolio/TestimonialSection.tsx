import { PortfolioTestimonial } from "@/types/portfolio";
import TestimonialCard from "@/components/portofolio/TestimonialCard";

interface TestimonialSectionProps {
  testimonials: PortfolioTestimonial[];
}

export default function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  return (
    <div>
      <h2 className="font-display text-lg font-black text-ink">Testimoni Klien</h2>
      {testimonials.length ? (
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-hairline bg-card p-8 text-center text-sm text-ink-muted">
          Testimoni akan tampil setelah proyek selesai dan UMKM memberikan ulasan.
        </div>
      )}
    </div>
  );
}
