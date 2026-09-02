import { stats } from "@/lib/mock-landing";

export default function StatsBar() {
  return (
    <section
      id="statistik"
      className="animate-reveal bg-canvas px-6 py-14"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`animate-reveal animate-reveal-d${Math.min(i + 1, 6)}`}
          >
            <p className="font-display font-black text-3xl text-brand">
              {stat.value}
            </p>
            <p className="mt-1 font-body text-sm text-white">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}