import SecuritySettingsView from "@/components/security/Securitysettingsview";

export const metadata = {
  title: "Keamanan | JemBara",
  description: "Kelola keamanan akun dan verifikasi autentikasi.",
};

export default function KeamananSettingsPage() {
  return <SecuritySettingsView />;
}
