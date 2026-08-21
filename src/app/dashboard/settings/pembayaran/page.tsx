import PaymentSettingsView from "@/components/settings/PaymentSettingsView";

export const metadata = {
  title: "Pembayaran | JemBara",
  description: "Kelola metode pembayaran, penarikan dana, dan riwayat transaksi.",
};

export default function PembayaranSettingsPage() {
  return <PaymentSettingsView />;
}
