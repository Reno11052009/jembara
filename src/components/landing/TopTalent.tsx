"use client";

import { Star } from "lucide-react";
import { topTalents } from "@/lib/mock-landing";
import { useReveal } from "@/hooks/useReveal";
import { Reveal } from "@/components/ui/Reveal";

<<<<<<< HEAD
export default async function TopTalent() {
  "use cache";
  cacheLife("minutes");

  const topTalents = await prisma.student.findMany({
    where: { available: true, isPublicProfile: true },
    orderBy: [
      { rating: "desc" },
      { total_project: "desc" },
      { createdAt: "desc" },
    ],
    take: 3,
    select: {
      id: true,
      school: true,
      jurusan: true,
      rating: true,
      total_project: true,
      user: { select: { name: true } },
      skills: {
        select: {
          skill: { select: { name: true, category: true } },
        },
      },
      _count: { select: { reviews: true } },
    },
  });
=======
export default function TopTalent() {
  const { ref, isVisible } = useReveal<HTMLElement>();
>>>>>>> 21c38751a638041c925d7476a9a57ff87f36a877

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
          {topTalents.map((talent, i) => (
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
