export type ConversationTag = "sensitif" | "aman";

export interface ReportedConversation {
  id: string;
  projectId: string;
  projectTitle: string;
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

export interface AdminChatMonitoringData {
  adminName: string;
  adminAvatarUrl?: string;
  stats: import("./admin-dashboard").AdminStatData[];
  conversations: ReportedConversation[];
  selectedProjectId: string | null;
  selectedProjectTitle: string | null;
  messages: TransactionMessage[];
}
