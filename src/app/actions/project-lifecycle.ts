"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { createUserNotification } from "@/lib/notifications";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";

export interface ProjectLifecycleResult {
  success: boolean;
  error?: string;
}

const projectIdSchema = z.string().uuid("Proyek tidak valid.");
const submissionSchema = z.object({
  projectId: projectIdSchema,
  resultUrl: z
    .union([z.literal(""), z.string().trim().url("Tautan hasil tidak valid.")])
    .refine(
      (value) => !value || ["http:", "https:"].includes(new URL(value).protocol),
      "Tautan hasil harus menggunakan HTTP atau HTTPS.",
    ),
  notes: z
    .string()
    .trim()
    .min(20, "Catatan hasil minimal 20 karakter.")
    .max(3000, "Catatan hasil maksimal 3000 karakter."),
});
const revisionSchema = z.object({
  projectId: projectIdSchema,
  reason: z.string().trim().min(20, "Alasan revisi minimal 20 karakter.").max(2000),
});
const reviewSchema = z.object({
  projectId: projectIdSchema,
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000),
});

class ProjectLifecycleError extends Error {}

function revalidateProjectLifecyclePaths() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/active-projects");
  revalidatePath("/dashboard/lowongan-saya");
  revalidatePath("/dashboard/earnings");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/settings/pembayaran");
  revalidatePath("/dashboard/portfolio");
}

