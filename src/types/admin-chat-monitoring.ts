export type ConversationTag = "sensitif" | "aman";

export interface ReportedConversation {
  id: string;
  participantsLabel: string;
  previewMessage: string;
  tag: ConversationTag;
}

export interface TransactionMessage {
  id: string;
  senderName: string;
  senderRole?: string;
  content: string;
  flagged?: boolean;
  flaggedLabel?: string;
  detectionNote?: string;
}
