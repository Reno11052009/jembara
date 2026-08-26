"use client";

import { useState } from "react";
import { Download, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { adminUserSkillOptions, adminUserStatusOptions } from "@/lib/mock-admin-users";

export default function UserListToolbar() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [skill, setSkill] = useState("");

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
          placeholder="Cari berdasarkan nama, email, atau keahlian..."
          className="w-full rounded-full bg-canvas py-2.5 pl-11 pr-4 text-sm font-body text-ink placeholder:text-ink-muted outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      <FilterDropdown
        label="Status: Semua"
        options={adminUserStatusOptions}
        value={status}
        onChange={setStatus}
      />

      <FilterDropdown
        label="Keahlian"
        options={adminUserSkillOptions}
        value={skill}
        onChange={setSkill}
      />

      <Button variant="primary">
        <Download size={16} />
        Ekspor CSV
      </Button>
    </div>
  );
}
