"use client";

import type { StatItem } from "@/types/landing";
import { useReveal } from "@/hooks/useReveal";
import { Reveal } from "@/components/ui/Reveal";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function StatsBar({ stats }: { stats: StatItem[] }) {
  const { dict } = usePreferences();
  const { ref, isVisible } = useReveal<HTMLElement>();

  const getLocalizedLabel = (label: string) => {
    if (label.includes("Proyek Selesai")) return dict.landing.stats.completedProjects;
    if (label.includes("Mahasiswa Aktif")) return dict.landing.stats.activeStudents;
    if (label.includes("UMKM Mitra")) return dict.landing.stats.partnerUmkm;
    if (label.includes("Tingkat Kepuasan")) return dict.landing.stats.satisfactionRate;
    return label;
  };

  return (
    <section
      ref={ref}
      id="statistik"
      className="bg-black dark:bg-canvas px-6 py-14"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal
            key={stat.label}
            active={isVisible}
            delay={Math.min(i + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6}
          >
            <p className="font-display font-black text-3xl text-brand">
              {stat.value}
            </p>
            <p className="mt-1 font-body text-sm text-white">
              {getLocalizedLabel(stat.label)}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
