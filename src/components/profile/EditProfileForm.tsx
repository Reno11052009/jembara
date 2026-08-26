"use client";

import Link from "next/link";
import { ArrowLeft, Save, Camera } from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { updateProfileAction } from "@/app/actions/profile";

interface ProfileData {
  name: string;
  headline: string;
  location: string;
  tingkat_pendidikan: string;
  school: string;
  about: string;
  skills: string[];
  avatarUrl: string;
}

export default function EditProfileForm({ initialData }: { initialData: ProfileData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(initialData.avatarUrl);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      void Swal.fire({
        icon: "error",
        title: "Foto tidak valid",
        text: "Pilih gambar PNG, JPEG, atau WebP dengan ukuran maksimal 5 MB.",
        confirmButtonColor: "#f97316",
      });
      e.target.value = "";
      return;
    }

    // Create object URL for immediate preview
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);

    // Compress to WebP using Canvas
    const img = new Image();
    img.src = objectUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      const MAX_SIZE = 500;
      let { width, height } = img;
      
      if (width > height && width > MAX_SIZE) {
        height *= MAX_SIZE / width;
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width *= MAX_SIZE / height;
        height = MAX_SIZE;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      
      const webpDataUrl = canvas.toDataURL("image/webp", 0.75); // 75% quality
      if (webpDataUrl.length > 360_000) {
        void Swal.fire({
          icon: "error",
          title: "Foto masih terlalu besar",
          text: "Gunakan gambar yang lebih sederhana atau beresolusi lebih kecil.",
          confirmButtonColor: "#f97316",
        });
        URL.revokeObjectURL(objectUrl);
        return;
      }
      setAvatarPreview(webpDataUrl);
      setAvatarBase64(webpDataUrl);
      URL.revokeObjectURL(objectUrl);
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    if (avatarBase64) {
      formData.append("avatarBase64", avatarBase64);
    }

    const result = await updateProfileAction(formData);
    
    setIsLoading(false);
    
    if (result?.error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: result.error,
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Profil Anda telah diperbarui.',
        confirmButtonColor: '#f97316'
      }).then(() => {
        router.push("/dashboard/profile");
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12 -m-6 sm:-m-8">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-md"></div>
              <span className="font-extrabold text-xl tracking-tight">
                Skill<span className="text-orange-500">Bridge</span>
              </span>
            </div>
            
            <Link href="/dashboard/profile" className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Profil
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 p-6 bg-gray-50/50">
            <h1 className="text-xl font-bold">Edit Profil</h1>
            <p className="text-sm text-gray-500 mt-1">Perbarui informasi profil Anda agar lebih menarik bagi klien UMKM.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
            
            {/* Avatar Upload */}
            <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6 mb-2">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 flex-shrink-0">
                  <img 
                    src={avatarPreview} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div className="flex flex-col justify-center text-center sm:text-left">
                <h3 className="text-sm font-semibold text-gray-900">Foto Profil</h3>
                <p className="text-xs text-gray-500 mt-1 mb-3">Disarankan rasio 1:1. Maksimal 5MB.</p>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors self-center sm:self-start border border-orange-200"
                >
                  Ubah Foto
                </button>
              </div>
            </div>
            {/* Name & Headline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={initialData.name}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="headline" className="text-sm font-semibold text-gray-700">Headline Pekerjaan</label>
                <input
                  type="text"
                  id="headline"
                  name="headline"
                  defaultValue={initialData.headline}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="Contoh: UI/UX Designer"
                  required
                />
              </div>
            </div>

            {/* Location & Education */}
            <div className="flex flex-col gap-2">
              <label htmlFor="location" className="text-sm font-semibold text-gray-700">Lokasi / Alamat</label>
              <input
                type="text"
                id="location"
                name="location"
                defaultValue={initialData.location}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="tingkat_pendidikan" className="text-sm font-semibold text-gray-700">Tingkat Pendidikan</label>
                <select
                  id="tingkat_pendidikan"
                  name="tingkat_pendidikan"
                  defaultValue={initialData.tingkat_pendidikan}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
                  required
                >
                  <option value="" disabled>Pilih tingkat pendidikan</option>
                  <option value="SMA">SMA</option>
                  <option value="SMK">SMK</option>
                  <option value="D3">D3 (Diploma 3)</option>
                  <option value="D4">D4 (Diploma 4)</option>
                  <option value="S1">S1 (Sarjana)</option>
                  <option value="S2">S2 (Magister)</option>
                  <option value="S3">S3 (Doktor)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="school" className="text-sm font-semibold text-gray-700">Nama Sekolah / Universitas</label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  defaultValue={initialData.school}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="Contoh: Universitas Brawijaya"
                  required
                />
              </div>
            </div>

            {/* About */}
            <div className="flex flex-col gap-2">
              <label htmlFor="about" className="text-sm font-semibold text-gray-700">Tentang Saya / Deskripsi</label>
              <textarea
                id="about"
                name="about"
                rows={4}
                defaultValue={initialData.about}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-y"
                required
              />
              <p className="text-xs text-gray-500">Ceritakan sedikit tentang latar belakang, minat, dan spesialisasi Anda.</p>
            </div>

            {/* Skills */}
            <div className="flex flex-col gap-2">
              <label htmlFor="skills" className="text-sm font-semibold text-gray-700">Keahlian & Tools</label>
              <input
                type="text"
                id="skills"
                name="skills"
                defaultValue={initialData.skills.join(", ")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Pisahkan dengan koma (contoh: React, Figma, UI Design)"
                required
              />
            </div>

            <div className="border-t border-gray-100 pt-6 mt-2 flex justify-end gap-3">
              <Link 
                href="/dashboard/profile" 
                className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </Link>
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-70"
              >
                {isLoading ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
