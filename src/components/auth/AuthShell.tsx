import { ReactNode } from "react";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <div className="relative hidden overflow-hidden bg-sidebar bg-hexgrid lg:flex lg:w-[42%] lg:flex-col lg:justify-between lg:p-10">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            Matchmaking Server: Online
          </span>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand">
            <span className="font-bold text-white">Jembatan</span> Karya
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-white">
            Cari kerja itu <br /> proses matchmaking.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-slate-400">
            Bukan sekadar kirim CV — sistem kami mencocokkan skill-mu dengan
            role yang benar-benar cocok.
          </p>
        </div>

        <div className="flex gap-6 text-[11px] uppercase tracking-[0.2em] text-slate-500">
          <span>Ping: 12ms</span>
          <span>Region: ID-East</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-canvas px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-brand">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
            {title}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-6 text-sm text-ink-muted">{footer}</div>
        </div>
      </div>
    </div>
  );
}