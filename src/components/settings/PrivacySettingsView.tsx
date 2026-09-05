import ProfileVisibilityCard from "@/components/settings/ProfileVisibilityCard";
import PrivacyPreferencesCard from "@/components/settings/PrivacyPreferencesCard";
import DataAccountCard from "@/components/settings/DataAccountCard";

export default function PrivacySettingsView({ isUmkm = false }: { isUmkm?: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      <ProfileVisibilityCard isUmkm={isUmkm} />
      <PrivacyPreferencesCard isUmkm={isUmkm} />
      <DataAccountCard isUmkm={isUmkm} />
    </div>
  );
}