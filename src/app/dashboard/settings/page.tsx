import { getCachedProfileData } from "@/lib/profile";
import SettingsView from "@/components/settings/SettingsView";

export const metadata = {
  title: "Settings | JemBara",
  description: "Kelola akun dan preferensi kamu di JemBara.",
};

export default async function SettingsPage() {
  const profileData = await getCachedProfileData();

  return <SettingsView initialData={profileData} />;
}
