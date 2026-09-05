"use client";

import { useState, useTransition } from "react";
import { updateNotificationPreferencesAction } from "@/app/actions/notification-preferences";
import type {
  NotificationPreferenceKey,
  NotificationPreferences,
} from "@/types/notification";

const notificationItems: {
  key: NotificationPreferenceKey;
  title: string;
  description: string;
}[] = [
  {
    key: "proposalMasuk",
    title: "Proposal Masuk",
    description: "Dapatkan notifikasi saat ada proposal baru untuk proyek kamu.",
  },
  {
    key: "pesanBaru",
    title: "Pesan Baru",
    description: "Dapatkan notifikasi saat menerima pesan dari klien atau talenta.",
  },
  {
    key: "pembayaran",
    title: "Pembayaran",
    description: "Dapatkan notifikasi terkait status pembayaran dan penarikan dana.",
  },
  {
    key: "updateProyek",
    title: "Update Proyek",
    description: "Dapatkan notifikasi saat ada perubahan status pada proyek aktif.",
  },
  {
    key: "promosiInfo",
    title: "Promosi & Info",
    description: "Dapatkan info seputar tips, promo, dan pembaruan fitur JemBara.",
  },
];

interface NotificationSettingsCardProps {
  initialPreferences: NotificationPreferences;
  isUmkm?: boolean;
}

// Item-item notifikasi UMKM di desain dipisah per kanal (Email / Push), tapi
// skema preferensi di backend cuma punya 5 flag datar tanpa kanal. Beberapa
// item di kanal berbeda jadi sengaja disambungkan ke key yang sama (jadi
// nyala/mati bareng) karena secara makna itu setting yang sama, cuma beda
// kanal penyampaian.
const umkmEmailItems: {
  key: NotificationPreferenceKey;
  title: string;
  description: string;
}[] = [
  {
    key: "proposalMasuk",
    title: "Pelamar Baru Masuk",
    description: "Dapatkan email pemberitahuan instan setiap kali ada talenta melamar ke lowongan Anda.",
  },
  {
    key: "updateProyek",
    title: "Update Status Proyek",
    description: "Notifikasi berkala mengenai tahap pengerjaan proyek oleh talenta terhubung.",
  },
  {
    key: "pesanBaru",
    title: "Pesan Baru dari Talent",
    description: "Email pengingat ketika Anda menerima pesan yang belum dibaca.",
  },
  {
    key: "pembayaran",
    title: "Konfirmasi Pembayaran",
    description: "Laporan bukti transfer transaksi pembayaran proyek yang berhasil.",
  },
];

const umkmPushItems: {
  key: NotificationPreferenceKey;
  title: string;
  description: string;
}[] = [
  {
    key: "pesanBaru",
    title: "Pesan Chat Instan",
    description: "Notifikasi melayang ketika talenta mengirim pesan dalam sistem diskusi.",
  },
  {
    key: "proposalMasuk",
    title: "Pelamar Baru",
    description: "Pemberitahuan real-time di bilah menu atas browser.",
  },
];

export default function NotificationSettingsCard({
  initialPreferences,
  isUmkm = false,
}: NotificationSettingsCardProps) {
  const [settings, setSettings] = useState(initialPreferences);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  // "Pengingat Batas Waktu Proyek (Deadline)" belum ada kolomnya di skema
  // NotificationPreferences backend — ditampilkan dulu sesuai desain, belum
  // tersambung ke penyimpanan.
  const [deadlineReminder, setDeadlineReminder] = useState(true);

  const toggle = (key: NotificationPreferenceKey) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setFeedback(null);
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateNotificationPreferencesAction(settings);

      if (!result.success) {
        setFeedback({
          type: "error",
          message: result.error,
        });
        return;
      }

      setSettings(result.preferences);
      setFeedback({
        type: "success",
        message: "Pengaturan notifikasi tersimpan.",
      });
    });
  };

  const renderToggleRow = (item: { key: NotificationPreferenceKey; title: string; description: string }) => (
    <div
      key={item.key}
      className="flex items-start justify-between gap-6 py-4 first:pt-0 last:pb-0"
    >
      <div>
        <p className="font-body text-sm font-semibold text-neutral-900 dark:text-ink mb-1">
          {item.title}
        </p>
        <p className="font-body text-sm text-neutral-500 dark:text-ink-muted max-w-xl">
          {item.description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={settings[item.key]}
        onClick={() => toggle(item.key)}
        className={`relative shrink-0 w-12 h-7 rounded-full transition-colors duration-200 ${
          settings[item.key] ? "bg-orange-500" : "bg-neutral-300 dark:bg-surface"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white dark:bg-card shadow transition-transform duration-200 ${
            settings[item.key] ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  if (isUmkm) {
    return (
      <div className="flex flex-col gap-6">
        <section className="bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-hairline shadow-sm p-6">
          <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-ink mb-5">
            Notifikasi Email
          </h2>
          <div className="flex flex-col divide-y divide-gray-100 dark:divide-hairline">
            {umkmEmailItems.map(renderToggleRow)}
          </div>
        </section>

        <section className="bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-hairline shadow-sm p-6">
          <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-ink mb-5">
            Notifikasi Push (Aplikasi)
          </h2>
          <div className="flex flex-col divide-y divide-gray-100 dark:divide-hairline">
            {umkmPushItems.map(renderToggleRow)}
            <div className="flex items-start justify-between gap-6 py-4 first:pt-0 last:pb-0">
              <div>
                <p className="font-body text-sm font-semibold text-neutral-900 dark:text-ink mb-1">
                  Pengingat Batas Waktu Proyek (Deadline)
                </p>
                <p className="font-body text-sm text-neutral-500 dark:text-ink-muted max-w-xl">
                  Alarm peringatan otomatis 48 jam sebelum durasi kontrak proyek berakhir.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={deadlineReminder}
                onClick={() => setDeadlineReminder((prev) => !prev)}
                className={`relative shrink-0 w-12 h-7 rounded-full transition-colors duration-200 ${
                  deadlineReminder ? "bg-orange-500" : "bg-neutral-300 dark:bg-surface"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white dark:bg-card shadow transition-transform duration-200 ${
                    deadlineReminder ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-end gap-4">
          {feedback && (
            <p
              role="status"
              className={`font-body text-sm ${
                feedback.type === "success" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {feedback.message}
            </p>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="font-body text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 transition-colors rounded-full px-6 py-3"
          >
            {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-hairline shadow-sm p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-ink mb-5">
        Notifikasi
      </h2>

      <div className="flex flex-col divide-y divide-gray-100">
        {notificationItems.map(renderToggleRow)}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4 mt-6">
        {feedback && (
          <p
            role="status"
            className={`font-body text-sm ${
              feedback.type === "success" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {feedback.message}
          </p>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="font-body text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 transition-colors rounded-full px-6 py-3"
        >
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </section>
  );
}