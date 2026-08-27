"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  Briefcase,
  User,
  Settings,
  Users,
  PlusCircle,
  LayoutGrid,
  Building2,
  Handshake,
} from "lucide-react";
import { Home, ListChecks, FolderOpen, MessageSquare, CreditCard, FileText } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";

interface NavItem {
  key:
    | "dashboard"
    | "findProjects"
    | "myProposals"
    | "activeProjects"
    | "portfolio"
    | "messages"
    | "earnings"
    | "profile"
    | "settings"
    | "cariTalent"
    | "pasangLowongan"
    | "lowonganSaya"
    | "pelamar"
    | "daftarUser"
    | "daftarUmkm"
    | "relasi"
    | "lowongan"
    | "monitorPesan";
  href: string;
  icon?: React.ElementType;
  iconSrc?: string;
}

const studentNavItems: NavItem[] = [
  { key: "dashboard", href: "/dashboard", icon: Home },
  { key: "findProjects", href: "/dashboard/find-projects", icon: Search },
  { key: "myProposals", href: "/dashboard/proposals", icon: ListChecks },
  { key: "activeProjects", href: "/dashboard/active-projects", icon: Briefcase },
  { key: "portfolio", href: "/dashboard/portfolio", icon: FolderOpen },
  { key: "messages", href: "/dashboard/messages", icon: MessageSquare },
  { key: "earnings", href: "/dashboard/earnings", icon: CreditCard },
  { key: "profile", href: "/dashboard/profile", icon: User },
  { key: "settings", href: "/dashboard/settings", icon: Settings },
];

// NOTE: cariTalent / pasangLowongan / lowonganSaya / pelamar pages don't exist yet —
// hrefs below are placeholders, update once those pages are built.
const umkmNavItems: NavItem[] = [
  { key: "dashboard", href: "/dashboard", icon: Home },
  { key: "cariTalent", href: "/dashboard/cari-talent", icon: Users },
  { key: "pasangLowongan", href: "/dashboard/pasang-lowongan", icon: PlusCircle },
  { key: "lowonganSaya", href: "/dashboard/lowongan-saya", icon: ListChecks },
  { key: "pelamar", href: "/dashboard/pelamar", icon: FileText },
  { key: "activeProjects", href: "/dashboard/active-projects", icon: Briefcase },
  { key: "messages", href: "/dashboard/messages", icon: MessageSquare },
  { key: "settings", href: "/dashboard/settings", icon: Settings },
];

// NOTE: daftarUser / daftarUmkm / relasi / lowongan / monitorPesan pages don't
// exist yet — hrefs below are placeholders, update once those pages are built.
const adminNavItems: NavItem[] = [
  { key: "dashboard", href: "/dashboard", icon: LayoutGrid },
  { key: "daftarUser", href: "/dashboard/daftar-user", icon: Users },
  { key: "daftarUmkm", href: "/dashboard/daftar-umkm", icon: Building2 },
  { key: "relasi", href: "/dashboard/relasi", icon: Handshake },
  { key: "lowongan", href: "/dashboard/lowongan", icon: Briefcase },
  { key: "monitorPesan", href: "/dashboard/monitor-pesan", icon: MessageSquare },
];

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const { dict } = usePreferences();

  const navItems =
    role === "ADMIN"
      ? adminNavItems
      : role === "UMKM"
        ? umkmNavItems
        : studentNavItems.filter((item) => item.key !== "myProposals" || role === "STUDENT");

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col self-start bg-sidebar lg:flex">
      <div className="flex h-full flex-col px-4 py-6">
        <Link href="/" className="mb-8 flex items-center gap-2 px-2">
          {role === "ADMIN" && <span className="h-6 w-6 rounded-md bg-brand" />}
          <span className="font-display text-lg font-bold text-white">Jem</span>
          <span className="font-display text-lg font-bold text-brand">Bara</span>
          {role === "ADMIN" && (
            <span className="font-body text-xs font-semibold tracking-wide text-slate-400">
              ADMIN
            </span>
          )}
        </Link>

        <nav className="flex flex-col gap-1">
          {navItems
            .filter(
              (item) =>
                !["myProposals", "portfolio"].includes(item.key) ||
                role === "STUDENT",
            )
            .map((item) => {
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
                {dict.sidebar[item.key]}
              </Link>
            );
          })}
        </nav>

        {role === "ADMIN" && (
          <div className="px-3 pt-4">
            <p className="font-body text-xs text-slate-500">Logged in as:</p>
            <p className="font-display text-sm font-bold text-white">Super Admin</p>
          </div>
        )}
      </div>
    </aside>
  );
}
