"use client";

import { useState, useRef } from "react";
import { Camera, Globe, Pencil, X } from "lucide-react";
import Swal from "sweetalert2";
import { updateProfileAction } from "@/app/actions/profile";
import { useRouter } from "next/navigation";
import { FaBehance, FaGithub, FaLinkedin } from "react-icons/fa"; // Behance, Github, Linkedin from react-icons
import Image from "next/image";
import type { ProfileData } from "@/lib/profile";

export default function ProfileSettings({ initialData }: { initialData: ProfileData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(initialData.avatarUrl);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>(initialData.skills || []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);

    const img = new window.Image();
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
      
      const webpDataUrl = canvas.toDataURL("image/webp", 0.75);
      setAvatarBase64(webpDataUrl);
    };
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddSkill = async () => {
    const { value: newSkill } = await Swal.fire({
      title: 'Tambah Skill',
      input: 'text',
      inputPlaceholder: 'Contoh: Next.js, Figma, dsb...',
      showCancelButton: true,
      confirmButtonColor: '#FF6B35',
      confirmButtonText: 'Tambah',
      cancelButtonText: 'Batal',
      inputValidator: (value) => {
        if (!value) {
          return 'Skill tidak boleh kosong!';
        }
        if (skills.includes(value.trim())) {
          return 'Skill sudah ada!';
        }
      }
    });

    if (newSkill) {
      setSkills([...skills, newSkill.trim()]);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("skills", skills.join(","));
    if (avatarBase64) {
      formData.append("avatarBase64", avatarBase64);
    }

    try {
      const result = await updateProfileAction(formData);
      if (result?.error) throw new Error(result.error);
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Profil Anda telah diperbarui.',
        confirmButtonColor: '#FF6B35'
      }).then(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err instanceof Error ? err.message : 'Gagal menyimpan perubahan.',
        confirmButtonColor: '#FF6B35'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header Avatar Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5">
        <div 
          className="relative group cursor-pointer w-[72px] h-[72px] shrink-0" 
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-full h-full rounded-full overflow-hidden border border-gray-200">
            <img 
              src={avatarPreview} 
              alt={initialData.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-none mb-2.5">
            {initialData.name.split(" ")[0]}
          </h2>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full border border-gray-900 px-4 py-1.5 text-xs font-semibold text-gray-900 hover:bg-gray-900 hover:text-white transition"
          >
            Ganti Foto
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
        {/* Informasi Pribadi Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-7 shadow-sm flex flex-col gap-5">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Informasi Pribadi</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                defaultValue={initialData.name}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-[#FF6B35] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Email</label>
              <input
                type="email"
                defaultValue={initialData.email || ""}
                placeholder="contoh@email.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-[#FF6B35] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Nomor Telepon</label>
              <input
                type="text"
                name="phone"
                defaultValue={initialData.phone || ""}
                placeholder="+62 812-3456-7890"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-[#FF6B35] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Universitas</label>
              <input
                type="text"
                name="school"
                defaultValue={initialData.school}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-[#FF6B35] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Jurusan</label>
              <input
                type="text"
                name="headline"
                defaultValue={initialData.headline}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-[#FF6B35] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Semester</label>
                <input
                  type="number"
                  name="semester"
                  defaultValue={initialData.semester ?? ""}
                  min={1}
                  max={20}
                  step={1}
                  placeholder="Contoh: 6"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-[#FF6B35] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Lokasi</label>
                <input
                  type="text"
                  name="location"
                  defaultValue={initialData.location}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-[#FF6B35] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Bio</label>
            <textarea
              name="about"
              rows={2}
              defaultValue={initialData.about}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-[#FF6B35] focus:outline-none focus:ring-1 focus:ring-[#FF6B35] resize-y min-h-[46px]"
            />
          </div>

          <div className="flex justify-end mt-2">
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#FF6B35] hover:bg-[#e85a26] text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-sm transition disabled:opacity-70"
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>

        {/* Skill & Keahlian Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <h3 className="text-lg font-bold text-gray-900">Skill & Keahlian</h3>
            <button 
              type="button"
              onClick={handleAddSkill}
              className="rounded-full border border-gray-900 px-4 py-1.5 text-xs font-semibold text-gray-900 hover:bg-gray-900 hover:text-white transition whitespace-nowrap"
            >
              + Tambah Skill
            </button>
          </div>
          <div className="flex flex-wrap gap-2.5 mt-2">
            {skills.map((skill) => (
              <div 
                key={skill}
                className="bg-[#F4F4F5] hover:bg-gray-200/80 rounded-full pl-4 pr-1.5 py-1.5 text-xs font-semibold text-gray-700 flex items-center gap-2 border border-gray-200/50 transition cursor-default"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="w-4 h-4 rounded-full bg-gray-400 text-white flex items-center justify-center hover:bg-red-500 transition-colors ml-1"
                  title={`Hapus ${skill}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {skills.length === 0 && (
              <p className="text-sm text-gray-500 italic">Belum ada skill yang ditambahkan.</p>
            )}
          </div>
        </div>


        {/* Link Portfolio & Sosial Media Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-7 shadow-sm flex flex-col gap-5">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Link Portfolio & Sosial Media</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {/* Portfolio */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Portfolio URL</label>
              <div className="relative flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:border-[#FF6B35] focus-within:ring-1 focus-within:ring-[#FF6B35]">
                <div className="pl-3.5 pr-2 text-gray-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="portfolioUrl"
                  defaultValue={initialData.portfolioUrl || ""}
                  placeholder="chello.design"
                  className="w-full py-2.5 pr-10 text-sm text-gray-900 bg-transparent focus:outline-none"
                />
                <div className="absolute right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer transition">
                  <Pencil className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* GitHub */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Github</label>
              <div className="relative flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:border-[#FF6B35] focus-within:ring-1 focus-within:ring-[#FF6B35]">
                <div className="pl-3.5 pr-2 text-gray-400">
                  <FaGithub className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="github"
                  defaultValue={initialData.github || ""}
                  placeholder="github.com/chello"
                  className="w-full py-2.5 pr-10 text-sm text-gray-900 bg-transparent focus:outline-none"
                />
                <div className="absolute right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer transition">
                  <Pencil className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Linkedin</label>
              <div className="relative flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:border-[#FF6B35] focus-within:ring-1 focus-within:ring-[#FF6B35]">
                <div className="pl-3.5 pr-2 text-gray-400">
                  <FaLinkedin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="linkedin"
                  defaultValue={initialData.linkedin || ""}
                  placeholder="linkedin.com/in/chello"
                  className="w-full py-2.5 pr-10 text-sm text-gray-900 bg-transparent focus:outline-none"
                />
                <div className="absolute right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer transition">
                  <Pencil className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Behance */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Behance</label>
              <div className="relative flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:border-[#FF6B35] focus-within:ring-1 focus-within:ring-[#FF6B35]">
                <div className="pl-3.5 pr-2 text-gray-400">
                  <FaBehance className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="behance"
                  defaultValue={initialData.behance || ""}
                  placeholder="behance.net/chello"
                  className="w-full py-2.5 pr-10 text-sm text-gray-900 bg-transparent focus:outline-none"
                />
                <div className="absolute right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer transition">
                  <Pencil className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-orange-50 font-bold text-sm px-8 py-2 rounded-full transition disabled:opacity-70"
            >
              {isLoading ? "..." : "Simpan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