export async function submitProjectResultAction(
  formData: FormData,
): Promise<ProjectLifecycleResult> {
  const parsed = submissionSchema.safeParse({
    projectId: formData.get("projectId"),
    resultUrl: formData.get("resultUrl") ?? "",
    notes: formData.get("notes"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") {
    return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
  }

  try {
    const outcome = await prisma.$transaction(async (transaction) => {
      const project = await transaction.project.findFirst({
        where: {
          id: parsed.data.projectId,
          student: { userId: session.userId },
        },
        select: {
          id: true,
          title: true,
          status: true,
          studentId: true,
          umkm: { select: { userId: true } },
          payment: { select: { status: true } },
          submission: { select: { id: true, status: true, revisionCount: true } },
        },
      });
      if (!project || !project.studentId) {
        throw new ProjectLifecycleError("Proyek tidak ditemukan atau bukan milik Anda.");
      }
      if (project.status === "REVIEW" && project.submission) {
        return { newlySubmitted: false, project };
      }
      if (project.status !== "IN_PROGRESS" || project.payment?.status !== "HELD") {
        throw new ProjectLifecycleError(
          "Hasil hanya dapat dikirim saat proyek berjalan dan dana telah diamankan.",
        );
      }

      if (project.submission?.status === "REVISION_REQUESTED") {
        await transaction.project_submission.update({
          where: { id: project.submission.id },
          data: {
            resultUrl: parsed.data.resultUrl || null,
            notes: parsed.data.notes,
            status: "SUBMITTED",
            submittedAt: new Date(),
          },
        });
      } else {
        await transaction.project_submission.create({
          data: {
            projectId: project.id,
            studentId: project.studentId,
            resultUrl: parsed.data.resultUrl || null,
            notes: parsed.data.notes,
            status: "SUBMITTED",
          },
          select: { id: true },
        });
      }
      const advanced = await transaction.project.updateMany({
        where: { id: project.id, status: "IN_PROGRESS", studentId: project.studentId },
        data: { status: "REVIEW" },
      });
      if (advanced.count !== 1) {
        throw new ProjectLifecycleError("Status proyek berubah. Muat ulang halaman.");
      }
      await transaction.project_status_history.create({
        data: { projectId: project.id, fromStatus: "IN_PROGRESS", toStatus: "REVIEW", reason: project.submission ? "Hasil revisi dikirim" : "Hasil dikirim", actorUserId: session.userId },
      });
      await transaction.audit_log.create({
        data: { actorUserId: session.userId, action: "PROJECT_RESULT_SUBMITTED", entityType: "project", entityId: project.id, metadata: { revisionCount: project.submission?.revisionCount ?? 0 } },
      });
      return { newlySubmitted: true, project };
    });

    if (outcome.newlySubmitted) {
      await createUserNotification({
        userId: outcome.project.umkm.userId,
        type: "PROJECT",
        title: "Hasil proyek siap direview",
        message: `Talent telah mengirim hasil untuk ${outcome.project.title}.`,
        href: "/dashboard/active-projects",
        preferenceKey: "updateProyek",
      }).catch((error) => console.error("Notifikasi hasil proyek gagal:", error));
    }
    revalidateProjectLifecyclePaths();
    return { success: true };
  } catch (error) {
    console.error("Gagal mengirim hasil proyek:", error);
    return {
      success: false,
      error:
        error instanceof ProjectLifecycleError
          ? error.message
          : "Hasil proyek belum dapat dikirim. Silakan coba lagi.",
    };
  }
}

async function releaseProjectPayment(projectId: string, userId: string) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (transaction) => {
          const project = await transaction.project.findFirst({
            where: { id: projectId, umkm: { userId } },
            select: {
              id: true,
              title: true,
              status: true,
              studentId: true,
              student: {
                select: {
                  id: true,
                  user: { select: { id: true, saldo: true } },
                },
              },
              payment: { select: { id: true, status: true, amount: true } },
              submission: { select: { id: true, status: true } },
            },
          });
          if (!project || !project.student || !project.payment) {
            throw new ProjectLifecycleError("Proyek berbayar tidak ditemukan.");
          }
          if (project.status === "COMPLETED" && project.payment.status === "RELEASED") {
            return { newlyReleased: false, project };
          }
          if (
            project.status !== "REVIEW" ||
            project.payment.status !== "HELD" ||
            project.submission?.status !== "SUBMITTED"
          ) {
            throw new ProjectLifecycleError(
              "Proyek belum siap disetujui atau dana tidak dalam status ditahan.",
            );
          }

          const now = new Date();
          const claimed = await transaction.project_payment.updateMany({
            where: { id: project.payment.id, status: "HELD" },
            data: {
              status: "RELEASED",
              releasedAt: now,
              releasedToUserId: project.student.user.id,
            },
          });
          if (claimed.count !== 1) {
            throw new ProjectLifecycleError("Dana sudah diproses oleh permintaan lain.");
          }

          const updatedUser = await transaction.user.update({
            where: { id: project.student.user.id },
            data: { saldo: { increment: project.payment.amount } },
            select: { saldo: true },
          });
          await transaction.balance_transaction.create({
            data: {
              userId: project.student.user.id,
              projectPaymentId: project.payment.id,
              type: "PROJECT_EARNING",
              amount: project.payment.amount,
              balanceBefore: updatedUser.saldo - project.payment.amount,
              balanceAfter: updatedUser.saldo,
            },
            select: { id: true },
          });
          await transaction.project_submission.update({
            where: { id: project.submission.id },
            data: { status: "APPROVED", approvedAt: now },
          });
          const completed = await transaction.project.updateMany({
            where: { id: project.id, status: "REVIEW", studentId: project.studentId },
            data: { status: "COMPLETED" },
          });
          if (completed.count !== 1) {
            throw new ProjectLifecycleError("Status proyek berubah. Muat ulang halaman.");
          }
          await transaction.student.update({
            where: { id: project.student.id },
            data: { total_project: { increment: 1 } },
            select: { id: true },
          });
          await transaction.project_status_history.create({
            data: { projectId: project.id, fromStatus: "REVIEW", toStatus: "COMPLETED", reason: "Hasil disetujui dan dana dilepas", actorUserId: userId },
          });
          await transaction.audit_log.create({
            data: { actorUserId: userId, action: "PROJECT_COMPLETED", entityType: "project", entityId: project.id, metadata: { paymentId: project.payment.id, amount: project.payment.amount } },
          });
          return { newlyReleased: true, project };
        },
        { isolationLevel: "Serializable" },
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034" &&
        attempt < 2
      ) {
        continue;
      }
      throw error;
    }
  }
  throw new ProjectLifecycleError("Pelepasan saldo gagal setelah beberapa percobaan.");
}

