"use client";
import { processSteps } from "@/lib/mock-landing";
import { useReveal } from "@/hooks/useReveal";

export default function ProcessSteps() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section ref={ref} id="cara-kerja" className={`bg-canvas px-6 py-20 transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">
          Proses Sederhana
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink">
          Bagaimana Jembatan Karya Membantu Anda
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-muted">
          Dari pasang project hingga serah terima hasil kerja, semua
          dirancang aman dan transparan.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border border-hairline bg-card p-6 text-left"
            >
              <p className="font-display text-2xl font-bold text-brand">
                {step.number}
              </p>
              <h3 className="mt-3 font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}