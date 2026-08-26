"use client";

import { useState, type KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Footer from "@/components/landing/Footer";
import Button from "@/components/ui/Button";
import { ownerName, ownerAvatarUrl } from "@/lib/mock-umkm-owner-dashboard";

const categoryOptions = [
  "Creative & Design",
  "Web Development",
  "Mobile Development",
  "Digital Marketing",
  "Content Writing",
];

const fieldClass =
  "w-full rounded-lg bg-canvas px-4 py-3 text-sm font-body text-ink placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-brand/30";

export default function PasangLowonganView() {
  const [skills, setSkills] = useState<string[]>([
    "Adobe Illustrator",
    "Packaging Design",
    "Branding",
  ]);
  const [newSkill, setNewSkill] = useState("");

  function addSkill() {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((current) => [...current, trimmed]);
    }
    setNewSkill("");
  }

  function handleSkillKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addSkill();
    }
  }

  function removeSkill(skill: string) {
    setSkills((current) => current.filter((item) => item !== skill));
  }

  return (
    <>
      <PageHeader
        title="Pasang Lowongan Baru 🛠️"
        subtitle="Publikasikan lowongan proyek baru untuk mulai menerima lamaran dari talenta lokal."
        userName={ownerName}
        avatarUrl={ownerAvatarUrl}
      />

      <div className="rounded-xl border border-hairline bg-card p-6 sm:p-8">
        <h2 className="font-display text-xl font-black text-ink">
          Formulir Informasi Lowongan
        </h2>

        <form className="mt-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="judul-proyek" className="text-base font-bold text-ink">
                Judul Proyek
              </label>
              <input
                id="judul-proyek"
                name="judulProyek"
                type="text"
                placeholder="Contoh: Desain Kemasan Keripik Tempe Organik"
                className={fieldClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="kategori" className="text-base font-bold text-ink">
                Kategori
              </label>
              <div className="relative">
                <select id="kategori" name="kategori" className={`${fieldClass} appearance-none pr-10`}>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="deskripsi" className="text-base font-bold text-ink">
              Deskripsi Proyek
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              rows={4}
              placeholder="Jelaskan kebutuhan proyek Anda secara detail..."
              className={`${fieldClass} resize-y`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="skill-input" className="text-base font-bold text-ink">
              Skill yang Dibutuhkan
            </label>
            <div className={`${fieldClass} flex flex-wrap items-center gap-2 py-2.5`}>
              {skills.map((skill) => (
                <span
                  key={skill}
                  onClick={() => removeSkill(skill)}
                  title="Klik untuk hapus"
                  className="cursor-pointer rounded-full bg-brand-soft px-3 py-1 text-sm font-body font-black text-brand"
                >
                  {skill}
                </span>
              ))}
              <input
                id="skill-input"
                type="text"
                value={newSkill}
                onChange={(event) => setNewSkill(event.target.value)}
                onKeyDown={handleSkillKeyDown}
                onBlur={addSkill}
                placeholder="+ Tambah Skill..."
                className="flex-1 min-w-32 bg-transparent text-sm font-body text-ink placeholder:text-ink-muted outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="budget" className="text-base font-bold text-ink">
                Budget (Rp)
              </label>
              <input
                id="budget"
                name="budget"
                type="text"
                placeholder="Contoh: 1.500.000 - 3.000.000"
                className={fieldClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="durasi" className="text-base font-bold text-ink">
                Durasi &amp; Tipe Kerja
              </label>
              <input
                id="durasi"
                name="durasi"
                type="text"
                placeholder="Contoh: 14 Hari · Remote"
                className={fieldClass}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 font-display font-black">
            <Button type="button" variant="outline">
              Simpan Draft
            </Button>
            <Button type="submit" variant="primary">
              Publikasikan
            </Button>
          </div>
        </form>
      </div>

      <div className="-mx-6 mt-10 sm:-mx-8">
        <Footer />
      </div>
    </>
  );
}
