import Button from "@/components/ui/Button";
import { AdminUserRow } from "@/types/admin-users";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function UserListRow({ user }: { user: AdminUserRow }) {
  const isActive = user.status === "aktif";

  return (
    <div className="grid grid-cols-[minmax(220px,1fr)_140px_80px_110px_110px_170px] items-center gap-4 px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-sm font-black text-brand">
          {getInitials(user.name)}
        </span>
        <div>
          <p className="font-display text-sm font-bold text-ink">{user.name}</p>
          <p className="text-xs text-ink-muted">{user.email}</p>
        </div>
      </div>

      <span className="text-sm text-ink">{user.skill}</span>

      <span className="text-sm font-bold text-ink">{user.rating.toFixed(1)} ★</span>

      <span
        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${
          isActive ? "bg-success/10 text-success" : "bg-danger-soft text-danger"
        }`}
      >
        {isActive ? "Aktif" : "Nonaktif"}
      </span>

      <span className="text-sm text-ink-muted">{user.joinedDate}</span>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Lihat
        </Button>
        {isActive ? (
          <Button variant="danger-soft" size="sm">
            Suspend
          </Button>
        ) : (
          <Button variant="success-soft" size="sm">
            Aktifkan
          </Button>
        )}
      </div>
    </div>
  );
}
