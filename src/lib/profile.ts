import { cache } from "react";
import prisma from "./prisma";
import { verifySession } from "./session";

const createAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

export const getCachedProfileData = cache(async () => {
  const session = await verifySession();
  const sessionName = session?.name || "Pengguna";

  if (session?.userId && session.userId !== "mock-user-id") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          name: true,
          email: true,
          no_telepon: true,
          avatar: true,
          bio: true,
          location: true,
          role: true,
          portfolioUrl: true,
          github: true,
          linkedin: true,
          behance: true,
          student: {
            select: {
              school: true,
              tingkat_pendidikan: true,
              jurusan: true,
              semester: true,
              available: true,
              rating: true,
              total_project: true,
              skills: {
                select: {
                  skill: { select: { name: true } },
                },
              },
              portfolios: {
                orderBy: { updatedAt: "desc" },
                take: 4,
                select: {
                  id: true,
                  title: true,
                  description: true,
                  link: true,
                  image: true,
                },
              },
              reviews: {
                orderBy: { createdAt: "desc" },
                take: 5,
                select: {
                  id: true,
                  rating: true,
                  comment: true,
                  project: { select: { title: true } },
                  umkm: { select: { nama_usaha: true } },
                },
              },
              _count: { select: { reviews: true } },
            },
          },
          umkm: {
            select: {
              nama_usaha: true,
              kategori_usaha: true,
              website: true,
              alamat_detail: true,
              provinsi_kode: true,
              kabupaten_kode: true,
              kecamatan_kode: true,
              kelurahan_kode: true,
            },
          },
        },
      });

      if (user) {
        const student = user.role === "STUDENT" ? user.student : null;
        const displayName = user.name || user.umkm?.nama_usaha || sessionName;
        const education = student
          ? [student.tingkat_pendidikan, student.school].filter(Boolean).join(" ")
          : "";

        return {
          name: displayName,
          role: user.role,
          headline: student?.jurusan || user.umkm?.kategori_usaha || "Profil belum dilengkapi",
          location: user.location || "Lokasi belum diatur",
          education: education || (student ? "Pendidikan belum diatur" : ""),
          tingkat_pendidikan: student?.tingkat_pendidikan || "",
          school: student?.school || "",
          semester: student?.semester ?? null,
          businessName: user.umkm?.nama_usaha || "",
          businessCategory: user.umkm?.kategori_usaha || "",
          businessWebsite: user.umkm?.website || "",
          businessAddressDetail: user.umkm?.alamat_detail || "",
          provinceCode: user.umkm?.provinsi_kode || "",
          regencyCode: user.umkm?.kabupaten_kode || "",
          districtCode: user.umkm?.kecamatan_kode || "",
          villageCode: user.umkm?.kelurahan_kode || "",
          about: user.bio || "Deskripsi profil belum diisi.",
          skills: student?.skills.map(({ skill }) => skill.name) || [],
          avatarUrl: user.avatar || createAvatarUrl(displayName),
          email: user.email,
          phone: user.no_telepon || "",
          portfolioUrl: user.portfolioUrl || "",
          github: user.github || "",
          linkedin: user.linkedin || "",
          behance: user.behance || "",
          available: student?.available || false,
          rating: student?.rating || 0,
          reviewCount: student?._count.reviews || 0,
          totalProject: student?.total_project || 0,
          portfolios: student?.portfolios || [],
          reviews: student?.reviews.map((review) => ({
            id: review.id,
            rating: review.rating,
            comment: review.comment,
            projectTitle: review.project.title,
            reviewerName: review.umkm.nama_usaha,
          })) || [],
        };
      }
    } catch (error) {
      console.error("Gagal mengambil data profil dari database:", error);
    }
  }

  return {
    name: sessionName,
    role: session?.role || "STUDENT",
    headline: "Profil belum dilengkapi",
    location: "Lokasi belum diatur",
    education: "Pendidikan belum diatur",
    tingkat_pendidikan: "",
    school: "",
    semester: null as number | null,
    businessName: "",
    businessCategory: "",
    businessWebsite: "",
    businessAddressDetail: "",
    provinceCode: "",
    regencyCode: "",
    districtCode: "",
    villageCode: "",
    about: "Deskripsi profil belum diisi.",
    skills: [] as string[],
    avatarUrl: createAvatarUrl(sessionName),
    email: "",
    phone: "",
    portfolioUrl: "",
    github: "",
    linkedin: "",
    behance: "",
    available: false,
    rating: 0,
    reviewCount: 0,
    totalProject: 0,
    portfolios: [] as Array<{
      id: string;
      title: string;
      description: string | null;
      link: string | null;
      image: string | null;
    }>,
    reviews: [] as Array<{
      id: string;
      rating: number;
      comment: string | null;
      projectTitle: string;
      reviewerName: string;
    }>,
  };
});

export type ProfileData = Awaited<ReturnType<typeof getCachedProfileData>>;
