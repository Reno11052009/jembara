import PrivacySettingsView from "@/components/settings/PrivacySettingsView";
import { getPrivacySettingsData } from "@/lib/privacy";

export const metadata = {
  title: "Privasi | JemBara",
  description: "Kelola visibilitas data dan hak privasi profil kamu.",
};

export default async function PrivasiSettingsPage() {
  const initialData = await getPrivacySettingsData();
  return <PrivacySettingsView initialData={initialData} />;
}
