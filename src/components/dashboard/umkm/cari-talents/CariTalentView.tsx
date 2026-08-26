"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Footer from "@/components/landing/Footer";
import TalentFilterBar from "@/components/dashboard/umkm/cari-talents/TalentFilterBar";
import TalentCard from "@/components/dashboard/umkm/cari-talents/TalentCard";
import { ownerName, ownerAvatarUrl } from "@/lib/mock-umkm-owner-dashboard";
import { recommendedTalents } from "@/lib/mock-talents";
import type { TalentFilters } from "@/types/talent";

const initialFilters: TalentFilters = {
  query: "",
  skill: "",
  location: "",
  rating: "",
  experience: "",
  budget: "",
};

function matchesBudget(ratePerHour: number, budget: string) {
  switch (budget) {
    case "under-150k":
      return ratePerHour < 150_000;
    case "150k-200k":
      return ratePerHour >= 150_000 && ratePerHour < 200_000;
    case "200k-250k":
      return ratePerHour >= 200_000 && ratePerHour <= 250_000;
    case "over-250k":
      return ratePerHour > 250_000;
    default:
      return true;
  }
}

export default function CariTalentView() {
  const [filters, setFilters] = useState<TalentFilters>(initialFilters);

  function updateFilter(name: keyof TalentFilters, value: string) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  const filteredTalents = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return recommendedTalents.filter((talent) => {
      const matchesQuery =
        !query ||
        talent.name.toLowerCase().includes(query) ||
        talent.role.toLowerCase().includes(query) ||
        talent.skills.some((skill) => skill.toLowerCase().includes(query));

      return (
        matchesQuery &&
        (!filters.skill || talent.skills.includes(filters.skill)) &&
        (!filters.location || talent.location === filters.location) &&
        (!filters.rating || talent.rating >= Number.parseFloat(filters.rating)) &&
        (!filters.experience || talent.experienceLevel === filters.experience) &&
        (!filters.budget || matchesBudget(talent.ratePerHour, filters.budget))
      );
    });
  }, [filters]);

  return (
    <>
      <PageHeader
        title="Cari Talent 🚀"
        subtitle="Temukan mahasiswa dan fresh graduate terbaik untuk kebutuhan proyek UMKM Anda."
        userName={ownerName}
        avatarUrl={ownerAvatarUrl}
      />

      <TalentFilterBar
        query={filters.query}
        onQueryChange={(value) => updateFilter("query", value)}
        filters={filters}
        onFilterChange={updateFilter}
      />

      <h2 className="mb-4 font-display text-lg font-black text-ink">
        Talenta Terbaik yang Direkomendasikan
      </h2>

      {filteredTalents.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredTalents.map((talent) => (
            <TalentCard key={talent.id} talent={talent} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-hairline bg-card px-6 py-12 text-center">
          <h3 className="font-display text-base font-black text-ink">
            Belum ada talent yang sesuai
          </h3>
          <p className="mt-2 text-sm font-body text-ink-muted">
            Coba ubah kata pencarian atau hapus beberapa filter.
          </p>
          <button
            type="button"
            onClick={() => setFilters(initialFilters)}
            className="mt-5 inline-flex rounded-[99px] bg-brand px-5 py-2.5 text-sm font-display font-bold uppercase text-white transition-opacity hover:opacity-90"
          >
            Reset Filter
          </button>
        </div>
      )}

      <div className="-mx-6 mt-10 sm:-mx-8">
        <Footer />
      </div>
    </>
  );
}
