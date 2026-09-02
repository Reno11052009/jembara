import type { Metadata } from "next";
import localFont from "next/font/local";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./global.css";

// Resolves and applies the theme class before first paint, so there's no
// light-mode flash for users whose stored/system preference is dark.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('jembara:theme');
    var theme = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'light';
    var resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    if (resolved === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    }
  } catch (e) {}
})();
`;

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${unbounded.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-ink transition-colors">
        <ThemeProvider>
          <PreferencesProvider>{children}</PreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}