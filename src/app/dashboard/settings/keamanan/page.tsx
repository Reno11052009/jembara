import SecuritySettingsView from "@/components/security/Securitysettingsview";
import { getActiveSessionsData } from "@/lib/account-security";

export const metadata = {
  title: "Keamanan | JemBara",
  description: "Kelola keamanan akun dan verifikasi autentikasi.",
};

export const instant = false;

export default async function KeamananSettingsPage() {
  const sessions = await getActiveSessionsData();
  return <SecuritySettingsView sessions={sessions} />;
}
