"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SETTINGS_NAV_ITEMS = [
  { label: "Profil", slug: "profile" },
  { label: "Keamanan", slug: "security" },
  { label: "Notifikasi", slug: "notifications" },
  { label: "Pembayaran", slug: "payment" },
  { label: "Privasi", slug: "privacy" },
  { label: "Bahasa & Tampilan", slug: "language" },
];

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-full rounded-xl border border-[#ECECEC] bg-white dark:bg-card overflow-hidden">
      {SETTINGS_NAV_ITEMS.map((item) => {
        const isActive = pathname?.endsWith(`/settings/${item.slug}`);

        return (
          <Link
            key={item.slug}
            href={`/dashboard/settings/${item.slug}`}
            className={`flex items-center px-5 py-4 font-body text-sm transition-colors border-l-[3px] ${
              isActive
                ? "border-orange-500 bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 font-semibold"
                : "border-transparent text-neutral-800 dark:text-ink hover:bg-neutral-50 dark:hover:bg-void"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}