import PageHeader from "@/components/layout/PageHeader";
import Footer from "@/components/landing/Footer";
import OwnerStatsGrid from "@/components/dashboard/umkm/OwnerStatsGrid";
import RecentJobListings from "@/components/dashboard/umkm/RecentJobListings";
import RecentApplicants from "@/components/dashboard/umkm/RecentApplicants";
import {
  ownerName,
  businessName,
  ownerAvatarUrl,
  ownerStats,
  recentJobListings,
  recentApplicants,
} from "@/lib/mock-umkm-owner-dashboard";

export default function OwnerDashboardView() {
  return (
    <>
      <PageHeader
        title={`Halo, ${ownerName}! 👋`}
        subtitle={`Selamat datang di dashboard bisnis ${businessName}. Pantau aktivitas pencarian talenta Anda.`}
        userName={ownerName}
        avatarUrl={ownerAvatarUrl}
      />

      <div className="flex flex-col gap-6">
        <OwnerStatsGrid stats={ownerStats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentJobListings listings={recentJobListings} />
          </div>
          <div>
            <RecentApplicants applicants={recentApplicants} />
          </div>
        </div>
      </div>

      <div className="-mx-6 mt-10 sm:-mx-8">
        <Footer />
      </div>
    </>
  );
}
