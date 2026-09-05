"use client";

import { processSteps } from "@/lib/landing-content";
import { useReveal } from "@/hooks/useReveal";
import { Reveal } from "@/components/ui/Reveal";

export default function ProcessSteps() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="cara-kerja"
      className="dark:bg-landing-dark px-6 py-20"
    >
      <div className="mx-auto max-w-7xl text-center">
        <Reveal
          as="p"
          active={isVisible}
          delay={1}
          className="font-body text-xs font-black uppercase tracking-[0.15em] text-brand"
        >
          Proses Sederhana
        </Reveal>
        <Reveal
          as="h2"
          active={isVisible}
          delay={2}
          className="mt-2 font-display text-3xl font-black text-ink"
        >
          Bagaimana Jembara Membantu Anda
        </Reveal>
        <Reveal
          as="p"
          active={isVisible}
          delay={3}
          className="font-body mx-auto mt-3 max-w-xl text-sm text-ink-muted"
        >
          Dari pasang project hingga serah terima hasil kerja, semua
          dirancang aman dan transparan.
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <Reveal
              key={step.number}
              active={isVisible}
              delay={Math.min(i + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6}
              className="rounded-xl bg-card p-6 text-left shadow-sm"
            >
              <p className="font-display text-4xl font-black text-brand">
                {step.number}
              </p>
              <h3 className="font-display mt-3 text-base font-black text-ink">
                {step.title}
              </h3>
              <p className="font-body mt-2 text-sm text-ink-muted">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
