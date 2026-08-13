import Link from "next/link";
import { ArrowLeft, CircleCheck, MapPin, GraduationCap, Star } from "lucide-react";

export default async function ProfilePage() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-md"></div>
              <span className="font-extrabold text-xl tracking-tight">
                Skill<span className="text-orange-500">Bridge</span>
              </span>
            </div>
            
            {/* Back to Dashboard */}
            <Link href="/dashboard" className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
              <img 
                src="https://ui-avatars.com/api/?name=Chello+Arta&background=random" 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-gray-50"
              />
              <h2 className="text-xl font-bold">Chello Arta</h2>
              <p className="text-sm text-gray-500 mb-3">UI/UX Designer & Frontend Dev</p>
              
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full mb-6">
                <CircleCheck className="w-3.5 h-3.5" />
                Available for Projects
              </div>

              <div className="w-full flex flex-col gap-3 text-sm text-gray-600 mb-6 text-left">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>Surabaya, Indonesia</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span>SMK PGRI 03 Malang</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-gray-400" fill="currentColor" />
                  <span><span className="font-bold text-gray-900">4.9</span> (23 Reviews)</span>
                </div>
              </div>

              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors">
                HUBUNGI & REKRUT CHELLO
              </button>
            </div>

            {/* Skills Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-lg mb-4">Keahlian & Tools</h3>
              <div className="flex flex-wrap gap-2">
                {['Figma', 'UI/UX Design', 'Wireframing', 'React.js', 'Tailwind CSS', 'JavaScript', 'User Research'].map((skill) => (
                  <span 
                    key={skill} 
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
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
                    "Kerjanya luar biasa cepat tanggap dan mengerti apa yang kami mau. Web toko kami sekarang terlihat modern dan keren sekali!"
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
                    "Desain UI aplikasinya sangat user-friendly untuk pelanggan kami yang rata-rata ibu-ibu. Kerjasama yang sangat menyenangkan!"
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}