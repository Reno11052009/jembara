"use client";

import Link from "next/link";
import { Bell, CheckCircle2, Info } from "lucide-react";
import type { DashboardNotification } from "@/types/dashboard";
import { usePreferences } from "@/contexts/PreferencesContext";
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

function formatRelativeTimeLabel(label: string, language: Language) {
  if (language === "id") return label;

  if (label === "Baru saja") {
    return language === "en" ? "Just now" : "たった今";
  }

  const minutesMatch = label.match(/^(\d+)\s+menit\s+lalu$/);
  if (minutesMatch) {
    return language === "en" ? `${minutesMatch[1]}m ago` : `${minutesMatch[1]}分前`;
  }

  const hoursMatch = label.match(/^(\d+)\s+jam\s+lalu$/);
  if (hoursMatch) {
    return language === "en" ? `${hoursMatch[1]}h ago` : `${hoursMatch[1]}時間前`;
  }

  const daysMatch = label.match(/^(\d+)\s+hari\s+lalu$/);
  if (daysMatch) {
    return language === "en" ? `${daysMatch[1]}d ago` : `${daysMatch[1]}日前`;
  }

  return label;
}

function NotificationItem({ notification }: { notification: DashboardNotification }) {
  const { language } = usePreferences();
  const Icon = notification.isRead ? CheckCircle2 : Info;
  const loc = localizeNotification(notification.title, notification.message, language);
  const timeLabel = formatRelativeTimeLabel(notification.createdAtLabel, language);

  const content = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Icon size={15} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-display font-black text-ink">
          {loc.title}
        </span>
        <span className="mt-0.5 block truncate text-[11px] text-ink-muted">
          {loc.message}
        </span>
        <span className="mt-1 block text-[10px] text-gray-400 dark:text-ink-muted">
          {timeLabel}
        </span>
      </span>
    </>
  );
  const className = `flex items-start gap-3 rounded-lg p-4 ${
    notification.isRead ? "bg-canvas" : "bg-orange-50/70 dark:bg-orange-500/10"
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
  const { dict } = usePreferences();

  return (
    <div className="rounded-xl border border-hairline bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-display font-black text-ink">{dict.notifications.title}</h3>
        <Bell size={16} className="text-brand" />
      </div>

      <div className="mt-2 flex flex-col gap-3">
        {notifications.length === 0 ? (
          <p className="rounded-lg bg-canvas p-4 text-sm text-ink-muted">
            {dict.notifications.empty}
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
