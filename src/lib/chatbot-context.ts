import "server-only";

import prisma from "./prisma";
import {
  calculateSkillMatch,
  formatBudget,
  formatDeadline,
} from "./dashboard-utils";

const ACTIVE_PROJECT_STATUSES = ["IN_PROGRESS", "REVIEW"];

// Batas jumlah item yang di-inject ke prompt supaya token per-request tetap
// terkendali — bukan angka ajaib, sesuaikan kalau kerasa kurang/berlebih.
const MAX_RECOMMENDATIONS = 3;
const MAX_OPEN_LOWONGAN_FOR_TALENT_MATCH = 2;
const TALENT_CANDIDATE_POOL_SIZE = 40;

function bulletList(lines: string[]) {
  return lines.map((line) => `- ${line}`).join("\n");
}

/**
 * Konteks untuk role STUDENT: profil (untuk dasar rekomendasi), status
 * proposal, proyek aktif, dan rekomendasi proyek yang cocok berdasarkan
 * skill yang diisi di profil (reuse logic yang sama dengan dashboard).
 */
async function buildStudentContext(userId: string): Promise<string> {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: {
      id: true,
      school: true,
      tingkat_pendidikan: true,
      jurusan: true,
      semester: true,
      skills: { select: { skill: { select: { name: true } } } },
    },
  });

  if (!student) {
    return "Profil pelajar pengguna ini belum dilengkapi. Kalau pengguna minta rekomendasi proyek, sarankan dia melengkapi profil (sekolah/kampus, jurusan, skill) dulu di halaman profil.";
  }

  const studentSkills = student.skills.map(({ skill }) => skill.name);

  const [proposalStatusCounts, activeProjects, recommendationCandidates] =
    await Promise.all([
      prisma.proposal.groupBy({
        by: ["status"],
        where: { studentId: student.id },
        _count: { _all: true },
      }),
      prisma.project.findMany({
        where: { studentId: student.id, status: { in: ACTIVE_PROJECT_STATUSES } },
        select: { title: true, deadline: true },
        orderBy: { updatedAt: "desc" },
        take: 3,
      }),
      studentSkills.length > 0
        ? prisma.project.findMany({
            where: {
              status: "OPEN",
              studentId: null,
              proposals: { none: { studentId: student.id } },
            },
            orderBy: { createdAt: "desc" },
            take: 20,
            select: {
              title: true,
              budget: true,
              deadline: true,
              umkm: { select: { nama_usaha: true } },
              skillsNeeded: { select: { skill: { select: { name: true } } } },
            },
          })
        : Promise.resolve([]),
    ]);

  const proposalCountMap = Object.fromEntries(
    proposalStatusCounts.map((row) => [row.status, row._count._all]),
  );
  const totalProposals = proposalStatusCounts.reduce(
    (sum, row) => sum + row._count._all,
    0,
  );

  const recommendations = recommendationCandidates
    .map((project) => {
      const requiredSkills = project.skillsNeeded.map(({ skill }) => skill.name);
      return {
        title: project.title,
        companyName: project.umkm.nama_usaha,
        matchPercent: calculateSkillMatch(studentSkills, requiredSkills),
        budgetLabel: formatBudget(project.budget),
        deadlineLabel: formatDeadline(project.deadline),
        tags: requiredSkills,
      };
    })
    .filter((project) => project.matchPercent > 0)
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, MAX_RECOMMENDATIONS);

  const profileLine = `Profil pengguna: ${
    [
      student.school,
      student.jurusan,
      student.tingkat_pendidikan,
      student.semester ? `semester ${student.semester}` : null,
    ]
      .filter(Boolean)
      .join(", ") || "belum lengkap"
  }. Skill yang diisi di profil: ${
    studentSkills.join(", ") || "belum ada skill diisi"
  }.`;

  const proposalLine = `Proposal terkirim: ${totalProposals} total (Pending: ${
    proposalCountMap.PENDING ?? 0
  }, Diterima: ${proposalCountMap.ACCEPTED ?? 0}, Ditolak: ${
    proposalCountMap.REJECTED ?? 0
  }).`;

  const activeLine = activeProjects.length
    ? `Proyek aktif yang sedang dikerjakan: ${activeProjects
        .map((p) => `"${p.title}" (deadline: ${formatDeadline(p.deadline)})`)
        .join("; ")}.`
    : "Belum ada proyek aktif yang sedang dikerjakan.";

  const recommendationLine = recommendations.length
    ? `Rekomendasi proyek yang cocok berdasarkan profil & skill pengguna (pakai ini kalau pengguna minta saran proyek — JANGAN sebut proyek di luar daftar ini):\n${bulletList(
        recommendations.map(
          (r) =>
            `"${r.title}" dari ${r.companyName} — kecocokan skill ${r.matchPercent}%, budget ${r.budgetLabel}, deadline ${r.deadlineLabel}, skill dibutuhkan: ${
              r.tags.join(", ") || "-"
            }`,
        ),
      )}`
    : "Belum ada proyek terbuka yang cocok dengan skill pengguna saat ini.";

  return [profileLine, proposalLine, activeLine, recommendationLine].join("\n");
}

