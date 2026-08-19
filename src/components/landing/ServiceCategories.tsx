"use client";
import { serviceCategories } from "@/lib/mock-landing";
import { useReveal } from "@/hooks/useReveal";

export default function ServiceCategories() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="kategori"
      className={`bg-white py-20 transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-xs font-display font-black uppercase tracking-[0.15em] text-brand">
          Kategori Populer
        </p>
        <h2 className="mt-2 font-display text-3xl font-black text-black">
          Layanan Digital Paling Dicari
        </h2>
        <p className="font-body mx-auto mt-3 max-w-xl text-sm text-ink-muted">
          Temukan talenta terbaik berdasarkan keahlian spesifik yang
          dibutuhkan bisnis Anda.
        </p>

        <div className="mt-12 grid grid-cols-3 gap-5 text-left">
          {serviceCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="flex items-center gap-5 rounded-2xl border border-hairline bg-gray-100 p-6"
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
              </div>
            );
          })}
        </div>  
      </div>
    </section>
  );
}