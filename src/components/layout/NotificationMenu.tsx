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
import { usePreferences } from "@/contexts/PreferencesContext";
import type { HeaderNotification } from "@/types/notification";

const NOTIFICATION_REFRESH_INTERVAL_MS = 120_000;

const notificationPresentation = {
  PROPOSAL: {
    icon: CheckCircle2,
    color: "bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400",
  },
  PROJECT: {
    icon: BriefcaseBusiness,
    color: "bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400",
  },
  MESSAGE: {
    icon: MessageSquareText,
    color: "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400",
  },
  DEADLINE: {
    icon: Clock3,
    color: "bg-amber-50 dark:bg-amber-500/15 text-amber-600",
  },
  INFO: {
    icon: Info,
    color: "bg-gray-100 dark:bg-surface text-gray-600 dark:text-ink-muted",
  },
};

function getPresentation(type: string) {
  const normalizedType = type.toUpperCase() as keyof typeof notificationPresentation;
  return notificationPresentation[normalizedType] ?? notificationPresentation.INFO;
}

import type { Language } from "@/lib/i18n/dictionary";

function localizeNotification(title: string, message: string, language: Language) {
  if (language === "id") return { title, message };

  let locTitle = title;
  let locMessage = message;

  if (title === "Profil berhasil diperbarui") {
    locTitle = language === "en" ? "Profile updated successfully" : "プロフィールが正常に更新されました";
  } else if (title === "Selamat datang di JemBara" || title === "Selamat datang di Jembara") {
    locTitle = language === "en" ? "Welcome to Jembara" : "Jembaraへようこそ";
  } else if (title === "Dana proyek telah diamankan") {
    locTitle = language === "en" ? "Project funds secured" : "プロジェクト資金が保護されました";
  } else if (title === "Pembayaran berhasil") {
    locTitle = language === "en" ? "Payment successful" : "お支払いが完了しました";
  } else if (title === "Proposal baru masuk") {
    locTitle = language === "en" ? "New proposal received" : "新しい提案が届きました";
  } else if (title === "Proposal diterima") {
    locTitle = language === "en" ? "Proposal accepted" : "提案が採用されました";
  } else if (title === "Proposal belum terpilih") {
    locTitle = language === "en" ? "Proposal not selected" : "提案は選ばれませんでした";
  } else if (title === "Proposal belum diterima") {
    locTitle = language === "en" ? "Proposal not accepted" : "提案は受け入れられませんでした";
  } else if (title === "Hasil proyek siap direview") {
    locTitle = language === "en" ? "Project result ready for review" : "プロジェクト成果物のレビュー準備完了";
  } else if (title.startsWith("Revisi ")) {
    locTitle = language === "en" ? title.replace("Revisi", "Revision").replace("diminta", "requested") : title.replace("Revisi", "修正").replace("diminta", "依頼");
  } else if (title === "Ulasan baru diterima") {
    locTitle = language === "en" ? "New review received" : "新しいレビューが届きました";
  } else if (title === "Saldo proyek telah masuk") {
    locTitle = language === "en" ? "Project funds credited" : "プロジェクト資金が入金されました";
  } else if (title === "Penarikan selesai") {
    locTitle = language === "en" ? "Withdrawal completed" : "出金が完了しました";
  } else if (title === "Penarikan ditolak") {
    locTitle = language === "en" ? "Withdrawal rejected" : "出金が拒否されました";
  }

  if (message === "Perubahan profil Anda telah tersimpan di Jembara.") {
    locMessage = language === "en" ? "Your profile changes have been saved to Jembara." : "プロフィールの変更がJembaraに保存されました。";
  } else if (message === "Akun Anda berhasil dibuat. Silakan lengkapi profil untuk mulai menggunakan platform.") {
    locMessage = language === "en" ? "Your account was created successfully. Please complete your profile to get started." : "アカウントが正常に作成されました。開始するにはプロフィールを完成させてください。";
  }

  return { title: locTitle, message: locMessage };
}

function formatRelativeTime(value: string, language: Language) {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) {
    return language === "en" ? "Just now" : language === "ja" ? "たった今" : "Baru saja";
  }

  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
  if (elapsedMinutes < 1) {
    return language === "en" ? "Just now" : language === "ja" ? "たった今" : "Baru saja";
  }
  if (elapsedMinutes < 60) {
    if (language === "en") return `${elapsedMinutes}m ago`;
    if (language === "ja") return `${elapsedMinutes}分前`;
    return `${elapsedMinutes} menit lalu`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    if (language === "en") return `${elapsedHours}h ago`;
    if (language === "ja") return `${elapsedHours}時間前`;
    return `${elapsedHours} jam lalu`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);
  if (elapsedDays < 7) {
    if (language === "en") return `${elapsedDays}d ago`;
    if (language === "ja") return `${elapsedDays}日前`;
    return `${elapsedDays} hari lalu`;
  }

  return new Intl.DateTimeFormat(
    language === "en" ? "en-US" : language === "ja" ? "ja-JP" : "id-ID",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(timestamp));
}

export default function NotificationMenu() {
  const { dict, language } = usePreferences();
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
        suppressHydrationWarning
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
          className="absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-100 dark:border-hairline bg-white dark:bg-card shadow-2xl shadow-black/10"
        >
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-hairline px-5 py-4">
            <div>
              <h2 className="font-display text-base font-black text-ink">{dict.notifications.title}</h2>
              <p className="mt-0.5 text-xs text-ink-muted">
                {unreadCount > 0 ? `${unreadCount} unread` : "All read"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markAllAsRead()}
                className="text-xs font-bold text-brand transition-colors hover:text-orange-700"
              >
                {dict.notifications.markAllRead}
              </button>
            )}
          </div>

          <div className="max-h-[26rem] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-5 py-10 text-sm text-ink-muted">
                <LoaderCircle size={18} className="animate-spin" />
                {dict.common.loading}
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
                  {dict.common.loading}
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center px-5 py-10 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 dark:bg-surface text-gray-400 dark:text-ink-muted">
                  <Bell size={20} />
                </span>
                <p className="mt-3 text-sm font-bold text-ink">{dict.notifications.empty}</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const presentation = getPresentation(notification.type);
                const Icon = presentation.icon;
                const loc = localizeNotification(notification.title, notification.message, language);
                const timeLabel = formatRelativeTime(notification.createdAt, language);

                const content = (
                  <>
                    <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${presentation.color}`}>
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-3">
                        <span className={`text-sm text-ink ${notification.isRead ? "font-semibold" : "font-bold"}`}>
                          {loc.title}
                        </span>
                        {!notification.isRead && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="Belum dibaca" />
                        )}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                        {loc.message}
                      </span>
                      <span className="mt-1.5 block text-[11px] font-medium text-gray-400 dark:text-ink-muted">
                        {timeLabel}
                      </span>
                    </span>
                  </>
                );
                const itemClassName = `flex w-full gap-3 border-b border-gray-50 dark:border-hairline px-5 py-4 text-left transition-colors last:border-0 hover:bg-gray-50 dark:hover:bg-void ${
                  notification.isRead ? "bg-white dark:bg-card" : "bg-orange-50/40 dark:bg-orange-500/10"
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
