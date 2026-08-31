import { FaInstagram, FaTwitter, FaLinkedin, FaFigma } from "react-icons/fa";

export default function DashboardFooter() {
  return (
    <footer className="border-t border-hairline px-6 py-6 sm:px-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-xs font-body text-ink-muted">
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