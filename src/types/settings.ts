export type SessionDeviceType = "laptop" | "mobile" | "desktop";

export interface ActiveSession {
  id: string;
  deviceName: string;
  deviceType: SessionDeviceType;
  location: string;
  status: string; // e.g. "Aktif Sekarang (Sesi ini)" or "Terakhir aktif: 2 jam yang lalu"
  isCurrentSession: boolean;
}

export interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  defaultEnabled: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  detailLine: string; // e.g. "Chello Arta • **** 8940"
  isPrimary: boolean;
}

export interface Transaction {
  id: string;
  date: string; // e.g. "15 Jan 2026"
  description: string;
  amount: string; // formatted, e.g. "Rp 1.500.000"
  amountType: "credit" | "debit" | "neutral";
  status: string; // e.g. "Selesai"
}

export interface PaymentSettingsData {
  canManagePayoutMethods: boolean;
  balanceLabel: string;
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
}

export interface ProfileVisibilityOption {
  id: string;
  title: string;
  description: string;
}

export interface PrivacyPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}
