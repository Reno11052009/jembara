"use client";

import Link from "next/link";
import { useMountReveal } from "@/hooks/useMountReveal";

export default function Hero() {
  const isVisible = useMountReveal();

  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <span
        className={`inline-block rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        Solusi Digital untuk UMKM Indonesia
      </span>

      <h1
        className={`mt-6 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl transition-all duration-700 ease-out delay-100 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        Temukan Talenta.
        <br />
        <span className="text-brand">Selesaikan Project.</span>
      </h1>

      <p
        className={`mx-auto mt-6 max-w-xl text-ink-muted transition-all duration-700 ease-out delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        Jembatan Karya menghubungkan UMKM yang membutuhkan solusi digital
        berkualitas dengan mahasiswa berbakat yang siap menghadirkan karya
        terbaik.
      </p>

      <div
        className={`mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row transition-all duration-700 ease-out delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <Link
          href="/register"
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Cari Talenta
        </Link>
        <Link
          href="/find-projects"
          className="rounded-full border border-hairline px-6 py-3 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
        >
          Temukan Project
        </Link>
      </div>
    </section>
  );
}