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
      save: "Simpan",
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
      save: "Save",
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
      save: "保存",
    },
  },
};

export default dictionary;