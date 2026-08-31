"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import FilterDropdown from "@/components/ui/FilterDropdown";
import type { AdminFilterOption } from "@/types/admin-users";
import type { AdminUmkmData } from "@/types/admin-umkm";

export default function UmkmListToolbar({ filters, statusOptions }: { filters: AdminUmkmData["filters"]; statusOptions: AdminFilterOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(filters.query);
  function updateFilters(values: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(values)) { if (value) params.set(key, value); else params.delete(key); }
    params.delete("page");
    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }
  function submitSearch(event: FormEvent<HTMLFormElement>) { event.preventDefault(); updateFilters({ q: query.trim() }); }
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-hairline bg-card p-4">
      <form onSubmit={submitSearch} className="relative min-w-[240px] flex-1">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama pemilik, nama bisnis, atau kategori..." className="w-full rounded-full bg-canvas py-2.5 pl-11 pr-4 text-sm font-body text-ink placeholder:text-ink-muted outline-none focus:ring-1 focus:ring-brand" />
      </form>
      <FilterDropdown label="Kelengkapan profil" options={statusOptions} value={filters.profileStatus} onChange={(value) => updateFilters({ profileStatus: value })} />
      <Button type="button" variant="outline" onClick={() => updateFilters({ q: query.trim() })}>Terapkan</Button>
    </div>
  );
}
