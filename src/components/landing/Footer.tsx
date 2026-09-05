// import { Instagram, Twitter, Linkedin } from "lucide-react";
import { Landmark } from "lucide-react";
import Link from "next/dist/client/link";
import { FaInstagram, FaTwitter, FaLinkedin, FaFigma } from "react-icons/fa";

const companyLinks = ["Tentang Kami", "Kontak", "Karir", "Blog"];
const featureLinks = ["Cari Talenta", "Cari Project", "Testimoni", "Hubungi CS"];

export default function Footer() {
  return (
    <footer className="mx-6 my-10 rounded-2xl border border-hairline bg-white dark:bg-card px-10 py-12 text-ink sm:mx-10">
      <div className="mx-auto flex max-w-8xl flex-col justify-between gap-10 sm:flex-row">
        <div className="max-w-xs">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/images/LOGO.png"
                alt="Jembatan Karya Logo"
                className="h-10 w-10 rounded-md object-contain"
              />
              <span className="font-display text-lg font-black text-ink">
                Jembatan <span className="text-brand">Karya</span>
              </span>
            </Link>
          </div>
          <p className="mt-3 text-sm font-body text-ink-muted">
            Pemberdayaan UMKM lokal Indonesia melalui inovasi, edukasi, dan
            kolaborasi talenta muda berdaya saing global.
          </p>
        </div>

        <div className="flex gap-16">
          <div>
            <p className="text-xs font-display font-black uppercase tracking-widest text-black dark:text-ink">
              Perusahaan
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm font-body text-ink-muted hover:text-brand">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-display font-black uppercase tracking-widest text-black dark:text-ink">
              Fitur Utama
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {featureLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-ink-muted hover:text-brand">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex justify-between max-w-8xl flex-col items-center gap-4 sm:flex-row">
        <p className="text-xs font-body text-ink-muted">
          © 2026 Jembatan Karya Indonesia. Hak Cipta Dilindungi Undang-Undang.
        </p>
        <div className="flex gap-4 text-ink-muted">
          <FaInstagram size={16} className="cursor-pointer transition hover:text-brand" />
          <FaTwitter size={16} className="cursor-pointer transition hover:text-brand" />
          <FaLinkedin size={16} className="cursor-pointer transition hover:text-brand" />
          <FaFigma size={16} className="cursor-pointer transition hover:text-brand" />
        </div>
      </div>
    </footer>
  );
}