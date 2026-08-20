import Link from "next/link";
import { Bell } from "lucide-react";

export interface PageHeaderProps {
  title: string;
  subtitle: string;
  userName?: string;
  avatarUrl?: string;
}

export default function PageHeader({
  title,
  subtitle,
  userName = "User",
  avatarUrl,
}: PageHeaderProps) {
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

        {/* Avatar inisial yang bisa diklik menuju profil */}
        <Link
          href="/dashboard/profile"
          aria-label="Buka profil"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-display font-black text-brand transition-opacity hover:opacity-80"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`Foto profil ${userName}`}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </Link>
      </div>
    </div>
  );
}
