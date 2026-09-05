import type { ProfileVisibilityOption, PrivacyPreference } from "@/types/settings";

export const profileVisibilityOptions: ProfileVisibilityOption[] = [
  {
    id: "public",
    title: "Publik",
    description:
      "Semua orang (klien, mahasiswa lain, & pengunjung luar) dapat melihat profil dan seluruh portofolio kamu.",
  },
  {
    id: "private",
    title: "Privat",
    description:
      "Hanya kamu dan klien yang sedang bekerja sama secara aktif denganmu yang dapat mengakses profil.",
  },
  {
    id: "connections-only",
    title: "Hanya Koneksi",
    description:
      "Hanya user terdaftar dan akun rekan mahasiswa yang terhubung yang bisa meninjau detail akun kamu.",
  },
];

export const defaultProfileVisibility = "public";

// Visibilitas & preferensi data untuk akun UMKM — perusahaan dilihat oleh
// talenta/freelancer, kebalikan dari versi Student di atas (dilihat oleh klien).
export const profileVisibilityOptionsUmkm: ProfileVisibilityOption[] = [
  {
    id: "public",
    title: "Publik",
    description:
      "Semua freelancer di platform dapat mencari dan melihat profil lengkap perusahaan Anda.",
  },
  {
    id: "private",
    title: "Privat",
    description:
      "Hanya talenta yang sedang melamar atau terikat kontrak aktif yang dapat melihat profil.",
  },
  {
    id: "connected-talent-only",
    title: "Hanya Talent Terhubung",
    description: "Hanya memperbolehkan portofolio Anda diakses oleh mitra resmi.",
  },
];

export const defaultProfileVisibilityUmkm = "public";

export const privacyPreferencesUmkm: PrivacyPreference[] = [
  {
    id: "show-online-status",
    title: "Tampilkan Status Online",
    description: "Izinkan freelancer melihat kapan admin rekrutmen perusahaan sedang online.",
    enabled: true,
  },
  {
    id: "publish-job-history",
    title: "Publikasikan Semua Histori Lowongan",
    description: "Menampilkan histori proyek sukses yang pernah dikerjakan oleh perusahaan Anda.",
    enabled: true,
  },
  {
    id: "allow-search-engine-indexing",
    title: "Izinkan Profil Muncul di Hasil Pencarian Eksternal",
    description: "Memungkinkan pencarian Google mengindeks profil bisnis Anda.",
    enabled: false,
  },
];

export const privacyPreferences: PrivacyPreference[] = [
  {
    id: "show-online-status",
    title: "Tampilkan status online",
    description:
      "Klien dapat melihat indikator titik hijau aktif saat kamu sedang membuka platform SkillBridge.",
    enabled: true,
  },
  {
    id: "show-portfolio-to-non-connections",
    title: "Tampilkan portofolio ke non-koneksi",
    description:
      "Izinkan file showcase portofolio diakses oleh pengunjung publik yang belum terdaftar di SkillBridge.",
    enabled: true,
  },
  {
    id: "allow-search-engine-indexing",
    title: "Izinkan profil muncul di hasil mesin pencarian",
    description:
      "Optimalkan profil kamu agar terindeks Google, memudahkan klien eksternal menemukan keahlian kamu.",
    enabled: false,
  },
];