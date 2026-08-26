"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Footer from "@/components/landing/Footer";
import MyJobRow from "@/components/dashboard/umkm/my-job/MyJobRow";
import { ownerName, ownerAvatarUrl } from "@/lib/mock-umkm-owner-dashboard";
import { myJobListings } from "@/lib/mock-my-jobs";
import type { JobListingStatus } from "@/types/my-jobs";

type TabValue = "Semua" | JobListingStatus;

const tabs: TabValue[] = ["Semua", "Aktif", "Ditutup", "Draft"];

export default function MyJobsView() {
  const [activeTab, setActiveTab] = useState<TabValue>("Semua");

  const filteredListings = useMemo(
    () =>
      activeTab === "Semua"
        ? myJobListings
        : myJobListings.filter((listing) => listing.status === activeTab),
    [activeTab],
  );

  return (
    <>
      <PageHeader
        title="Lowongan Saya 📂"
        subtitle="Kelola semua lowongan proyek yang telah Anda publikasikan atau simpan."
        userName={ownerName}
        avatarUrl={ownerAvatarUrl}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-display font-bold transition-colors ${
              activeTab === tab
                ? "bg-ink text-white"
                : "border border-hairline bg-card text-ink hover:border-brand hover:text-brand"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredListings.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredListings.map((listing) => (
            <MyJobRow key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-hairline bg-card px-6 py-12 text-center">
          <h3 className="font-display text-base font-black text-ink">
            Belum ada lowongan
          </h3>
          <p className="mt-2 text-sm font-body text-ink-muted">
            Tidak ada lowongan dengan status ini.
          </p>
        </div>
      )}

      <div className="-mx-6 mt-10 sm:-mx-8">
        <Footer />
      </div>
    </>
  );
}
