import Link from "next/link";
import GoBackLink from "@/components/errors/GoBackLink";

export default function ForbiddenContent() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 text-center">
      <p className="font-display text-8xl font-black leading-none">
        <span className="text-ink">4</span>
        <span className="text-brand">0</span>
        <span className="text-ink">3</span>
      </p>

      <h1 className="mt-6 font-display text-3xl font-black text-ink">
        Akses Ditolak
      </h1>
      <p className="mt-3 font-body text-sm text-ink-muted">
        Kamu tidak memiliki izin untuk mengakses halaman ini.
        Pastikan kamu sudah login dengan akun yang benar.
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