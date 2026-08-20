import SettingsView from "@/components/settings/SettingsView";
import { getCachedProfileData } from "@/lib/profile";

export default async function SettingsPage() {
  const profileData = await getCachedProfileData();
  
  return <SettingsView initialData={profileData} />;
}
