import "server-only";

import prisma from "./prisma";

function publicUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function getPublicSkillPassport(studentId: string) {
  const student = await prisma.student.findFirst({
    where: { id: studentId, isPublicProfile: true },
    select: {
      id: true,
      jurusan: true,
      school: true,
      tingkat_pendidikan: true,
      available: true,
      rating: true,
      total_project: true,
      user: {
        select: {
          name: true,
          avatar: true,
          bio: true,
          location: true,
          portfolioUrl: true,
          github: true,
          linkedin: true,
          behance: true,
        },
      },
      skills: {
        orderBy: [{ isVerified: "desc" }, { createdAt: "asc" }],
        select: {
          id: true,
          level: true,
          isVerified: true,
          skill: { select: { name: true, category: true } },
        },
      },
      portfolios: {
        orderBy: { updatedAt: "desc" },
        take: 12,
        select: { id: true, title: true, description: true, link: true, image: true },
      },
      projects: {
        where: { status: "COMPLETED" },
        orderBy: { updatedAt: "desc" },
        take: 8,
        select: { id: true, title: true, updatedAt: true, umkm: { select: { nama_usaha: true } } },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, rating: true, comment: true, project: { select: { title: true } }, umkm: { select: { nama_usaha: true } } },
      },
    },
  });
  if (!student) return null;

  return {
    id: student.id,
    name: student.user.name || "Talent Jembara",
    avatar: student.user.avatar,
    headline: student.jurusan || "Talent Jembara",
    education: [student.tingkat_pendidikan, student.school].filter(Boolean).join(" · "),
    bio: student.user.bio,
    location: student.user.location,
    available: student.available,
    rating: student.reviews.length ? student.rating : null,
    completedProjects: student.total_project,
    links: [
      ["Portofolio", publicUrl(student.user.portfolioUrl)],
      ["GitHub", publicUrl(student.user.github)],
      ["LinkedIn", publicUrl(student.user.linkedin)],
      ["Behance", publicUrl(student.user.behance)],
    ].filter((link): link is [string, string] => Boolean(link[1])),
    skills: student.skills.map((item) => ({ id: item.id, name: item.skill.name, category: item.skill.category, level: item.level, verified: item.isVerified })),
    portfolios: student.portfolios.map((item) => ({ ...item, link: publicUrl(item.link), image: publicUrl(item.image) })),
    projects: student.projects,
    reviews: student.reviews,
  };
}
