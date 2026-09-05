"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import type { Talent } from "@/types/landing";
import { useReveal } from "@/hooks/useReveal";
import { Reveal } from "@/components/ui/Reveal";

export default function TopTalent({ talents }: { talents: Talent[] }) {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="talenta"
      className="dark:bg-landing-dark px-6 py-20"
    >
      <div className="mx-auto max-w-7xl text-center">
        <Reveal
          as="p"
          active={isVisible}
          delay={1}
          className="text-xs font-display font-black uppercase tracking-[0.15em] text-brand"
        >
          Talenta Berbakat
        </Reveal>
        <Reveal
          as="h2"
          active={isVisible}
          delay={2}
          className="mt-2 font-display text-3xl font-black text-ink"
        >
          Mahasiswa Terbaik Minggu Ini
        </Reveal>
        <Reveal
          as="p"
          active={isVisible}
          delay={3}
          className="mx-auto mt-3 max-w-xl text-sm font-body text-ink-muted"
        >
          Lihat profil mahasiswa berprestasi dengan rekam jejak penyelesaian
          project yang mengagumkan.
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
          {talents.map((talent, i) => (
            <Reveal
              key={talent.id}
              active={isVisible}
              delay={Math.min(i + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6}
              className="rounded-xl border border-hairline bg-card p-10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-soft text-base font-display font-black text-brand">
                  {talent.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-display font-black text-ink">{talent.name}</p>
                  <p className="text-base font-body text-ink-muted">
                    {talent.school}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-base font-body font-medium text-brand">
                {talent.specialty}
              </p>
              <div className="mt-1 flex items-center gap-1 text-sm font-body text-ink-muted">
                <Star size={16} className="fill-brand text-brand" />
                {talent.rating.toFixed(1)} · {talent.completedLabel}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 font-body">
                {talent.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-canvas px-2.5 py-1 text-xs text-black dark:text-ink"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <Link href={`/talent/${talent.id}`} className="mt-5 inline-flex text-sm font-bold text-brand">Lihat Skill Passport</Link>
            </Reveal>
          ))}
          {talents.length === 0 && <p className="col-span-full rounded-xl border border-dashed border-hairline p-8 text-center text-ink-muted">Belum ada talent publik yang sedang tersedia.</p>}
        </div>
      </div>
    </section>
  );
}
