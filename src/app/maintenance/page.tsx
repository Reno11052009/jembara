import PublicTopBar from "@/components/errors/PublicTopBar";
import MaintenanceContent from "@/components/maintenance/MaintenanceContent";

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicTopBar />
      <div className="flex flex-1 items-center justify-center">
        <MaintenanceContent
          title="Sedang Dalam Pemeliharaan"
          description="SkillBridge sedang melakukan pemeliharaan terjadwal untuk meningkatkan layanan kami. Estimasi selesai: 30 menit."
          progressPercent={55}
          footnote="Terima kasih atas kesabaranmu!"
        />
      </div>
    </div>
  );
}