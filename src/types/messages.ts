export type ConversationFilterValue = "Semua" | "Belum Dibaca" | "Project";

export interface Conversation {
  id: string;
  contactName: string;
  lastMessagePreview: string;
  timeLabel: string;
  unread: boolean;
  isOnline: boolean;
  projectName?: string;
}

export interface ChatMessage {
  id: string;
  sender: "me" | "contact";
  text: string;
  timeLabel: string;
  dateDividerLabel?: string;
}