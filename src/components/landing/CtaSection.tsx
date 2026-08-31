import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="animate-reveal bg-black px-6 py-20 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="animate-reveal animate-reveal-d1 font-display text-4xl font-black text-white">
          Siap Memulai Langkah Anda
          <span className="block">
            Bersama{' '}
            <span className="text-brand">Jembatan Karya</span>?
          </span>
        </h2>
        <p className="animate-reveal animate-reveal-d2 mt-4 text-lg font-body text-slate-400">
          Daftarkan bisnis UMKM Anda atau profil mahasiswa bertalenta tinggi
          secara gratis sekarang juga.
        </p>

        <div className="animate-reveal animate-reveal-d3 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register?role=umkm"
            className="rounded-full bg-brand px-6 py-3 text-sm font-body font-black text-white hover:opacity-90"
          >
            DAFTAR SEBAGAI UMKM
          </Link>
          <Link
            href="/register?role=mahasiswa"
            className="text-sm font-body font-black uppercase text-white hover:text-brand"
          >
            Daftar Sebagai Mahasiswa
          </Link>
        </div>
      </div>
    </section>
  );
}