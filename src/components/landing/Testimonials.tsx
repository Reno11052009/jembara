"use client";
import { testimonials } from "@/lib/mock-landing";
import { useReveal } from "@/hooks/useReveal";

export default function Testimonials() {
  const { ref, isVisible } = useReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      className={`px-6 py-20 transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">
          Cerita Sukses
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink">
          Apa Kata Mereka Tentang Kami
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-muted">
          Dari para pelaku usaha kecil hingga talenta muda masa depan negeri
          ini.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 text-left sm:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-xl border border-hairline bg-card p-6"
            >
              <p className="text-sm text-ink-muted">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full bg-brand-soft" />
                <div>
                  <p className="text-sm font-semibold text-ink">{testimonial.name}</p>
                  <p className="text-xs text-ink-muted">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}