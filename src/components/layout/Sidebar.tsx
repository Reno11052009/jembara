"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  Briefcase,
  Wallet,
  User,
  Settings,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ElementType;
  iconSrc?: string;
}

const navItems: NavItem[] = [
  { label: "Dasbor", href: "/dashboard", iconSrc: "/icons/home.png" },
  { label: "Temu Projek", href: "/dashboard/find-projects", icon: Search },
  { label: "Proposalku", href: "/dashboard/proposals", iconSrc: "/icons/list.png" },
  { label: "Projek Aktif", href: "/dashboard/active-projects", icon: Briefcase },
  { label: "Portfolio", href: "/dashboard/portfolio", iconSrc: "/icons/folder-open.png" },
  { label: "Pesanan", href: "/dashboard/messages", iconSrc: "/icons/Vector.png" },
  { label: "Pendapatan", href: "/dashboard/earnings", icon: Wallet },
  { label: "Profil", href: "/dashboard/profile", icon: User },
  { label: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col self-start bg-sidebar lg:flex">
      <div className="flex h-full flex-col px-4 py-6">
        <div className="mb-8 px-2">
          <span className="font-display text-lg font-bold text-white">Jem</span>
          <span className="font-display text-lg font-bold text-brand">Bara</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-brand font-medium text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute right-6 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-white" />
                )}

                {item.iconSrc ? (
                  <Image
                    src={item.iconSrc}
                    alt=""
                    width={18}
                    height={18}
                    className={`shrink-0 transition-opacity ${
                      isActive ? "opacity-100" : "opacity-60"
                    }`}
                  />
                ) : (
                  Icon && <Icon size={18} className="shrink-0" />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}