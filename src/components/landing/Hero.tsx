"use client";

import Link from "next/link";
import { useMountReveal } from "@/hooks/useMountReveal";

export default function Hero() {
  const isVisible = useMountReveal();

  return (
    <section className="w-full bg-white dark:bg-canvas">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 text-center">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-4 py-1.5 text-xs font-display font-black uppercase tracking-wide text-brand transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
        Solusi Digital untuk UMKM Indonesia
        </span>

        <h1
          className={`mt-6 font-display text-3xl font-black leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-6xl transition-all duration-700 ease-out delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Temukan Talenta.
          <br />
          <span className="text-brand">Selesaikan Project.</span>
        </h1>

        <p
          className={`mx-auto mt-4 sm:mt-6 max-w-xl text-sm sm:text-base text-ink-muted transition-all duration-700 ease-out delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 font-body"
          }`}
        >
          Jembatan Karya menghubungkan UMKM yang membutuhkan solusi digital
          berkualitas dengan mahasiswa berbakat yang siap menghadirkan karya
          terbaik.
        </p>

        <div
          className={`mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center transition-all duration-700 ease-out delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href="/register"
            className="w-full sm:w-auto text-center rounded-full bg-brand px-6 py-3 text-sm font-body font-black uppercase tracking-wide text-white transition-all duration-200 ease-out hover:opacity-90 hover:shadow-lg active:scale-95"
          >
            Cari Talenta
          </Link>
          <Link
            href="/cari-talent"
            className="w-full sm:w-auto text-center rounded-full border border-ink px-6 py-3 text-sm font-body font-black uppercase tracking-wide text-ink transition-all duration-200 ease-out hover:border-brand hover:text-brand active:scale-95"
          >
            Temukan Project
          </Link>
        </div>
      </div>
    </section>
  );
}