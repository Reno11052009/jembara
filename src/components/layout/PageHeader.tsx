import { Bell } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="font-display text-2xl font-black text-ink">{title}</h1>
        <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          aria-label="Notifikasi"
          className="rounded-full p-2 text-ink transition-colors hover:bg-black/5"
        >
          <Bell size={20} />
        </button>
        {/* TODO: ganti dengan foto profil user sebenarnya */}
        <div className="h-9 w-9 overflow-hidden rounded-full bg-hairline" />
      </div>
    </div>
  );
}