/**
 * Konteks untuk role UMKM: ringkasan bisnis, lowongan aktif, pelamar belum
 * direspon, proyek berjalan, dan rekomendasi talent yang cocok untuk
 * lowongan aktif (ranking naif via calculateSkillMatch, bukan search index).
 */
async function buildUmkmContext(userId: string): Promise<string> {
  const umkm = await prisma.umkm.findUnique({
    where: { userId },
    select: { id: true, nama_usaha: true, kategori_usaha: true },
  });

  if (!umkm) {
    return "Profil bisnis UMKM pengguna ini belum dilengkapi. Kalau pengguna minta rekomendasi talent atau mau pasang lowongan, sarankan dia melengkapi profil bisnis dulu.";
  }

  const [openProjects, pendingProposalCount, activeProjects] = await Promise.all([
    prisma.project.findMany({
      where: { umkmId: umkm.id, status: "OPEN" },
      orderBy: { createdAt: "desc" },
      take: MAX_OPEN_LOWONGAN_FOR_TALENT_MATCH,
      select: {
        id: true,
        title: true,
        skillsNeeded: { select: { skill: { select: { name: true } } } },
      },
    }),
    prisma.proposal.count({
      where: { project: { umkmId: umkm.id }, status: "PENDING" },
    }),
    prisma.project.findMany({
      where: { umkmId: umkm.id, status: { in: ACTIVE_PROJECT_STATUSES } },
      select: {
        title: true,
        student: { select: { user: { select: { name: true } } } },
      },
      orderBy: { updatedAt: "desc" },
      take: 3,
    }),
  ]);

  const businessLine = `Bisnis: ${umkm.nama_usaha}${
    umkm.kategori_usaha ? ` (${umkm.kategori_usaha})` : ""
  }.`;
  const lowonganLine = `Lowongan aktif: ${openProjects.length}. Pelamar baru yang belum direspon: ${pendingProposalCount}.`;
  const activeLine = activeProjects.length
    ? `Proyek berjalan: ${activeProjects
        .map(
          (p) =>
            `"${p.title}" bersama ${p.student?.user.name || "talent belum ditentukan"}`,
        )
        .join("; ")}.`
    : "Belum ada proyek yang sedang berjalan.";

  let talentRecommendationLine =
    "Belum ada lowongan aktif untuk dicarikan talent yang cocok.";

  if (openProjects.length > 0) {
    const talentBlocks = (
      await Promise.all(
        openProjects.map(async (project) => {
          const requiredSkills = project.skillsNeeded.map(({ skill }) => skill.name);
          if (requiredSkills.length === 0) return null;

          const candidates = await prisma.student.findMany({
            where: {
              available: true,
              proposals: { none: { projectId: project.id } },
            },
            select: {
              jurusan: true,
              rating: true,
              user: { select: { name: true } },
              skills: { select: { skill: { select: { name: true } } } },
            },
            take: TALENT_CANDIDATE_POOL_SIZE,
          });

          const ranked = candidates
            .map((c) => ({
              name: c.user.name || "Talent Jembara",
              jurusan: c.jurusan,
              rating: c.rating,
              matchPercent: calculateSkillMatch(
                c.skills.map(({ skill }) => skill.name),
                requiredSkills,
              ),
            }))
            .filter((c) => c.matchPercent > 0)
            .sort((a, b) => b.matchPercent - a.matchPercent)
            .slice(0, MAX_RECOMMENDATIONS);

          if (ranked.length === 0) return null;

          return `Untuk lowongan "${project.title}" (butuh skill: ${requiredSkills.join(
            ", ",
          )}):\n${bulletList(
            ranked.map(
              (r) =>
                `${r.name}${r.jurusan ? ` (${r.jurusan})` : ""} — kecocokan skill ${
                  r.matchPercent
                }%, rating ${r.rating.toFixed(1)}★`,
            ),
          )}`;
        }),
      )
    ).filter((block): block is string => block !== null);

    talentRecommendationLine = talentBlocks.length
      ? `Rekomendasi talent yang cocok untuk lowongan aktif (pakai ini kalau pengguna minta saran kandidat — JANGAN sebut nama di luar daftar ini):\n${talentBlocks.join(
          "\n",
        )}`
      : "Belum ada talent yang cocok ditemukan untuk lowongan aktif saat ini.";
  }

  return [businessLine, lowonganLine, activeLine, talentRecommendationLine].join(
    "\n",
  );
}

/**
 * Membangun ringkasan data platform milik pengguna untuk disisipkan ke
 * system prompt chatbot. Selalu fail-open: kalau query gagal, kembalikan
 * string kosong supaya chat tetap bisa jalan tanpa konteks tambahan
 * daripada seluruh chatbot ikut down gara-gara satu query error.
 */
export async function getChatbotContext(
  userId: string,
  role: string,
): Promise<string> {
  try {
    if (role === "UMKM") return await buildUmkmContext(userId);
    if (role === "STUDENT") return await buildStudentContext(userId);
    return "";
  } catch (error) {
    console.error("Gagal membangun konteks chatbot:", error);
    return "";
  }
}