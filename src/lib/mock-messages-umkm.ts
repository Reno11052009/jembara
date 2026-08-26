import { Conversation, ChatMessage } from "@/types/messages";

// UMKM-side inbox: percakapan dengan talenta yang melamar/mengerjakan proyek,
// beda dataset dari sisi mahasiswa di mock-messages.ts.

export const umkmConversations: Conversation[] = [
  {
    id: "umkm-conv-1",
    contactName: "Chello Saputra",
    lastMessagePreview: "Kapan kira-kira wireframe modul pemb...",
    timeLabel: "8:45 AM",
    unread: true,
    isOnline: true,
    projectName: "Desain Website Furnitur Java Woodcraft",
  },
  {
    id: "umkm-conv-2",
    contactName: "Maya Amelia",
    lastMessagePreview: "Terima kasih atas tawaran proyekny...",
    timeLabel: "Kemarin",
    unread: false,
    isOnline: false,
  },
  {
    id: "umkm-conv-3",
    contactName: "Ahmad Setiawan",
    lastMessagePreview: "Revisi sudah saya kirim ya, tolong dice...",
    timeLabel: "2 hari lalu",
    unread: false,
    isOnline: false,
  },
];

export const umkmConversationMessages: Record<string, ChatMessage[]> = {
  "umkm-conv-1": [
    {
      id: "umkm-msg-1",
      sender: "contact",
      text: "Halo Pak Budi! Saya sudah melengkapi proposal dan portofolio saya untuk website e-commerce Java Woodcraft.",
      timeLabel: "9:30 AM",
    },
    {
      id: "umkm-msg-2",
      sender: "me",
      text: "Halo Chello, terima kasih sudah melamar! Portofolio Anda sangat bagus. Kapan kira-kira kita bisa meeting online singkat untuk diskusi?",
      timeLabel: "9:32 AM",
    },
  ],
};
