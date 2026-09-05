"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import MyJobRow from "@/components/dashboard/umkm/my-job/MyJobRow";
import type {
  JobListingStatus,
  MyJobsData,
} from "@/types/my-jobs";
import ListPagination from "@/components/ui/ListPagination";

type TabValue = "Semua" | JobListingStatus;

const tabs: TabValue[] = [
  "Semua",
  "Terbuka",
  "Seleksi",
  "Menunggu Pembayaran",
  "Berjalan",
  "Dalam Review",
  "Selesai",
  "Dibatalkan",
];

export default function MyJobsView({ data }: { data: MyJobsData }) {
  const router = useRouter();
  const activeTab = data.activeFilter;
  const setActiveTab = (tab: TabValue) => {
    const params = new URLSearchParams();
    if (tab !== "Semua") params.set("status", tab);
    const query = params.toString();
    router.replace(query ? `/dashboard/lowongan-saya?${query}` : "/dashboard/lowongan-saya");
  };

  return (
    <>
      <PageHeader
        title="Lowongan Saya"
        subtitle={`Kelola project yang dibuat oleh ${data.businessName}.`}
        userName={data.ownerName}
        avatarUrl={data.ownerAvatarUrl}
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-display font-bold transition-colors ${
                activeTab === tab
                  ? "bg-ink text-white dark:text-canvas"
                  : "border border-hairline bg-card text-ink hover:border-brand hover:text-brand"
              }`}
            >
              {tab} ({data.tabCounts[tab]})
            </button>
          ))}
        </div>

        <Link
          href="/dashboard/pasang-lowongan"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={17} aria-hidden="true" />
          Pasang Lowongan
        </Link>
      </div>

      {data.listings.length > 0 ? (
        <div className="flex flex-col gap-4">
          {data.listings.map((listing) => (
            <MyJobRow key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-hairline bg-card px-6 py-12 text-center">
          <h3 className="font-display text-base font-black text-ink">
            Belum ada project
          </h3>
          <p className="mt-2 text-sm font-body text-ink-muted">
            Tidak ada project dengan status ini.
          </p>
        </div>
      )}
      <ListPagination
        basePath="/dashboard/lowongan-saya"
        pagination={data.pagination}
        preservedParams={{ status: activeTab === "Semua" ? null : activeTab }}
      />
    </>
  );
}
