export type Language = "id" | "en" | "ja";

export const languageOptions: { value: Language; label: string }[] = [
  { value: "id", label: "Bahasa Indonesia" },
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
];

export interface Dictionary {
  sidebar: {
    dashboard: string;
    findProjects: string;
    myProposals: string;
    activeProjects: string;
    portfolio: string;
    messages: string;
    earnings: string;
    withdrawals: string;
    profile: string;
    settings: string;
    cariTalent: string;
    pasangLowongan: string;
    lowonganSaya: string;
    pelamar: string;
    daftarUser: string;
    daftarUmkm: string;
    relasi: string;
    lowongan: string;
    monitorPesan: string;
    logout: string;
  };
  common: {
    copyright: string;
    search: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    back: string;
    loading: string;
    viewDetails: string;
    submit: string;
    close: string;
    status: {
      OPEN: string;
      PROPOSAL: string;
      IN_PROGRESS: string;
      REVIEW: string;
      COMPLETED: string;
      CANCELLED: string;
    };
    verified: string;
    unverified: string;
    noData: string;
  };
  notifications: {
    title: string;
    markAllRead: string;
    empty: string;
    loadError: string;
    justNow: string;
  };
  settings: {
    pageTitle: string;
    pageSubtitle: string;
    pageSubtitleUmkm: string;
    tabs: {
      profil: string;
      profilUmkm: string;
      keamanan: string;
      notifikasi: string;
      pembayaran: string;
      privasi: string;
      bahasa: string;
    };
    language: {
      cardTitle: string;
      selectLabel: string;
      autoSaveNote: string;
    };
    headers: {
      keamanan: { title: string; subtitle: string; subtitleUmkm: string };
      notifikasi: { title: string; subtitle: string; subtitleUmkm: string };
      privasi: { title: string; subtitle: string; subtitleUmkm: string };
    };
    theme: {
      cardTitle: string;
      light: { title: string; desc: string };
      dark: { title: string; desc: string };
      system: { title: string; desc: string };
    };
    fontSize: {
      cardTitle: string;
      small: { title: string; desc: string };
      medium: { title: string; desc: string };
      large: { title: string; desc: string };
    };
    save: string;
  };
  messages: {
    pageTitle: string;
    searchPlaceholder: string;
    checkProfile: string;
    clearChat: string;
    clearChatConfirmTitle: string;
    clearChatConfirmText: string;
    clearChatSuccess: string;
    typePlaceholder: string;
    send: string;
    noMessages: string;
  };
  withdrawals: {
    pageTitle: string;
    availableBalance: string;
    minimumWithdrawalNote: string;
    nominalLabel: string;
    methodLabel: string;
    submitButton: string;
    securityNote: string;
  };
  projects: {
    createTitle: string;
    createSubtitle: string;
    titleLabel: string;
    budgetLabel: string;
    descriptionLabel: string;
    skillsLabel: string;
    requiredSkills: string;
    optionalSkills: string;
    deadlineLabel: string;
    workModeLabel: string;
    locationLabel: string;
    publishButton: string;
  };
}

