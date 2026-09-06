"use client";

import { Search } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";

interface ConversationSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ConversationSearchBar({
  value,
  onChange,
}: ConversationSearchBarProps) {
  const { dict } = usePreferences();

  return (
    <div className="flex items-center gap-2 rounded-full bg-canvas px-4 py-2.5">
      <Search size={16} className="shrink-0 text-ink-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={dict.messages.searchPlaceholder || "Cari percakapan..."}
        className="w-full bg-transparent font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none"
      />
    </div>
  );
}