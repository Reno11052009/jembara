import type { Metadata } from "next";
import { Chakra_Petch, Inter, JetBrains_Mono, Geist, Unbounded } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import "./global.css";

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-chakra",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "SkillBridge",
  description: "Cari kerja, mulai matchmaking-mu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${chakra.variable} ${inter.variable} ${jetbrains.variable} ${unbounded.variable} ${geist.variable}`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}