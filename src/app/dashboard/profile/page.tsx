import ProfileCard from "@/components/profile/profile-card";
import { Star } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { getCachedProfileData } from "@/lib/profile";

export default async function ProfilePage() {
  const profileData = await getCachedProfileData();

  return (
    <>
      <PageHeader
        title="Profil"
        subtitle="Lihat bagaimana profil publik Anda tampil di mata orang lain."
        userName="Pengguna"
        avatarUrl={profileData.avatarUrl}
      />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Left Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24 flex flex-col gap-6">
              <ProfileCard avatarUrl={profileData.avatarUrl} />
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <h3 className="font-bold text-xl mb-3">Tentang Chello</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Saya adalah siswa Ilmu Komputer di SMK PGRI 03 Malang yang fokus mendalami dunia UI/UX Design dan Frontend Web Development. Senang berkolaborasi dengan UMKM dalam membangun solusi produk digital yang rapi, cepat, dan fungsional.
              </p>
            </div>

            {/* Portfolio Section */}
            <div>
              <h3 className="font-bold text-xl mb-4 ml-1">Portofolio Pilihan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Portfolio Item 1 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {/* Ganti dengan <Image /> Next.js untuk production */}
                    <img src="" alt="Web Toko Sepatu" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-1">Redesign Web Toko Sepatu</h4>
                    <p className="text-xs text-gray-500">UI/UX & Frontend</p>
                  </div>
                </div>

                {/* Portfolio Item 2 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    <img src="" alt="Apps Pemesanan Laundry" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-1">Apps Pemesanan Laundry</h4>
                    <p className="text-xs text-gray-500">Mobile UI Design</p>
                  </div>
                </div>

                {/* Portfolio Item 3 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    <img src="" alt="Landing Page Event" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-1">Landing Page Event UMKM</h4>
                    <p className="text-xs text-gray-500">Web Development</p>
                  </div>
                </div>

                {/* Portfolio Item 4 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    <img src="" alt="Sistem Kasir Pintar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-1">Sistem Kasir Pintar (Web)</h4>
                    <p className="text-xs text-gray-500">Frontend Dev</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-4">
              <h3 className="font-bold text-xl mb-4 ml-1">Ulasan Klien UMKM</h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8 flex flex-col gap-6">
                {/* Review 1 */}
                <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">Bpk. Cholik</h4>
                      <p className="text-xs text-gray-500">Owner Toko Sepatu Jaya</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold">
                      <Star className="w-4 h-4 text-orange-500" fill="currentColor" />
                      5.0
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    &quot;Kerjanya luar biasa cepat tanggap dan mengerti apa yang kami mau. Web toko kami sekarang terlihat modern dan keren sekali!&quot;
                  </p>
                </div>

                {/* Review 2 */}
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">Ibu Chotijah</h4>
                      <p className="text-xs text-gray-500">Manager Laundry Bersih</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold">
                      <Star className="w-4 h-4 text-orange-500" fill="currentColor" />
                      4.8
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    &quot;Desain UI aplikasinya sangat user-friendly untuk pelanggan kami yang rata-rata ibu-ibu. Kerjasama yang sangat menyenangkan!&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
