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
          submission: { select: { id: true, status: true } },
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
      const advanced = await transaction.project.updateMany({
        where: { id: project.id, status: "IN_PROGRESS", studentId: project.studentId },
        data: { status: "REVIEW" },
      });
      if (advanced.count !== 1) {
        throw new ProjectLifecycleError("Status proyek berubah. Muat ulang halaman.");
      }
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
