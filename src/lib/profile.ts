import { cache } from "react";
import { verifySession } from "./session";
import prisma from "./prisma";

// Gunakan React cache untuk menghindari pemanggilan berulang dalam satu request cycle
export const getCachedProfileData = cache(async () => {
  const session = await verifySession();
  const name = session?.name;
  
  // Coba ambil data dari database jika userId valid
  if (session?.userId && session.userId !== "mock-user-id") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
          student: {
            include: {
              skills: {
                include: { skill: true }
              }
            }
          },
          umkm: true,
        }
      });

      if (user) {
        const isStudent = user.role === "STUDENT" && user.student;
        const profileData = isStudent ? user.student : user.umkm;
        
        // Ambil keahlian (skills)
        let skills: string[] = [];
        if (isStudent && user.student?.skills) {
          skills = user.student.skills.map(s => s.skill.name);
        }

        // Susun data sesuai struktur ProfileCard
        return {
          name: user.name || name || "User",
          role: user.role,
          headline: isStudent ? (user.student?.jurusan || "Pelajar / Mahasiswa") : (user.umkm?.kategori_usaha || "Pemilik UMKM"),
          location: user.location || "Belum diatur",
          education: isStudent ? `${user.student?.tingkat_pendidikan || ""} ${user.student?.school || ""}`.trim() || "Pendidikan belum diatur" : "",
          tingkat_pendidikan: isStudent ? user.student?.tingkat_pendidikan || "" : "",
          school: isStudent ? user.student?.school || "" : "",
          about: user.bio || `Halo, saya ${user.name || name}.`,
          skills: skills.length > 0 ? skills : ["Figma", "UI/UX Design", "Wireframing", "React.js", "Tailwind CSS", "JavaScript"],
          avatarUrl: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || name || "User")}&background=random`,
          email: user.email,
          phone: user.no_telepon || "",
          portfolioUrl: user.portfolioUrl || "",
          github: user.github || "",
          linkedin: user.linkedin || "",
          behance: user.behance || "",
        };
      }
    } catch (error) {
      console.error("Gagal mengambil data profil dari DB:", error);
    }
  }

  // Fallback data jika belum terhubung database atau menggunakan mock-user-id
  return {
    name: name || "User",
    role: session?.role || "STUDENT",
    headline: "UI/UX Designer & Frontend Dev",
    location: "Surabaya, Indonesia",
    education: "SMK PGRI 03 Malang",
    tingkat_pendidikan: "SMK",
    school: "PGRI 03 Malang",
    about: `Halo, saya ${name}. Saya fokus mendalami dunia UI/UX Design dan Frontend Web Development. Senang berkolaborasi dengan UMKM dalam membangun solusi produk digital yang rapi, cepat, dan fungsional.`,
    skills: ["Figma", "UI/UX Design", "Wireframing", "React.js", "Tailwind CSS", "JavaScript", "User Research"],
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=random`,
    email: "chello@email.com",
    phone: "+62 812-3456-7890",
    portfolioUrl: "chello.design",
    github: "github.com/chello",
    linkedin: "linkedin.com/in/chello",
    behance: "behance.net/chello",
  };
});
// HMR trigger 2
