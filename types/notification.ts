export interface HeaderNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  href: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  proposalMasuk: boolean;
  pesanBaru: boolean;
  pembayaran: boolean;
  updateProyek: boolean;
  promosiInfo: boolean;
}

export type NotificationPreferenceKey = keyof NotificationPreferences;
