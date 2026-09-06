"use client";

import { FaInstagram } from "react-icons/fa";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function DashboardFooter() {
  const { dict } = usePreferences();

  return (
    <footer className="border-t border-hairline px-6 py-6 sm:px-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-xs font-body text-ink-muted">
          {dict.common.copyright}
        </p>
        <div className="flex gap-4 text-ink">
          <a
            href="https://www.instagram.com/jembaraid/?utm_source=ig_web_button_share_sheet"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Jembara"
            className="transition hover:text-brand"
          >
            <FaInstagram size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
