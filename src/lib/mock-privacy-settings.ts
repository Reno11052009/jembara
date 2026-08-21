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
