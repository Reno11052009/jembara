"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import link from "next/link";

const navLinks = [
  { label: "Bagaimana Cara Kerja", href: "#cara-kerja" },
  { label: "Kategori", href: "#kategori" },
  { label: "Talenta", href: "#talenta" },
  { label: "Project", href: "#project" },
  { label: "Statistik", href: "#statistik" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-brand" />
          <span className="font-display text-lg font-bold text-ink">
            Jembatan <span className="text-brand">Karya</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink-muted hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
  
        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/login" className="text-sm font-medium text-ink hover:text-brand">
            Masuk
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Daftar Sekarang
          </Link>
        </div>

        <button
          aria-label="Buka menu"
          className="lg:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-4 border-t border-hairline px-6 py-4 lg:hidden">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-ink-muted">
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-3">
            <Link href="/login" className="text-sm font-medium text-ink">
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-ink px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}