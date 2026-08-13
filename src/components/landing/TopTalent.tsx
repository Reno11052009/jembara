"use client";
import { Star } from "lucide-react";
import { topTalents } from "@/lib/mock-landing";
import { useReveal } from "@/hooks/useReveal";

export default function TopTalent() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="talenta"
      className={`bg-canvas px-6 py-20 transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">
          Talenta Berbakat
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink">
          Mahasiswa Terbaik Minggu Ini
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-muted">
          Lihat profil mahasiswa berprestasi dengan rekam jejak penyelesaian
          project yang mengagumkan.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
          {topTalents.map((talent) => (
            <div
              key={talent.id}
              className="rounded-xl border border-hairline bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand">
                  {talent.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold text-ink">{talent.name}</p>
                  <p className="text-xs text-ink-muted">{talent.school}</p>
                </div>
              </div>

              <p className="mt-4 text-sm font-semibold text-brand">
                {talent.specialty}
              </p>
              <div className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                <Star size={12} className="fill-brand text-brand" />
                {talent.rating.toFixed(1)} · {talent.completedLabel}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {talent.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-canvas px-2.5 py-1 text-xs text-ink-muted"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}