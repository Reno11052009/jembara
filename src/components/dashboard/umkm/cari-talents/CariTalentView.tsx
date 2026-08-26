"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import Footer from "@/components/landing/Footer";
import TalentFilterBar from "@/components/dashboard/umkm/cari-talents/TalentFilterBar";
import TalentCard from "@/components/dashboard/umkm/cari-talents/TalentCard";
import type { TalentFilters, TalentSearchData } from "@/types/talent";

const initialFilters: TalentFilters = {
  query: "",
  skill: "",
  location: "",
  rating: "",
};

export default function CariTalentView({ data }: { data: TalentSearchData }) {
  const router = useRouter();
  const [filters, setFilters] = useState<TalentFilters>(initialFilters);

  function updateFilter(name: keyof TalentFilters, value: string) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  const filteredTalents = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return data.talents.filter((talent) => {
      const matchesQuery =
        !query ||
        talent.name.toLowerCase().includes(query) ||
        talent.role.toLowerCase().includes(query) ||
        talent.skills.some((skill) => skill.toLowerCase().includes(query));

      return (
        matchesQuery &&
        (!filters.skill || talent.skills.includes(filters.skill)) &&
        (!filters.location || talent.location === filters.location) &&
        (!filters.rating ||
          (talent.rating !== null &&
            talent.rating >= Number.parseFloat(filters.rating)))
      );
    });
  }, [data.talents, filters]);

  return (
    <>
      <PageHeader
        title="Cari Talent 🚀"
        subtitle="Temukan mahasiswa dan fresh graduate terbaik untuk kebutuhan proyek UMKM Anda."
        userName={data.ownerName}
        avatarUrl={data.ownerAvatarUrl}
      />

      {data.projects.length > 0 && (
        <div className="mb-4 rounded-xl border border-hairline bg-card p-4">
          <label
            htmlFor="matching-project"
            className="mb-2 block text-sm font-display font-bold text-ink"
          >
            Hitung kecocokan skill untuk proyek
          </label>
          <select
            id="matching-project"
            value={data.selectedProjectId ?? ""}
            onChange={(event) =>
              router.replace(
                `/dashboard/cari-talent?project=${encodeURIComponent(event.target.value)}`,
              )
            }
            className="w-full rounded-lg border border-hairline bg-canvas px-4 py-3 text-sm text-ink focus:border-brand focus:outline-none"
          >
            {data.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <TalentFilterBar
        query={filters.query}
        onQueryChange={(value) => updateFilter("query", value)}
        filters={filters}
        onFilterChange={updateFilter}
        skillOptions={data.skillOptions}
        locationOptions={data.locationOptions}
        ratingOptions={data.ratingOptions}
      />

      <h2 className="mb-4 font-display text-lg font-black text-ink">
        {data.selectedProjectTitle
          ? `Rekomendasi talent untuk ${data.selectedProjectTitle}`
          : "Talent yang sedang tersedia"}
      </h2>

      {filteredTalents.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredTalents.map((talent) => (
            <TalentCard
              key={talent.id}
              talent={talent}
              showSkillMatch={Boolean(data.selectedProjectId)}
            />
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
