import "server-only";

import { calculateSkillMatch, formatBudget, formatDeadline } from "@/lib/dashboard-utils";
import prisma from "@/lib/prisma";

export type ChatbotRecommendationIntent = "PROJECTS" | "TALENTS";

export type ChatbotRecommendationLink = {
  label: string;
  href: string;
};

type RecommendationResult =
  | { handled: false }
  | {
      handled: true;
      message: string;
      links?: ChatbotRecommendationLink[];
    };

type RecommendationInput = {
  userId: string;
  role: string;
  latestUserMessage: string;
};

const DISCOVERY_PATTERN =
  /\b(rekomendasi(?:kan)?|saran(?:kan)?|cari(?:kan)?|pilih(?:kan)?|cocok|terbaik|matching)\b/i;
const PROJECT_PATTERN = /\b(project|proyek|lowongan|pekerjaan)\b/i;
const TALENT_PATTERN = /\b(talent|talenta|kandidat|pelajar|mahasiswa|siswa)\b/i;

function safeText(value: string | null | undefined, maxLength = 120) {
  return (value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("id-ID");
}

function joinSkills(skills: readonly string[]) {
  return skills.map((skill) => safeText(skill, 50)).filter(Boolean).join(", ");
}

export function detectChatbotRecommendationIntent(
  message: string,
  role?: string,
): ChatbotRecommendationIntent | null {
  if (!DISCOVERY_PATTERN.test(message)) return null;

  const asksForProjects = PROJECT_PATTERN.test(message);
  const asksForTalents = TALENT_PATTERN.test(message);

  if (asksForProjects && asksForTalents) {
    return role === "UMKM" ? "TALENTS" : "PROJECTS";
  }
  if (asksForTalents) return "TALENTS";
  if (asksForProjects) return "PROJECTS";
  return null;
}

async function recommendProjects(userId: string): Promise<RecommendationResult> {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: {
      id: true,
      skills: {
        select: { skill: { select: { name: true } } },
      },
    },
  });

  if (!student) {
    return {
      handled: true,
      message: "Profil pelajar belum tersedia. Lengkapi profil terlebih dahulu agar Jelita dapat mencarikan project yang relevan.",
    };
  }

  const studentSkills = student.skills.map(({ skill }) => skill.name);
  if (studentSkills.length === 0) {
    return {
      handled: true,
      message: "Tambahkan skill pada profil terlebih dahulu. Rekomendasi project dihitung dari kecocokan skill yang tersimpan di profilmu.",
    };
  }

  const now = new Date();
  const projects = await prisma.project.findMany({
    where: {
      status: "OPEN",
      studentId: null,
      OR: [{ deadline: null }, { deadline: { gte: now } }],
      proposals: { none: { studentId: student.id } },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      title: true,
      budget: true,
      deadline: true,
      workMode: true,
      location: true,
      createdAt: true,
      umkm: { select: { nama_usaha: true } },
      skillsNeeded: {
        select: { skill: { select: { name: true } } },
      },
    },
  });

  const normalizedStudentSkills = new Set(studentSkills.map(normalize));
  const ranked = projects
    .map((project) => {
      const requiredSkills = project.skillsNeeded.map(({ skill }) => skill.name);
      const matchedSkills = requiredSkills.filter((skill) =>
        normalizedStudentSkills.has(normalize(skill)),
      );

      return {
        ...project,
        requiredSkills,
        matchedSkills,
        score: calculateSkillMatch(studentSkills, requiredSkills),
      };
    })
    .filter((project) => project.score > 0)
    .sort(
      (first, second) =>
        second.score - first.score ||
        second.createdAt.getTime() - first.createdAt.getTime(),
    )
    .slice(0, 5);

  if (ranked.length === 0) {
    return {
      handled: true,
      message:
        "Belum ada project terbuka yang cocok dengan skill profilmu saat ini. Kamu tetap dapat melihat semua lowongan yang tersedia.",
      links: [
        {
          label: "Lihat semua project",
          href: "/dashboard/find-projects",
        },
      ],
    };
  }

  const rows = ranked.map((project, index) => {
    const workLocation =
      project.workMode === "REMOTE"
        ? "Remote"
        : `${safeText(project.workMode, 20)}${project.location ? ` · ${safeText(project.location, 80)}` : ""}`;
    return [
      `${index + 1}. ${safeText(project.title)} — ${project.score}% kecocokan skill`,
      `   UMKM: ${safeText(project.umkm.nama_usaha)} · ${formatBudget(project.budget)} · ${formatDeadline(project.deadline, now)} · ${workLocation}`,
      `   Cocok: ${joinSkills(project.matchedSkills)}`,
    ].join("\n");
  });

  return {
    handled: true,
    message: `Berikut rekomendasi project berdasarkan kecocokan skill profilmu saat ini:\n\n${rows.join("\n\n")}\n\nSkor ini hanya menunjukkan kecocokan skill, bukan jaminan diterima.`,
    links: ranked.map((project) => ({
      label: `Lihat project ${safeText(project.title, 80)}`,
      href: `/dashboard/find-projects/${encodeURIComponent(project.id)}`,
    })),
  };
}

