"use client";

import { testimonials } from "@/lib/mock-landing";
import { useReveal } from "@/hooks/useReveal";
import { Reveal } from "@/components/ui/Reveal";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Testimonials() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="dark:bg-landing-dark px-6 py-20 font-sans"
    >
      <div className="mx-auto max-w-7xl text-center">
        <Reveal
          as="p"
          active={isVisible}
          delay={1}
          className="font-display text-lg font-black uppercase tracking-[0.15em] text-brand"
        >
          Cerita Sukses
        </Reveal>
        <Reveal
          as="h2"
          active={isVisible}
          delay={2}
          className="mt-2 font-display text-4xl font-black text-ink"
        >
          Apa Kata Mereka Tentang Kami
        </Reveal>
        <Reveal
          as="p"
          active={isVisible}
          delay={3}
          className="mx-auto mt-3 max-w-xl text-base text-ink-muted"
        >
          Dari para pelaku usaha kecil hingga talenta muda masa depan negeri
          ini.
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 text-left sm:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <Reveal
              key={index}
              active={isVisible}
              delay={Math.min(index + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6}
              className="flex h-full flex-col rounded-xl border border-hairline bg-card p-6"
            >
              {/* Quote — dibatasi tinggi & konsisten */}
              <p className="line-clamp-4 font-body text-lg text-black dark:text-ink">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author — selalu di dasar card */}
              <div className="mt-auto flex items-center gap-3 pt-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-sm font-black text-brand">
                  {getInitials(testimonial.name)}
                </div>
                <div>
                  <p className="text-base font-display font-black text-ink">
                    {testimonial.name}
                  </p>
                  <p className="text-sm font-body text-ink-muted">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
