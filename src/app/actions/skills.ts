"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";

const uuid = z.string().uuid("Data skill tidak valid.");

export async function setSkillEvidenceAction(studentSkillId: unknown, portfolioId: unknown) {
  const skillId = uuid.safeParse(studentSkillId);
  const evidenceId = z.union([z.literal(""), uuid]).safeParse(portfolioId);
  if (!skillId.success || !evidenceId.success) return { success: false, error: "Bukti skill tidak valid." };
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") return { success: false, error: "Sesi tidak valid." };

  const evidence = evidenceId.data
    ? await prisma.portfolio.findFirst({ where: { id: evidenceId.data, student: { userId: session.userId } }, select: { id: true } })
    : null;
  if (evidenceId.data && !evidence) return { success: false, error: "Portofolio bukan milik Anda." };
  const changed = await prisma.student_skill.updateMany({ where: { id: skillId.data, student: { userId: session.userId } }, data: { evidencePortfolioId: evidence?.id ?? null, isVerified: false, verifiedAt: null, verifiedByUserId: null } });
  if (changed.count !== 1) return { success: false, error: "Skill tidak ditemukan." };
  revalidatePath("/dashboard/portfolio");
  return { success: true };
}

export async function verifyStudentSkillAction(studentSkillId: unknown, verified: unknown) {
  const parsedId = uuid.safeParse(studentSkillId);
  const parsedVerified = z.boolean().safeParse(verified);
  if (!parsedId.success || !parsedVerified.success) return { success: false, error: "Permintaan verifikasi tidak valid." };
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") return { success: false, error: "Sesi tidak valid." };
  const admin = await prisma.user.findFirst({ where: { id: session.userId, role: "ADMIN", admin: { isNot: null } }, select: { id: true } });
  if (!admin) return { success: false, error: "Hanya admin yang dapat memverifikasi skill." };

  try {
    await prisma.$transaction(async (transaction) => {
      const item = await transaction.student_skill.findUnique({
        where: { id: parsedId.data },
        select: { id: true, studentId: true, skillId: true, evidencePortfolio: { select: { studentId: true } }, student: { select: { projects: { where: { status: "COMPLETED", skillsNeeded: { some: {} } }, select: { skillsNeeded: { select: { skillId: true } } } } } } },
      });
      if (!item) throw new Error("SKILL_NOT_FOUND");
      const completedEvidence = item.student.projects.some((project) => project.skillsNeeded.some(({ skillId }) => skillId === item.skillId));
      const portfolioEvidence = item.evidencePortfolio?.studentId === item.studentId;
      if (parsedVerified.data && !portfolioEvidence && !completedEvidence) throw new Error("EVIDENCE_REQUIRED");
      await transaction.student_skill.update({ where: { id: item.id }, data: { isVerified: parsedVerified.data, verifiedAt: parsedVerified.data ? new Date() : null, verifiedByUserId: parsedVerified.data ? admin.id : null } });
      await transaction.audit_log.create({ data: { actorUserId: admin.id, action: parsedVerified.data ? "STUDENT_SKILL_VERIFIED" : "STUDENT_SKILL_UNVERIFIED", entityType: "student_skill", entityId: item.id } });
    });
    revalidatePath("/dashboard/verifikasi-skill");
    revalidatePath("/dashboard/portfolio");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "EVIDENCE_REQUIRED") return { success: false, error: "Skill memerlukan portofolio bukti atau project selesai yang relevan." };
    return { success: false, error: "Verifikasi skill gagal." };
  }
}
