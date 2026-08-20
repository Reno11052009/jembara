import Link from "next/link";
import GoBackLink from "@/components/errors/GoBackLink";

export default function NotFoundContent() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 text-center">
      <p className="font-display text-8xl font-black leading-none text-brand">404</p>

      <h1 className="mt-6 font-display text-3xl font-black text-ink">
        Halaman Tidak Ditemukan
      </h1>
      <p className="mt-3 font-body text-sm text-ink-muted">
        Maaf, halaman yang kamu cari tidak tersedia atau telah dipindahkan.
      </p>

      <Link
        href="/"
        className="mt-6 rounded-full bg-brand px-8 py-3.5 font-display text-sm font-black uppercase tracking-wide text-white transition-opacity hover:opacity-90"
      >
        Kembali ke Beranda
      </Link>

      <div className="mt-3">
        <GoBackLink />
      </div>
    </div>
  );
}