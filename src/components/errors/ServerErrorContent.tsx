import Link from "next/link";

interface ServerErrorContentProps {
  onRetry: () => void;
}

export default function ServerErrorContent({ onRetry }: ServerErrorContentProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 text-center">
      <p className="font-display text-8xl font-black leading-none">
        <span className="text-ink">5</span>
        <span className="text-brand">0</span>
        <span className="text-ink">0</span>
      </p>

      <h1 className="mt-6 font-display text-3xl font-black text-ink">
        Terjadi Kesalahan Server
      </h1>
      <p className="mt-3 font-body text-sm text-ink-muted">
        Maaf, terjadi masalah di server kami. Tim kami sedang memperbaikinya.
        Silakan coba lagi nanti.
      </p>

      <button
        onClick={onRetry}
        className="mt-6 rounded-full bg-brand px-8 py-3.5 font-display text-sm font-black uppercase tracking-wide text-white transition-opacity hover:opacity-90"
      >
        Coba Lagi
      </button>

      <Link
        href="#"
        className="mt-3 font-body text-sm font-medium text-ink underline underline-offset-2 hover:text-brand"
      >
        Hubungi Support
      </Link>
    </div>
  );
}