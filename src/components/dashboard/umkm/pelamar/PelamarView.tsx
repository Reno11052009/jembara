"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Footer from "@/components/landing/Footer";
import ApplicantRow from "@/components/dashboard/umkm/pelamar/ApplicantRow";
import { ownerName, ownerAvatarUrl } from "@/lib/mock-umkm-owner-dashboard";
import { applicants, projectTitle } from "@/lib/mock-applicants";
import type { ApplicantStatus } from "@/types/applicant";

type TabValue = "Semua" | ApplicantStatus;

const tabs: TabValue[] = ["Semua", "Baru", "Shortlist", "Ditolak"];

export default function PelamarView() {
  const [activeTab, setActiveTab] = useState<TabValue>("Semua");

  const filteredApplicants = useMemo(
    () =>
      activeTab === "Semua"
        ? applicants
        : applicants.filter((applicant) => applicant.status === activeTab),
    [activeTab],
  );

  return (
    <>
      <PageHeader
        title="Pelamar 📨"
        subtitle={`Proyek: ${projectTitle}`}
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

      {filteredApplicants.length > 0 ? (
        <div className="flex flex-col gap-5">
          {filteredApplicants.map((applicant) => (
            <ApplicantRow key={applicant.id} applicant={applicant} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-hairline bg-card px-6 py-12 text-center">
          <h3 className="font-display text-base font-black text-ink">
            Belum ada pelamar
          </h3>
          <p className="mt-2 text-sm font-body text-ink-muted">
            Tidak ada pelamar dengan status ini.
          </p>
        </div>
      )}

      <div className="-mx-6 mt-10 sm:-mx-8">
        <Footer />
      </div>
    </>
  );
}
