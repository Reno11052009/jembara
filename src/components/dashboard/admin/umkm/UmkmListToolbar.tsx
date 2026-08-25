"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { adminUmkmVerificationOptions } from "@/lib/mock-admin-umkm";

export default function UmkmListToolbar() {
  const [query, setQuery] = useState("");
  const [verification, setVerification] = useState("");

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-hairline bg-card p-4">
      <div className="relative min-w-[240px] flex-1">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari nama pemilik, nama bisnis, atau kategori..."
          className="w-full rounded-full bg-canvas py-2.5 pl-11 pr-4 text-sm font-body text-ink placeholder:text-ink-muted outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      <FilterDropdown
        label="Verifikasi: Semua"
        options={adminUmkmVerificationOptions}
        value={verification}
        onChange={setVerification}
      />
    </div>
  );
}
