import PaymentSettingsView from "@/components/settings/PaymentSettingsView";
import { getPaymentSettingsData } from "@/lib/payment-settings";

export const metadata = {
  title: "Pembayaran | JemBara",
  description: "Kelola metode pembayaran, penarikan dana, dan riwayat transaksi.",
};

export const instant = false;

export default async function PembayaranSettingsPage() {
  return <PaymentSettingsView data={await getPaymentSettingsData()} />;
}
