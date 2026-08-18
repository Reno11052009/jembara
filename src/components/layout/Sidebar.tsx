"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  FileText,
  Briefcase,
  Image as ImageIcon,
  MessageSquare,
  Wallet,
  User,
  Settings,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Find Projects", href: "/dashboard/find-projects", icon: Search },
  { label: "My Proposals", href: "/dashboard/proposals", icon: FileText },
  { label: "Active Projects", href: "/dashboard/active-projects", icon: Briefcase },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: ImageIcon },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Earnings", href: "/dashboard/earnings", icon: Wallet },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-sidebar px-4 py-6 lg:flex">
      <div className="mb-8 px-2">
        <span className="font-display text-lg font-bold text-white">Jem</span>
        <span className="font-display text-lg font-bold text-brand">bara</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-brand font-medium text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}