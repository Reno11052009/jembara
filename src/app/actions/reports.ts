"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";

const reportSchema = z.object({
  projectId: z.string().uuid(),
  category: z.enum(["SPAM", "FRAUD", "HARASSMENT", "INAPPROPRIATE", "OTHER"]),
  description: z.string().trim().min(20, "Jelaskan laporan minimal 20 karakter.").max(2000),
});
const statusSchema = z.enum(["OPEN", "REVIEWING", "RESOLVED", "REJECTED"]);

export async function createProjectReportAction(formData: FormData) {
  const parsed = reportSchema.safeParse({ projectId: formData.get("projectId"), category: formData.get("category"), description: formData.get("description") });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message || "Laporan tidak valid." };
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") return { success: false, error: "Silakan login untuk membuat laporan." };
  const project = await prisma.project.findUnique({ where: { id: parsed.data.projectId }, select: { id: true, umkm: { select: { userId: true } } } });
  if (!project) return { success: false, error: "Project tidak ditemukan." };
  const report = await prisma.$transaction(async (transaction) => {
    const created = await transaction.content_report.create({ data: { reporterUserId: session.userId, targetUserId: project.umkm.userId, projectId: project.id, category: parsed.data.category, description: parsed.data.description } });
    await transaction.audit_log.create({ data: { actorUserId: session.userId, action: "CONTENT_REPORTED", entityType: "content_report", entityId: created.id, metadata: { projectId: project.id } } });
    return created;
  });
  revalidatePath("/dashboard/laporan");
  return { success: true, reportId: report.id };
}

export async function updateReportStatusAction(reportId: unknown, status: unknown, resolutionNote: unknown) {
  const id = z.string().uuid().safeParse(reportId);
  const parsedStatus = statusSchema.safeParse(status);
  const note = z.string().trim().max(2000).safeParse(resolutionNote);
  if (!id.success || !parsedStatus.success || !note.success) return { success: false, error: "Keputusan laporan tidak valid." };
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") return { success: false, error: "Sesi tidak valid." };
  const admin = await prisma.user.findFirst({ where: { id: session.userId, role: "ADMIN", admin: { isNot: null } }, select: { id: true } });
  if (!admin) return { success: false, error: "Hanya admin yang dapat memoderasi laporan." };
  const terminal = ["RESOLVED", "REJECTED"].includes(parsedStatus.data);
  await prisma.$transaction([
    prisma.content_report.update({ where: { id: id.data }, data: { status: parsedStatus.data, resolutionNote: note.data || null, resolvedByUserId: terminal ? admin.id : null, resolvedAt: terminal ? new Date() : null } }),
    prisma.audit_log.create({ data: { actorUserId: admin.id, action: "REPORT_STATUS_UPDATED", entityType: "content_report", entityId: id.data, metadata: { status: parsedStatus.data } } }),
  ]);
  revalidatePath("/dashboard/laporan");
  return { success: true };
}
