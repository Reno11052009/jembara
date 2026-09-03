import { processSteps } from "@/lib/mock-landing";

export default function ProcessSteps() {
  return (
    <section
      id="cara-kerja"
      className="animate-reveal dark:bg-landing-dark px-6 py-20"
    >
      <div className="mx-auto max-w-7xl text-center">
        <p className="animate-reveal animate-reveal-d1 font-body text-xs font-black uppercase tracking-[0.15em] text-brand">
          Proses Sederhana
        </p>
        <h2 className="animate-reveal animate-reveal-d2 mt-2 font-display text-3xl font-black text-ink">
          Bagaimana Jembatan Karya Membantu Anda
        </h2>
        <p className="animate-reveal animate-reveal-d3 font-body mx-auto mt-3 max-w-xl text-sm text-ink-muted">
          Dari pasang project hingga serah terima hasil kerja, semua
          dirancang aman dan transparan.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <div
              key={step.number}
              className={`animate-reveal animate-reveal-d${Math.min(i + 1, 6)} rounded-xl bg-card p-6 text-left shadow-sm`}
            >
              <p className="font-display text-4xl font-black text-brand">
                {step.number}
              </p>
              <h3 className="font-display mt-3 text-base font-black text-ink">
                {step.title}
              </h3>
              <p className="font-body mt-2 text-sm text-ink-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}