async function recommendTalents(
  userId: string,
  latestUserMessage: string,
): Promise<RecommendationResult> {
  const business = await prisma.umkm.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!business) {
    return {
      handled: true,
      message: "Profil UMKM belum tersedia. Lengkapi profil UMKM terlebih dahulu agar Jelita dapat mencarikan talent.",
    };
  }

  // Kepemilikan dibatasi di query: chatbot hanya boleh memilih project milik
  // UMKM yang sedang login, bukan ID project yang dikirim oleh klien.
  const projects = await prisma.project.findMany({
    where: {
      umkmId: business.id,
      status: { in: ["OPEN", "PROPOSAL"] },
      studentId: null,
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
    select: {
      id: true,
      title: true,
      updatedAt: true,
      skillsNeeded: {
        select: { skill: { select: { name: true } } },
      },
    },
  });

  if (projects.length === 0) {
    return {
      handled: true,
      message: "Belum ada project OPEN atau PROPOSAL milik UMKM Anda. Buat dan publikasikan project terlebih dahulu sebelum mencari talent.",
    };
  }

  const normalizedMessage = normalize(latestUserMessage);
  const mentionedProject = [...projects]
    .sort((first, second) => second.title.length - first.title.length)
    .find((project) => normalizedMessage.includes(normalize(project.title)));
  const selectedProject = mentionedProject ?? projects[0];
  const requiredSkills = selectedProject.skillsNeeded.map(({ skill }) => skill.name);

  if (requiredSkills.length === 0) {
    return {
      handled: true,
      message: `Project “${safeText(selectedProject.title)}” belum memiliki skill wajib. Tambahkan skill pada project agar rekomendasi talent dapat dihitung dengan jelas.`,
    };
  }

  const students = await prisma.student.findMany({
    where: { available: true },
    take: 60,
    select: {
      id: true,
      rating: true,
      user: { select: { name: true } },
      skills: {
        select: { skill: { select: { name: true } } },
      },
      _count: {
        select: {
          portfolios: true,
          reviews: true,
          projects: { where: { status: "COMPLETED" } },
        },
      },
    },
  });

  const normalizedRequiredSkills = new Set(requiredSkills.map(normalize));
  const ranked = students
    .map((student) => {
      const studentSkills = student.skills.map(({ skill }) => skill.name);
      const matchedSkills = studentSkills.filter((skill) =>
        normalizedRequiredSkills.has(normalize(skill)),
      );
      return {
        ...student,
        matchedSkills,
        score: calculateSkillMatch(studentSkills, requiredSkills),
      };
    })
    .filter((student) => student.score > 0)
    .sort(
      (first, second) =>
        second.score - first.score ||
        second._count.projects - first._count.projects ||
        (second._count.reviews > 0 ? second.rating : 0) -
          (first._count.reviews > 0 ? first.rating : 0),
    )
    .slice(0, 5);

  if (ranked.length === 0) {
    return {
      handled: true,
      message: `Belum ada talent tersedia yang memiliki skill wajib untuk project “${safeText(selectedProject.title)}”. Gunakan pencarian talent untuk melihat kandidat lainnya.`,
      links: [
        {
          label: "Buka pencarian talent",
          href: `/dashboard/cari-talent?project=${encodeURIComponent(selectedProject.id)}`,
        },
      ],
    };
  }

  const rows = ranked.map((student, index) => {
    const rating =
      student._count.reviews > 0
        ? `${student.rating.toFixed(1)}/5 dari ${student._count.reviews} ulasan`
        : "Belum ada ulasan";
    return [
      `${index + 1}. ${safeText(student.user.name) || "Talent Jembara"} — ${student.score}% kecocokan skill`,
      `   Cocok: ${joinSkills(student.matchedSkills)}`,
      `   Rekam jejak: ${student._count.projects} project selesai · ${student._count.portfolios} portfolio · ${rating}`,
    ].join("\n");
  });

  return {
    handled: true,
    message: `Rekomendasi talent untuk project “${safeText(selectedProject.title)}” berdasarkan kecocokan skill saat ini:\n\n${rows.join("\n\n")}\n\nTinjau profil dan proposal sebelum memilih talent.`,
    links: ranked.map((student) => ({
      label: `Lihat profil ${safeText(student.user.name, 60) || "Talent Jembara"}`,
      href: `/dashboard/cari-talent?project=${encodeURIComponent(selectedProject.id)}#talent-${encodeURIComponent(student.id)}`,
    })),
  };
}

export async function getSafeChatbotRecommendation({
  userId,
  role,
  latestUserMessage,
}: RecommendationInput): Promise<RecommendationResult> {
  const intent = detectChatbotRecommendationIntent(latestUserMessage, role);
  if (!intent) return { handled: false };

  if (intent === "PROJECTS") {
    if (role !== "STUDENT") {
      return {
        handled: true,
        message: "Rekomendasi project saat ini hanya tersedia untuk akun pelajar/talent.",
      };
    }
    return recommendProjects(userId);
  }

  if (role !== "UMKM") {
    return {
      handled: true,
      message: "Rekomendasi talent saat ini hanya tersedia untuk akun UMKM.",
    };
  }
  return recommendTalents(userId, latestUserMessage);
}