const dictionary: Record<Language, Dictionary> = {
  id: {
    sidebar: {
      dashboard: "Dashboard",
      findProjects: "Cari Proyek",
      myProposals: "Proposal Saya",
      activeProjects: "Proyek Aktif",
      portfolio: "Portofolio",
      messages: "Pesan",
      earnings: "Pendapatan",
      withdrawals: "Penarikan Saldo",
      profile: "Profil",
      settings: "Pengaturan",
      cariTalent: "Cari Talent",
      pasangLowongan: "Pasang Lowongan",
      lowonganSaya: "Lowongan Saya",
      pelamar: "Pelamar",
      daftarUser: "Daftar User",
      daftarUmkm: "Daftar UMKM",
      relasi: "Relasi",
      lowongan: "Lowongan",
      monitorPesan: "Monitor Pesan",
      logout: "Log Out",
    },
    common: {
      copyright: "© 2026 Jembara. Hak Cipta Dilindungi Undang-Undang.",
      search: "Cari...",
      save: "Simpan Perubahan",
      cancel: "Batal",
      delete: "Hapus",
      edit: "Ubah",
      back: "Kembali",
      loading: "Memuat...",
      viewDetails: "Lihat Detail",
      submit: "Kirim",
      close: "Tutup",
      status: {
        OPEN: "OPEN",
        PROPOSAL: "PROPOSAL",
        IN_PROGRESS: "IN PROGRESS",
        REVIEW: "REVIEW",
        COMPLETED: "COMPLETED",
        CANCELLED: "CANCELLED",
      },
      verified: "Terverifikasi",
      unverified: "Belum terverifikasi",
      noData: "Belum ada data tersedia.",
    },
    notifications: {
      title: "Notifikasi",
      markAllRead: "Tandai semua dibaca",
      empty: "Belum ada notifikasi baru.",
      loadError: "Notifikasi belum dapat dimuat.",
      justNow: "Baru saja",
    },
    settings: {
      pageTitle: "Pengaturan",
      pageSubtitle: "Kelola akun dan preferensi kamu.",
      pageSubtitleUmkm: "Kelola profil perusahaan dan preferensi bisnis {businessName}.",
      tabs: {
        profil: "Profil",
        profilUmkm: "Profil Perusahaan",
        keamanan: "Keamanan",
        notifikasi: "Notifikasi",
        pembayaran: "Pembayaran",
        privasi: "Privasi",
        bahasa: "Bahasa & Tampilan",
      },
      language: {
        cardTitle: "Bahasa Sistem",
        selectLabel: "PILIH BAHASA",
        autoSaveNote: "Perubahan bahasa, tema, dan ukuran huruf tersimpan otomatis di perangkat ini.",
      },
      headers: {
        keamanan: {
          title: "Keamanan Akun",
          subtitle: "Kelola autentikasi dan perlindungan data akun Anda.",
          subtitleUmkm: "Kelola autentikasi dan perlindungan data perusahaan Anda.",
        },
        notifikasi: {
          title: "Preferensi Notifikasi",
          subtitle: "Pilih bagaimana dan kapan Anda ingin menerima pembaruan dari klien.",
          subtitleUmkm: "Pilih bagaimana dan kapan Anda ingin menerima pembaruan dari talenta.",
        },
        privasi: {
          title: "Keamanan & Privasi",
          subtitle: "Kelola visibilitas data Anda di dalam platform.",
          subtitleUmkm: "Kelola visibilitas data perusahaan Anda di dalam platform.",
        },
      },
      theme: {
        cardTitle: "Tema Aplikasi",
        light: { title: "Terang", desc: "Tampilan kontras tinggi berlatar putih bersih." },
        dark: { title: "Gelap", desc: "Merawat kenyamanan mata dalam kondisi kurang cahaya." },
        system: { title: "Sistem", desc: "Menyesuaikan otomatis dengan settingan perangkat kamu." },
      },
      fontSize: {
        cardTitle: "Ukuran Huruf",
        small: { title: "Kecil (12px)", desc: "Tampilan UI lebih padat, memuat banyak informasi sekaligus." },
        medium: { title: "Sedang (14px)", desc: "Ukuran default yang seimbang untuk kenyamanan membaca reguler." },
        large: { title: "Besar (16px)", desc: "Teks lebih mencolok dan ramah untuk dibaca jarak menengah." },
      },
      save: "Simpan Perubahan",
    },
    messages: {
      pageTitle: "Pesan",
      searchPlaceholder: "Cari obrolan atau pengguna...",
      checkProfile: "Cek Profil",
      clearChat: "Bersihkan Chat",
      clearChatConfirmTitle: "Bersihkan Chat?",
      clearChatConfirmText: "Seluruh riwayat obrolan dengan kontak ini akan dibersihkan dari tampilan Anda.",
      clearChatSuccess: "Tampilan riwayat chat telah dibersihkan.",
      typePlaceholder: "Ketik pesan...",
      send: "Kirim",
      noMessages: "Belum ada obrolan terpilih.",
    },
    withdrawals: {
      pageTitle: "Tarik Saldo",
      availableBalance: "Saldo tersedia",
      minimumWithdrawalNote: "Minimum penarikan Rp10.000. Saldo akan dicadangkan sampai Admin memproses permintaan.",
      nominalLabel: "Nominal penarikan (Rp)",
      methodLabel: "Metode pencairan",
      submitButton: "Ajukan Penarikan",
      securityNote: "Pastikan nama dan nomor tujuan sudah benar.",
    },
    projects: {
      createTitle: "Pasang Lowongan Baru",
      createSubtitle: "Publikasikan project baru untuk {businessName} dan mulai menerima proposal.",
      titleLabel: "Judul Project",
      budgetLabel: "Budget Tetap (Rp)",
      descriptionLabel: "Deskripsi Project",
      skillsLabel: "Skill Project",
      requiredSkills: "Skill Wajib",
      optionalSkills: "Skill Opsional",
      deadlineLabel: "Deadline",
      workModeLabel: "Mode Kerja",
      locationLabel: "Lokasi",
      publishButton: "Publikasikan Project",
    },
  },
  en: {
    sidebar: {
      dashboard: "Dashboard",
      findProjects: "Find Projects",
      myProposals: "My Proposals",
      activeProjects: "Active Projects",
      portfolio: "Portfolio",
      messages: "Messages",
      earnings: "Earnings",
      withdrawals: "Withdrawals",
      profile: "Profile",
      settings: "Settings",
      cariTalent: "Find Talent",
      pasangLowongan: "Post a Job",
      lowonganSaya: "My Listings",
      pelamar: "Applicants",
      daftarUser: "User List",
      daftarUmkm: "UMKM List",
      relasi: "Relations",
      lowongan: "Listings",
      monitorPesan: "Message Monitoring",
      logout: "Log Out",
    },
    common: {
      copyright: "© 2026 Jembara. All Rights Reserved.",
      search: "Search...",
      save: "Save Changes",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      back: "Back",
      loading: "Loading...",
      viewDetails: "View Details",
      submit: "Submit",
      close: "Close",
      status: {
        OPEN: "OPEN",
        PROPOSAL: "PROPOSAL",
        IN_PROGRESS: "IN PROGRESS",
        REVIEW: "REVIEW",
        COMPLETED: "COMPLETED",
        CANCELLED: "CANCELLED",
      },
      verified: "Verified",
      unverified: "Unverified",
      noData: "No data available yet.",
    },
    notifications: {
      title: "Notifications",
      markAllRead: "Mark all as read",
      empty: "No new notifications.",
      loadError: "Unable to load notifications.",
      justNow: "Just now",
    },
    settings: {
      pageTitle: "Settings",
      pageSubtitle: "Manage your account and preferences.",
      pageSubtitleUmkm: "Manage your company profile and business preferences for {businessName}.",
      tabs: {
        profil: "Profile",
        profilUmkm: "Company Profile",
        keamanan: "Security",
        notifikasi: "Notifications",
        pembayaran: "Payment",
        privasi: "Privacy",
        bahasa: "Language & Appearance",
      },
      language: {
        cardTitle: "System Language",
        selectLabel: "SELECT LANGUAGE",
        autoSaveNote: "Language, theme, and font size changes are saved automatically on this device.",
      },
      headers: {
        keamanan: {
          title: "Account Security",
          subtitle: "Manage authentication and protection for your account data.",
          subtitleUmkm: "Manage authentication and protection for your company data.",
        },
        notifikasi: {
          title: "Notification Preferences",
          subtitle: "Choose how and when you want to receive updates from clients.",
          subtitleUmkm: "Choose how and when you want to receive updates from talent.",
        },
        privasi: {
          title: "Security & Privacy",
          subtitle: "Manage the visibility of your data on the platform.",
          subtitleUmkm: "Manage the visibility of your company data on the platform.",
        },
      },
      theme: {
        cardTitle: "App Theme",
        light: { title: "Light", desc: "High-contrast display with a clean white background." },
        dark: { title: "Dark", desc: "Easier on the eyes in low-light conditions." },
        system: { title: "System", desc: "Automatically matches your device settings." },
      },
      fontSize: {
        cardTitle: "Font Size",
        small: { title: "Small (12px)", desc: "A denser UI that fits more information at once." },
        medium: { title: "Medium (14px)", desc: "The balanced default size for comfortable reading." },
        large: { title: "Large (16px)", desc: "More prominent text, easier to read from mid-range." },
      },
      save: "Save Changes",
    },
    messages: {
      pageTitle: "Messages",
      searchPlaceholder: "Search conversations or users...",
      checkProfile: "View Profile",
      clearChat: "Clear Chat",
      clearChatConfirmTitle: "Clear Chat?",
      clearChatConfirmText: "All chat history with this contact will be cleared from your view.",
      clearChatSuccess: "Chat history view cleared.",
      typePlaceholder: "Type a message...",
      send: "Send",
      noMessages: "No chat selected.",
    },
    withdrawals: {
      pageTitle: "Withdraw Balance",
      availableBalance: "Available balance",
      minimumWithdrawalNote: "Minimum withdrawal Rp10.000. Balance is reserved until Admin processes the request.",
      nominalLabel: "Withdrawal amount (Rp)",
      methodLabel: "Payout method",
      submitButton: "Submit Withdrawal",
      securityNote: "Ensure account name and number are correct.",
    },
    projects: {
      createTitle: "Post New Listing",
      createSubtitle: "Publish a new project for {businessName} and start receiving proposals.",
      titleLabel: "Project Title",
      budgetLabel: "Fixed Budget (Rp)",
      descriptionLabel: "Project Description",
      skillsLabel: "Project Skills",
      requiredSkills: "Required Skills",
      optionalSkills: "Optional Skills",
      deadlineLabel: "Deadline",
      workModeLabel: "Work Mode",
      locationLabel: "Location",
      publishButton: "Publish Project",
    },
  },
  ja: {
    sidebar: {
      dashboard: "ダッシュボード",
      findProjects: "プロジェクトを探す",
      myProposals: "提案一覧",
      activeProjects: "進行中のプロジェクト",
      portfolio: "ポートフォリオ",
      messages: "メッセージ",
      earnings: "収益",
      withdrawals: "出金",
      profile: "プロフィール",
      settings: "設定",
      cariTalent: "人材を探す",
      pasangLowongan: "求人を投稿",
      lowonganSaya: "自分の求人",
      pelamar: "応募者",
      daftarUser: "ユーザー一覧",
      daftarUmkm: "UMKM一覧",
      relasi: "関係",
      lowongan: "求人モニタリング",
      monitorPesan: "メッセージ監視",
      logout: "ログアウト",
    },
    common: {
      copyright: "© 2026 Jembara. 無断転載を禁じます。",
      search: "検索...",
      save: "変更を保存",
      cancel: "キャンセル",
      delete: "削除",
      edit: "編集",
      back: "戻る",
      loading: "読み込み中...",
      viewDetails: "詳細を見る",
      submit: "送信",
      close: "閉じる",
      status: {
        OPEN: "募集中",
        PROPOSAL: "提案中",
        IN_PROGRESS: "進行中",
        REVIEW: "レビュー中",
        COMPLETED: "完了",
        CANCELLED: "キャンセル済み",
      },
      verified: "確認済み",
      unverified: "未確認",
      noData: "利用可能なデータがありません。",
    },
    notifications: {
      title: "通知",
      markAllRead: "すべて既読にする",
      empty: "新しい通知はありません。",
      loadError: "通知を読み込めませんでした。",
      justNow: "たった今",
    },
    settings: {
      pageTitle: "設定",
      pageSubtitle: "アカウントと環境設定を管理します。",
      pageSubtitleUmkm: "{businessName}の企業プロフィールとビジネス設定を管理します。",
      tabs: {
        profil: "プロフィール",
        profilUmkm: "企業プロフィール",
        keamanan: "セキュリティ",
        notifikasi: "通知",
        pembayaran: "支払い",
        privasi: "プライバシー",
        bahasa: "言語と表示",
      },
      language: {
        cardTitle: "システム言語",
        selectLabel: "言語を選択",
        autoSaveNote: "言語、テーマ、フォントサイズの設定はこのデバイスに自動保存されます。",
      },
      headers: {
        keamanan: {
          title: "アカウントセキュリティ",
          subtitle: "アカウントデータの認証と保護を管理します。",
          subtitleUmkm: "企業データの認証と保護を管理します。",
        },
        notifikasi: {
          title: "通知設定",
          subtitle: "クライアントからの更新をどのように、いつ受け取るか選択します。",
          subtitleUmkm: "タレントからの更新をどのように、いつ受け取るか選択します。",
        },
        privasi: {
          title: "セキュリティとプライバシー",
          subtitle: "プラットフォーム上でのデータの公開範囲を管理します。",
          subtitleUmkm: "プラットフォーム上での企業データの公開範囲を管理します。",
        },
      },
      theme: {
        cardTitle: "アプリのテーマ",
        light: { title: "ライト", desc: "白背景でコントラストの高い表示です。" },
        dark: { title: "ダーク", desc: "暗い環境でも目に優しい表示です。" },
        system: { title: "システム", desc: "デバイスの設定に自動的に合わせます。" },
      },
      fontSize: {
        cardTitle: "文字サイズ",
        small: { title: "小 (12px)", desc: "情報を多く表示できるコンパクトな表示です。" },
        medium: { title: "中 (14px)", desc: "読みやすさとバランスの取れた標準サイズです。" },
        large: { title: "大 (16px)", desc: "見やすく、離れた距離からも読みやすい文字サイズです。" },
      },
      save: "変更を保存",
    },
    messages: {
      pageTitle: "メッセージ",
      searchPlaceholder: "会話やユーザーを検索...",
      checkProfile: "プロフィールを見る",
      clearChat: "チャットを消去",
      clearChatConfirmTitle: "チャットを消去しますか？",
      clearChatConfirmText: "この連絡先とのすべての会話履歴があなたの画面から消去されます。",
      clearChatSuccess: "チャット履歴の表示が消去されました。",
      typePlaceholder: "メッセージを入力...",
      send: "送信",
      noMessages: "選択されたチャットはありません。",
    },
    withdrawals: {
      pageTitle: "出金申請",
      availableBalance: "利用可能残高",
      minimumWithdrawalNote: "最低出金額はRp10.000です。管理者が処理するまで残高は予約されます。",
      nominalLabel: "出金金額 (Rp)",
      methodLabel: "受取方法",
      submitButton: "出金を申請",
      securityNote: "口座名義と口座番号が正しいかご確認ください。",
    },
    projects: {
      createTitle: "新規求人を投稿",
      createSubtitle: "{businessName}の新しいプロジェクトを公開して提案の受け取りを開始します。",
      titleLabel: "プロジェクト名",
      budgetLabel: "固定予算 (Rp)",
      descriptionLabel: "プロジェクト概要",
      skillsLabel: "必要スキル",
      requiredSkills: "必須スキル",
      optionalSkills: "推奨スキル",
      deadlineLabel: "締切日",
      workModeLabel: "勤務形態",
      locationLabel: "勤務地",
      publishButton: "プロジェクトを公開",
    },
  },
};

export default dictionary;