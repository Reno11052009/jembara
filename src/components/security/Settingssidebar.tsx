// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useEffect, useState } from "react";

// const SETTINGS_NAV_ITEMS = [
//   { label: "Profil", slug: "profile" },
//   { label: "Keamanan", slug: "security" },
//   { label: "Notifikasi", slug: "notifications" },
//   { label: "Pembayaran", slug: "payment" },
//   { label: "Privasi", slug: "privacy" },
//   { label: "Bahasa & Tampilan", slug: "language" },
// ];

// export default function SettingsSidebar() {
//   const pathname = usePathname();
//   const [isOpen, setIsOpen] = useState(false);
//   const [prevPathname, setPrevPathname] = useState(pathname);
//   // Tutup otomatis begitu pindah halaman (klik salah satu nav item)
  
//   if (pathname !== prevPathname) {
//   setPrevPathname(pathname);
//   setIsOpen(false);
// }
  
//   // Kunci scroll body selagi overlay mobile terbuka
//   useEffect(() => {
//     document.body.style.overflow = isOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [isOpen]);

//   // Tutup dengan Escape
//   useEffect(() => {
//     function handleKeyDown(e: KeyboardEvent) {
//       if (e.key === "Escape") setIsOpen(false);
//     }
//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   return (
//     <>
//       {/* Trigger hamburger — cuma render di mobile */}
//       <button
//         type="button"
//         onClick={() => setIsOpen((prev) => !prev)}
//         aria-expanded={isOpen}
//         aria-controls="settings-sidebar"
//         aria-label={isOpen ? "Tutup menu pengaturan" : "Buka menu pengaturan"}
//         className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-[#ECECEC] bg-white shadow-sm dark:bg-card md:hidden"
//       >
//         <span className="relative flex h-4 w-5 flex-col justify-between">
//           <span
//             className={`h-0.5 w-full rounded-full bg-neutral-800 transition-transform duration-300 dark:bg-ink ${
//               isOpen ? "translate-y-1.75 rotate-45" : ""
//             }`}
//           />
//           <span
//             className={`h-0.5 w-full rounded-full bg-neutral-800 transition-opacity duration-300 dark:bg-ink ${
//               isOpen ? "opacity-0" : "opacity-100"
//             }`}
//           />
//           <span
//             className={`h-0.5 w-full rounded-full bg-neutral-800 transition-transform duration-300 dark:bg-ink ${
//               isOpen ? "-translate-y-1.75 -rotate-45" : ""
//             }`}
//           />
//         </span>
//       </button>

//       {/* Backdrop — cuma render pas mobile sidebar kebuka */}
//       {isOpen && (
//         <div
//           onClick={() => setIsOpen(false)}
//           aria-hidden="true"
//           className="fixed inset-0 z-40 bg-black/40 md:hidden"
//         />
//       )}

//       {/* Sidebar — mobile-first: default = overlay slide-in, di-override balik ke static di md+ */}
//       <nav
//         id="settings-sidebar"
//         className={`
//           fixed inset-y-0 left-0 z-50 h-full w-[80%] max-w-xs overflow-y-auto
//           border-0 bg-white transition-transform duration-300 ease-out dark:bg-card
//           ${isOpen ? "translate-x-0" : "-translate-x-full"}
//           md:static md:z-auto md:h-auto md:w-full md:max-w-none md:translate-x-0
//           md:rounded-xl md:border md:border-[#ECECEC] md:transition-none md:overflow-hidden
//         `}
//       >
//         {SETTINGS_NAV_ITEMS.map((item) => {
//           const isActive = pathname?.endsWith(`/settings/${item.slug}`);

//           return (
//             <Link
//               key={item.slug}
//               href={`/dashboard/settings/${item.slug}`}
//               className={`flex items-center px-5 py-4 font-body text-sm transition-colors border-l-[3px] ${
//                 isActive
//                   ? "border-orange-500 bg-orange-50 text-orange-600 font-semibold dark:bg-orange-500/15 dark:text-orange-400"
//                   : "border-transparent text-neutral-800 hover:bg-neutral-50 dark:text-ink dark:hover:bg-void"
//               }`}
//             >
//               {item.label}
//             </Link>
//           );
//         })}
//       </nav>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShieldCheck, Bell, CreditCard, Lock, Languages } from "lucide-react";

const SETTINGS_NAV_ITEMS = [
  { label: "Profil", slug: "profile", icon: User },
  { label: "Keamanan", slug: "security", icon: ShieldCheck },
  { label: "Notifikasi", slug: "notifications", icon: Bell },
  { label: "Pembayaran", slug: "payment", icon: CreditCard },
  { label: "Privasi", slug: "privacy", icon: Lock },
  { label: "Bahasa & Tampilan", slug: "language", icon: Languages },
];

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi pengaturan"
      className="flex items-center gap-1 overflow-x-auto rounded-t-xl border border-b-0 border-[#ECECEC] bg-gray-50 px-4 dark:bg-card sm:gap-2"
    >
      {SETTINGS_NAV_ITEMS.map((item) => {
        const isActive = pathname?.endsWith(`/settings/${item.slug}`);
        const Icon = item.icon;

        return (
          <Link
            key={item.slug}
            href={`/dashboard/settings/${item.slug}`}
            aria-current={isActive ? "page" : undefined}
            aria-label={item.label}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-4 text-sm font-body transition-colors ${
              isActive
                ? "border-blue-600 font-semibold text-blue-600"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:text-ink-muted dark:hover:text-ink"
            }`}
          >
            <Icon size={18} />
            {isActive && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}