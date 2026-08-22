import Link from "next/link";
import { Bell, CheckCircle2, Info } from "lucide-react";
import type { DashboardNotification } from "@/types/dashboard";

function NotificationItem({ notification }: { notification: DashboardNotification }) {
  const Icon = notification.isRead ? CheckCircle2 : Info;
  const content = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Icon size={15} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-display font-black text-ink">
          {notification.title}
        </span>
        <span className="mt-0.5 block truncate text-[11px] text-ink-muted">
          {notification.message}
        </span>
        <span className="mt-1 block text-[10px] text-gray-400">
          {notification.createdAtLabel}
        </span>
      </span>
    </>
  );
  const className = `flex items-start gap-3 rounded-lg p-4 ${
    notification.isRead ? "bg-canvas" : "bg-orange-50/70"
  }`;

  return notification.href ? (
    <Link href={notification.href} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

export default function RecentNotificationsCard({
  notifications,
}: {
  notifications: DashboardNotification[];
}) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-display font-black text-ink">Notifikasi Terbaru</h3>
        <Bell size={16} className="text-brand" />
      </div>

      <div className="mt-2 flex flex-col gap-3">
        {notifications.length === 0 ? (
          <p className="rounded-lg bg-canvas p-4 text-sm text-ink-muted">
            Belum ada notifikasi.
          </p>
        ) : (
          notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        )}
      </div>
    </div>
  );
}
