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
  landing: {
    nav: {
      cariTalent: string;
      cariProject: string;
      caraKerja: string;
      kategori: string;
      statistik: string;
      login: string;
      register: string;
      dashboard: string;
    };
    hero: {
      tag: string;
      titleLine1: string;
      titleLine2: string;
      subtitle: string;
      ctaFindProject: string;
      ctaFindTalent: string;
    };
    process: {
      badge: string;
      title: string;
      subtitle: string;
      step1Title: string;
      step1Desc: string;
      step2Title: string;
      step2Desc: string;
      step3Title: string;
      step3Desc: string;
      step4Title: string;
      step4Desc: string;
    };
    categories: {
      badge: string;
      title: string;
      subtitle: string;
      activeProjectsLabel: string;
    };
    topTalents: {
      badge: string;
      title: string;
      subtitle: string;
      viewAll: string;
      noTalent: string;
    };
    latestProjects: {
      badge: string;
      title: string;
      subtitle: string;
      viewAll: string;
      noProjects: string;
    };
    stats: {
      sdgBadge: string;
      sdgTitle: string;
      sdgDesc: string;
      completedProjects: string;
      activeStudents: string;
      partnerUmkm: string;
      satisfactionRate: string;
    };
    testimonials: {
      badge: string;
      title: string;
      subtitle: string;
      empty: string;
    };
    cta: {
      title: string;
      subtitle: string;
      studentCta: string;
      umkmCta: string;
    };
    footer: {
      tagline: string;
      copyright: string;
      company: string;
      mainFeatures: string;
      aboutUs: string;
      contact: string;
      careers: string;
      blog: string;
      testimonials: string;
      contactCs: string;
    };
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    emailLabel: string;
    passwordLabel: string;
    loginButton: string;
    noAccount: string;
    registerHere: string;
    registerTitle: string;
    registerSubtitle: string;
    nameLabel: string;
    roleLabel: string;
    roleStudent: string;
    roleStudentDesc: string;
    roleUmkm: string;
    roleUmkmDesc: string;
    registerButton: string;
    hasAccount: string;
    loginHere: string;
    confirmPasswordLabel: string;
  };
  dashboard: {
    welcome: string;
    subtitleStudent: string;
    subtitleUmkm: string;
    stats: {
      activeProjects: string;
      proposalsSubmitted: string;
      totalEarnings: string;
      completedProjects: string;
      openJobs: string;
      totalApplicants: string;
    };
    recentProjects: string;
    recentMessages: string;
    profileCompletion: string;
  };
  findProjects: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterCategory: string;
    filterWorkMode: string;
    noProjectsFound: string;
    submitProposal: string;
  };
  cariTalent: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    viewProfile: string;
  };
  activeProjects: {
    title: string;
    subtitle: string;
    all: string;
    inProgress: string;
    review: string;
    completed: string;
    submitWork: string;
    requestRevision: string;
    approveWork: string;
  };
  proposals: {
    title: string;
    subtitle: string;
    submitted: string;
    accepted: string;
    rejected: string;
  };
  portfolio: {
    title: string;
    subtitle: string;
    skillPassportTitle: string;
    addEvidence: string;
  };
  security: {
    title: string;
    subtitle: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    updatePasswordButton: string;
  };
  privacy: {
    title: string;
    subtitle: string;
    publicProfile: string;
    publicProfileDesc: string;
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
  admin: {
    dashboardTitle: string;
    dashboardSubtitle: string;
    quickActionsTitle: string;
    recentActivityTitle: string;
    userGrowthTitle: string;
    noActivity: string;
    userListTitle: string;
    userListSubtitle: string;
    umkmListTitle: string;
    umkmListSubtitle: string;
    jobsTitle: string;
    jobsSubtitle: string;
    relationsTitle: string;
    relationsSubtitle: string;
    skillsTitle: string;
    skillsSubtitle: string;
    chatTitle: string;
    chatSubtitle: string;
    reportsTitle: string;
    reportsSubtitle: string;
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
    landing: {
      nav: {
        cariTalent: "Cari Talent",
        cariProject: "Cari Proyek",
        caraKerja: "Cara Kerja",
        kategori: "Kategori",
        statistik: "Statistik",
        login: "Masuk",
        register: "Daftar",
        dashboard: "Dashboard",
      },
      hero: {
        tag: "Jembatani Keterampilan, Wujudkan Peluang",
        titleLine1: "Temukan Talenta.",
        titleLine2: "Selesaikan Project.",
        subtitle: "Jembara menghubungkan UMKM yang membutuhkan solusi digital berkualitas dengan mahasiswa berbakat yang siap menghadirkan karya terbaik.",
        ctaFindProject: "Temukan Project",
        ctaFindTalent: "Cari Talenta",
      },
      process: {
        badge: "Proses Sederhana",
        title: "Bagaimana Jembara Membantu Anda",
        subtitle: "Dari pasang project hingga serah terima hasil kerja, semua dirancang aman dan transparan.",
        step1Title: "UMKM Pasang Project",
        step1Desc: "Tulis kebutuhan, budget tetap, deadline, lokasi, serta skill wajib dan opsional.",
        step2Title: "Smart Matching",
        step2Desc: "Jembara memberi ranking dari skill, portofolio, rating, budget, ketersediaan, dan lokasi.",
        step3Title: "Pilih dan Kolaborasi",
        step3Desc: "UMKM memilih satu talent, mengamankan pembayaran, lalu berkolaborasi hingga hasil direview.",
        step4Title: "Reputasi Bertumbuh",
        step4Desc: "Proyek selesai dan ulasan nyata memperbarui reputasi serta Skill Passport talent.",
      },
      categories: {
        badge: "Kategori Populer",
        title: "Layanan Digital Paling Dicari",
        subtitle: "Temukan talenta terbaik berdasarkan keahlian spesifik yang dibutuhkan bisnis Anda.",
        activeProjectsLabel: "Didukung Smart Matching",
      },
      topTalents: {
        badge: "Talenta Berbakat",
        title: "Mahasiswa Terbaik Minggu Ini",
        subtitle: "Lihat profil mahasiswa berprestasi dengan rekam jejak penyelesaian project yang mengagumkan.",
        viewAll: "Lihat Semua Talenta",
        noTalent: "Belum ada talent publik yang sedang tersedia.",
      },
      latestProjects: {
        badge: "Daftar Project",
        title: "Project Terbaru dari UMKM",
        subtitle: "Lihat peluang kerja sama terbaru dan mulailah membangun portofolio hebat Anda hari ini.",
        viewAll: "Lihat Semua Proyek",
        noProjects: "Belum ada project OPEN. Jadilah UMKM pertama yang memasang project.",
      },
      stats: {
        sdgBadge: "SDG 8: Pekerjaan Layak & Pertumbuhan Ekonomi",
        sdgTitle: "Mendorong Pengalaman Kerja & Digitalisasi UMKM",
        sdgDesc: "Jembara berkomitmen memberikan pengalaman proyek nyata bagi pelajar sekaligus mendukung UMKM dalam bertransformasi secara digital.",
        completedProjects: "Proyek Selesai",
        activeStudents: "Mahasiswa Aktif",
        partnerUmkm: "UMKM Mitra",
        satisfactionRate: "Tingkat Kepuasan",
      },
      testimonials: {
        badge: "Cerita Sukses",
        title: "Apa Kata Mereka Tentang Kami",
        subtitle: "Dari para pelaku usaha kecil hingga talenta muda masa depan negeri ini.",
        empty: "Cerita sukses akan tampil setelah proyek pertama selesai dan diberi ulasan.",
      },
      cta: {
        title: "Siap Memulai Langkah Anda Bersama Jembara?",
        subtitle: "Daftarkan bisnis UMKM Anda atau profil mahasiswa bertalenta tinggi secara gratis sekarang juga.",
        studentCta: "Daftar Sebagai Mahasiswa",
        umkmCta: "Daftar Sebagai UMKM",
      },
      footer: {
        tagline: "Pemberdayaan UMKM lokal Indonesia melalui inovasi, edukasi, dan kolaborasi talenta muda berdaya saing global.",
        copyright: "© 2026 Jembara. Hak Cipta Dilindungi Undang-Undang.",
        company: "Perusahaan",
        mainFeatures: "Fitur Utama",
        aboutUs: "Tentang Kami",
        contact: "Kontak",
        careers: "Karir",
        blog: "Blog",
        testimonials: "Testimoni",
        contactCs: "Hubungi CS",
      },
    },
    auth: {
      loginTitle: "Masuk ke Jembara",
      loginSubtitle: "Selamat datang kembali! Silakan masuk ke akun Anda.",
      emailLabel: "Email",
      passwordLabel: "Password",
      loginButton: "Masuk",
      noAccount: "Belum punya akun?",
      registerHere: "Daftar di sini",
      registerTitle: "Daftar Akun Baru",
      registerSubtitle: "Pilih peran Anda dan mulai perjalanan di Jembara.",
      nameLabel: "Nama Lengkap",
      roleLabel: "Pilih Peran Akun",
      roleStudent: "Pelajar / Mahasiswa",
      roleStudentDesc: "Cari proyek nyata, bangun portofolio, dan raih pendapatan.",
      roleUmkm: "Perusahaan / UMKM",
      roleUmkmDesc: "Pasang proyek digital dan temukan talenta berkualitas.",
      registerButton: "Daftar Sekarang",
      hasAccount: "Sudah punya akun?",
      loginHere: "Masuk di sini",
      confirmPasswordLabel: "Konfirmasi Password",
    },
    dashboard: {
      welcome: "Selamat Datang Kembali",
      subtitleStudent: "Pantau perkembangan proyek, proposal, dan statistik Anda.",
      subtitleUmkm: "Kelola lowongan proyek dan pantau pelamar bisnis Anda.",
      stats: {
        activeProjects: "Proyek Aktif",
        proposalsSubmitted: "Proposal Terkirim",
        totalEarnings: "Total Pendapatan",
        completedProjects: "Proyek Selesai",
        openJobs: "Lowongan Terbuka",
        totalApplicants: "Total Pelamar",
      },
      recentProjects: "Proyek Terbaru",
      recentMessages: "Pesan Terbaru",
      profileCompletion: "Kelengkapan Profil",
    },
    findProjects: {
      title: "Cari Proyek Digital",
      subtitle: "Temukan proyek yang sesuai dengan keahlian dan minat Anda.",
      searchPlaceholder: "Cari judul proyek atau kata kunci...",
      filterCategory: "Kategori",
      filterWorkMode: "Mode Kerja",
      noProjectsFound: "Tidak ada proyek yang sesuai filter pencarian.",
      submitProposal: "Kirim Proposal",
    },
    cariTalent: {
      title: "Cari Talenta Pelajar",
      subtitle: "Temukan siswa dan mahasiswa berbakat untuk proyek digital UMKM Anda.",
      searchPlaceholder: "Cari nama talenta atau skill...",
      viewProfile: "Lihat Profil",
    },
    activeProjects: {
      title: "Proyek Aktif",
      subtitle: "Kelola alur kerja dan pengumpulan hasil proyek yang sedang berjalan.",
      all: "Semua",
      inProgress: "Dalam Pengerjaan",
      review: "Dalam Peninjauan",
      completed: "Selesai",
      submitWork: "Kirim Hasil Kerja",
      requestRevision: "Minta Revisi",
      approveWork: "Setujui Hasil",
    },
    proposals: {
      title: "Proposal Saya",
      subtitle: "Pantau status pengajuan proposal proyek Anda.",
      submitted: "Terkirim",
      accepted: "Diterima",
      rejected: "Ditolak",
    },
    portfolio: {
      title: "Portofolio & Skill Passport",
      subtitle: "Tampilkan bukti karya dan reputasi keahlian terverifikasi Anda.",
      skillPassportTitle: "Skill Passport Terverifikasi",
      addEvidence: "Tambah Bukti Karya",
    },
    security: {
      title: "Keamanan Akun",
      subtitle: "Perbarui kata sandi dan amankan akses akun Anda.",
      currentPassword: "Kata Sandi Saat Ini",
      newPassword: "Kata Sandi Baru",
      confirmPassword: "Konfirmasi Kata Sandi Baru",
      updatePasswordButton: "Perbarui Kata Sandi",
    },
    privacy: {
      title: "Keamanan & Privasi Data",
      subtitle: "Atur visibilitas informasi Anda di platform.",
      publicProfile: "Tampilkan Profil Publik",
      publicProfileDesc: "Izinkan profil Anda muncul di pencarian publik dan rekomendasi.",
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
    admin: {
      dashboardTitle: "Dashboard Admin Jembara",
      dashboardSubtitle: "Overview performa operasional, talenta, dan UMKM se-Indonesia hari ini.",
      quickActionsTitle: "Aksi Cepat Admin",
      recentActivityTitle: "Aktivitas Terbaru Platform",
      userGrowthTitle: "Pertumbuhan Pengguna Baru",
      noActivity: "Belum ada aktivitas platform.",
      userListTitle: "Daftar User Platform",
      userListSubtitle: "Kelola akun pengguna, peran, dan status verifikasi di platform Jembara.",
      umkmListTitle: "Daftar UMKM Terdaftar",
      umkmListSubtitle: "Kelola dan verifikasi profil bisnis UMKM di platform Jembara.",
      jobsTitle: "Kelola Lowongan Proyek",
      jobsSubtitle: "Pantau dan moderasi seluruh lowongan proyek yang dipasang oleh UMKM.",
      relationsTitle: "Relasi & Kolaborasi Proyek",
      relationsSubtitle: "Pantau status relasi kerja sama antara UMKM dan Pelajar.",
      skillsTitle: "Verifikasi Skill Pelajar",
      skillsSubtitle: "Tinjau pengajuan klaim skill dan bukti portofolio pelajar.",
      chatTitle: "Monitor Pesan Platform",
      chatSubtitle: "Moderasi dan awasi riwayat percakapan antara pengguna platform.",
      reportsTitle: "Laporan & Moderasi Pengguna",
      reportsSubtitle: "Tinjau dan proses laporan pelanggaran dari pengguna platform.",
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
    landing: {
      nav: {
        cariTalent: "Find Talent",
        cariProject: "Find Projects",
        caraKerja: "How It Works",
        kategori: "Categories",
        statistik: "Statistics",
        login: "Log In",
        register: "Register",
        dashboard: "Dashboard",
      },
      hero: {
        tag: "Bridge Skills, Realize Opportunities",
        titleLine1: "Find Talent.",
        titleLine2: "Complete Projects.",
        subtitle: "Jembara connects SMBs needing quality digital solutions with talented students ready to deliver their best work.",
        ctaFindProject: "Find Projects",
        ctaFindTalent: "Find Talent",
      },
      process: {
        badge: "Simple Process",
        title: "How Jembara Helps You",
        subtitle: "From posting a project to final delivery, everything is designed to be safe and transparent.",
        step1Title: "UMKM Posts Project",
        step1Desc: "Specify requirements, fixed budget, deadline, location, mandatory skills, and optional skills.",
        step2Title: "Smart Matching",
        step2Desc: "Jembara ranks candidates based on skills, portfolio, rating, budget, availability, and location.",
        step3Title: "Select and Collaborate",
        step3Desc: "UMKM picks a talent, secures payment, and collaborates until work review.",
        step4Title: "Growing Reputation",
        step4Desc: "Project completion and verified reviews update the talent's reputation and Skill Passport.",
      },
      categories: {
        badge: "Popular Categories",
        title: "Most Demanded Digital Services",
        subtitle: "Find top talent based on the specific expertise your business needs.",
        activeProjectsLabel: "Powered by Smart Matching",
      },
      topTalents: {
        badge: "Talented Youth",
        title: "Top Students of the Week",
        subtitle: "Explore high-performing student profiles with outstanding project track records.",
        viewAll: "View All Talents",
        noTalent: "No public talents are currently available.",
      },
      latestProjects: {
        badge: "Project Listings",
        title: "Latest Projects from SMBs",
        subtitle: "Discover new collaboration opportunities and build your great portfolio today.",
        viewAll: "View All Projects",
        noProjects: "No OPEN projects available yet. Be the first SMB to post a project.",
      },
      stats: {
        sdgBadge: "SDG 8: Decent Work & Economic Growth",
        sdgTitle: "Driving Practical Experience & SMB Digitalization",
        sdgDesc: "Jembara is committed to providing real project experience for students while supporting SMBs in digital transformation.",
        completedProjects: "Completed Projects",
        activeStudents: "Active Students",
        partnerUmkm: "Partner SMBs",
        satisfactionRate: "Satisfaction Rate",
      },
      testimonials: {
        badge: "Success Stories",
        title: "What They Say About Us",
        subtitle: "From local small business owners to the nation's future digital talents.",
        empty: "Success stories will appear after the first project is completed and reviewed.",
      },
      cta: {
        title: "Ready to Take Your Next Step with Jembara?",
        subtitle: "Register your SMB business or talented student profile for free right now.",
        studentCta: "Register as Student",
        umkmCta: "Register as SMB",
      },
      footer: {
        tagline: "Empowering local Indonesian SMBs through innovation, education, and collaboration with globally competitive youth.",
        copyright: "© 2026 Jembara. All Rights Reserved.",
        company: "Company",
        mainFeatures: "Main Features",
        aboutUs: "About Us",
        contact: "Contact",
        careers: "Careers",
        blog: "Blog",
        testimonials: "Testimonials",
        contactCs: "Contact Support",
      },
    },
    auth: {
      loginTitle: "Log in to Jembara",
      loginSubtitle: "Welcome back! Please log in to your account.",
      emailLabel: "Email",
      passwordLabel: "Password",
      loginButton: "Log In",
      noAccount: "Don't have an account?",
      registerHere: "Register here",
      registerTitle: "Create New Account",
      registerSubtitle: "Select your role and start your journey on Jembara.",
      nameLabel: "Full Name",
      roleLabel: "Select Account Role",
      roleStudent: "Student",
      roleStudentDesc: "Find real projects, build portfolios, and earn income.",
      roleUmkm: "Business / UMKM",
      roleUmkmDesc: "Post digital projects and find quality talent.",
      registerButton: "Register Now",
      hasAccount: "Already have an account?",
      loginHere: "Log in here",
      confirmPasswordLabel: "Confirm Password",
    },
    dashboard: {
      welcome: "Welcome Back",
      subtitleStudent: "Monitor project progress, proposals, and your stats.",
      subtitleUmkm: "Manage project listings and track your applicants.",
      stats: {
        activeProjects: "Active Projects",
        proposalsSubmitted: "Proposals Submitted",
        totalEarnings: "Total Earnings",
        completedProjects: "Completed Projects",
        openJobs: "Open Listings",
        totalApplicants: "Total Applicants",
      },
      recentProjects: "Recent Projects",
      recentMessages: "Recent Messages",
      profileCompletion: "Profile Completion",
    },
    findProjects: {
      title: "Find Digital Projects",
      subtitle: "Find projects matching your skills and interest.",
      searchPlaceholder: "Search project title or keyword...",
      filterCategory: "Category",
      filterWorkMode: "Work Mode",
      noProjectsFound: "No projects match your search filter.",
      submitProposal: "Submit Proposal",
    },
    cariTalent: {
      title: "Find Student Talent",
      subtitle: "Discover talented students for your digital project.",
      searchPlaceholder: "Search talent name or skill...",
      viewProfile: "View Profile",
    },
    activeProjects: {
      title: "Active Projects",
      subtitle: "Manage workflow and submission of ongoing projects.",
      all: "All",
      inProgress: "In Progress",
      review: "Under Review",
      completed: "Completed",
      submitWork: "Submit Work",
      requestRevision: "Request Revision",
      approveWork: "Approve Work",
    },
    proposals: {
      title: "My Proposals",
      subtitle: "Track the status of your submitted project proposals.",
      submitted: "Submitted",
      accepted: "Accepted",
      rejected: "Rejected",
    },
    portfolio: {
      title: "Portfolio & Skill Passport",
      subtitle: "Display proof of work and your verified reputation.",
      skillPassportTitle: "Verified Skill Passport",
      addEvidence: "Add Work Evidence",
    },
    security: {
      title: "Account Security",
      subtitle: "Update your password and secure account access.",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      updatePasswordButton: "Update Password",
    },
    privacy: {
      title: "Data Security & Privacy",
      subtitle: "Manage your visibility on the platform.",
      publicProfile: "Show Public Profile",
      publicProfileDesc: "Allow your profile to appear in public search and recommendations.",
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
    admin: {
      dashboardTitle: "Jembara Admin Dashboard",
      dashboardSubtitle: "Overview of operational performance, talents, and SMBs across Indonesia today.",
      quickActionsTitle: "Admin Quick Actions",
      recentActivityTitle: "Recent Platform Activity",
      userGrowthTitle: "New User Growth",
      noActivity: "No platform activity yet.",
      userListTitle: "Platform User List",
      userListSubtitle: "Manage user accounts, roles, and verification status across Jembara.",
      umkmListTitle: "Registered SMB List",
      umkmListSubtitle: "Manage and verify SMB business profiles on Jembara.",
      jobsTitle: "Manage Project Listings",
      jobsSubtitle: "Monitor and moderate all project listings posted by SMBs.",
      relationsTitle: "Project Relations & Collaborations",
      relationsSubtitle: "Monitor collaboration status between SMBs and Students.",
      skillsTitle: "Student Skill Verification",
      skillsSubtitle: "Review student skill claims and portfolio evidence.",
      chatTitle: "Platform Chat Monitoring",
      chatSubtitle: "Moderate and oversee conversation history between users.",
      reportsTitle: "User Reports & Moderation",
      reportsSubtitle: "Review and process violation reports from platform users.",
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
    landing: {
      nav: {
        cariTalent: "タレントを探す",
        cariProject: "案件を探す",
        caraKerja: "使い方",
        kategori: "カテゴリー",
        statistik: "統計",
        login: "ログイン",
        register: "登録",
        dashboard: "ダッシュボード",
      },
      hero: {
        tag: "スキルをつなぎ、チャンスを形に",
        titleLine1: "タレントを見つけよう。",
        titleLine2: "案件を完了しよう。",
        subtitle: "Jembaraは高品質なデジタルソリューションを求める中小企業と、優秀な学生タレントを直接つなぎます。",
        ctaFindProject: "案件を探す",
        ctaFindTalent: "タレントを探す",
      },
      process: {
        badge: "シンプルプロセス",
        title: "Jembaraの仕組み",
        subtitle: "案件の投稿から成果物の納品まで、すべて安心・透明に設計されています。",
        step1Title: "企業が案件を投稿",
        step1Desc: "必要スキル、固定予算、納期、勤務形態、必須・任意スキルを入力します。",
        step2Title: "スマートマッチング",
        step2Desc: "スキル・実績・評価・予算・稼働状況・位置情報に基づき自動ランク付けします。",
        step3Title: "選定とコラボレーション",
        step3Desc: "候補者を1名選出し、支払いを保護した上でレビュー完了まで共同作業を進めます。",
        step4Title: "実績と信頼の向上",
        step4Desc: "案件完了とリアルな評価により、タレントの評判とスキルパスポートが更新されます。",
      },
      categories: {
        badge: "人気カテゴリー",
        title: "人気のデジタルサービス",
        subtitle: "あなたのビジネスに必要な専門スキルに合わせて最適なタレントを見つけましょう。",
        activeProjectsLabel: "Smart Matching対応",
      },
      topTalents: {
        badge: "注目のタレント",
        title: "今週の優秀学生",
        subtitle: "素晴らしいプロジェクト実績を持つ優秀な学生プロフィールをご覧ください。",
        viewAll: "すべてのタレントを見る",
        noTalent: "現在公開中のタレントはいません。",
      },
      latestProjects: {
        badge: "案件一覧",
        title: "中小企業からの最新案件",
        subtitle: "最新の協業機会を見つけ、今日から素晴らしいポートフォリオを構築しましょう。",
        viewAll: "すべての案件を見る",
        noProjects: "現在募集中の案件はありません。最初の案件を投稿してみましょう。",
      },
      stats: {
        sdgBadge: "SDG 8: 働きがいも経済成長も",
        sdgTitle: "実務経験の提供と中小企業のデジタル化を推進",
        sdgDesc: "Jembaraは学生にリアルなプロジェクト経験を提供すると同時に、中小企業のデジタル変革を支援します。",
        completedProjects: "完了した案件",
        activeStudents: "アクティブ学生数",
        partnerUmkm: "パートナー企業数",
        satisfactionRate: "満足度",
      },
      testimonials: {
        badge: "成功事例",
        title: "お客様の声",
        subtitle: "地域の事業者様から未来を担う若いデジタル人材まで。",
        empty: "最初のプロジェクトが完了してレビューされると、成功事例が表示されます。",
      },
      cta: {
        title: "Jembaraで新しい一歩を踏み出しませんか？",
        subtitle: "中小企業または優秀な学生プロフィールを今すぐ無料で登録しましょう。",
        studentCta: "学生として登録",
        umkmCta: "企業として登録",
      },
      footer: {
        tagline: "イノベーション、教育、そして若き人材とのコラボレーションにより地域中小企業を支援します。",
        copyright: "© 2026 Jembara. All Rights Reserved.",
        company: "企業情報",
        mainFeatures: "主な機能",
        aboutUs: "会社概要",
        contact: "お問い合わせ",
        careers: "採用情報",
        blog: "ブログ",
        testimonials: "お客様の声",
        contactCs: "サポートにお問い合わせ",
      },
    },
    auth: {
      loginTitle: "Jembaraにログイン",
      loginSubtitle: "お帰りなさい！アカウントにログインしてください。",
      emailLabel: "メールアドレス",
      passwordLabel: "パスワード",
      loginButton: "ログイン",
      noAccount: "アカウントをお持ちでないですか？",
      registerHere: "ここから登録",
      registerTitle: "新規アカウント作成",
      registerSubtitle: "役割を選択してJembaraでの旅を始めましょう。",
      nameLabel: "氏名",
      roleLabel: "アカウントの役割を選択",
      roleStudent: "学生",
      roleStudentDesc: "実プロジェクトを見つけ、ポートフォリオを構築し、収益を得ましょう。",
      roleUmkm: "企業・UMKM",
      roleUmkmDesc: "デジタルプロジェクトを投稿し、優秀なタレントを見つけましょう。",
      registerButton: "今すぐ登録",
      hasAccount: "既にアカウントをお持ちですか？",
      loginHere: "ここからログイン",
      confirmPasswordLabel: "パスワード（確認）",
    },
    dashboard: {
      welcome: "おかえりなさい",
      subtitleStudent: "プロジェクトの進捗、提案、統計を管理します。",
      subtitleUmkm: "求人一覧と応募者を管理します。",
      stats: {
        activeProjects: "進行中のプロジェクト",
        proposalsSubmitted: "提出済みの提案",
        totalEarnings: "総収益",
        completedProjects: "完了したプロジェクト",
        openJobs: "募集中の求人",
        totalApplicants: "総応募者数",
      },
      recentProjects: "最近のプロジェクト",
      recentMessages: "最近のメッセージ",
      profileCompletion: "プロフィール完成度",
    },
    findProjects: {
      title: "デジタルプロジェクトを探す",
      subtitle: "あなたのスキルと関心に合うプロジェクトを見つけましょう。",
      searchPlaceholder: "プロジェクト名またはキーワードを検索...",
      filterCategory: "カテゴリー",
      filterWorkMode: "勤務形態",
      noProjectsFound: "検索条件に一致するプロジェクトは見つかりませんでした。",
      submitProposal: "提案を送信",
    },
    cariTalent: {
      title: "学生タレントを探す",
      subtitle: "あなたのデジタルプロジェクトに最適な学生を見つけましょう。",
      searchPlaceholder: "タレント名またはスキルを検索...",
      viewProfile: "プロフィールを見る",
    },
    activeProjects: {
      title: "進行中のプロジェクト",
      subtitle: "進行中プロジェクトのワークフローと成果物提出を管理します。",
      all: "すべて",
      inProgress: "進行中",
      review: "レビュー中",
      completed: "完了",
      submitWork: "成果物を提出",
      requestRevision: "修正を依頼",
      approveWork: "成果物を承認",
    },
    proposals: {
      title: "提案一覧",
      subtitle: "提出したプロジェクト提案のステータスを確認します。",
      submitted: "提出済み",
      accepted: "採用",
      rejected: "不採用",
    },
    portfolio: {
      title: "ポートフォリオ＆スキルパスポート",
      subtitle: "実績と認証されたスキル評判を表示します。",
      skillPassportTitle: "認証済みスキルパスポート",
      addEvidence: "実績証拠を追加",
    },
    security: {
      title: "アカウントセキュリティ",
      subtitle: "パスワードを更新してアカウントアクセスを保護します。",
      currentPassword: "現在のパスワード",
      newPassword: "新しいパスワード",
      confirmPassword: "新しいパスワード（確認）",
      updatePasswordButton: "パスワードを更新",
    },
    privacy: {
      title: "データセキュリティとプライバシー",
      subtitle: "プラットフォーム上での公開範囲を管理します。",
      publicProfile: "公開プロフィールを表示",
      publicProfileDesc: "公開検索および推奨事項にプロフィールを表示することを許可します。",
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
    admin: {
      dashboardTitle: "Jembara 管理者ダッシュボード",
      dashboardSubtitle: "インドネシア全土の運用パフォーマンス、タレント、中小企業の概要。",
      quickActionsTitle: "管理者クイックアクション",
      recentActivityTitle: "プラットフォームの最近のアクティビティ",
      userGrowthTitle: "新規ユーザーの推移",
      noActivity: "アクティビティはまだありません。",
      userListTitle: "ユーザー一覧",
      userListSubtitle: "ユーザーアカウント、役割、および認証ステータスを管理します。",
      umkmListTitle: "登録企業一覧",
      umkmListSubtitle: "中小企業のビジネスプロフィールの管理および認証を行います。",
      jobsTitle: "案件管理",
      jobsSubtitle: "投稿されたすべての案件を監視・モデレーションします。",
      relationsTitle: "プロジェクト関係一覧",
      relationsSubtitle: "企業と学生の間のコラボレーションステータスを監視します。",
      skillsTitle: "スキル認証",
      skillsSubtitle: "学生のスキル申請およびポートフォリオ証拠を審査します。",
      chatTitle: "チャットの監視",
      chatSubtitle: "ユーザー間の会話履歴をモデレーション・監視します。",
      reportsTitle: "通報とモデレーション",
      reportsSubtitle: "ユーザーからの違反通報を審査・処理します。",
    },
  },
};

export default dictionary;