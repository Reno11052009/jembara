"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search, Briefcase, User, Settings, Users, LayoutGrid, Building2, Handshake,
} from "lucide-react";
import { Home, ListChecks, FolderOpen, MessageSquare, CreditCard, FileText, LogOut } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { logoutAction } from "@/app/actions/auth";

interface NavItem {
  key:
    | "dashboard" | "findProjects" | "myProposals" | "activeProjects"
    | "portfolio" | "messages" | "earnings" | "profile" | "settings"
    | "cariTalent" | "pelamar" | "daftarUser" | "daftarUmkm" | "relasi"
    | "lowongan" | "monitorPesan";
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

const umkmNavItems: NavItem[] = [
  { key: "dashboard", href: "/dashboard", icon: Home },
  { key: "cariTalent", href: "/dashboard/cari-talent", icon: Users },
  { key: "lowongan", href: "/dashboard/lowongan-saya", icon: Briefcase },
  { key: "pelamar", href: "/dashboard/pelamar", icon: FileText },
  { key: "activeProjects", href: "/dashboard/active-projects", icon: Briefcase },
  { key: "messages", href: "/dashboard/messages", icon: MessageSquare },
  { key: "settings", href: "/dashboard/settings", icon: Settings },
];

const adminNavItems: NavItem[] = [
  { key: "dashboard", href: "/dashboard", icon: LayoutGrid },
  { key: "daftarUser", href: "/dashboard/daftar-user", icon: Users },
  { key: "daftarUmkm", href: "/dashboard/daftar-umkm", icon: Building2 },
  { key: "relasi", href: "/dashboard/relasi", icon: Handshake },
  { key: "lowongan", href: "/dashboard/lowongan", icon: Briefcase },
  { key: "monitorPesan", href: "/dashboard/monitor-pesan", icon: MessageSquare },
];

interface SidebarProps {
  role: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { dict } = usePreferences();

  const navItems =
    role === "ADMIN"
      ? adminNavItems
      : role === "UMKM"
        ? umkmNavItems
        : studentNavItems.filter((item) => item.key !== "myProposals" || role === "STUDENT");

  return (
    <>
      {/* Backdrop — cuma render pas mobile drawer kebuka */}
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex h-dvh w-64 max-w-[80%] shrink-0 flex-col
          self-start bg-sidebar transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-60 lg:translate-x-0 lg:transition-none
        `}
      >
        {/* Header / Logo */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            {role === "ADMIN" && <span className="h-6 w-6 rounded-md bg-brand" />}
            <span className="font-display text-lg font-bold text-white">Jem</span>
            <span className="font-display text-lg font-bold text-brand">Bara</span>
            {role === "ADMIN" && (
              <span className="font-body text-xs font-semibold tracking-wide text-white/70">
                ADMIN
              </span>
            )}
          </Link>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <nav className="flex flex-col gap-1">
            {navItems
              .filter(
                (item) =>
                  !["myProposals", "portfolio"].includes(item.key) ||
                  role === "STUDENT",
              )
              .map((item) => {
              const isUmkmLowongan = role === "UMKM" && item.key === "lowongan";
              const isActive = isUmkmLowongan
                ? pathname === "/dashboard/lowongan-saya" ||
                  pathname === "/dashboard/pasang-lowongan"
                : pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-brand font-medium text-white"
                      : "text-white hover:bg-white/5 hover:text-white"
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
              <p className="font-body text-xs text-white/70">Logged in as:</p>
              <p className="font-display text-sm font-bold text-white">Super Admin</p>
            </div>
          )}
        </div>

        {/* Fixed Footer untuk Tombol Logout (Selalu Terlihat) */}
        <div className="shrink-0 border-t border-white/10 p-4">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm text-white transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut size={18} className="shrink-0" />
              {dict.sidebar.logout}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}