"use client";
import { stats } from "@/lib/mock-landing";
import { useReveal } from "@/hooks/useReveal";

export default function StatsBar() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="statistik"
      className={`bg-black px-6 py-14 transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-display text-3xl font-bold text-brand">
              {stat.value}
            </p>
            <p className="mt-1 font-display text-sm  text-white">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}