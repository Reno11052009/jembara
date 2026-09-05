export type ConversationFilterValue = "Semua" | "Belum Dibaca" | "Project";

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

export interface ChatMessage {
  id: string;
  sender: "me" | "contact";
  text: string;
  timeLabel: string;
  dateDividerLabel?: string;
  status?: "sent" | "delivered" | "read";
  deliveryStatus?: "sending";
  attachment?: MessageAttachment;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  downloadUrl: string;
}

export interface MessagesData {
  conversations: Conversation[];
  conversationMessages: Record<string, ChatMessage[]>;
  selectedConversationId: string;
  attachmentsEnabled: boolean;
}

export interface MessageActionResult {
  success: boolean;
  error?: string;
}

export type PrepareAttachmentUploadResult =
  | {
      success: true;
      upload: {
        endpoint: string;
        token: string;
        bucketName: string;
        storagePath: string;
        uploadId: string;
      };
    }
  | { success: false; error: string };

export type FinalizeAttachmentUploadResult =
  | { success: true; message: ChatMessage }
  | { success: false; error: string };
