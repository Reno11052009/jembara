"use client";

import { useState } from "react";

type NotificationKey =
  | "proposalMasuk"
  | "pesanBaru"
  | "pembayaran"
  | "updateProyek"
  | "promosiInfo";

const notificationItems: { key: NotificationKey; title: string; description: string }[] = [
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

const defaultState: Record<NotificationKey, boolean> = {
  proposalMasuk: true,
  pesanBaru: true,
  pembayaran: true,
  updateProyek: false,
  promosiInfo: false,
};

export default function NotificationSettingsCard() {
  const [settings, setSettings] = useState(defaultState);

  const toggle = (key: NotificationKey) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 mb-5">
        Notifikasi
      </h2>

      <div className="flex flex-col divide-y divide-gray-100">
        {notificationItems.map((item) => (
          <div
            key={item.key}
            className="flex items-start justify-between gap-6 py-4 first:pt-0 last:pb-0"
          >
            <div>
              <p className="font-body text-sm font-semibold text-neutral-900 mb-1">
                {item.title}
              </p>
              <p className="font-body text-sm text-neutral-500 max-w-xl">
                {item.description}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings[item.key]}
              onClick={() => toggle(item.key)}
              className={`relative shrink-0 w-12 h-7 rounded-full transition-colors duration-200 ${
                settings[item.key] ? "bg-orange-500" : "bg-neutral-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  settings[item.key] ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="font-body text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors rounded-full px-6 py-3"
        >
          Simpan Perubahan
        </button>
      </div>
    </section>
  );
}
