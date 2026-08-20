"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: FormData) {
  const session = await verifySession();
  if (!session || !session.userId || session.userId === "mock-user-id") {
    throw new Error("Unauthorized");
  }

  const authenticatedUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  });
  if (!authenticatedUser || !["STUDENT", "UMKM"].includes(authenticatedUser.role)) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const headline = formData.get("headline") as string;
  const location = formData.get("location") as string;
  const tingkat_pendidikan = formData.get("tingkat_pendidikan") as string;
  const school = formData.get("school") as string;
  const about = formData.get("about") as string;
  const phone = formData.get("phone") as string;
  const portfolioUrl = formData.get("portfolioUrl") as string;
  const github = formData.get("github") as string;
  const linkedin = formData.get("linkedin") as string;
  const behance = formData.get("behance") as string;
  // skills dipisahkan dengan koma
  const skillsString = formData.get("skills") as string;
  const skillsArray = skillsString ? skillsString.split(",").map(s => s.trim()).filter(Boolean) : [];

  const avatarBase64 = formData.get("avatarBase64") as string;

  try {
    // 1. Update User table
    const updateData = {
      name,
      location,
      bio: about,
      no_telepon: phone || null,
      portfolioUrl: portfolioUrl || null,
      github: github || null,
      linkedin: linkedin || null,
      behance: behance || null,
      ...(avatarBase64 ? { avatar: avatarBase64 } : {}),
    };

    await prisma.user.update({
      where: { id: session.userId },
      data: updateData
    });

    // 2. Update Student / UMKM specific tables
    if (authenticatedUser.role === "STUDENT") {
      // Perbarui jurusan & sekolah di model student
      const student = await prisma.student.upsert({
        where: { userId: session.userId },
        update: {
          jurusan: headline,
          school: school,
          tingkat_pendidikan: tingkat_pendidikan,
        },
        create: {
          userId: session.userId,
          jurusan: headline,
          school: school,
          tingkat_pendidikan: tingkat_pendidikan,
        }
      });

      // Update skills
      // Hapus yang lama dulu (opsi sederhana)
      await prisma.student_skill.deleteMany({
        where: { studentId: student.id }
      });

      // Masukkan yang baru
      for (const skillName of skillsArray) {
        // Cari atau buat skill master
        let skill = await prisma.skill.findUnique({ where: { name: skillName } });
        if (!skill) {
          skill = await prisma.skill.create({ data: { name: skillName } });
        }
        // Hubungkan ke student
        await prisma.student_skill.create({
          data: {
            studentId: student.id,
            skillId: skill.id
          }
        });
      }

    } else if (authenticatedUser.role === "UMKM") {
      await prisma.umkm.upsert({
        where: { userId: session.userId },
        update: {
          kategori_usaha: headline,
          // education tidak terlalu relevan untuk umkm, tapi bisa kita skip
        },
        create: {
          userId: session.userId,
          nama_usaha: name, // fallback
          kategori_usaha: headline,
        }
      });
    }

  } catch (error) {
    console.error("Failed to update profile:", error);
    return { error: "Gagal memperbarui profil" };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/settings");
  return { success: true };
}
