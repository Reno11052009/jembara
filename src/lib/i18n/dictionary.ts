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
    logoutConfirmTitle: string;
    logoutConfirmButton: string;
    logoutCancelButton: string;
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
    comingSoonTitle: string;
    comingSoonSubtitle: string;
    pagination: {
      showing: string;
      of: string;
      previous: string;
      next: string;
    };
    ui: {
      searchPlaceholder: string;
      searchOptionsPlaceholder: string;
      loadingOptions: string;
      notFound: string;
      optionNotFound: string;
      selectedSkills: string;
      maxSelectedSkills: string;
    };
    datePicker: {
      selectDate: string;
      today: string;
      clear: string;
      prevMonth: string;
      nextMonth: string;
      months: string[];
      weekdays: string[];
    };
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
    eyebrowLogin: string;
    loginHeadline: string;
    loginSubtitleText: string;
    noAccountText: string;
    registerText: string;
    eyebrowRegister: string;
    registerHeadline: string;
    registerSubtitleText: string;
    hasAccountText: string;
    loginText: string;
    shellHeroTag: string;
    shellHeroTitle: string;
    shellHeroDesc: string;
    authenticatorLabel: string;
    authenticatorPlaceholder: string;
    loginSuccessMsg: string;
    registerSuccessMsg: string;
    connectionErrorTitle: string;
    connectionErrorDesc: string;
    whyThisHappened: string;
    profileProgress: string;
    addressLabel: string;
    addressPlaceholder: string;
    fullNamePlaceholder: string;
    passwordMinPlaceholder: string;
    repeatPasswordPlaceholder: string;
    selectRoleBadge: string;
    joinAsTitle: string;
    joinAsDesc: string;
    joinFreeNote: string;
    fillBusinessProfile: string;
    businessNameLabel: string;
    businessNamePlaceholder: string;
    businessCategoryLabel: string;
    selectBusinessCategory: string;
    searchCategoryPlaceholder: string;
    phoneLabel: string;
    websiteLabel: string;
    websiteErrorMsg: string;
    saving: string;
    saveAndContinue: string;
    categories: {
      kuliner: string;
      fashion: string;
      jasa: string;
      teknologi: string;
      agribisnis: string;
      kreatif: string;
      pendidikan: string;
      kesehatan: string;
      properti: string;
      perdagangan: string;
      hiburan: string;
    };
  };
  dashboard: {
    welcome: string;
    greetingStudent: string;
    greetingUmkm: string;
    greetingAdmin: string;
    subtitleStudent: string;
    subtitleUmkm: string;
    subtitleAdmin: string;
    recommendedProjectsTitle: string;
    umkmProjectsTitle: string;
    emptyRecommended: string;
    emptyRecommendedNoSkill: string;
    stats: {
      activeProjects: string;
      proposalsSubmitted: string;
      totalEarnings: string;
      completedProjects: string;
      averageRating: string;
      totalProjects: string;
      proposalsReceived: string;
      openJobs: string;
      totalApplicants: string;
      unitProposal: string;
      unitActive: string;
      unitCompleted: string;
      unitProject: string;
      unitListing: string;
      unitPeople: string;
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
    titleStudent: string;
    subtitleStudent: string;
    titleUmkm: string;
    subtitleUmkm: string;
    titleAdmin: string;
    subtitleAdmin: string;
    all: string;
    inProgress: string;
    review: string;
    completed: string;
    submitWork: string;
    requestRevision: string;
    approveWork: string;
    emptyMessageStudent: string;
    emptyMessageUmkm: string;
    emptyMessageAdmin: string;
    collaborationTipTitle: string;
    collaborationTipStudent: string;
    collaborationTipUmkm: string;
    collaborationTipAdmin: string;
    summaryTitleStudent: string;
    summaryTitleUmkm: string;
    summaryTitleAdmin: string;
    metrics: {
      activeStudent: string;
      activeUmkm: string;
      completedThisMonth: string;
      activeValue: string;
      studentRating: string;
      noRating: string;
      awaitingReview: string;
      inReview: string;
      selectedTalent: string;
      totalProposals: string;
      unitProject: string;
      unitTalent: string;
      unitProposal: string;
    };
    card: {
      counterpartUmkm: string;
      counterpartTalent: string;
      unassignedTalent: string;
      budget: string;
      deadline: string;
      lastUpdate: string;
      proposalsReceived: string;
      proposalsCount: string;
      paymentSecured: string;
    };
    workflow: {
      submitHeader: string;
      submitRevisionHeader: string;
      revisionGuide: string;
      resultUrlPlaceholder: string;
      notesPlaceholder: string;
      submitting: string;
      submitBtn: string;
      submitError: string;
      talentResultTitle: string;
      openResultLink: string;
      approving: string;
      approveBtn: string;
      revisionReasonPlaceholder: string;
      requestRevisionBtn: string;
      revisionSuccessTitle: string;
      revisionSuccessText: string;
      revisionError: string;
      approveSwalTitle: string;
      approveSwalText: string;
      approveSwalConfirm: string;
      approveSwalCancel: string;
      approveError: string;
      rateTalentTitle: string;
      ratingOptions: {
        r5: string;
        r4: string;
        r3: string;
        r2: string;
        r1: string;
      };
      commentPlaceholder: string;
      saveReviewBtn: string;
      reviewSuccessTitle: string;
      reviewError: string;
    };
    progress: {
      progressTitle: string;
      milestoneTitle: string;
    };
  };
  proposals: {
    title: string;
    subtitle: string;
    all: string;
    submitted: string;
    accepted: string;
    rejected: string;
    emptyCategory: string;
    match: string;
    budget: string;
    submittedDate: string;
  };
  portfolio: {
    title: string;
    subtitle: string;
    skillPassportTitle: string;
    addEvidence: string;
    noSkills: string;
    stats: {
      portfolioWorks: string;
      completedProjects: string;
      averageRating: string;
      verifiedSkills: string;
      noRating: string;
    };
    evidence: {
      label: string;
      notSelected: string;
      placeholder: string;
      successTitle: string;
      successDesc: string;
      unspecifiedCategory: string;
    };
    projectsSection: {
      bestWorks: string;
      closeForm: string;
      addProject: string;
      workTitle: string;
      workLink: string;
      imageUrl: string;
      description: string;
      emptyDescription: string;
      savePortfolio: string;
      emptyProjects: string;
      saveSuccess: string;
      saveError: string;
    };
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
  profilePage: {
    title: string;
    subtitle: string;
    about: string;
    featuredPortfolio: string;
    noDescription: string;
    emptyPortfolios: string;
    clientReviews: string;
    noReviewComment: string;
    emptyReviews: string;
    editProfileTitle: string;
    editProfileSubtitle: string;
    backToProfile: string;
    profilePicture: string;
    pictureSizeNote: string;
    changePhoto: string;
    fullName: string;
    jobHeadline: string;
    locationAddress: string;
    educationLevel: string;
    selectEducationLevel: string;
    schoolUniversity: string;
    aboutMeDescription: string;
    aboutMeNote: string;
    skillsAndTools: string;
    skillsPlaceholder: string;
    saving: string;
    card: {
      roleStudent: string;
      roleUmkm: string;
      roleAdmin: string;
      roleUser: string;
      available: string;
      unavailable: string;
      reviews: string;
      completedProjects: string;
      editProfile: string;
      contactHire: string;
      skillsTitle: string;
      emptySkills: string;
    };
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
  settingsCards: {
    notifications: {
      emailTitle: string;
      pushTitle: string;
      deadlineTitle: string;
      deadlineDesc: string;
      proposalMasukTitle: string;
      proposalMasukDesc: string;
      pesanBaruTitle: string;
      pesanBaruDesc: string;
      pembayaranTitle: string;
      pembayaranDesc: string;
      updateProyekTitle: string;
      updateProyekDesc: string;
      promosiTitle: string;
      promosiDesc: string;
      saveButton: string;
      saving: string;
      saveSuccess: string;
    };
    privacy: {
      visibilityTitle: string;
      visibilityUmkmTitle: string;
      visibilityStudentDesc: string;
      visibilityUmkmDesc: string;
      publicTitle: string;
      publicDesc: string;
      privateTitle: string;
      privateDesc: string;
      saveSuccess: string;
      dataAccountTitle: string;
      downloadDataTitle: string;
      downloadDataDesc: string;
      downloadDataButton: string;
      deleteAccountTitle: string;
      deleteAccountDesc: string;
      deleteAccountButton: string;
      deleting: string;
      confirmDeleteTitle: string;
      confirmDeleteText: string;
      passwordRequired: string;
    };
    security: {
      changePasswordTitle: string;
      currentPasswordLabel: string;
      newPasswordLabel: string;
      confirmPasswordLabel: string;
      savePasswordButton: string;
      saving: string;
      passwordUpdatedTitle: string;
      passwordUpdatedText: string;
      twoFactorTitle: string;
      twoFactorDesc: string;
      active: string;
      inactive: string;
      startSetup: string;
      enterSecretNote: string;
      openAuthApp: string;
      verifyAndActivate: string;
      disable2FA: string;
      activeSessionsTitle: string;
      noOtherSessions: string;
      logoutSession: string;
      confirmRevokeTitle: string;
      confirmRevokeText: string;
      yesRevoke: string;
    };
    payments: {
      payoutMethodsTitle: string;
      payoutMethodsDesc: string;
      addMethod: string;
      closeMethod: string;
      providerLabel: string;
      accountNameLabel: string;
      accountNumberLabel: string;
      makePrimaryLabel: string;
      saveMethodButton: string;
      noMethodsNote: string;
      primaryBadge: string;
      makePrimaryButton: string;
      maxMethodsNote: string;
      manualWithdrawalTitle: string;
      manualWithdrawalNote: string;
      adminCheckNote: string;
      withdrawButton: string;
      addAccountFirst: string;
      transactionHistoryTitle: string;
      tableHeaderDate: string;
      tableHeaderDesc: string;
      tableHeaderAmount: string;
      tableHeaderStatus: string;
      noTransactions: string;
      studentPayoutOnlyTitle: string;
      studentPayoutOnlyDesc: string;
    };
    profile: {
      changeLogo: string;
      changePhoto: string;
      companyProfileTitle: string;
      companyNameLabel: string;
      industryLabel: string;
      companyEmailLabel: string;
      companyDescriptionLabel: string;
      phoneNumberLabel: string;
      mainAddressTitle: string;
      officialWebsiteLabel: string;
      employeeCountLabel: string;
      foundedYearLabel: string;
      saveProfileButton: string;
      saving: string;
      saveSuccess: string;
      personalInfoTitle: string;
      fullNameLabel: string;
      emailLabel: string;
      phoneLabel: string;
      educationInfoTitle: string;
      educationLevelLabel: string;
      educationLevelPlaceholder: string;
      schoolLabel: string;
      schoolPlaceholder: string;
      majorLabel: string;
      semesterLabel: string;
      semesterPlaceholder: string;
      bioLabel: string;
      availableForProjects: string;
      availableForProjectsDesc: string;
      publicProfile: string;
      publicProfileDesc: string;
      skillsTitle: string;
      addSkillButton: string;
      noSkillsAdded: string;
      selectOfficialSkill: string;
      searchSkillPlaceholder: string;
      minBudgetExpectation: string;
      maxBudgetExpectation: string;
      minBudgetPlaceholder: string;
      maxBudgetPlaceholder: string;
      portfolioAndSocialTitle: string;
      portfolioUrlLabel: string;
      githubLabel: string;
      linkedinLabel: string;
      behanceLabel: string;
      saveButton: string;
      invalidPhotoTitle: string;
      invalidPhotoText: string;
      photoTooLargeTitle: string;
      photoTooLargeText: string;
      skillLimitTitle: string;
      skillLimitText: string;
      allSkillsSelectedTitle: string;
      addSkillModalTitle: string;
      addSkillModalConfirm: string;
      addSkillModalCancel: string;
      addSkillModalValidation: string;
      saveError: string;
    };
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
    noMatchingConversations: string;
    unread: string;
    projectTab: string;
  };
  withdrawals: {
    pageTitle: string;
    pageSubtitle: string;
    availableBalance: string;
    minimumWithdrawalNote: string;
    nominalLabel: string;
    amountPlaceholder: string;
    methodLabel: string;
    noSavedAccount: string;
    primaryBadge: string;
    submitButton: string;
    securityNote: string;
    historyTitle: string;
    noHistory: string;
    submittedDate: string;
    adminNote: string;
    processedDate: string;
    minBalanceNotice: string;
    addAccountPromptPrefix: string;
    addAccountLinkText: string;
    addAccountPromptSuffix: string;
  };
  regions: {
    provinceLabel: string;
    regencyLabel: string;
    districtLabel: string;
    villageLabel: string;
    addressDetailLabel: string;
    selectProvince: string;
    searchProvince: string;
    selectRegency: string;
    searchRegency: string;
    selectDistrict: string;
    searchDistrict: string;
    selectVillage: string;
    searchVillage: string;
    typeProvince: string;
    typeRegency: string;
    typeDistrict: string;
    typeVillage: string;
    manualToggleOn: string;
    manualToggleOff: string;
    manualModeNote: string;
    addressDetailPlaceholder: string;
    attributionNote: string;
    fetchError: string;
  };
  projects: {
    findProjectsTitle: string;
    findProjectsSubtitleApply: string;
    findProjectsSubtitleExplore: string;
    recommendedSectionTitle: string;
    openSectionTitle: string;
    projectsFound: string;
    viewOnlyNotice: string;
    noSkillsNotice: string;
    emptyStateTitle: string;
    emptyStateDesc: string;
    resetFilterBtn: string;
    paginationPrevious: string;
    paginationNext: string;
    paginationPageOf: string;
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
    searchPlaceholder: string;
    searchButton: string;
    filterSkill: string;
    filterLocation: string;
    filterBudget: string;
    sortBy: string;
    sortRecommended: string;
    sortLatest: string;
    sortDeadline: string;
    sortBudget: string;
    budgetUnder1m: string;
    budget1mTo3m: string;
    budget3mTo5m: string;
    budgetOver5m: string;
    skillMatch: string;
    projectOpen: string;
    viewProject: string;
    share: string;
    shareProjectAriaLabel: string;
    linkCopied: string;
    copyFailed: string;
    shareProjectText: string;
    yourProposal: string;
    proposalPlaceholder: string;
    proposalCharLimit: string;
    proposalBudgetAgree: string;
    submitProposal: string;
    submittingProposal: string;
    backToJembara: string;
    projectDescription: string;
    modeAndLocation: string;
    fixedBudget: string;
    interestedTitle: string;
    interestedDesc: string;
    viewAndApply: string;
    noAccount: string;
    registerFree: string;
    login: string;
    register: string;
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
  earningsCards: {
    pageTitle: string;
    pageSubtitle: string;
    walletBalanceTitle: string;
    walletBalanceDesc: string;
    withdrawBalance: string;
    chartTitle: string;
    rangeSixMonths: string;
    rangeOneYear: string;
    rangeAll: string;
    upcomingWithdrawalTitle: string;
    amount: string;
    date: string;
    status: string;
    withdrawNow: string;
    historyTitle: string;
    emptyHistory: string;
    transactionStatus: {
      completed: string;
      inReview: string;
      inProgress: string;
    };
    paymentMethodsTitle: string;
    addMethod: string;
    addWithdrawalMethod: string;
    primary: string;
    emptyPaymentMethods: string;
    methodName: string;
    methodNamePlaceholder: string;
    detail: string;
    detailPlaceholder: string;
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
      logoutConfirmTitle: "Apakah Anda yakin ingin keluar?",
      logoutConfirmButton: "Ya, Log Out",
      logoutCancelButton: "Batal",
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
      comingSoonTitle: "Halaman ini masih dalam pengerjaan",
      comingSoonSubtitle: "Fitur \"{title}\" akan segera hadir di sini.",
      pagination: {
        showing: "Menampilkan",
        of: "dari",
        previous: "Sebelumnya",
        next: "Berikutnya",
      },
      ui: {
        searchPlaceholder: "Cari...",
        searchOptionsPlaceholder: "Cari pilihan...",
        loadingOptions: "Memuat pilihan...",
        notFound: "Tidak ditemukan",
        optionNotFound: "Pilihan tidak ditemukan",
        selectedSkills: "skill dipilih",
        maxSelectedSkills: "dari maksimal",
      },
      datePicker: {
        selectDate: "Pilih tanggal",
        today: "Hari ini",
        clear: "Hapus",
        prevMonth: "Bulan sebelumnya",
        nextMonth: "Bulan berikutnya",
        months: [
          "Januari", "Februari", "Maret", "April", "Mei", "Juni",
          "Juli", "Agustus", "September", "Oktober", "November", "Desember",
        ],
        weekdays: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
      },
    },
    landing: {
      nav: {
        cariTalent: "Cari Talent",
        cariProject: "Cari Proyek",
        caraKerja: "Cara Kerja",
        kategori: "Kategori",
        statistik: "Statistik",
        login: "Masuk",
        register: "Daftar Sekarang",
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
      eyebrowLogin: "Masuk Antrean",
      loginHeadline: "Selamat datang kembali",
      loginSubtitleText: "Lanjutkan pencarian kerja yang sudah cocok untukmu.",
      noAccountText: "Belum punya akun?",
      registerText: "Daftar",
      eyebrowRegister: "Buat Profil",
      registerHeadline: "Mulai matchmaking-mu",
      registerSubtitleText: "Lengkapi data diri untuk mulai dicocokkan dengan role yang tepat.",
      hasAccountText: "Sudah punya akun?",
      loginText: "Masuk",
      shellHeroTag: "Jembatan Karya",
      shellHeroTitle: "Perahu berlayar hingga ke muara, UMKM berkembang, Pelajar berkarya.",
      shellHeroDesc: "Hubungkan bakat digital pelajar dengan proyek UMKM melalui Smart Matching.", 
      authenticatorLabel: "Kode autentikator atau pemulihan",
      authenticatorPlaceholder: "123456 atau ABCD-EFGH",
      loginSuccessMsg: "Masuk berhasil. Mengarahkan ke dashboard...",
      registerSuccessMsg: "Akun dibuat. Menyiapkan profil kamu...",
      connectionErrorTitle: "Koneksi ke server gagal",
      connectionErrorDesc: "Sepertinya ada gangguan saat proses matchmaking. Coba lagi dalam beberapa saat.",
      whyThisHappened: "Kenapa ini terjadi?",
      profileProgress: "Profile Progress",
      addressLabel: "Alamat",
      addressPlaceholder: "Alamat lengkap (min. 5 karakter)",
      fullNamePlaceholder: "Nama kamu",
      passwordMinPlaceholder: "Minimal 8 karakter",
      repeatPasswordPlaceholder: "Ulangi password",
      selectRoleBadge: "Pilih Peran Kamu",
      joinAsTitle: "Bergabung sebagai",
      joinAsDesc: "Pilih peran yang sesuai dengan kebutuhanmu dan mulai perjalanan kolaborasi digital bersama kami.",
      joinFreeNote: "Bergabung gratis dan lengkapi profil sesuai peranmu",
      fillBusinessProfile: "Isi Profil Usaha",
      businessNameLabel: "Nama usaha",
      businessNamePlaceholder: "Contoh: Kopi Jembara",
      businessCategoryLabel: "Kategori usaha",
      selectBusinessCategory: "Pilih kategori usaha",
      searchCategoryPlaceholder: "Cari kategori...",
      phoneLabel: "Nomor telepon",
      websiteLabel: "Website",
      websiteErrorMsg: "Wajib mengandung domain, contoh: tokokamu.com",
      saving: "Menyimpan...",
      saveAndContinue: "Simpan dan Lanjutkan",
      categories: {
        kuliner: "Kuliner",
        fashion: "Fashion",
        jasa: "Jasa",
        teknologi: "Teknologi",
        agribisnis: "Agribisnis",
        kreatif: "Industri Kreatif",
        pendidikan: "Pendidikan",
        kesehatan: "Kesehatan",
        properti: "Properti",
        perdagangan: "Perdagangan",
        hiburan: "Hiburan",
      },
    },
    dashboard: {
      welcome: "Selamat Datang Kembali",
      greetingStudent: "Halo, {name}!",
      greetingUmkm: "Halo, {name}!",
      greetingAdmin: "Halo, {name}!",
      subtitleStudent: "Berikut aktivitas, rekomendasi proyek, dan perkembangan reputasi kamu.",
      subtitleUmkm: "Pantau proyek, proposal masuk, dan aktivitas kolaborasi bisnis Anda.",
      subtitleAdmin: "Pantau pertumbuhan pengguna dan aktivitas proyek di platform Jembara.",
      recommendedProjectsTitle: "Proyek yang Cocok Untukmu",
      umkmProjectsTitle: "Proyek Terbaru Anda",
      emptyRecommended: "Belum ada proyek terbuka yang cocok dengan skill kamu.",
      emptyRecommendedNoSkill: "Tambahkan skill pada profil agar sistem dapat mencari proyek yang cocok.",
      stats: {
        activeProjects: "Proyek Aktif",
        proposalsSubmitted: "Proposal Terkirim",
        totalEarnings: "Total Pendapatan",
        completedProjects: "Proyek Selesai",
        averageRating: "Rating Rata-rata",
        totalProjects: "Total Proyek",
        proposalsReceived: "Proposal Masuk",
        openJobs: "Lowongan Aktif",
        totalApplicants: "Total Pelamar",
        unitProposal: "Proposal",
        unitActive: "Aktif",
        unitCompleted: "Selesai",
        unitProject: "Proyek",
        unitListing: "Lowongan",
        unitPeople: "Orang",
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
      titleStudent: "Proyek Aktif Saya",
      subtitleStudent: "Pantau deadline dan tahap proyek yang sedang kamu kerjakan.",
      titleUmkm: "Kolaborasi Proyek UMKM",
      subtitleUmkm: "Pantau talent, deadline, dan tahap pengerjaan proyek bisnis Anda.",
      titleAdmin: "Pengawasan Proyek Aktif",
      subtitleAdmin: "Tinjau aktivitas kolaborasi yang sedang berjalan di platform.",
      all: "Semua",
      inProgress: "Dalam Pengerjaan",
      review: "Dalam Peninjauan",
      completed: "Selesai",
      submitWork: "Kirim Hasil Kerja",
      requestRevision: "Minta Revisi",
      approveWork: "Setujui Hasil",
      emptyMessageStudent: "Belum ada proyek yang ditugaskan kepadamu.",
      emptyMessageUmkm: "Belum ada proyek bisnis yang memasuki tahap kolaborasi.",
      emptyMessageAdmin: "Belum ada kolaborasi aktif di platform.",
      collaborationTipTitle: "Tips Sukses Kolaborasi",
      collaborationTipStudent: "Komunikasikan perkembangan pekerjaan secara berkala kepada UMKM dan pastikan hasil dikirim sebelum deadline.",
      collaborationTipUmkm: "Berikan brief dan umpan balik yang jelas agar talent dapat menyelesaikan pekerjaan sesuai kebutuhan bisnis Anda.",
      collaborationTipAdmin: "Gunakan data proyek untuk pengawasan dasar. Perubahan status tetap harus dilakukan oleh pemilik alur yang berwenang.",
      summaryTitleStudent: "Ringkasan Proyek Saya",
      summaryTitleUmkm: "Ringkasan Kolaborasi UMKM",
      summaryTitleAdmin: "Ringkasan Platform",
      metrics: {
        activeStudent: "Sedang Berjalan",
        activeUmkm: "Kolaborasi Berjalan",
        completedThisMonth: "Selesai Bulan Ini",
        activeValue: "Nilai Proyek Aktif",
        studentRating: "Rating Pelajar",
        noRating: "Belum ada",
        awaitingReview: "Menunggu Review",
        inReview: "Dalam Review",
        selectedTalent: "Talent Terpilih",
        totalProposals: "Total Proposal",
        unitProject: "Proyek",
        unitTalent: "Talent",
        unitProposal: "Proposal",
      },
      card: {
        counterpartUmkm: "UMKM",
        counterpartTalent: "Talent",
        unassignedTalent: "Talent belum dipilih",
        budget: "Budget",
        deadline: "Deadline",
        lastUpdate: "Update Terakhir",
        proposalsReceived: "Proposal Masuk",
        proposalsCount: "Proposal",
        paymentSecured: "Dana proyek sudah diamankan dan ditahan sampai hasil disetujui UMKM.",
      },
      workflow: {
        submitHeader: "Kirim hasil pekerjaan",
        submitRevisionHeader: "Kirim hasil revisi",
        revisionGuide: "Arahan revisi:",
        resultUrlPlaceholder: "https://drive.google.com/... (opsional)",
        notesPlaceholder: "Jelaskan hasil yang sudah diselesaikan dan cara UMKM memeriksanya.",
        submitting: "Mengirim...",
        submitBtn: "Kirim untuk Review",
        submitError: "Hasil proyek gagal dikirim.",
        talentResultTitle: "Hasil dari talent",
        openResultLink: "Buka tautan hasil",
        approving: "Memproses...",
        approveBtn: "Setujui & Lepas Saldo",
        revisionReasonPlaceholder: "Arahan revisi",
        requestRevisionBtn: "Minta Revisi",
        revisionSuccessTitle: "Revisi diminta",
        revisionSuccessText: "Talent telah menerima arahan perbaikan.",
        revisionError: "Permintaan revisi gagal dikirim.",
        approveSwalTitle: "Setujui hasil proyek?",
        approveSwalText: "Dana akan langsung masuk ke saldo talent setelah hasil disetujui.",
        approveSwalConfirm: "Setujui & Lepas Saldo",
        approveSwalCancel: "Batal",
        approveError: "Hasil proyek gagal disetujui.",
        rateTalentTitle: "Nilai kolaborasi talent",
        ratingOptions: {
          r5: "5 - Sangat baik",
          r4: "4 - Baik",
          r3: "3 - Cukup",
          r2: "2 - Kurang",
          r1: "1 - Sangat kurang",
        },
        commentPlaceholder: "Ceritakan pengalaman bekerja sama (opsional).",
        saveReviewBtn: "Simpan Ulasan",
        reviewSuccessTitle: "Ulasan tersimpan",
        reviewError: "Ulasan gagal disimpan.",
      },
      progress: {
        progressTitle: "Progres Pengerjaan",
        milestoneTitle: "Milestone Project",
      },
    },
    proposals: {
      title: "Proposal Saya",
      subtitle: "Pantau status pengajuan proposal proyek Anda.",
      all: "Semua",
      submitted: "Terkirim",
      accepted: "Diterima",
      rejected: "Ditolak",
      emptyCategory: "Belum ada proposal di kategori ini.",
      match: "Match",
      budget: "Budget",
      submittedDate: "Tanggal Pengajuan",
    },
    portfolio: {
      title: "Portofolio & Skill Passport",
      subtitle: "Tampilkan bukti karya dan reputasi keahlian terverifikasi Anda.",
      skillPassportTitle: "Skill Passport Terverifikasi",
      addEvidence: "Tambah Bukti Karya",
      noSkills: "Belum ada skill. Tambahkan skill melalui pengaturan profil.",
      stats: {
        portfolioWorks: "Karya Portofolio",
        completedProjects: "Proyek Selesai",
        averageRating: "Rata-rata Rating",
        verifiedSkills: "Skill Terverifikasi",
        noRating: "Belum ada",
      },
      evidence: {
        label: "Bukti portofolio",
        notSelected: "Belum dipilih",
        placeholder: "Pilih bukti portofolio",
        successTitle: "Bukti skill diperbarui",
        successDesc: "Admin dapat meninjau portofolio yang dipilih.",
        unspecifiedCategory: "Kategori belum ditentukan",
      },
      projectsSection: {
        bestWorks: "Karya Terbaikmu",
        closeForm: "Tutup Form",
        addProject: "Tambah Project",
        workTitle: "Judul karya",
        workLink: "Tautan karya (opsional)",
        imageUrl: "URL gambar (opsional)",
        description: "Deskripsi (opsional)",
        emptyDescription: "Belum ada deskripsi karya.",
        savePortfolio: "Simpan Portofolio",
        emptyProjects: "Belum ada karya. Tambahkan portofolio pertama untuk memperkuat profilmu.",
        saveSuccess: "Portofolio berhasil ditambahkan.",
        saveError: "Portofolio gagal disimpan.",
      },
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
    profilePage: {
      title: "Profil",
      subtitle: "Lihat bagaimana profil publik Anda tampil di mata orang lain.",
      about: "Tentang",
      featuredPortfolio: "Portofolio Pilihan",
      noDescription: "Belum ada deskripsi.",
      emptyPortfolios: "Belum ada portofolio yang ditambahkan.",
      clientReviews: "Ulasan Klien UMKM",
      noReviewComment: "Klien belum menambahkan komentar.",
      emptyReviews: "Belum ada ulasan dari klien.",
      editProfileTitle: "Edit Profil",
      editProfileSubtitle: "Perbarui informasi profil Anda agar lebih menarik bagi klien UMKM.",
      backToProfile: "Kembali ke Profil",
      profilePicture: "Foto Profil",
      pictureSizeNote: "Disarankan rasio 1:1. Maksimal 5MB.",
      changePhoto: "Ubah Foto",
      fullName: "Nama Lengkap",
      jobHeadline: "Headline Pekerjaan",
      locationAddress: "Lokasi / Alamat",
      educationLevel: "Tingkat Pendidikan",
      selectEducationLevel: "Pilih tingkat pendidikan",
      schoolUniversity: "Nama Sekolah / Universitas",
      aboutMeDescription: "Tentang Saya / Deskripsi",
      aboutMeNote: "Ceritakan sedikit tentang latar belakang, minat, dan spesialisasi Anda.",
      skillsAndTools: "Keahlian & Tools",
      skillsPlaceholder: "Pisahkan dengan koma (contoh: React, Figma, UI Design)",
      saving: "Menyimpan...",
      card: {
        roleStudent: "Pelajar",
        roleUmkm: "UMKM",
        roleAdmin: "Admin",
        roleUser: "Pengguna",
        available: "Tersedia untuk Proyek",
        unavailable: "Belum Tersedia",
        reviews: "Ulasan",
        completedProjects: "Proyek Selesai",
        editProfile: "EDIT PROFIL",
        contactHire: "HUBUNGI & REKRUT",
        skillsTitle: "Keahlian & Tools",
        emptySkills: "Belum ada keahlian yang ditambahkan.",
      },
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
    settingsCards: {
      notifications: {
        emailTitle: "Notifikasi Email",
        pushTitle: "Notifikasi Push (Aplikasi)",
        deadlineTitle: "Pengingat Batas Waktu Proyek (Deadline)",
        deadlineDesc: "Alarm peringatan otomatis 48 jam sebelum durasi kontrak proyek berakhir.",
        proposalMasukTitle: "Proposal Masuk",
        proposalMasukDesc: "Dapatkan notifikasi saat ada proposal baru untuk proyek kamu.",
        pesanBaruTitle: "Pesan Baru",
        pesanBaruDesc: "Dapatkan notifikasi saat menerima pesan dari klien atau talenta.",
        pembayaranTitle: "Pembayaran",
        pembayaranDesc: "Dapatkan notifikasi terkait status pembayaran dan penarikan dana.",
        updateProyekTitle: "Update Proyek",
        updateProyekDesc: "Dapatkan notifikasi saat ada perubahan status pada proyek aktif.",
        promosiTitle: "Promosi & Info",
        promosiDesc: "Dapatkan info seputar tips, promo, dan pembaruan fitur Jembara.",
        saveButton: "Simpan Pengaturan",
        saving: "Menyimpan...",
        saveSuccess: "Pengaturan notifikasi tersimpan.",
      },
      privacy: {
        visibilityTitle: "Visibilitas Profil",
        visibilityUmkmTitle: "Visibilitas Profil Perusahaan",
        visibilityStudentDesc: "Atur apakah profil Anda dapat ditemukan publik.",
        visibilityUmkmDesc: "Profil UMKM tampil melalui proyek yang dipublikasikan. Informasi kontak dan alamat lengkap tidak ditampilkan secara publik.",
        publicTitle: "Publik",
        publicDesc: "Profil dapat tampil di halaman talenta. Kontak dan alamat lengkap tetap dirahasiakan.",
        privateTitle: "Privat",
        privateDesc: "Profil tidak ditampilkan pada halaman talenta publik.",
        saveSuccess: "Pengaturan visibilitas tersimpan.",
        dataAccountTitle: "Data & Akun",
        downloadDataTitle: "Unduh Informasi Data Pribadi",
        downloadDataDesc: "Ekspor seluruh salinan data aktivitas kamu, proyek, dan riwayat proposal dalam format file .JSON.",
        downloadDataButton: "Unduh Data",
        deleteAccountTitle: "Hapus Akun Permanen",
        deleteAccountDesc: "Aksi ini akan menghapus akun, portfolio, proposal aktif, dan seluruh data kamu selamanya. Aksi tidak dapat dibatalkan.",
        deleteAccountButton: "Hapus Akun",
        deleting: "Menghapus...",
        confirmDeleteTitle: "Hapus akun permanen?",
        confirmDeleteText: "Masukkan password untuk mengonfirmasi. Akun dengan transaksi atau proyek tidak dapat dihapus otomatis.",
        passwordRequired: "Password wajib diisi.",
      },
      security: {
        changePasswordTitle: "Ubah Password",
        currentPasswordLabel: "Password Saat Ini",
        newPasswordLabel: "Password Baru",
        confirmPasswordLabel: "Konfirmasi Password Baru",
        savePasswordButton: "Simpan Perubahan",
        saving: "Menyimpan...",
        passwordUpdatedTitle: "Password diperbarui",
        passwordUpdatedText: "Semua sesi lama telah dicabut. Sesi perangkat ini sudah diperbarui.",
        twoFactorTitle: "Autentikasi Dua Faktor (2FA)",
        twoFactorDesc: "Gunakan aplikasi autentikator berbasis TOTP. Delapan kode pemulihan hanya ditampilkan sekali saat aktivasi.",
        active: "Aktif",
        inactive: "Tidak aktif",
        startSetup: "Mulai Setup 2FA",
        enterSecretNote: "Masukkan secret berikut ke aplikasi autentikator:",
        openAuthApp: "Buka di aplikasi autentikator",
        verifyAndActivate: "Verifikasi & Aktifkan",
        disable2FA: "Nonaktifkan 2FA",
        activeSessionsTitle: "Sesi Aktif",
        noOtherSessions: "Tidak ada sesi aktif lain.",
        logoutSession: "Logout",
        confirmRevokeTitle: "Cabut sesi ini?",
        confirmRevokeText: "Perangkat tersebut harus login ulang untuk mengakses Jembara.",
        yesRevoke: "Ya, cabut sesi",
      },
      payments: {
        payoutMethodsTitle: "Metode Pencairan",
        payoutMethodsDesc: "Rekening tersimpan akan tersedia saat mengajukan penarikan saldo.",
        addMethod: "Tambah",
        closeMethod: "Tutup",
        providerLabel: "Bank atau e-wallet",
        accountNameLabel: "Nama pemilik rekening",
        accountNumberLabel: "Nomor rekening/e-wallet",
        makePrimaryLabel: "Jadikan rekening utama",
        saveMethodButton: "Simpan Metode",
        noMethodsNote: "Belum ada metode pencairan. Tambahkan rekening sebelum menarik saldo.",
        primaryBadge: "Utama",
        makePrimaryButton: "Utamakan",
        maxMethodsNote: "Maksimal 5 metode pencairan per akun.",
        manualWithdrawalTitle: "Penarikan Saldo Manual",
        manualWithdrawalNote: "Saldo tersedia: {balance}. Minimum penarikan Rp10.000.",
        adminCheckNote: "Permintaan diperiksa dan ditransfer manual oleh Admin.",
        withdrawButton: "Tarik Saldo",
        addAccountFirst: "Tambahkan Rekening Dahulu",
        transactionHistoryTitle: "Riwayat Transaksi",
        tableHeaderDate: "Tanggal",
        tableHeaderDesc: "Deskripsi",
        tableHeaderAmount: "Jumlah",
        tableHeaderStatus: "Status",
        noTransactions: "Belum ada transaksi pembayaran atau penarikan.",
        studentPayoutOnlyTitle: "Pengaturan pencairan khusus Student",
        studentPayoutOnlyDesc: "UMKM melakukan pembayaran melalui halaman proyek, sedangkan Admin memproses permintaan Student melalui menu Penarikan Saldo.",
      },
      profile: {
        changeLogo: "Ganti Logo",
        changePhoto: "Ganti Foto",
        companyProfileTitle: "Profil Perusahaan",
        companyNameLabel: "Nama Perusahaan",
        industryLabel: "Industri / Kategori",
        companyEmailLabel: "Email Perusahaan",
        companyDescriptionLabel: "Deskripsi Perusahaan",
        phoneNumberLabel: "Nomor Telepon",
        mainAddressTitle: "Alamat Utama",
        officialWebsiteLabel: "Website Resmi",
        employeeCountLabel: "Jumlah Karyawan",
        foundedYearLabel: "Tahun Berdiri",
        saveProfileButton: "Simpan Perubahan",
        saving: "Menyimpan...",
        saveSuccess: "Profil Anda telah diperbarui.",
        personalInfoTitle: "Informasi Pribadi",
        fullNameLabel: "Nama Lengkap",
        emailLabel: "Email",
        phoneLabel: "Nomor Telepon",
        educationInfoTitle: "Informasi Pendidikan",
        educationLevelLabel: "Jenjang Pendidikan",
        educationLevelPlaceholder: "Pilih jenjang pendidikan",
        schoolLabel: "Nama Universitas/Sekolah",
        schoolPlaceholder: "Contoh: Universitas Brawijaya",
        majorLabel: "Jurusan",
        semesterLabel: "Semester",
        semesterPlaceholder: "Contoh: 6",
        bioLabel: "Bio",
        availableForProjects: "Tersedia menerima proyek",
        availableForProjectsDesc: "Aktifkan agar profil masuk rekomendasi Smart Matching dan pencarian talent.",
        publicProfile: "Tampilkan profil di halaman publik",
        publicProfileDesc: "Nama, sekolah, jurusan, skill, rating, dan jumlah proyek dapat tampil. Alamat, email, dan nomor telepon tetap dirahasiakan.",
        skillsTitle: "Skill & Keahlian",
        addSkillButton: "+ Tambah Skill",
        noSkillsAdded: "Belum ada skill yang ditambahkan.",
        selectOfficialSkill: "Pilih skill resmi dari Jembara",
        searchSkillPlaceholder: "Cari skill (mis. React, UI/UX...)",
        minBudgetExpectation: "Ekspektasi budget minimum (Rp)",
        maxBudgetExpectation: "Ekspektasi budget maksimum (Rp)",
        minBudgetPlaceholder: "Contoh: 500.000",
        maxBudgetPlaceholder: "Contoh: 5.000.000",
        portfolioAndSocialTitle: "Link Portfolio & Sosial Media",
        portfolioUrlLabel: "Portfolio URL",
        githubLabel: "Github",
        linkedinLabel: "Linkedin",
        behanceLabel: "Behance",
        saveButton: "Simpan",
        invalidPhotoTitle: "Foto tidak valid",
        invalidPhotoText: "Pilih gambar PNG, JPEG, atau WebP dengan ukuran maksimal 5 MB.",
        photoTooLargeTitle: "Foto masih terlalu besar",
        photoTooLargeText: "Gunakan gambar yang lebih sederhana atau beresolusi lebih kecil.",
        skillLimitTitle: "Batas skill tercapai",
        skillLimitText: "Maksimal 20 skill dapat ditambahkan.",
        allSkillsSelectedTitle: "Semua skill sudah dipilih",
        addSkillModalTitle: "Tambah Skill",
        addSkillModalConfirm: "Tambah",
        addSkillModalCancel: "Batal",
        addSkillModalValidation: "Pilih salah satu skill.",
        saveError: "Gagal menyimpan perubahan.",
      },
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
      noMatchingConversations: "Nggak ada percakapan yang cocok.",
      unread: "Belum Dibaca",
      projectTab: "Project",
    },
    withdrawals: {
      pageTitle: "Penarikan Saldo",
      pageSubtitle: "Ajukan pencairan saldo Jembara ke rekening atau e-wallet Anda.",
      availableBalance: "Saldo tersedia",
      minimumWithdrawalNote: "Minimum penarikan Rp10.000. Saldo akan dicadangkan sampai Admin memproses permintaan.",
      nominalLabel: "Nominal penarikan (Rp)",
      amountPlaceholder: "Contoh: 50.000",
      methodLabel: "Metode pencairan",
      noSavedAccount: "Belum ada rekening tersimpan",
      primaryBadge: " (Utama)",
      submitButton: "Ajukan Penarikan",
      securityNote: "Pastikan nama dan nomor tujuan sudah benar.",
      historyTitle: "Riwayat Penarikan",
      noHistory: "Belum ada permintaan penarikan.",
      submittedDate: "Diajukan",
      adminNote: "Catatan Admin",
      processedDate: "Diproses",
      minBalanceNotice: "Saldo belum mencapai minimum penarikan Rp10.000.",
      addAccountPromptPrefix: "Tambahkan rekening atau e-wallet terlebih dahulu di ",
      addAccountLinkText: "Pengaturan Pembayaran",
      addAccountPromptSuffix: ".",
    },
    regions: {
      provinceLabel: "Provinsi",
      regencyLabel: "Kabupaten/Kota",
      districtLabel: "Kecamatan",
      villageLabel: "Kelurahan/Desa",
      addressDetailLabel: "Detail Alamat",
      selectProvince: "Pilih provinsi",
      searchProvince: "Cari provinsi...",
      selectRegency: "Pilih kota",
      searchRegency: "Cari kabupaten/kota...",
      selectDistrict: "Pilih kecamatan",
      searchDistrict: "Cari kecamatan...",
      selectVillage: "Pilih desa",
      searchVillage: "Cari kelurahan/desa...",
      typeProvince: "Tulis nama provinsi",
      typeRegency: "Tulis nama kabupaten/kota",
      typeDistrict: "Tulis nama kecamatan",
      typeVillage: "Tulis nama kelurahan/desa",
      manualToggleOn: "Wilayah tidak ada di daftar? Isi secara manual",
      manualToggleOff: "Kembali pilih dari daftar wilayah",
      manualModeNote: "Nama wilayah manual akan disimpan tanpa kode wilayah.id.",
      addressDetailPlaceholder: "Nama jalan, nomor bangunan, RT/RW, atau patokan",
      attributionNote: "Data wilayah administratif disediakan oleh wilayah.id.",
      fetchError: "Gagal mengambil data wilayah. Silakan coba lagi.",
    },
    projects: {
      findProjectsTitle: "Find Projects",
      findProjectsSubtitleApply: "Temukan project yang sesuai dengan skill kamu.",
      findProjectsSubtitleExplore: "Jelajahi project terbuka di platform Jembara.",
      recommendedSectionTitle: "Project yang Mungkin Cocok Untukmu",
      openSectionTitle: "Project Terbuka",
      projectsFound: "{count} project ditemukan",
      viewOnlyNotice: "Anda sedang melihat marketplace dalam mode lihat saja. Hanya akun pelajar yang dapat mendaftar atau mengirim proposal ke project.",
      noSkillsNotice: "Tambahkan skill pada profil agar proyek dapat diurutkan berdasarkan kecocokan.",
      emptyStateTitle: "Belum ada project yang sesuai",
      emptyStateDesc: "Coba ubah kata pencarian atau hapus beberapa filter.",
      resetFilterBtn: "RESET FILTER",
      paginationPrevious: "Sebelumnya",
      paginationNext: "Berikutnya",
      paginationPageOf: "Halaman {current} dari {total}",
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
      searchPlaceholder: "Cari project berdasarkan nama, skill, atau UMKM...",
      searchButton: "Cari",
      filterSkill: "Skill",
      filterLocation: "Lokasi",
      filterBudget: "Budget",
      sortBy: "Urutkan:",
      sortRecommended: "Paling Cocok",
      sortLatest: "Terbaru",
      sortDeadline: "Deadline Terdekat",
      sortBudget: "Budget Tertinggi",
      budgetUnder1m: "< Rp 1.000.000",
      budget1mTo3m: "Rp 1.000.000 - 3.000.000",
      budget3mTo5m: "Rp 3.000.000 - 5.000.000",
      budgetOver5m: "> Rp 5.000.000",
      skillMatch: "Skill Match",
      projectOpen: "Project OPEN",
      viewProject: "Lihat Project",
      share: "Bagikan",
      shareProjectAriaLabel: "Bagikan project {title}",
      linkCopied: "Tautan disalin",
      copyFailed: "Gagal menyalin",
      shareProjectText: "Lihat project \"{title}\" di Jembara.",
      yourProposal: "Proposal Anda",
      proposalPlaceholder: "Jelaskan pengalaman yang relevan, pendekatan pengerjaan, dan alasan Anda cocok untuk project ini.",
      proposalCharLimit: "Minimal 50 karakter, maksimal 2.000 karakter.",
      proposalBudgetAgree: "Saya menyetujui budget tetap project sebesar",
      submitProposal: "Kirim Proposal",
      submittingProposal: "Mengirim...",
      backToJembara: "Kembali ke Jembara",
      projectDescription: "Deskripsi Project",
      modeAndLocation: "Mode & Lokasi",
      fixedBudget: "Budget Tetap",
      interestedTitle: "Tertarik dengan project ini?",
      interestedDesc: "Masuk sebagai pelajar untuk melihat kecocokan skill dan mengirim proposal kepada UMKM.",
      viewAndApply: "Lihat & Ajukan Proposal",
      noAccount: "Belum punya akun?",
      registerFree: "Daftar gratis",
      login: "Masuk",
      register: "Daftar",
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
    earningsCards: {
      pageTitle: "Earnings",
      pageSubtitle: "Pantau nilai proyek berdasarkan status dan pembaruan terakhir proyek.",
      walletBalanceTitle: "Saldo Jembara tersedia",
      walletBalanceDesc: "Saldo bertambah otomatis setelah UMKM menyetujui hasil proyek.",
      withdrawBalance: "Tarik Saldo",
      chartTitle: "Grafik Pendapatan",
      rangeSixMonths: "6 Bulan",
      rangeOneYear: "1 Tahun",
      rangeAll: "Semua",
      upcomingWithdrawalTitle: "Penarikan Berikutnya",
      amount: "Jumlah",
      date: "Tanggal",
      status: "Status",
      withdrawNow: "Tarik Sekarang",
      historyTitle: "Riwayat Nilai Proyek",
      emptyHistory: "Belum ada proyek aktif atau selesai yang memiliki nilai anggaran.",
      transactionStatus: {
        completed: "Selesai",
        inReview: "Dalam Review",
        inProgress: "Berjalan",
      },
      paymentMethodsTitle: "Metode Pembayaran",
      addMethod: "Tambah Metode",
      addWithdrawalMethod: "Tambah Metode Penarikan",
      primary: "Utama",
      emptyPaymentMethods: "Belum ada metode pembayaran.",
      methodName: "Nama Metode",
      methodNamePlaceholder: "mis. Bank Mandiri",
      detail: "Detail",
      detailPlaceholder: "mis. **** 1234",
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
      logoutConfirmTitle: "Are you sure you want to log out?",
      logoutConfirmButton: "Yes, Log Out",
      logoutCancelButton: "Cancel",
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
      noData: "No data available.",
      comingSoonTitle: "This page is under construction",
      comingSoonSubtitle: "Feature \"{title}\" will be coming soon.",
      pagination: {
        showing: "Showing",
        of: "of",
        previous: "Previous",
        next: "Next",
      },
      ui: {
        searchPlaceholder: "Search...",
        searchOptionsPlaceholder: "Search options...",
        loadingOptions: "Loading options...",
        notFound: "Not found",
        optionNotFound: "Option not found",
        selectedSkills: "skills selected",
        maxSelectedSkills: "of max",
      },
      datePicker: {
        selectDate: "Select date",
        today: "Today",
        clear: "Clear",
        prevMonth: "Previous month",
        nextMonth: "Next month",
        months: [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December",
        ],
        weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      },
    },
    landing: {
      nav: {
        cariTalent: "Find Talent",
        cariProject: "Find Projects",
        caraKerja: "How It Works",
        kategori: "Categories",
        statistik: "Statistics",
        login: "Log In",
        register: "Register Now",
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
      eyebrowLogin: "Queue Login",
      loginHeadline: "Welcome back",
      loginSubtitleText: "Continue finding jobs matched for you.",
      noAccountText: "Don't have an account?",
      registerText: "Register",
      eyebrowRegister: "Create Profile",
      registerHeadline: "Start your matchmaking",
      registerSubtitleText: "Complete your details to match with the right role.",
      hasAccountText: "Already have an account?",
      loginText: "Log In",
      shellHeroTag: "Bridge of Creation",
      shellHeroTitle: "Sailing ships reach the estuary wide, UMKMs thrive, students create with pride.",
      shellHeroDesc: "Connect student digital talent with UMKM projects through Smart Matching.",
      authenticatorLabel: "Authenticator or recovery code",
      authenticatorPlaceholder: "123456 or ABCD-EFGH",
      loginSuccessMsg: "Login successful. Redirecting to dashboard...",
      registerSuccessMsg: "Account created. Setting up your profile...",
      connectionErrorTitle: "Server connection failed",
      connectionErrorDesc: "There seems to be an issue during matchmaking. Please try again shortly.",
      whyThisHappened: "Why did this happen?",
      profileProgress: "Profile Progress",
      addressLabel: "Address",
      addressPlaceholder: "Full address (min. 5 characters)",
      fullNamePlaceholder: "Your name",
      passwordMinPlaceholder: "Minimum 8 characters",
      repeatPasswordPlaceholder: "Repeat password",
      selectRoleBadge: "Select Your Role",
      joinAsTitle: "Join as",
      joinAsDesc: "Choose the role that fits your needs and start your digital collaboration journey with us.",
      joinFreeNote: "Join for free and complete your profile according to your role",
      fillBusinessProfile: "Fill Business Profile",
      businessNameLabel: "Business Name",
      businessNamePlaceholder: "Example: Jembara Cafe",
      businessCategoryLabel: "Business Category",
      selectBusinessCategory: "Select business category",
      searchCategoryPlaceholder: "Search category...",
      phoneLabel: "Phone Number",
      websiteLabel: "Website",
      websiteErrorMsg: "Must contain domain, e.g.: yourstore.com",
      saving: "Saving...",
      saveAndContinue: "Save and Continue",
      categories: {
        kuliner: "Culinary",
        fashion: "Fashion",
        jasa: "Services",
        teknologi: "Technology",
        agribisnis: "Agribusiness",
        kreatif: "Creative Industry",
        pendidikan: "Education",
        kesehatan: "Healthcare",
        properti: "Real Estate",
        perdagangan: "Trade & Retail",
        hiburan: "Entertainment",
      },
    },
    dashboard: {
      welcome: "Welcome Back",
      greetingStudent: "Hello, {name}!",
      greetingUmkm: "Hello, {name}!",
      greetingAdmin: "Hello, {name}!",
      subtitleStudent: "Here are your activities, project recommendations, and reputation progress.",
      subtitleUmkm: "Monitor your projects, incoming proposals, and business collaboration activities.",
      subtitleAdmin: "Monitor user growth and project activities on the Jembara platform.",
      recommendedProjectsTitle: "Recommended Projects for You",
      umkmProjectsTitle: "Your Latest Projects",
      emptyRecommended: "No open projects matching your skills yet.",
      emptyRecommendedNoSkill: "Add skills to your profile so the system can find matching projects.",
      stats: {
        activeProjects: "Active Projects",
        proposalsSubmitted: "Proposals Submitted",
        totalEarnings: "Total Earnings",
        completedProjects: "Completed Projects",
        averageRating: "Average Rating",
        totalProjects: "Total Projects",
        proposalsReceived: "Proposals Received",
        openJobs: "Active Listings",
        totalApplicants: "Total Applicants",
        unitProposal: "Proposals",
        unitActive: "Active",
        unitCompleted: "Completed",
        unitProject: "Projects",
        unitListing: "Listings",
        unitPeople: "Applicants",
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
      titleStudent: "My Active Projects",
      subtitleStudent: "Track deadlines and stages of projects you are working on.",
      titleUmkm: "UMKM Project Collaborations",
      subtitleUmkm: "Monitor talent, deadlines, and project execution stages.",
      titleAdmin: "Active Project Oversight",
      subtitleAdmin: "Review ongoing collaboration activities across the platform.",
      all: "All",
      inProgress: "In Progress",
      review: "Under Review",
      completed: "Completed",
      submitWork: "Submit Work",
      requestRevision: "Request Revision",
      approveWork: "Approve Work",
      emptyMessageStudent: "No projects assigned to you yet.",
      emptyMessageUmkm: "No business projects have entered the collaboration phase yet.",
      emptyMessageAdmin: "No active collaborations on the platform.",
      collaborationTipTitle: "Collaboration Success Tips",
      collaborationTipStudent: "Communicate progress regularly to UMKM and ensure deliverables are submitted before deadline.",
      collaborationTipUmkm: "Provide clear briefs and feedback so talent can complete work according to your business needs.",
      collaborationTipAdmin: "Use project data for basic monitoring. Status changes must still be performed by authorized flow owners.",
      summaryTitleStudent: "My Projects Summary",
      summaryTitleUmkm: "UMKM Collaboration Summary",
      summaryTitleAdmin: "Platform Summary",
      metrics: {
        activeStudent: "In Progress",
        activeUmkm: "Active Collaborations",
        completedThisMonth: "Completed This Month",
        activeValue: "Active Project Value",
        studentRating: "Student Rating",
        noRating: "None yet",
        awaitingReview: "Awaiting Review",
        inReview: "In Review",
        selectedTalent: "Selected Talent",
        totalProposals: "Total Proposals",
        unitProject: "Projects",
        unitTalent: "Talents",
        unitProposal: "Proposals",
      },
      card: {
        counterpartUmkm: "UMKM",
        counterpartTalent: "Talent",
        unassignedTalent: "Talent not assigned",
        budget: "Budget",
        deadline: "Deadline",
        lastUpdate: "Last Update",
        proposalsReceived: "Proposals Received",
        proposalsCount: "Proposals",
        paymentSecured: "Project funds are secured and held until results are approved by UMKM.",
      },
      workflow: {
        submitHeader: "Submit work results",
        submitRevisionHeader: "Submit revision results",
        revisionGuide: "Revision instructions:",
        resultUrlPlaceholder: "https://drive.google.com/... (optional)",
        notesPlaceholder: "Describe completed results and how UMKM can verify them.",
        submitting: "Submitting...",
        submitBtn: "Submit for Review",
        submitError: "Failed to submit project result.",
        talentResultTitle: "Result from talent",
        openResultLink: "Open result link",
        approving: "Processing...",
        approveBtn: "Approve & Release Funds",
        revisionReasonPlaceholder: "Revision instructions",
        requestRevisionBtn: "Request Revision",
        revisionSuccessTitle: "Revision requested",
        revisionSuccessText: "Talent has received revision instructions.",
        revisionError: "Failed to request revision.",
        approveSwalTitle: "Approve project result?",
        approveSwalText: "Funds will be immediately released to talent's balance once approved.",
        approveSwalConfirm: "Approve & Release Funds",
        approveSwalCancel: "Cancel",
        approveError: "Failed to approve project result.",
        rateTalentTitle: "Rate talent collaboration",
        ratingOptions: {
          r5: "5 - Excellent",
          r4: "4 - Good",
          r3: "3 - Fair",
          r2: "2 - Poor",
          r1: "1 - Very poor",
        },
        commentPlaceholder: "Share your experience working together (optional).",
        saveReviewBtn: "Save Review",
        reviewSuccessTitle: "Review saved",
        reviewError: "Failed to save review.",
      },
      progress: {
        progressTitle: "Work Progress",
        milestoneTitle: "Project Milestones",
      },
    },
    proposals: {
      title: "My Proposals",
      subtitle: "Track the status of your submitted project proposals.",
      all: "All",
      submitted: "Submitted",
      accepted: "Accepted",
      rejected: "Rejected",
      emptyCategory: "No proposals in this category.",
      match: "Match",
      budget: "Budget",
      submittedDate: "Submitted Date",
    },
    portfolio: {
      title: "Portfolio & Skill Passport",
      subtitle: "Display proof of work and your verified reputation.",
      skillPassportTitle: "Verified Skill Passport",
      addEvidence: "Add Work Evidence",
      noSkills: "No skills added yet. Add skills in your profile settings.",
      stats: {
        portfolioWorks: "Portfolio Works",
        completedProjects: "Completed Projects",
        averageRating: "Average Rating",
        verifiedSkills: "Verified Skills",
        noRating: "No rating",
      },
      evidence: {
        label: "Portfolio evidence",
        notSelected: "Not selected",
        placeholder: "Select portfolio evidence",
        successTitle: "Skill evidence updated",
        successDesc: "Admin can review the selected portfolio work.",
        unspecifiedCategory: "Unspecified category",
      },
      projectsSection: {
        bestWorks: "Your Best Works",
        closeForm: "Close Form",
        addProject: "Add Project",
        workTitle: "Work title",
        workLink: "Work link (optional)",
        imageUrl: "Image URL (optional)",
        description: "Description (optional)",
        emptyDescription: "No description provided.",
        savePortfolio: "Save Portfolio",
        emptyProjects: "No portfolio works yet. Add your first work to strengthen your profile.",
        saveSuccess: "Portfolio work added successfully.",
        saveError: "Failed to save portfolio work.",
      },
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
    profilePage: {
      title: "Profile",
      subtitle: "See how your public profile looks to others.",
      about: "About",
      featuredPortfolio: "Featured Portfolio",
      noDescription: "No description provided.",
      emptyPortfolios: "No portfolios added yet.",
      clientReviews: "SMB Client Reviews",
      noReviewComment: "Client hasn't added a comment.",
      emptyReviews: "No client reviews yet.",
      editProfileTitle: "Edit Profile",
      editProfileSubtitle: "Update your profile information to make it more appealing to SMB clients.",
      backToProfile: "Back to Profile",
      profilePicture: "Profile Picture",
      pictureSizeNote: "1:1 ratio recommended. Max 5MB.",
      changePhoto: "Change Photo",
      fullName: "Full Name",
      jobHeadline: "Job Headline",
      locationAddress: "Location / Address",
      educationLevel: "Education Level",
      selectEducationLevel: "Select education level",
      schoolUniversity: "School / University Name",
      aboutMeDescription: "About Me / Description",
      aboutMeNote: "Tell us a bit about your background, interests, and specialization.",
      skillsAndTools: "Skills & Tools",
      skillsPlaceholder: "Separate with commas (e.g. React, Figma, UI Design)",
      saving: "Saving...",
      card: {
        roleStudent: "Student",
        roleUmkm: "SMB",
        roleAdmin: "Admin",
        roleUser: "User",
        available: "Available for Projects",
        unavailable: "Not Available",
        reviews: "Reviews",
        completedProjects: "Completed Projects",
        editProfile: "EDIT PROFILE",
        contactHire: "CONTACT & HIRE",
        skillsTitle: "Skills & Tools",
        emptySkills: "No skills added yet.",
      },
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
    settingsCards: {
      notifications: {
        emailTitle: "Email Notifications",
        pushTitle: "Push Notifications (App)",
        deadlineTitle: "Project Deadline Reminder",
        deadlineDesc: "Automatic alert 48 hours before the project contract duration ends.",
        proposalMasukTitle: "Incoming Proposals",
        proposalMasukDesc: "Get notified when a new proposal is submitted for your project.",
        pesanBaruTitle: "New Messages",
        pesanBaruDesc: "Get notified when receiving messages from clients or talents.",
        pembayaranTitle: "Payments",
        pembayaranDesc: "Get notified regarding payment and withdrawal status updates.",
        updateProyekTitle: "Project Updates",
        updateProyekDesc: "Get notified on status changes in active projects.",
        promosiTitle: "Promotions & Info",
        promosiDesc: "Get updates on tips, promos, and new Jembara feature releases.",
        saveButton: "Save Settings",
        saving: "Saving...",
        saveSuccess: "Notification settings saved.",
      },
      privacy: {
        visibilityTitle: "Profile Visibility",
        visibilityUmkmTitle: "Company Profile Visibility",
        visibilityStudentDesc: "Control whether your profile is discoverable publicly.",
        visibilityUmkmDesc: "Company profile appears through published projects. Contact and full address remain private.",
        publicTitle: "Public",
        publicDesc: "Profile appears on the talent directory. Contact details and full address remain confidential.",
        privateTitle: "Private",
        privateDesc: "Profile is hidden from public talent listings.",
        saveSuccess: "Visibility settings saved.",
        dataAccountTitle: "Data & Account",
        downloadDataTitle: "Download Personal Data",
        downloadDataDesc: "Export a complete copy of your activity data, projects, and proposal history in .JSON format.",
        downloadDataButton: "Download Data",
        deleteAccountTitle: "Permanently Delete Account",
        deleteAccountDesc: "This action will permanently delete your account, portfolio, proposals, and data forever. Cannot be undone.",
        deleteAccountButton: "Delete Account",
        deleting: "Deleting...",
        confirmDeleteTitle: "Permanently delete account?",
        confirmDeleteText: "Enter your password to confirm. Accounts with active transactions or projects cannot be deleted automatically.",
        passwordRequired: "Password is required.",
      },
      security: {
        changePasswordTitle: "Change Password",
        currentPasswordLabel: "Current Password",
        newPasswordLabel: "New Password",
        confirmPasswordLabel: "Confirm New Password",
        savePasswordButton: "Save Changes",
        saving: "Saving...",
        passwordUpdatedTitle: "Password updated",
        passwordUpdatedText: "All previous active sessions have been revoked. Current device session updated.",
        twoFactorTitle: "Two-Factor Authentication (2FA)",
        twoFactorDesc: "Use a TOTP authenticator application. Eight recovery codes are displayed only once upon activation.",
        active: "Active",
        inactive: "Inactive",
        startSetup: "Start 2FA Setup",
        enterSecretNote: "Enter the following secret key into your authenticator app:",
        openAuthApp: "Open in authenticator app",
        verifyAndActivate: "Verify & Activate",
        disable2FA: "Disable 2FA",
        activeSessionsTitle: "Active Sessions",
        noOtherSessions: "No other active sessions.",
        logoutSession: "Log Out",
        confirmRevokeTitle: "Revoke this session?",
        confirmRevokeText: "The device will need to log in again to access Jembara.",
        yesRevoke: "Yes, revoke session",
      },
      payments: {
        payoutMethodsTitle: "Payout Methods",
        payoutMethodsDesc: "Saved accounts will be available when requesting balance withdrawals.",
        addMethod: "Add",
        closeMethod: "Close",
        providerLabel: "Bank or e-wallet",
        accountNameLabel: "Account holder name",
        accountNumberLabel: "Account or e-wallet number",
        makePrimaryLabel: "Set as primary account",
        saveMethodButton: "Save Method",
        noMethodsNote: "No payout methods added yet. Add an account before withdrawing balance.",
        primaryBadge: "Primary",
        makePrimaryButton: "Set Primary",
        maxMethodsNote: "Maximum 5 payout methods per account.",
        manualWithdrawalTitle: "Manual Balance Withdrawal",
        manualWithdrawalNote: "Available balance: {balance}. Minimum withdrawal Rp10.000.",
        adminCheckNote: "Requests are reviewed and processed manually by Admin.",
        withdrawButton: "Withdraw Balance",
        addAccountFirst: "Add Account First",
        transactionHistoryTitle: "Transaction History",
        tableHeaderDate: "Date",
        tableHeaderDesc: "Description",
        tableHeaderAmount: "Amount",
        tableHeaderStatus: "Status",
        noTransactions: "No payment or withdrawal transactions yet.",
        studentPayoutOnlyTitle: "Student Payout Settings Only",
        studentPayoutOnlyDesc: "Businesses pay through project pages, while Admins process Student payout requests in the Withdrawals menu.",
      },
      profile: {
        changeLogo: "Change Logo",
        changePhoto: "Change Photo",
        companyProfileTitle: "Company Profile",
        companyNameLabel: "Company Name",
        industryLabel: "Industry / Category",
        companyEmailLabel: "Company Email",
        companyDescriptionLabel: "Company Description",
        phoneNumberLabel: "Phone Number",
        mainAddressTitle: "Primary Address",
        officialWebsiteLabel: "Official Website",
        employeeCountLabel: "Employee Count",
        foundedYearLabel: "Founded Year",
        saveProfileButton: "Save Changes",
        saving: "Saving...",
        saveSuccess: "Your profile has been updated.",
        personalInfoTitle: "Personal Information",
        fullNameLabel: "Full Name",
        emailLabel: "Email",
        phoneLabel: "Phone Number",
        educationInfoTitle: "Education Information",
        educationLevelLabel: "Education Level",
        educationLevelPlaceholder: "Select education level",
        schoolLabel: "University/School Name",
        schoolPlaceholder: "E.g.: Brawijaya University",
        majorLabel: "Major",
        semesterLabel: "Semester",
        semesterPlaceholder: "E.g.: 6",
        bioLabel: "Bio",
        availableForProjects: "Available for projects",
        availableForProjectsDesc: "Enable so profile enters Smart Matching recommendations and talent search.",
        publicProfile: "Show profile on public page",
        publicProfileDesc: "Name, school, major, skills, rating, and project count can be shown. Address, email, and phone remain private.",
        skillsTitle: "Skills & Expertise",
        addSkillButton: "+ Add Skill",
        noSkillsAdded: "No skills added yet.",
        selectOfficialSkill: "Select official skill from Jembara",
        searchSkillPlaceholder: "Search skill (e.g. React, UI/UX...)",
        minBudgetExpectation: "Minimum budget expectation (Rp)",
        maxBudgetExpectation: "Maximum budget expectation (Rp)",
        minBudgetPlaceholder: "E.g.: 500.000",
        maxBudgetPlaceholder: "E.g.: 5.000.000",
        portfolioAndSocialTitle: "Portfolio & Social Media Links",
        portfolioUrlLabel: "Portfolio URL",
        githubLabel: "Github",
        linkedinLabel: "Linkedin",
        behanceLabel: "Behance",
        saveButton: "Save",
        invalidPhotoTitle: "Invalid photo",
        invalidPhotoText: "Choose a PNG, JPEG, or WebP image up to 5 MB.",
        photoTooLargeTitle: "Photo is still too large",
        photoTooLargeText: "Use a simpler or lower resolution image.",
        skillLimitTitle: "Skill limit reached",
        skillLimitText: "Maximum of 20 skills can be added.",
        allSkillsSelectedTitle: "All skills already selected",
        addSkillModalTitle: "Add Skill",
        addSkillModalConfirm: "Add",
        addSkillModalCancel: "Cancel",
        addSkillModalValidation: "Select a skill.",
        saveError: "Failed to save changes.",
      },
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
      noMatchingConversations: "No matching conversations found.",
      unread: "Unread",
      projectTab: "Project",
    },
    withdrawals: {
      pageTitle: "Withdraw Balance",
      pageSubtitle: "Submit a withdrawal of your Jembara balance to your bank account or e-wallet.",
      availableBalance: "Available balance",
      minimumWithdrawalNote: "Minimum withdrawal Rp10.000. Balance is reserved until Admin processes the request.",
      nominalLabel: "Withdrawal amount (Rp)",
      amountPlaceholder: "e.g. 50,000",
      methodLabel: "Payout method",
      noSavedAccount: "No saved accounts",
      primaryBadge: " (Primary)",
      submitButton: "Submit Withdrawal",
      securityNote: "Ensure account name and number are correct.",
      historyTitle: "Withdrawal History",
      noHistory: "No withdrawal requests yet.",
      submittedDate: "Submitted",
      adminNote: "Admin Note",
      processedDate: "Processed",
      minBalanceNotice: "Balance has not reached the minimum withdrawal of Rp10.000.",
      addAccountPromptPrefix: "Please add a bank account or e-wallet first in ",
      addAccountLinkText: "Payment Settings",
      addAccountPromptSuffix: ".",
    },
    regions: {
      provinceLabel: "Province",
      regencyLabel: "Regency/City",
      districtLabel: "District",
      villageLabel: "Sub-district/Village",
      addressDetailLabel: "Address Details",
      selectProvince: "Select province",
      searchProvince: "Search province...",
      selectRegency: "Select city",
      searchRegency: "Search regency/city...",
      selectDistrict: "Select district",
      searchDistrict: "Search district...",
      selectVillage: "Select village",
      searchVillage: "Search village...",
      typeProvince: "Type province name",
      typeRegency: "Type regency/city name",
      typeDistrict: "Type district name",
      typeVillage: "Type village name",
      manualToggleOn: "Region not listed? Fill in manually",
      manualToggleOff: "Back to region selection",
      manualModeNote: "Manual region names will be saved without a wilayah.id code.",
      addressDetailPlaceholder: "Street name, building number, neighborhood, or landmark",
      attributionNote: "Administrative region data provided by wilayah.id.",
      fetchError: "Failed to fetch region data. Please try again.",
    },
    projects: {
      findProjectsTitle: "Find Projects",
      findProjectsSubtitleApply: "Find projects matching your skills.",
      findProjectsSubtitleExplore: "Explore open projects on the Jembara platform.",
      recommendedSectionTitle: "Projects Recommended for You",
      openSectionTitle: "Open Projects",
      projectsFound: "{count} project{plural} found",
      viewOnlyNotice: "You are viewing the marketplace in view-only mode. Only student accounts can apply or submit proposals to projects.",
      noSkillsNotice: "Add skills to your profile so projects can be ranked by compatibility.",
      emptyStateTitle: "No matching projects found",
      emptyStateDesc: "Try changing your search terms or clearing some filters.",
      resetFilterBtn: "RESET FILTER",
      paginationPrevious: "Previous",
      paginationNext: "Next",
      paginationPageOf: "Page {current} of {total}",
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
      searchPlaceholder: "Search project by title, skill, or business...",
      searchButton: "Search",
      filterSkill: "Skill",
      filterLocation: "Location",
      filterBudget: "Budget",
      sortBy: "Sort by:",
      sortRecommended: "Best Match",
      sortLatest: "Latest",
      sortDeadline: "Nearest Deadline",
      sortBudget: "Highest Budget",
      budgetUnder1m: "< Rp 1.000.000",
      budget1mTo3m: "Rp 1.000.000 - 3.000.000",
      budget3mTo5m: "Rp 3.000.000 - 5.000.000",
      budgetOver5m: "> Rp 5.000.000",
      skillMatch: "Skill Match",
      projectOpen: "Project OPEN",
      viewProject: "View Project",
      share: "Share",
      shareProjectAriaLabel: "Share project {title}",
      linkCopied: "Link copied",
      copyFailed: "Copy failed",
      shareProjectText: "View project \"{title}\" on Jembara.",
      yourProposal: "Your Proposal",
      proposalPlaceholder: "Explain relevant experience, work approach, and why you are suitable for this project.",
      proposalCharLimit: "Minimum 50 characters, maximum 2,000 characters.",
      proposalBudgetAgree: "I agree to the fixed project budget of",
      submitProposal: "Submit Proposal",
      submittingProposal: "Submitting...",
      backToJembara: "Back to Jembara",
      projectDescription: "Project Description",
      modeAndLocation: "Mode & Location",
      fixedBudget: "Fixed Budget",
      interestedTitle: "Interested in this project?",
      interestedDesc: "Log in as a student to view skill match and submit proposals to UMKM.",
      viewAndApply: "View & Submit Proposal",
      noAccount: "Don't have an account?",
      registerFree: "Register for free",
      login: "Log In",
      register: "Register",
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
    earningsCards: {
      pageTitle: "Earnings",
      pageSubtitle: "Monitor project value based on project status and last updates.",
      walletBalanceTitle: "Available Jembara balance",
      walletBalanceDesc: "Balance is automatically added after UMKM approves project results.",
      withdrawBalance: "Withdraw Balance",
      chartTitle: "Revenue Chart",
      rangeSixMonths: "6 Months",
      rangeOneYear: "1 Year",
      rangeAll: "All",
      upcomingWithdrawalTitle: "Next Withdrawal",
      amount: "Amount",
      date: "Date",
      status: "Status",
      withdrawNow: "Withdraw Now",
      historyTitle: "Project Value History",
      emptyHistory: "No active or completed projects with budget value yet.",
      transactionStatus: {
        completed: "Completed",
        inReview: "In Review",
        inProgress: "In Progress",
      },
      paymentMethodsTitle: "Payment Methods",
      addMethod: "Add Method",
      addWithdrawalMethod: "Add Withdrawal Method",
      primary: "Primary",
      emptyPaymentMethods: "No payment methods yet.",
      methodName: "Method Name",
      methodNamePlaceholder: "e.g. Bank Mandiri",
      detail: "Details",
      detailPlaceholder: "e.g. **** 1234",
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
      logoutConfirmTitle: "ログアウトしてもよろしいですか？",
      logoutConfirmButton: "はい、ログアウト",
      logoutCancelButton: "キャンセル",
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
      comingSoonTitle: "このページは準備中です",
      comingSoonSubtitle: "「{title}」機能は近日公開予定です。",
      pagination: {
        showing: "表示中",
        of: "/",
        previous: "前へ",
        next: "次へ",
      },
      ui: {
        searchPlaceholder: "検索...",
        searchOptionsPlaceholder: "選択肢を検索...",
        loadingOptions: "選択肢を読み込み中...",
        notFound: "見つかりません",
        optionNotFound: "選択肢が見つかりません",
        selectedSkills: "個のスキルを選択中",
        maxSelectedSkills: "最大",
      },
      datePicker: {
        selectDate: "日付を選択",
        today: "今日",
        clear: "クリア",
        prevMonth: "前月",
        nextMonth: "次月",
        months: [
          "1月", "2月", "3月", "4月", "5月", "6月",
          "7月", "8月", "9月", "10月", "11月", "12月",
        ],
        weekdays: ["日", "月", "火", "水", "木", "金", "土"],
      },
    },
    landing: {
      nav: {
        cariTalent: "タレントを探す",
        cariProject: "案件を探す",
        caraKerja: "使い方",
        kategori: "カテゴリー",
        statistik: "統計",
        login: "ログイン",
        register: "今すぐ登録",
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
      loginSubtitle: "おかえりなさい！アカウントにログインしてください。",
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
      eyebrowLogin: "キューログイン",
      loginHeadline: "おかえりなさい",
      loginSubtitleText: "あなたにマッチした仕事探しを続けましょう。",
      noAccountText: "アカウントをお持ちでないですか？",
      registerText: "新規登録",
      eyebrowRegister: "プロフィール作成",
      registerHeadline: "マッチメイキングを開始",
      registerSubtitleText: "適切なロールとマッチングするために詳細を入力してください。",
      hasAccountText: "既にアカウントをお持ちですか？",
      loginText: "ログイン",
      shellHeroTag: "創作の架け橋",
      shellHeroTitle: "船は航海して入り江へと至る、中小企業は発展し、学生は創作に励む。",
      shellHeroDesc: "スマートマッチングを通じて、学生のデジタル人材とUMKMのプロジェクトを接続します。",
      authenticatorLabel: "認証コードまたはリカバリコード",
      authenticatorPlaceholder: "123456 または ABCD-EFGH",
      loginSuccessMsg: "ログインに成功しました。ダッシュボードに移動中...",
      registerSuccessMsg: "アカウントが作成されました。プロフィールを準備中...",
      connectionErrorTitle: "サーバーへの接続に失敗しました",
      connectionErrorDesc: "マッチメイキング中に問題が発生したようです。しばらく経ってから再試行してください。",
      whyThisHappened: "なぜこれが発生したのですか？",
      profileProgress: "プロフィールの進捗",
      addressLabel: "住所",
      addressPlaceholder: "詳細住所（5文字以上）",
      fullNamePlaceholder: "お名前",
      passwordMinPlaceholder: "8文字以上",
      repeatPasswordPlaceholder: "パスワードを再入力",
      selectRoleBadge: "役割を選択してください",
      joinAsTitle: "として参加する",
      joinAsDesc: "ニーズに合った役割を選択し、私たちとデジタルコラボレーションの旅を始めましょう。",
      joinFreeNote: "無料で参加し、役割に応じてプロフィールを完成させましょう",
      fillBusinessProfile: "事業プロフィールを入力",
      businessNameLabel: "屋号・事業者名",
      businessNamePlaceholder: "例: Jembara Cafe",
      businessCategoryLabel: "事業カテゴリー",
      selectBusinessCategory: "事業カテゴリーを選択",
      searchCategoryPlaceholder: "カテゴリーを検索...",
      phoneLabel: "電話番号",
      websiteLabel: "ウェブサイト",
      websiteErrorMsg: "ドメインを含める必要があります。例：yourstore.com",
      saving: "保存中...",
      saveAndContinue: "保存して続行",
      categories: {
        kuliner: "料理・グルメ",
        fashion: "ファッション",
        jasa: "サービス",
        teknologi: "テクノロジー",
        agribisnis: "アグリビジネス",
        kreatif: "クリエイティブ産業",
        pendidikan: "教育",
        kesehatan: "医療・ヘルスケア",
        properti: "不動産",
        perdagangan: "貿易・小売",
        hiburan: "エンターテインメント",
      },
    },
    dashboard: {
      welcome: "おかえりなさい",
      greetingStudent: "こんにちは、{name}さん！",
      greetingUmkm: "こんにちは、{name}さん！",
      greetingAdmin: "こんにちは、{name}さん！",
      subtitleStudent: "アクティビティ、おすすめのプロジェクト、評判の進行状況はこちらです。",
      subtitleUmkm: "プロジェクト、届いた提案、ビジネスコラボレーション活動を管理します。",
      subtitleAdmin: "Jembaraプラットフォーム上のユーザー成長とプロジェクト活動を監視します。",
      recommendedProjectsTitle: "あなたにおすすめのプロジェクト",
      umkmProjectsTitle: "最新のプロジェクト",
      emptyRecommended: "あなたのスキルに一致するオープンなプロジェクトはまだありません。",
      emptyRecommendedNoSkill: "システムが一致するプロジェクトを検索できるよう、プロフィールにスキルを追加してください。",
      stats: {
        activeProjects: "進行中プロジェクト",
        proposalsSubmitted: "提出済みの提案",
        totalEarnings: "総収益",
        completedProjects: "完了したプロジェクト",
        averageRating: "平均評価",
        totalProjects: "プロジェクト総数",
        proposalsReceived: "届いた提案",
        openJobs: "募集中の求人",
        totalApplicants: "総応募者数",
        unitProposal: "件",
        unitActive: "件",
        unitCompleted: "件",
        unitProject: "件",
        unitListing: "件",
        unitPeople: "名",
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
      titleStudent: "進行中のマイプロジェクト",
      subtitleStudent: "取り組んでいるプロジェクトの締切と進行段階を管理します。",
      titleUmkm: "UMKMプロジェクト連携",
      subtitleUmkm: "タレント、締切、事業プロジェクトの進行状況を管理します。",
      titleAdmin: "進行中プロジェクトの監視",
      subtitleAdmin: "プラットフォームで進行中の連携アクティビティを確認します。",
      all: "すべて",
      inProgress: "進行中",
      review: "レビュー中",
      completed: "完了",
      submitWork: "成果物を提出",
      requestRevision: "修正を依頼",
      approveWork: "成果物を承認",
      emptyMessageStudent: "割り当てられたプロジェクトはまだありません。",
      emptyMessageUmkm: "コラボレーション段階に入った事業プロジェクトはまだありません。",
      emptyMessageAdmin: "プラットフォーム内に進行中の連携はまだありません。",
      collaborationTipTitle: "コラボレーション成功のヒント",
      collaborationTipStudent: "UMKMに進捗を定期的に連絡し、締切前に成果物を提出してください。",
      collaborationTipUmkm: "タレントがビジネスニーズに沿って作業を完了できるよう、明確なブリーフとフィードバックを提供してください。",
      collaborationTipAdmin: "基本監視にはプロジェクトデータを使用してください。ステータス変更は権限を持つ所有者が行います。",
      summaryTitleStudent: "マイプロジェクト概要",
      summaryTitleUmkm: "UMKMコラボレーション概要",
      summaryTitleAdmin: "プラットフォーム概要",
      metrics: {
        activeStudent: "進行中",
        activeUmkm: "進行中連携",
        completedThisMonth: "今月の完了",
        activeValue: "進行中プロジェクトの価値",
        studentRating: "学生の評価",
        noRating: "まだありません",
        awaitingReview: "レビュー待ち",
        inReview: "レビュー中",
        selectedTalent: "選ばれたタレント",
        totalProposals: "提案の総数",
        unitProject: "件",
        unitTalent: "名",
        unitProposal: "件",
      },
      card: {
        counterpartUmkm: "UMKM",
        counterpartTalent: "タレント",
        unassignedTalent: "タレント未選択",
        budget: "予算",
        deadline: "締切",
        lastUpdate: "最終更新",
        proposalsReceived: "届いた提案",
        proposalsCount: "件の提案",
        paymentSecured: "プロジェクト資金は安全に保管され、UMKMが承認するまで保留されます。",
      },
      workflow: {
        submitHeader: "成果物を提出",
        submitRevisionHeader: "修正成果物を提出",
        revisionGuide: "修正指示:",
        resultUrlPlaceholder: "https://drive.google.com/... (任意)",
        notesPlaceholder: "完了した成果とUMKMの確認方法を説明してください。",
        submitting: "送信中...",
        submitBtn: "レビュー用に送信",
        submitError: "プロジェクト成果物の送信に失敗しました。",
        talentResultTitle: "タレントからの成果物",
        openResultLink: "成果物リンクを開く",
        approving: "処理中...",
        approveBtn: "承認して資金を解除",
        revisionReasonPlaceholder: "修正指示",
        requestRevisionBtn: "修正を依頼",
        revisionSuccessTitle: "修正を依頼しました",
        revisionSuccessText: "タレントに修正指示が送信されました。",
        revisionError: "修正依頼の送信に失敗しました。",
        approveSwalTitle: "プロジェクト成果物を承認しますか？",
        approveSwalText: "承認後、資金は直ちにタレントの残高に入金されます。",
        approveSwalConfirm: "承認して資金を解除",
        approveSwalCancel: "キャンセル",
        approveError: "プロジェクト成果物の承認に失敗しました。",
        rateTalentTitle: "タレントの連携を評価",
        ratingOptions: {
          r5: "5 - とても良い",
          r4: "4 - 良い",
          r3: "3 - 普通",
          r2: "2 - 悪い",
          r1: "1 - とても悪い",
        },
        commentPlaceholder: "協力体験について共有してください（任意）。",
        saveReviewBtn: "レビューを保存",
        reviewSuccessTitle: "レビューが保存されました",
        reviewError: "レビューの保存に失敗しました。",
      },
      progress: {
        progressTitle: "作業進捗",
        milestoneTitle: "プロジェクトマイルストーン",
      },
    },
    proposals: {
      title: "提案一覧",
      subtitle: "提出したプロジェクト提案のステータスを確認します。",
      all: "すべて",
      submitted: "提出済み",
      accepted: "採用",
      rejected: "不採用",
      emptyCategory: "このカテゴリーの提案はまだありません。",
      match: "マッチ度",
      budget: "予算",
      submittedDate: "提出日",
    },
    portfolio: {
      title: "ポートフォリオ＆スキルパスポート",
      subtitle: "実績と認証されたスキル評判を表示します。",
      skillPassportTitle: "認証済みスキルパスポート",
      addEvidence: "実績証拠を追加",
      noSkills: "スキルはまだ追加されていません。プロフィール設定から追加してください。",
      stats: {
        portfolioWorks: "ポートフォリオ作品",
        completedProjects: "完了したプロジェクト",
        averageRating: "平均評価",
        verifiedSkills: "認証済みスキル",
        noRating: "評価なし",
      },
      evidence: {
        label: "ポートフォリオ実績証拠",
        notSelected: "未選択",
        placeholder: "ポートフォリオ実績を選択",
        successTitle: "スキル実績証拠を更新しました",
        successDesc: "管理者が選択したポートフォリオをレビューできます。",
        unspecifiedCategory: "カテゴリー未設定",
      },
      projectsSection: {
        bestWorks: "あなたの代表作",
        closeForm: "フォームを閉じる",
        addProject: "作品を追加",
        workTitle: "作品タイトル",
        workLink: "作品リンク（任意）",
        imageUrl: "画像URL（任意）",
        description: "説明（任意）",
        emptyDescription: "作品の説明はまだありません。",
        savePortfolio: "ポートフォリオを保存",
        emptyProjects: "作品はまだありません。最初の作品を追加してプロフィールを充実させましょう。",
        saveSuccess: "ポートフォリオ作品を追加しました。",
        saveError: "ポートフォリオ作品の保存に失敗しました。",
      },
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
    profilePage: {
      title: "プロフィール",
      subtitle: "公開プロフィールが他ユーザーにどのように表示されるか確認します。",
      about: "について",
      featuredPortfolio: "注目のポートフォリオ",
      noDescription: "説明はまだありません。",
      emptyPortfolios: "ポートフォリオはまだ追加されていません。",
      clientReviews: "UMKMクライアントのレビュー",
      noReviewComment: "クライアントのコメントはまだありません。",
      emptyReviews: "クライアントからのレビューはまだありません。",
      editProfileTitle: "プロフィール編集",
      editProfileSubtitle: "UMKMクライアントに対してより魅力的に見せるためにプロフィール情報を更新します。",
      backToProfile: "プロフィールに戻る",
      profilePicture: "プロフィール写真",
      pictureSizeNote: "推奨アスペクト比 1:1。最大 5MB。",
      changePhoto: "写真を変更",
      fullName: "フルネーム",
      jobHeadline: "職種・見出し",
      locationAddress: "所在地・住所",
      educationLevel: "学歴",
      selectEducationLevel: "学歴を選択してください",
      schoolUniversity: "学校名・大学名",
      aboutMeDescription: "自己紹介・詳細説明",
      aboutMeNote: "経歴、関心分野、専門スキルについて簡潔に記述してください。",
      skillsAndTools: "スキル＆ツール",
      skillsPlaceholder: "カンマ区切りで入力（例: React, Figma, UI Design）",
      saving: "保存中...",
      card: {
        roleStudent: "学生",
        roleUmkm: "UMKM企業",
        roleAdmin: "管理者",
        roleUser: "ユーザー",
        available: "案件受注可能",
        unavailable: "現在対応不可",
        reviews: "件のレビュー",
        completedProjects: "件の完了プロジェクト",
        editProfile: "プロフィールを編集",
        contactHire: "連絡・採用する",
        skillsTitle: "スキル＆ツール",
        emptySkills: "スキルはまだ追加されていません。",
      },
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
    settingsCards: {
      notifications: {
        emailTitle: "メール通知",
        pushTitle: "プッシュ通知（アプリ）",
        deadlineTitle: "プロジェクト期限リマインダー",
        deadlineDesc: "契約終了の48時間前に自動警告を発信します。",
        proposalMasukTitle: "提案の受信",
        proposalMasukDesc: "プロジェクトに新しい提案が提出されたときに通知を受け取ります。",
        pesanBaruTitle: "新着メッセージ",
        pesanBaruDesc: "クライアントやタレントからメッセージを受信したときに通知を受け取ります。",
        pembayaranTitle: "支払い",
        pembayaranDesc: "支払い状況や出金申請の更新に関する通知を受け取ります。",
        updateProyekTitle: "プロジェクト更新",
        updateProyekDesc: "進行中プロジェクトのステータス変更に関する通知を受け取ります。",
        promosiTitle: "お知らせ＆プロモーション",
        promosiDesc: "ヒント、プロモーション、新機能リリースに関する情報を受け取ります。",
        saveButton: "設定を保存",
        saving: "保存中...",
        saveSuccess: "通知設定を保存しました。",
      },
      privacy: {
        visibilityTitle: "プロフィールの公開範囲",
        visibilityUmkmTitle: "企業プロフィールの公開範囲",
        visibilityStudentDesc: "プロフィールを公開検索可能にするかを設定します。",
        visibilityUmkmDesc: "企業プロフィールは公開されたプロジェクトを通じて表示されます。連絡先および詳細住所は非公開に保たれます。",
        publicTitle: "公開",
        publicDesc: "タレント一覧に表示されます。連絡先および詳細住所は非公開です。",
        privateTitle: "非公開",
        privateDesc: "公開タレント一覧には表示されません。",
        saveSuccess: "公開範囲の設定を保存しました。",
        dataAccountTitle: "データとアカウント",
        downloadDataTitle: "個人データのダウンロード",
        downloadDataDesc: "アクティビティ、プロジェクト、提案履歴のすべてのデータを.JSON形式でエクスポートします。",
        downloadDataButton: "データをダウンロード",
        deleteAccountTitle: "アカウントの永久削除",
        deleteAccountDesc: "この操作により、アカウント、ポートフォリオ、提案、すべてのデータが永久に削除されます。取り消すことはできません。",
        deleteAccountButton: "アカウントを削除",
        deleting: "削除中...",
        confirmDeleteTitle: "アカウントを永久に削除しますか？",
        confirmDeleteText: "確認のためパスワードを入力してください。アクティブな取引やプロジェクトがあるアカウントは自動削除できません。",
        passwordRequired: "パスワードは必須です。",
      },
      security: {
        changePasswordTitle: "パスワードの変更",
        currentPasswordLabel: "現在のパスワード",
        newPasswordLabel: "新しいパスワード",
        confirmPasswordLabel: "新しいパスワード（確認）",
        savePasswordButton: "変更を保存",
        saving: "保存中...",
        passwordUpdatedTitle: "パスワードを更新しました",
        passwordUpdatedText: "以前のすべてのセッションが失効しました。このデバイスのセッションが更新されました。",
        twoFactorTitle: "2要素認証 (2FA)",
        twoFactorDesc: "TOTP対応認証アプリを使用します。8つの復元コードは有効化時に1回のみ表示されます。",
        active: "有効",
        inactive: "無効",
        startSetup: "2FAセットアップを開始",
        enterSecretNote: "認証アプリに以下のシークレットを入力してください：",
        openAuthApp: "認証アプリで開く",
        verifyAndActivate: "検証して有効化",
        disable2FA: "2FAを無効化",
        activeSessionsTitle: "アクティブなセッション",
        noOtherSessions: "他のアクティブセッションはありません。",
        logoutSession: "ログアウト",
        confirmRevokeTitle: "このセッションを失効させますか？",
        confirmRevokeText: "該当デバイスはJembaraにアクセスするために再ログインが必要です。",
        yesRevoke: "はい、セッションを失効します",
      },
      payments: {
        payoutMethodsTitle: "出金方法",
        payoutMethodsDesc: "保存された口座は売上残高の出金申請時に利用可能になります。",
        addMethod: "追加",
        closeMethod: "閉じる",
        providerLabel: "銀行またはEウォレット",
        accountNameLabel: "口座名義",
        accountNumberLabel: "口座番号/Eウォレット番号",
        makePrimaryLabel: "メイン口座に設定",
        saveMethodButton: "出金方法を保存",
        noMethodsNote: "出金方法はまだ追加されていません。出金前に口座を追加してください。",
        primaryBadge: "メイン",
        makePrimaryButton: "メインに設定",
        maxMethodsNote: "1アカウントにつき最大5つの出金方法まで登録可能です。",
        manualWithdrawalTitle: "手動残高出金",
        manualWithdrawalNote: "利用可能残高: {balance}。最低出金額はRp10.000です。",
        adminCheckNote: "申請は管理者によって審査され手動で振込処理されます。",
        withdrawButton: "残高を出金する",
        addAccountFirst: "最初に口座を追加してください",
        transactionHistoryTitle: "取引履歴",
        tableHeaderDate: "日付",
        tableHeaderDesc: "説明",
        tableHeaderAmount: "金額",
        tableHeaderStatus: "ステータス",
        noTransactions: "支払いまたは出金の取引履歴はまだありません。",
        studentPayoutOnlyTitle: "学生専用の出金設定",
        studentPayoutOnlyDesc: "企業はプロジェクトページ経由で支払いを行い、管理者は出金メニュー経由で学生の出金申請を処理します。",
      },
      profile: {
        changeLogo: "ロゴを変更",
        changePhoto: "写真を変更",
        companyProfileTitle: "企業プロフィール",
        companyNameLabel: "企業名",
        industryLabel: "業界 / カテゴリー",
        companyEmailLabel: "企業メールアドレス",
        companyDescriptionLabel: "企業概要",
        phoneNumberLabel: "電話番号",
        mainAddressTitle: "主要住所",
        officialWebsiteLabel: "公式サイト",
        employeeCountLabel: "従業員数",
        foundedYearLabel: "設立年",
        saveProfileButton: "変更を保存",
        saving: "保存中...",
        saveSuccess: "プロフィールが更新されました。",
        personalInfoTitle: "個人情報",
        fullNameLabel: "フルネーム",
        emailLabel: "メールアドレス",
        phoneLabel: "電話番号",
        educationInfoTitle: "学歴情報",
        educationLevelLabel: "教育段階",
        educationLevelPlaceholder: "教育段階を選択",
        schoolLabel: "大学・学校名",
        schoolPlaceholder: "例：ブラウィジャヤ大学",
        majorLabel: "専攻",
        semesterLabel: "学期",
        semesterPlaceholder: "例：6",
        bioLabel: "自己紹介",
        availableForProjects: "案件の受注が可能",
        availableForProjectsDesc: "有効にすると、スマートマッチングの推薦や人材検索に表示されます。",
        publicProfile: "公開ページにプロフィールを表示",
        publicProfileDesc: "名前、学校、専攻、スキル、評価、案件数が表示されます。住所、メール、電話番号は非公開です。",
        skillsTitle: "スキル・専門知識",
        addSkillButton: "+ スキルを追加",
        noSkillsAdded: "まだスキルが追加されていません。",
        selectOfficialSkill: "Jembaraの公式スキルを選択",
        searchSkillPlaceholder: "スキルを検索 (例: React, UI/UX...)",
        minBudgetExpectation: "希望最小予算 (Rp)",
        maxBudgetExpectation: "希望最大予算 (Rp)",
        minBudgetPlaceholder: "例：500.000",
        maxBudgetPlaceholder: "例：5.000.000",
        portfolioAndSocialTitle: "ポートフォリオ・SNSリンク",
        portfolioUrlLabel: "Portfolio URL",
        githubLabel: "Github",
        linkedinLabel: "Linkedin",
        behanceLabel: "Behance",
        saveButton: "保存",
        invalidPhotoTitle: "無効な写真",
        invalidPhotoText: "5MB以下のPNG、JPEG、またはWebP画像を選択してください。",
        photoTooLargeTitle: "写真のサイズが大きすぎます",
        photoTooLargeText: "より解像度の低い画像を使用してください。",
        skillLimitTitle: "スキルの上限に達しました",
        skillLimitText: "最大20個のスキルを追加できます。",
        allSkillsSelectedTitle: "すべてのスキルが選択済みです",
        addSkillModalTitle: "スキルを追加",
        addSkillModalConfirm: "追加",
        addSkillModalCancel: "キャンセル",
        addSkillModalValidation: "スキルを1つ選択してください。",
        saveError: "変更の保存に失敗しました。",
      },
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
      noMatchingConversations: "一致する会話はありません。",
      unread: "未読",
      projectTab: "プロジェクト",
    },
    withdrawals: {
      pageTitle: "出金申請",
      pageSubtitle: "Jembaraの残高を銀行口座または電子マネーに引き出す申請を行います。",
      availableBalance: "利用可能残高",
      minimumWithdrawalNote: "最低出金額はRp10.000です。管理者が処理するまで残高は予約されます。",
      nominalLabel: "出金額 (Rp)",
      amountPlaceholder: "例: 50.000",
      methodLabel: "受取方法",
      noSavedAccount: "保存された口座はありません",
      primaryBadge: " (メイン)",
      submitButton: "出金を申請する",
      securityNote: "口座名義と番号が正しいことを確認してください。",
      historyTitle: "出金履歴",
      noHistory: "出金申請はまだありません。",
      submittedDate: "申請日",
      adminNote: "管理者メモ",
      processedDate: "処理日",
      minBalanceNotice: "残高が最低出金額のRp10.000に達していません。",
      addAccountPromptPrefix: "最初に",
      addAccountLinkText: "お支払い設定",
      addAccountPromptSuffix: "で銀行口座または電子マネーを追加してください。",
    },
    regions: {
      provinceLabel: "州 / 都道府県",
      regencyLabel: "市 / 郡",
      districtLabel: "区 / 町村",
      villageLabel: "町・字 / 村",
      addressDetailLabel: "住所詳細",
      selectProvince: "都道府県を選択",
      searchProvince: "都道府県を検索...",
      selectRegency: "市/郡を選択",
      searchRegency: "市/郡を検索...",
      selectDistrict: "区/町村を選択",
      searchDistrict: "区/町村を検索...",
      selectVillage: "村を選択",
      searchVillage: "町・字/村を検索...",
      typeProvince: "都道府県名を入力",
      typeRegency: "市/郡名を入力",
      typeDistrict: "区/町村名を入力",
      typeVillage: "町・字/村名を入力",
      manualToggleOn: "地域が一覧にありませんか？ 手動で入力",
      manualToggleOff: "地域一覧からの選択に戻る",
      manualModeNote: "手動入力の地域名はwilayah.idコードなしで保存されます。",
      addressDetailPlaceholder: "通り名、建物番号、番地、目印など",
      attributionNote: "行政地域データは wilayah.id によって提供されています。",
      fetchError: "地域データの取得に失敗しました。再試行してください。",
    },
    projects: {
      findProjectsTitle: "案件を探す",
      findProjectsSubtitleApply: "スキルに合ったプロジェクトを見つけましょう。",
      findProjectsSubtitleExplore: "Jembaraプラットフォーム上の公開プロジェクトを探索。",
      recommendedSectionTitle: "おすすめのプロジェクト",
      openSectionTitle: "公開プロジェクト",
      projectsFound: "{count}件のプロジェクトが見つかりました",
      viewOnlyNotice: "閲覧専用モードでマーケットプレイスを表示しています。プロジェクトへの応募や提案の送信は学生アカウントのみ可能です。",
      noSkillsNotice: "適性に基づいてプロジェクトを順位付けするには、プロフィールにスキルを追加してください。",
      emptyStateTitle: "一致するプロジェクトが見つかりません",
      emptyStateDesc: "検索キーワードを変更するか、フィルターを解除してみてください。",
      resetFilterBtn: "フィルターをリセット",
      paginationPrevious: "前へ",
      paginationNext: "次へ",
      paginationPageOf: "{total}ページ中 {current}ページ目",
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
      searchPlaceholder: "案件名、スキル、企業名で検索...",
      searchButton: "検索",
      filterSkill: "スキル",
      filterLocation: "場所",
      filterBudget: "予算",
      sortBy: "並び替え:",
      sortRecommended: "おすすめ順",
      sortLatest: "新着順",
      sortDeadline: "締切が近い順",
      sortBudget: "予算が高い順",
      budgetUnder1m: "< Rp 1.000.000",
      budget1mTo3m: "Rp 1.000.000 - 3.000.000",
      budget3mTo5m: "Rp 3.000.000 - 5.000.000",
      budgetOver5m: "> Rp 5.000.000",
      skillMatch: "スキルマッチ",
      projectOpen: "募集中",
      viewProject: "案件を見る",
      share: "共有",
      shareProjectAriaLabel: "{title} を共有",
      linkCopied: "リンクをコピーしました",
      copyFailed: "コピーに失敗しました",
      shareProjectText: "Jembaraで「{title}」の案件をチェック。",
      yourProposal: "あなたの提案",
      proposalPlaceholder: "関連する経験、進め方、この案件に適している理由を説明してください。",
      proposalCharLimit: "最小50文字、最大2,000文字。",
      proposalBudgetAgree: "固定予算に同意します：",
      submitProposal: "提案を送信",
      submittingProposal: "送信中...",
      backToJembara: "Jembaraへ戻る",
      projectDescription: "案件概要",
      modeAndLocation: "勤務形態・場所",
      fixedBudget: "固定予算",
      interestedTitle: "この案件に興味がありますか？",
      interestedDesc: "学生としてログインしてスキル一致度を確認し、企業に提案を送信しましょう。",
      viewAndApply: "確認して提案する",
      noAccount: "アカウントをお持ちでないですか？",
      registerFree: "無料会員登録",
      login: "ログイン",
      register: "会員登録",
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
    earningsCards: {
      pageTitle: "収益",
      pageSubtitle: "プロジェクトのステータスと最新の更新に基づいてプロジェクトの価値を監視します。",
      walletBalanceTitle: "利用可能なJembara残高",
      walletBalanceDesc: "UMKMがプロジェクト結果を承認すると、残高が自動的に加算されます。",
      withdrawBalance: "残高を出金",
      chartTitle: "収益チャート",
      rangeSixMonths: "6ヶ月",
      rangeOneYear: "1年",
      rangeAll: "すべて",
      upcomingWithdrawalTitle: "次回の出金",
      amount: "金額",
      date: "日付",
      status: "ステータス",
      withdrawNow: "今すぐ出金",
      historyTitle: "プロジェクト価値の履歴",
      emptyHistory: "予算額のあるアクティブまたは完了したプロジェクトはまだありません。",
      transactionStatus: {
        completed: "完了",
        inReview: "レビュー中",
        inProgress: "進行中",
      },
      paymentMethodsTitle: "お支払い方法",
      addMethod: "方法を追加",
      addWithdrawalMethod: "出金方法を追加",
      primary: "メイン",
      emptyPaymentMethods: "お支払い方法はまだありません。",
      methodName: "方法名",
      methodNamePlaceholder: "例: Bank Mandiri",
      detail: "詳細",
      detailPlaceholder: "例: **** 1234",
    },
  },
};

export default dictionary;