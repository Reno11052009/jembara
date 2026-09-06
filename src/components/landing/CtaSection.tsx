"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function CtaSection() {
  const { dict } = usePreferences();

  return (
    <section className="bg-black px-6 py-20 text-center">
      <div className="mx-auto max-w-2xl">
        <Reveal as="h2" className="font-display text-4xl font-black text-white">
          {dict.landing.cta.title}
        </Reveal>

        <Reveal
          delay={1}
          as="p"
          className="mt-4 text-lg font-body text-slate-400"
        >
          {dict.landing.cta.subtitle}
        </Reveal>

        <Reveal
          delay={2}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/register?role=umkm"
            className="rounded-full bg-brand px-6 py-3 text-sm font-body font-black text-white hover:opacity-90 uppercase"
          >
            {dict.landing.cta.umkmCta}
          </Link>
          <Link
            href="/register?role=mahasiswa"
            className="text-sm font-body font-black uppercase text-white hover:text-brand"
          >
            {dict.landing.cta.studentCta}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
