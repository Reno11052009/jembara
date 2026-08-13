"use client";
import Link from "next/link";
import { useReveal } from "@/hooks/useReveal";

export default function CtaSection() {
  const { ref, isVisible } = useReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      className={`bg-ink px-6 py-20 text-center transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-3xl font-bold text-white">
          Siap Memulai Langkah Anda Bersama{" "}
          <span className="text-brand">Jembatan Karya</span>?
        </h2>
        <p className="mt-4 text-sm text-slate-400">
          Daftarkan bisnis UMKM Anda atau profil mahasiswa bertalenta tinggi
          secara gratis sekarang juga.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register?role=umkm"
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Daftar Sebagai UMKM
          </Link>
          <Link
            href="/register?role=mahasiswa"
            className="text-sm font-semibold text-white hover:text-brand"
          >
            Daftar Sebagai Mahasiswa
          </Link>
        </div>
      </div>
    </section>
  );
}