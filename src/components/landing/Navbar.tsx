"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, User, X, Landmark } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

const navLinks = [
  { label: "Bagaimana Cara Kerja", href: "#cara-kerja" },
  { label: "Kategori", href: "#kategori" },
  { label: "Talenta", href: "#talenta" },
  { label: "Project", href: "#project" },
  { label: "Statistik", href: "#statistik" },
];

interface NavbarProps {
  sessionName: string | null;
}

interface AccountDropdownProps {
  sessionName: string;
  mobile?: boolean;
}

function AccountDropdown({ sessionName, mobile = false }: AccountDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={mobile ? "relative w-full" : "relative"}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((current) => !current)}
        className={
          mobile
            ? "flex w-full items-center justify-between text-sm font-black text-ink"
            : "flex max-w-48 items-center gap-1.5 text-sm font-medium text-ink hover:text-brand"
        }
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <User size={16} aria-hidden="true" className="shrink-0" />
          <span className="truncate">{sessionName}</span>
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          id={menuId}
          className={
            mobile
              ? "mt-2 flex flex-col rounded-xl border border-hairline bg-card p-1.5 shadow-lg"
              : "absolute right-0 top-full z-50 mt-3 flex w-48 flex-col rounded-xl border border-hairline bg-card p-1.5 shadow-lg"
          }
        >
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-black/5 dark:hover:bg-white/10"
          >
            Dashboard
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-ink hover:bg-black/5 dark:hover:bg-white/10"
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function Navbar({ sessionName }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const authenticatedName = sessionName?.trim() || null;

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand">
            <Landmark size={23} className="text-white" />
          </span>
          <span className="font-display text-lg font-black text-ink">
            Jembatan <span className="text-brand">Karya</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-black dark:text-ink hover:text-brand transition-colors duration-200 ease-out font-body font-black"
            >
              {link.label}
            </a>
          ))}
        </nav>
  
        <div className="hidden items-center gap-4 lg:flex">
          {authenticatedName ? (
            <AccountDropdown sessionName={authenticatedName} />
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-ink hover:text-brand">
                Masuk
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-body font-black text-white hover:opacity-90"
              >
                DAFTAR SEKARANG
              </Link>
            </>
          )}
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
            {authenticatedName ? (
              <AccountDropdown sessionName={authenticatedName} mobile />
            ) : (
              <>
                <Link href="/login" className="text-sm font-black text-ink">
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-ink px-5 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Daftar Sekarang
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
