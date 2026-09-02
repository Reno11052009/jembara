"use client";

import Link from "next/link";
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Info,
  LoaderCircle,
  MessageSquareText,
} from "lucide-react";
import {
  getNotificationsAction,
  markAllNotificationsAsReadAction,
  markNotificationAsReadAction,
} from "@/app/actions/notifications";
import type { HeaderNotification } from "@/types/notification";

const NOTIFICATION_REFRESH_INTERVAL_MS = 120_000;

const notificationPresentation = {
  PROPOSAL: {
    icon: CheckCircle2,
    color: "bg-green-50 text-green-600",
  },
  PROJECT: {
    icon: BriefcaseBusiness,
    color: "bg-orange-50 text-orange-600",
  },
  MESSAGE: {
    icon: MessageSquareText,
    color: "bg-blue-50 text-blue-600",
  },
  DEADLINE: {
    icon: Clock3,
    color: "bg-amber-50 text-amber-600",
  },
  INFO: {
    icon: Info,
    color: "bg-gray-100 text-gray-600",
  },
};

function getPresentation(type: string) {
  const normalizedType = type.toUpperCase() as keyof typeof notificationPresentation;
  return notificationPresentation[normalizedType] ?? notificationPresentation.INFO;
}

function formatRelativeTime(value: string) {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "Baru saja";

  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
  if (elapsedMinutes < 1) return "Baru saja";
  if (elapsedMinutes < 60) return `${elapsedMinutes} menit lalu`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} jam lalu`;

  const elapsedDays = Math.floor(elapsedHours / 24);
  if (elapsedDays < 7) return `${elapsedDays} hari lalu`;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}

export default function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<HeaderNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const hasLoadedInitially = useRef(false);
  const isFetching = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const loadNotifications = useCallback(async (showLoading = false) => {
    if (isFetching.current) return;

    isFetching.current = true;
    if (showLoading) setIsLoading(true);
    try {
      setNotifications(await getNotificationsAction());
      setLoadError(null);
    } catch {
      if (showLoading) {
        setLoadError("Notifikasi belum dapat dimuat.");
      }
    } finally {
      isFetching.current = false;
      if (showLoading) setIsLoading(false);
    }
  }, []);

  const handleToggle = useCallback(() => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      startTransition(async () => {
        await loadNotifications();
      });
    }
  }, [isOpen, loadNotifications]);

  useEffect(() => {
    if (!hasLoadedInitially.current) {
      hasLoadedInitially.current = true;
      startTransition(async () => {
        await loadNotifications(true);
      });
    }

    const refreshNotifications = () => {
      if (document.visibilityState !== "visible") return;
      startTransition(async () => {
        await loadNotifications();
      });
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") refreshNotifications();
    };

    window.addEventListener("focus", refreshNotifications);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const refreshInterval = window.setInterval(
      refreshNotifications,
      NOTIFICATION_REFRESH_INTERVAL_MS,
    );

    return () => {
      window.removeEventListener("focus", refreshNotifications);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(refreshInterval);
    };
  }, [loadNotifications]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    );
    setIsOpen(false);

    void markNotificationAsReadAction(id).then((result) => {
      if (!result.success) void loadNotifications();
    });
  };

  const markAllAsRead = async () => {
    const previousNotifications = notifications;
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, isRead: true })),
    );

    try {
      const result = await markAllNotificationsAsReadAction();
      if (!result.success) setNotifications(previousNotifications);
    } catch {
      setNotifications(previousNotifications);
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label={`Notifikasi${unreadCount > 0 ? `, ${unreadCount} belum dibaca` : ""}`}
        aria-expanded={isOpen}
        aria-controls="header-notification-menu"
        onClick={handleToggle}
        className="relative rounded-full p-2 text-ink transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          id="header-notification-menu"
          role="dialog"
          aria-label="Daftar notifikasi"
          className="absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-black/10"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="font-display text-base font-black text-ink">Notifikasi</h2>
              <p className="mt-0.5 text-xs text-ink-muted">
                {unreadCount > 0 ? `${unreadCount} belum dibaca` : "Semua sudah dibaca"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markAllAsRead()}
                className="text-xs font-bold text-brand transition-colors hover:text-orange-700"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="max-h-[26rem] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-5 py-10 text-sm text-ink-muted">
                <LoaderCircle size={18} className="animate-spin" />
                Memuat notifikasi...
              </div>
            ) : loadError ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-red-600">{loadError}</p>
                <button
                  type="button"
                  onClick={() => {
                    void loadNotifications(true);
                  }}
                  className="mt-3 text-xs font-bold text-brand hover:text-orange-700"
                >
                  Coba lagi
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center px-5 py-10 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <Bell size={20} />
                </span>
                <p className="mt-3 text-sm font-bold text-ink">Belum ada notifikasi</p>
                <p className="mt-1 text-xs text-ink-muted">Aktivitas terbaru akan tampil di sini.</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const presentation = getPresentation(notification.type);
                const Icon = presentation.icon;
                const content = (
                  <>
                    <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${presentation.color}`}>
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-3">
                        <span className={`text-sm text-ink ${notification.isRead ? "font-semibold" : "font-bold"}`}>
                          {notification.title}
                        </span>
                        {!notification.isRead && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="Belum dibaca" />
                        )}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                        {notification.message}
                      </span>
                      <span className="mt-1.5 block text-[11px] font-medium text-gray-400">
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                    </span>
                  </>
                );
                const itemClassName = `flex w-full gap-3 border-b border-gray-50 px-5 py-4 text-left transition-colors last:border-0 hover:bg-gray-50 ${
                  notification.isRead ? "bg-white" : "bg-orange-50/40"
                }`;

                return notification.href ? (
                  <Link
                    key={notification.id}
                    href={notification.href}
                    onClick={() => markAsRead(notification.id)}
                    className={itemClassName}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => markAsRead(notification.id)}
                    className={itemClassName}
                  >
                    {content}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
