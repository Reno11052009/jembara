import type { Metadata } from "next";
import localFont from "next/font/local";
import { connection } from "next/server";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import "./global.css";

const unbounded = localFont({
  src: "../fonts/Unbounded-Variable.woff2",
  variable: "--font-unbounded",
  weight: "200 900",
  display: "swap",
});

const geistSans = localFont({
  src: "../fonts/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Jembatan Karya",
  description: "Temukan talenta. Selesaikan project.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // CSP nonce dibuat per request di proxy dan harus dipasangkan ke script yang
  // dirender Next.js, sehingga root layout tidak boleh diprerender statis.
  await connection();

  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${unbounded.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}
