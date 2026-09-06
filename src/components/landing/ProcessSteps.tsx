"use client";

import { processSteps } from "@/lib/landing-content";
import { useReveal } from "@/hooks/useReveal";
import { Reveal } from "@/components/ui/Reveal";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function ProcessSteps() {
  const { dict } = usePreferences();
  const { ref, isVisible } = useReveal<HTMLElement>();

  const steps = [
    { number: "01", title: dict.landing.process.step1Title, description: dict.landing.process.step1Desc },
    { number: "02", title: dict.landing.process.step2Title, description: dict.landing.process.step2Desc },
    { number: "03", title: dict.landing.process.step3Title, description: dict.landing.process.step3Desc },
    { number: "04", title: dict.landing.process.step4Title, description: dict.landing.process.step4Desc },
  ];

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
          {dict.landing.process.badge}
        </Reveal>
        <Reveal
          as="h2"
          active={isVisible}
          delay={2}
          className="mt-2 font-display text-3xl font-black text-ink"
        >
          {dict.landing.process.title}
        </Reveal>
        <Reveal
          as="p"
          active={isVisible}
          delay={3}
          className="font-body mx-auto mt-3 max-w-xl text-sm text-ink-muted"
        >
          {dict.landing.process.subtitle}
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
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
