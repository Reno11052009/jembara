import type { Metadata } from "next";
import localFont from "next/font/local";
import SmoothScroll from "@/components/providers/SmoothScroll";
import "./global.css";

const unbounded = localFont({
  src: "../fonts/Unbounded-Variable.ttf",
  variable: "--font-unbounded",
  weight: "200 900",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${unbounded.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
