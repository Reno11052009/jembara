type BusinessCategorySeed = {
  groupName: string;
  groupOrder: number;
  name: string;
  sortOrder: number;
};

const categoryGroups = [
  {
    groupName: "Kuliner",
    items: [
      "Restoran dan Warung",
      "Kafe dan Kedai Kopi",
      "Katering",
      "Makanan Ringan",
      "Minuman",
      "Bakery dan Dessert",
      "Makanan Beku",
      "Oleh-Oleh",
    ],
  },
  {
    groupName: "Fashion",
    items: [
      "Pakaian",
      "Hijab dan Busana Muslim",
      "Batik dan Pakaian Adat",
      "Tas dan Dompet",
      "Sepatu dan Sandal",
      "Aksesoris dan Perhiasan",
      "Konveksi dan Tailor",
    ],
  },
  {
    groupName: "Kecantikan",
    items: [
      "Salon dan Barbershop",
      "Skincare dan Kosmetik",
      "Makeup Artist",
      "Spa dan Perawatan Tubuh",
      "Parfum",
    ],
  },
  {
    groupName: "Kesehatan",
    items: ["Apotek", "Klinik", "Alat Kesehatan", "Optik", "Terapi dan Fisioterapi"],
  },
  {
    groupName: "Kerajinan",
    items: [
      "Kerajinan Tangan",
      "Souvenir",
      "Produk Handmade",
      "Keramik dan Gerabah",
      "Kerajinan Kayu dan Bambu",
    ],
  },
  {
    groupName: "Pertanian dan Peternakan",
    items: [
      "Hasil Pertanian",
      "Bibit dan Tanaman",
      "Pupuk dan Alat Pertanian",
      "Peternakan",
      "Hasil Peternakan",
      "Perikanan",
    ],
  },
  {
    groupName: "Elektronik dan Teknologi",
    items: [
      "Elektronik",
      "Komputer dan Laptop",
      "Smartphone dan Aksesoris",
      "Servis Elektronik",
      "Software dan Aplikasi",
      "Jasa IT",
    ],
  },
  {
    groupName: "Percetakan dan Kreatif",
    items: [
      "Percetakan",
      "Sablon dan Bordir",
      "Desain Grafis",
      "Fotografi dan Videografi",
      "Editing Foto dan Video",
    ],
  },
  {
    groupName: "Pendidikan",
    items: ["Bimbingan Belajar", "Les Privat", "Kursus", "Pelatihan", "E-Learning"],
  },
  {
    groupName: "Properti dan Konstruksi",
    items: [
      "Jual dan Sewa Properti",
      "Kost dan Kontrakan",
      "Kontraktor",
      "Renovasi",
      "Arsitektur dan Interior",
      "Material Bangunan",
    ],
  },
  {
    groupName: "Furniture dan Rumah",
    items: ["Furniture", "Dekorasi Rumah", "Peralatan Rumah Tangga", "Furniture Custom"],
  },
  {
    groupName: "Otomotif",
    items: [
      "Bengkel Kendaraan",
      "Cuci Kendaraan",
      "Sparepart dan Aksesoris",
      "Rental Kendaraan",
      "Salon Kendaraan",
    ],
  },
  {
    groupName: "Transportasi dan Logistik",
    items: ["Travel", "Antar Jemput", "Kurir dan Ekspedisi", "Angkutan Barang", "Rental Transportasi"],
  },
  {
    groupName: "Pariwisata",
    items: ["Agen Travel", "Paket Wisata", "Tour Guide", "Penginapan", "Wisata dan Rekreasi"],
  },
  {
    groupName: "Event",
    items: [
      "Event Organizer",
      "Wedding Organizer",
      "Dekorasi Acara",
      "Sound System dan Lighting",
      "Sewa Peralatan Acara",
    ],
  },
  {
    groupName: "Jasa Profesional",
    items: ["Konsultan", "Akuntansi dan Pajak", "Jasa Hukum", "Penerjemah", "Penulis dan Copywriter"],
  },
  {
    groupName: "Jasa Rumah Tangga",
    items: ["Laundry", "Cleaning Service", "Servis Rumah", "Tukang Bangunan", "Jasa Pindahan"],
  },
  {
    groupName: "Hewan Peliharaan",
    items: ["Pet Shop", "Grooming", "Klinik Hewan", "Penitipan Hewan"],
  },
  {
    groupName: "Hobi dan Hiburan",
    items: ["Game dan Rental Game", "Mainan dan Koleksi", "Buku dan Komik", "Alat Musik", "Peralatan Hobi"],
  },
  {
    groupName: "Olahraga",
    items: ["Toko Olahraga", "Gym dan Fitness", "Sewa Lapangan", "Pelatih Olahraga"],
  },
  {
    groupName: "Retail",
    items: ["Toko Kelontong", "Sembako", "Grosir", "Distributor dan Supplier"],
  },
  {
    groupName: "Digital dan Kreatif",
    items: [
      "Digital Marketing",
      "Social Media Management",
      "Content Creator",
      "Web dan App Development",
      "Desain dan Branding",
    ],
  },
  {
    groupName: "Produk Digital",
    items: ["Software", "Template", "E-Book", "Kursus Online", "Asset Digital"],
  },
  {
    groupName: "Lingkungan",
    items: ["Daur Ulang", "Bank Sampah", "Produk Ramah Lingkungan"],
  },
  {
    groupName: "Lainnya",
    items: ["Usaha Rumahan", "Produk Lokal", "Produk UMKM", "Jasa Umum", "Lainnya"],
  },
] as const;

export const businessCategorySeeds: BusinessCategorySeed[] = categoryGroups.flatMap(
  ({ groupName, items }, groupIndex) =>
    items.map((name, itemIndex) => ({
      groupName,
      groupOrder: (groupIndex + 1) * 10,
      name,
      sortOrder: (itemIndex + 1) * 10,
    })),
);

export const businessCategoryGroupCount = categoryGroups.length;
