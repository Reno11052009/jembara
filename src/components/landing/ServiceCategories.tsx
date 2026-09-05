"use client";

import { serviceCategories } from "@/lib/landing-content";
import { useReveal } from "@/hooks/useReveal";
import { Reveal } from "@/components/ui/Reveal";

export default function ServiceCategories() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="kategori"
      className="bg-white dark:bg-canvas py-20"
    >
      <div className="mx-auto max-w-7xl text-center">
        <Reveal
          as="p"
          active={isVisible}
          delay={1}
          className="text-xs font-display font-black uppercase tracking-[0.15em] text-brand"
        >
          Kategori Populer
        </Reveal>
        <Reveal
          as="h2"
          active={isVisible}
          delay={2}
          className="mt-2 font-display text-3xl font-black text-black dark:text-ink"
        >
          Layanan Digital Paling Dicari
        </Reveal>
        <Reveal
          as="p"
          active={isVisible}
          delay={3}
          className="font-body mx-auto mt-3 max-w-xl text-sm text-ink-muted"
        >
          Temukan talenta terbaik berdasarkan keahlian spesifik yang
          dibutuhkan bisnis Anda.
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.map((category, i) => {
            const Icon = category.icon;
            return (
              <Reveal
                key={category.title}
                active={isVisible}
                delay={Math.min(i + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6}
                className="flex items-center gap-5 rounded-2xl border border-hairline bg-gray-100 dark:bg-card p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-display font-black text-ink text-base">
                    {category.title}
                  </h3>
                  <p className="font-body text-sm text-ink-muted">
                    {category.activeProjectsLabel}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
