import "server-only";
import { redirect } from "next/navigation";
import { requireAdminSession } from "./auth-guard";
import prisma from "./prisma";

export async function getAdminReportsData() {
  const session = await requireAdminSession();
  const viewer = await prisma.user.findFirst({ where: { id: session.userId, role: "ADMIN", admin: { isNot: null } }, select: { name: true } });
  if (!viewer) redirect("/forbidden");
  const reports = await prisma.content_report.findMany({ orderBy: [{ status: "asc" }, { createdAt: "desc" }], take: 100, select: { id: true, category: true, description: true, status: true, resolutionNote: true, createdAt: true, reporter: { select: { name: true, email: true } }, targetUser: { select: { name: true } }, project: { select: { title: true } } } });
  return { adminName: viewer.name || "Admin Jembara", reports };
}
