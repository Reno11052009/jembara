"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SETTINGS_NAV_ITEMS = [
  { label: "Profil", slug: "profil" },
  { label: "Keamanan", slug: "keamanan" },
  { label: "Notifikasi", slug: "notifikasi" },
  { label: "Pembayaran", slug: "pembayaran" },
  { label: "Privasi", slug: "privasi" },
  { label: "Bahasa & Tampilan", slug: "bahasa" },
];

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-24 w-full rounded-xl border border-[#ECECEC] bg-white overflow-hidden">
      {SETTINGS_NAV_ITEMS.map((item) => {
        const isActive = pathname?.endsWith(`/settings/${item.slug}`);

        return (
          <Link
            key={item.slug}
            href={`/dashboard/settings/${item.slug}`}
            className={`flex items-center px-5 py-4 font-body text-sm transition-colors border-l-[3px] ${
              isActive
                ? "border-orange-500 bg-orange-50 text-orange-600 font-semibold"
                : "border-transparent text-neutral-800 hover:bg-neutral-50"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}