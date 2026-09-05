import "server-only";

import { redirect } from "next/navigation";
import { requireAdminSession } from "./auth-guard";
import prisma from "./prisma";

export async function getSkillVerificationData() {
  const session = await requireAdminSession();
  const viewer = await prisma.user.findFirst({ where: { id: session.userId, role: "ADMIN", admin: { isNot: null } }, select: { name: true } });
  if (!viewer) redirect("/forbidden");
  const skills = await prisma.student_skill.findMany({
    where: { OR: [{ evidencePortfolioId: { not: null } }, { isVerified: true }] },
    orderBy: [{ isVerified: "asc" }, { updatedAt: "desc" }],
    take: 100,
    select: {
      id: true, level: true, isVerified: true, verifiedAt: true,
      skill: { select: { name: true, category: true } },
      student: { select: { user: { select: { name: true } }, projects: { where: { status: "COMPLETED" }, select: { id: true } } } },
      evidencePortfolio: { select: { title: true, link: true } },
    },
  });
  return { adminName: viewer.name || "Admin Jembara", skills };
}
