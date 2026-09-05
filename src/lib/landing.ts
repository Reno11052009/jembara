import "server-only";
import prisma from "./prisma";
import { formatBudget, formatDeadline } from "./dashboard-utils";
import type { LandingProject, StatItem, Talent, Testimonial } from "@/types/landing";

export async function getLandingData() {
  const [students, businesses, completed, average, projects, talents, reviews] = await Promise.all([
    prisma.student.count(), prisma.umkm.count(), prisma.project.count({ where: { status: "COMPLETED" } }), prisma.review.aggregate({ _avg: { rating: true } }),
    prisma.project.findMany({ where: { status: "OPEN", studentId: null, OR: [{ deadline: null }, { deadline: { gt: new Date() } }] }, orderBy: { createdAt: "desc" }, take: 3, select: { id: true, title: true, budget: true, deadline: true, umkm: { select: { nama_usaha: true } }, skillsNeeded: { take: 4, select: { skill: { select: { name: true } } } } } }),
    prisma.student.findMany({
      where: { isPublicProfile: true, available: true },
      orderBy: [{ rating: "desc" }, { total_project: "desc" }],
      take: 3,
      select: {
        id: true,
        school: true,
        jurusan: true,
        rating: true,
        total_project: true,
        user: { select: { name: true } },
        skills: { take: 4, select: { skill: { select: { name: true } } } },
        _count: { select: { reviews: true } },
      },
    }),
    prisma.review.findMany({ where: { comment: { not: null } }, orderBy: { createdAt: "desc" }, take: 4, select: { comment: true, umkm: { select: { nama_usaha: true, user: { select: { name: true } } } }, project: { select: { title: true } } } }),
  ]);
  return {
    stats: [{ value: students.toLocaleString("id-ID"), label: "Mahasiswa Terdaftar" }, { value: businesses.toLocaleString("id-ID"), label: "UMKM Bergabung" }, { value: completed.toLocaleString("id-ID"), label: "Project Selesai" }, { value: average._avg.rating?.toFixed(1) ?? "—", label: "Rata-Rata Rating" }] satisfies StatItem[],
    projects: projects.map((project) => ({ id: project.id, clientName: project.umkm.nama_usaha, title: project.title, budgetLabel: formatBudget(project.budget), durationLabel: formatDeadline(project.deadline), tags: project.skillsNeeded.map(({ skill }) => skill.name) })) satisfies LandingProject[],
    talents: talents.map((talent) => ({ id: talent.id, name: talent.user.name || "Talent Jembara", school: talent.school || "Institusi belum diisi", specialty: talent.jurusan || talent.skills[0]?.skill.name || "Talent digital", rating: talent._count.reviews ? talent.rating : 0, completedLabel: `${talent.total_project} Selesai`, skills: talent.skills.map(({ skill }) => skill.name) })) satisfies Talent[],
    testimonials: reviews.flatMap((review) => review.comment ? [{ quote: review.comment, name: review.umkm.user.name || review.umkm.nama_usaha, role: `${review.umkm.nama_usaha} · ${review.project.title}` }] : []) satisfies Testimonial[],
  };
}