export async function requestProjectRevisionAction(formData: FormData): Promise<ProjectLifecycleResult> {
  const parsed = revisionSchema.safeParse({ projectId: formData.get("projectId"), reason: formData.get("reason") });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") return { success: false, error: "Sesi tidak valid." };

  try {
    const outcome = await prisma.$transaction(async (transaction) => {
      const project = await transaction.project.findFirst({
        where: { id: parsed.data.projectId, status: "REVIEW", umkm: { userId: session.userId } },
        select: { id: true, title: true, student: { select: { userId: true } }, payment: { select: { status: true } }, submission: { select: { id: true, status: true, revisionCount: true } } },
      });
      if (!project?.student || project.payment?.status !== "HELD" || project.submission?.status !== "SUBMITTED") throw new ProjectLifecycleError("Proyek belum siap diminta revisi.");
      if (project.submission.revisionCount >= 2) throw new ProjectLifecycleError("Batas maksimal 2 revisi telah tercapai. Setujui hasil atau hubungi admin.");
      const sequence = project.submission.revisionCount + 1;
      await transaction.project_revision.create({ data: { projectId: project.id, submissionId: project.submission.id, requestedByUserId: session.userId, sequence, reason: parsed.data.reason } });
      await transaction.project_submission.update({ where: { id: project.submission.id }, data: { status: "REVISION_REQUESTED", revisionCount: sequence } });
      const changed = await transaction.project.updateMany({ where: { id: project.id, status: "REVIEW" }, data: { status: "IN_PROGRESS" } });
      if (changed.count !== 1) throw new ProjectLifecycleError("Status proyek berubah. Muat ulang halaman.");
      await transaction.project_status_history.create({ data: { projectId: project.id, fromStatus: "REVIEW", toStatus: "IN_PROGRESS", reason: `Revisi ${sequence}/2 diminta`, actorUserId: session.userId } });
      await transaction.audit_log.create({ data: { actorUserId: session.userId, action: "PROJECT_REVISION_REQUESTED", entityType: "project", entityId: project.id, metadata: { sequence } } });
      return { ...project, studentUserId: project.student.userId, sequence };
    });
    await createUserNotification({ userId: outcome.studentUserId, type: "PROJECT", title: `Revisi ${outcome.sequence}/2 diminta`, message: `UMKM meminta perbaikan hasil untuk ${outcome.title}.`, href: "/dashboard/active-projects", preferenceKey: "updateProyek" }).catch((error) => console.error("Notifikasi revisi gagal:", error));
    revalidateProjectLifecyclePaths();
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ProjectLifecycleError ? error.message : "Permintaan revisi gagal disimpan." };
  }
}

export async function createProjectReviewAction(formData: FormData): Promise<ProjectLifecycleResult> {
  const parsed = reviewSchema.safeParse({ projectId: formData.get("projectId"), rating: formData.get("rating"), comment: formData.get("comment") ?? "" });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") return { success: false, error: "Sesi tidak valid." };

  try {
    const outcome = await prisma.$transaction(async (transaction) => {
      const project = await transaction.project.findFirst({ where: { id: parsed.data.projectId, status: "COMPLETED", umkm: { userId: session.userId }, review: null }, select: { id: true, title: true, studentId: true, student: { select: { userId: true } }, umkmId: true, payment: { select: { status: true } } } });
      if (!project?.studentId || !project.student || project.payment?.status !== "RELEASED") throw new ProjectLifecycleError("Ulasan hanya dapat diberikan sekali setelah proyek selesai.");
      await transaction.review.create({ data: { projectId: project.id, studentId: project.studentId, umkmId: project.umkmId, rating: parsed.data.rating, comment: parsed.data.comment || null } });
      const aggregate = await transaction.review.aggregate({ where: { studentId: project.studentId }, _avg: { rating: true } });
      await transaction.student.update({ where: { id: project.studentId }, data: { rating: aggregate._avg.rating ?? parsed.data.rating } });
      await transaction.audit_log.create({ data: { actorUserId: session.userId, action: "PROJECT_REVIEW_CREATED", entityType: "project", entityId: project.id, metadata: { rating: parsed.data.rating } } });
      return { ...project, studentUserId: project.student.userId };
    });
    await createUserNotification({ userId: outcome.studentUserId, type: "PROJECT", title: "Ulasan baru diterima", message: `UMKM memberi ulasan untuk ${outcome.title}.`, href: "/dashboard/portfolio", preferenceKey: "updateProyek" }).catch((error) => console.error("Notifikasi ulasan gagal:", error));
    revalidateProjectLifecyclePaths();
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return { success: false, error: "Ulasan untuk proyek ini sudah ada." };
    return { success: false, error: error instanceof ProjectLifecycleError ? error.message : "Ulasan gagal disimpan." };
  }
}

export async function approveProjectResultAction(
  projectId: unknown,
): Promise<ProjectLifecycleResult> {
  const parsed = projectIdSchema.safeParse(projectId);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") {
    return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
  }

  try {
    const outcome = await releaseProjectPayment(parsed.data, session.userId);
    if (outcome.newlyReleased) {
      await createUserNotification({
        userId: outcome.project.student!.user.id,
        type: "PAYMENT",
        title: "Saldo proyek telah masuk",
        message: `Hasil ${outcome.project.title} disetujui dan saldo telah ditambahkan ke akun Anda.`,
        href: "/dashboard/earnings",
        preferenceKey: "pembayaran",
      }).catch((error) => console.error("Notifikasi pelepasan saldo gagal:", error));
    }
    revalidateProjectLifecyclePaths();
    return { success: true };
  } catch (error) {
    console.error("Gagal menyetujui hasil proyek:", error);
    return {
      success: false,
      error:
        error instanceof ProjectLifecycleError
          ? error.message
          : "Hasil proyek belum dapat disetujui. Silakan coba lagi.",
    };
  }
}
