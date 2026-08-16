import type { Metadata } from "next";
import { Unbounded } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import SmoothScroll from "@/components/providers/SmoothScroll";
import "./global.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-unbounded",
});

export const metadata: Metadata = {
  title: "Jembatan Karya",
  description: "Temukan talenta. Selesaikan project.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${unbounded.variable} ${GeistSans.variable} ${GeistMono.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}