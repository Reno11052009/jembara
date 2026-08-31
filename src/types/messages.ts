export interface MessagesData {
  conversations: Conversation[];
  conversationMessages: Record<string, ChatMessage[]>;
  selectedConversationId: string;
}

export interface MessageActionResult {
  success: boolean;
  error?: string;
}


export interface ChatMessage {
  id: string;
  sender: "me" | "contact";
  text: string;
  timeLabel: string;
  dateDividerLabel?: string;
  status?: "sent" | "delivered" | "read" | (string & {});
}

export interface Conversation {
  id: string;
  contactName: string;
  lastMessagePreview: string;
  timeLabel: string;
  unread: boolean;
  isOnline: boolean;
  projectName: string;
  canSend: boolean;
}

export type ConversationFilterValue = "Semua" | "Belum Dibaca" | "Project";