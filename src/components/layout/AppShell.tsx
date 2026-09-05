"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import DashboardFooter from "@/components/layout/DashboardFooter";
import ChatBubbleWidget from "@/components/chatbot/ChatBubbleWidget";

interface AppShellProps {
  children: ReactNode;
  role: string;
  userId: string;
}

export default function AppShell({ children, role, userId }: AppShellProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Tutup drawer begitu pindah halaman — reset saat render, bukan di effect
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsSidebarOpen(false);
  }

  // Kunci scroll body selagi drawer mobile terbuka
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // Tutup dengan Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsSidebarOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-canvas">
      {/*
        Tombol hamburger — cuma tampil di mobile/tablet (lg:hidden).
        Posisi default: left-4 top-4 (di atas konten, di luar sidebar).
        Begitu isSidebarOpen true, digeser translate-x sejauh lebar drawer (w-64 = 256px)
        + sedikit gap, supaya nangkring di luar sisi kanan drawer — nggak numpuk logo.
        Pakai transform (translate-x), bukan animasi `left`, biar GPU-accelerated & smooth.
      */}
      <button
        type="button"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        aria-expanded={isSidebarOpen}
        aria-controls="main-sidebar"
        aria-label={isSidebarOpen ? "Tutup menu" : "Buka menu"}
        className={`fixed left-4 top-4 z-60 flex h-10 w-10 items-center justify-center rounded-lg border border-[#ECECEC] bg-white shadow-sm transition-transform duration-300 ease-out dark:bg-card lg:hidden ${
          isSidebarOpen ? "translate-x-[min(17rem,calc(80vw-3rem))]" : "translate-x-0"
        }`}
      >
        {isSidebarOpen ? (
          <X size={20} className="text-neutral-800 dark:text-ink" />
        ) : (
          <Menu size={20} className="text-neutral-800 dark:text-ink" />
        )}
      </button>

      <Sidebar role={role} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0">
        <main className="flex-1 px-4 pb-6 pt-16 sm:px-8 lg:pt-8">{children}</main>
        <DashboardFooter />
      </div>
      <ChatBubbleWidget role={role} userId={userId} />
    </div>
  );
}