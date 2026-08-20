import { Conversation, ChatMessage } from "@/types/messages";

export const conversations: Conversation[] = [
  {
    id: "conv-1",
    contactName: "Warung pak Chello",
    lastMessagePreview: "Kapan kira-kira wireframe modul pemb...",
    timeLabel: "8:45 AM",
    unread: true,
    isOnline: true,
    projectName: "Desain Website E-commerce Furnitur Lokal",
  },
  {
    id: "conv-2",
    contactName: "Kopdes Bumawe",
    lastMessagePreview: "Terima kasih atas proposal yang diajuka...",
    timeLabel: "Kemarin",
    unread: false,
    isOnline: false,
  },
  {
    id: "conv-3",
    contactName: "Java Woodcraft",
    lastMessagePreview: "Revisi sudah saya kirim ya, tolong dice...",
    timeLabel: "2 hari lalu",
    unread: false,
    isOnline: false,
    projectName: "Website E-commerce Furnitur Lokal",
  },
  {
    id: "conv-4",
    contactName: "DataViz Indonesia",
    lastMessagePreview: "Meeting besok jam 10 ya untuk review d...",
    timeLabel: "3 hari lalu",
    unread: false,
    isOnline: true,
    projectName: "Redesign Dashboard Analytics Platform SaaS",
  },
  {
    id: "conv-5",
    contactName: "TokoMaju Digital",
    lastMessagePreview: "Budget sudah disetujui. Bisa mulai min...",
    timeLabel: "5 hari lalu",
    unread: false,
    isOnline: false,
  },
  {
    id: "conv-6",
    contactName: "EduPath",
    lastMessagePreview: "Terima kasih sudah mengirim portfolio...",
    timeLabel: "1 minggu lalu",
    unread: false,
    isOnline: false,
  },
];

// Cuma thread "Warung pak Chello" yang ada isinya di mockup.
// 5 conversationId lain sengaja nggak punya entry di sini (bukan lupa) —
// ChatThread bakal nampilin empty state buat itu.
export const conversationMessages: Record<string, ChatMessage[]> = {
  "conv-1": [
    {
      id: "msg-1",
      sender: "contact",
      text: "Halo Chello! Saya sudah lihat portfolio kamu dan tertarik untuk project website toko kami.",
      timeLabel: "9:30 AM",
    },
    {
      id: "msg-2",
      sender: "me",
      text: "Terima kasih pak! Saya sangat tertarik dengan projectnya. Bisa ceritakan lebih detail tentang kebutuhannya?",
      timeLabel: "9:32 AM",
    },
    {
      id: "msg-3",
      sender: "contact",
      text: "Kami butuh website dengan fitur menu online, reservasi meja, dan galeri foto. Budget sekitar Rp750K - Rp1.5M.",
      timeLabel: "9:35 AM",
    },
    {
      id: "msg-4",
      sender: "me",
      text: "Baik pak, saya bisa handle semua fitur tersebut. Saya akan buatkan proposal detailnya hari ini.",
      timeLabel: "9:38 AM",
    },
    {
      id: "msg-5",
      sender: "contact",
      text: "Kapan kira-kira wireframe modul pembayaran bisa selesai?",
      timeLabel: "8:45 AM",
      dateDividerLabel: "Today",
    },
  ],
};