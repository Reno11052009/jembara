// import { Instagram, Twitter, Linkedin } from "lucide-react";
import { FaInstagram, FaTwitter, FaLinkedin, FaFigma } from "react-icons/fa";

const companyLinks = ["Tentang Kami", "Kontak", "Karir", "Blog"];
const featureLinks = ["Cari Talenta", "Cari Project", "Testimoni", "Hubungi CS"];

export default function Footer() {
  return (
    <footer className="border-t border-hairline px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col justify-between gap-10 sm:flex-row">
        <div className="max-w-xs">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-md bg-brand" />
            <span className="font-display text-lg font-bold text-ink">
              Jembatan <span className="text-brand">Karya</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-ink-muted">
            Pemberdayaan UMKM lokal Indonesia melalui inovasi, edukasi, dan
            kolaborasi talenta muda berdaya saing global.
          </p>
        </div>

        <div className="flex gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-muted">
              Perusahaan
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-ink-muted hover:text-brand">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-muted">
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

      <div className="mx-auto mt-10 flex max-w-5xl flex-col items-center justify-between gap-4 border-t border-hairline pt-6 sm:flex-row">
        <p className="text-xs text-ink-muted">
          © 2026 Jembatan Karya Indonesia. Hak Cipta Dilindungi Undang-Undang.
        </p>
        <div className="flex gap-4 text-ink-muted">
          <FaInstagram size={16} />
          <FaTwitter size={16} />
          <FaLinkedin size={16} />
          <FaFigma size={16} />
        </div>
      </div>
    </footer>
  );
}