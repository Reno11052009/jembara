import "server-only";

import { Star } from "lucide-react";
import { cacheLife } from "next/cache";
import prisma from "@/lib/prisma";

export default async function TopTalent() {
  "use cache";
  cacheLife("minutes");

  const topTalents = await prisma.student.findMany({
    where: { available: true },
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

  return (
    <section
      id="talenta"
      className="animate-reveal dark:bg-landing-dark px-6 py-20"
    >
      <div className="mx-auto max-w-7xl text-center">
        <p className="animate-reveal animate-reveal-d1 text-xs font-display font-black uppercase tracking-[0.15em] text-brand">
          Talenta Berbakat
        </p>
        <h2 className="animate-reveal animate-reveal-d2 mt-2 font-display text-3xl font-black text-ink">
          Mahasiswa Terbaik Minggu Ini
        </h2>
        <p className="animate-reveal animate-reveal-d3 mx-auto mt-3 max-w-xl text-sm font-body text-ink-muted">
          Lihat profil mahasiswa berprestasi dengan rekam jejak penyelesaian
          project yang mengagumkan.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
          {topTalents.map((talent, index) => {
            const name = talent.user.name?.trim() || "Talent Jembara";
            const skills = talent.skills
              .map(({ skill }) => skill.name)
              .sort((first, second) => first.localeCompare(second, "id-ID"))
              .slice(0, 3);
            const specialty =
              talent.jurusan ||
              talent.skills.find(({ skill }) => skill.category)?.skill
                .category ||
              skills[0] ||
              "Talent Jembara";

            return (
              <div
                key={talent.id}
                className={`animate-reveal animate-reveal-d${Math.min(index + 1, 6)} rounded-xl border border-hairline bg-card p-10`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-soft text-base font-display font-black text-brand">
                    {name
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="font-display font-black text-ink">{name}</p>
                    <p className="text-base font-body text-ink-muted">
                      {talent.school || "Institusi belum diisi"}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-base font-body font-medium text-brand">
                  {specialty}
                </p>
                <div className="mt-1 flex items-center gap-1 text-sm font-body text-ink-muted">
                  <Star size={16} className="fill-brand text-brand" />
                  {talent._count.reviews > 0
                    ? talent.rating.toFixed(1)
                    : "Talent baru"}{" "}
                  · {talent.total_project} Selesai
                </div>

                <div className="mt-6 flex flex-wrap gap-3 font-body">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-canvas px-2.5 py-1 text-xs text-black dark:text-ink"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
          {topTalents.length === 0 && (
            <p className="col-span-full rounded-xl border border-hairline bg-card p-10 text-center font-body text-sm text-ink-muted">
              Belum ada talent yang tersedia saat ini.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
