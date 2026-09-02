"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ApplicantRow from "@/components/dashboard/umkm/pelamar/ApplicantRow";
import SearchableSelect from "@/components/ui/SearchableSelect";
import type {
  ApplicantStatus,
  ApplicantsData,
} from "@/types/applicant";
import ListPagination from "@/components/ui/ListPagination";

type TabValue = "Semua" | ApplicantStatus;

const tabs: TabValue[] = ["Semua", "Pending", "Diterima", "Ditolak"];

export default function PelamarView({ data }: { data: ApplicantsData }) {
  const router = useRouter();
  const activeTab = data.activeFilter;
  const setActiveTab = (tab: TabValue) => {
    const params = new URLSearchParams();
    if (data.selectedProjectId) params.set("project", data.selectedProjectId);
    if (tab !== "Semua") params.set("status", tab);
    router.replace(`/dashboard/pelamar?${params.toString()}`);
  };

  return (
    <>
      <PageHeader
        title="Pelamar"
        subtitle={data.selectedProjectTitle
          ? `Proposal untuk project ${data.selectedProjectTitle}`
          : "Pantau proposal yang masuk untuk project Anda."}
        userName={data.ownerName}
        avatarUrl={data.ownerAvatarUrl}
      />
        
      {data.projects.length > 0 && (
        <div className="mb-5 rounded-xl border border-hairline bg-card p-4">
          <SearchableSelect
            id="applicant-project"
            name="applicant-project"
            label="Pilih project"
            labelClassName="mb-2 block text-sm font-display font-bold text-ink"
            value={data.selectedProjectId ?? ""}
            onChange={(code) =>
              router.replace(
                `/dashboard/pelamar?project=${encodeURIComponent(code)}`,
              )
            }
            options={data.projects.map((project) => ({
              code: project.id,
              name: `${project.title} · ${project.status}`,
            }))}
            placeholder="Pilih project"
            searchPlaceholder="Cari project..."
            showSearch={false}
          />
        </div>
      )}

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
            {tab} ({data.tabCounts[tab]})
          </button>
        ))}
      </div>

      {data.applicants.length > 0 ? (
        <div className="flex flex-col gap-5">
          {data.applicants.map((applicant) => (
            <ApplicantRow key={applicant.id} applicant={applicant} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-hairline bg-card px-6 py-12 text-center">
          <h3 className="font-display text-base font-black text-ink">
            Belum ada pelamar
          </h3>
          <p className="mt-2 text-sm font-body text-ink-muted">
            {data.projects.length === 0
              ? "Buat dan publikasikan project untuk mulai menerima proposal."
              : "Tidak ada proposal dengan status ini."}
          </p>
        </div>
      )}
      <ListPagination
        basePath="/dashboard/pelamar"
        pagination={data.pagination}
        preservedParams={{
          project: data.selectedProjectId,
          status: activeTab === "Semua" ? null : activeTab,
        }}
      />
    </>
  );
}
