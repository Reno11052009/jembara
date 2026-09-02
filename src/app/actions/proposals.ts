"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { config } from "@/config/unifiedConfig";
import {
  createUserNotification,
  createUserNotifications,
} from "@/lib/notifications";
import prisma from "@/lib/prisma";
import { consumeRateLimit, createRateLimitKey } from "@/lib/rate-limit";
import { verifySession } from "@/lib/session";

export interface ProposalActionState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export interface ProposalDecisionResult {
  success: boolean;
  error?: string;
  projectId?: string;
  paymentRequired?: boolean;
}

const DECIDABLE_PROJECT_STATUSES = ["OPEN", "PROPOSAL"];
const proposalIdSchema = z.string().uuid("Proposal tidak valid.");

class ProposalDecisionError extends Error {}

const proposalSchema = z.object({
  projectId: z.string().uuid("Project tidak valid."),
  coverLetter: z
    .string()
    .trim()
    .min(50, "Proposal minimal 50 karakter.")
    .max(2000, "Proposal maksimal 2000 karakter."),
  budgetAgreement: z.literal("on", {
    error: "Anda harus menyetujui budget tetap project.",
  }),
});

export async function createProposalAction(
  _previousState: ProposalActionState,
  formData: FormData,
): Promise<ProposalActionState> {
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") {
    return { error: "Sesi tidak valid. Silakan login kembali." };
  }

  const parsed = proposalSchema.safeParse({
    projectId: formData.get("projectId"),
    coverLetter: formData.get("coverLetter"),
    budgetAgreement: formData.get("budgetAgreement"),
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message || "Proposal tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      role: true,
      student: { select: { id: true } },
    },
  });
  if (!viewer || viewer.role !== "STUDENT" || !viewer.student) {
    return { error: "Hanya akun pelajar yang dapat mengirim proposal." };
  }

  const rateLimit = await consumeRateLimit({
    key: createRateLimitKey("proposal:create:user", session.userId),
    ...config.security.auth.rateLimit.proposalCreateByUser,
  });
  if (!rateLimit.allowed) {
    return { error: "Terlalu banyak proposal dikirim. Silakan coba lagi nanti." };
  }

  const project = await prisma.project.findFirst({
    where: {
      id: parsed.data.projectId,
      status: "OPEN",
      studentId: null,
      OR: [{ deadline: null }, { deadline: { gt: new Date() } }],
    },
    select: {
      id: true,
      title: true,
      umkm: { select: { userId: true } },
    },
  });
  if (!project) {
    return { error: "Project tidak ditemukan atau sudah tidak menerima proposal." };
  }

  try {
    await prisma.proposal.create({
      data: {
        projectId: project.id,
        studentId: viewer.student.id,
        coverLetter: parsed.data.coverLetter,
        budgetMatch: true,
        status: "PENDING",
      },
      select: { id: true },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "Anda sudah mengirim proposal untuk project ini." };
    }
    console.error("Gagal mengirim proposal:", error);
    return { error: "Proposal gagal dikirim. Silakan coba lagi." };
  }

  try {
    await createUserNotification({
      userId: project.umkm.userId,
      type: "PROPOSAL",
      title: "Proposal baru masuk",
      message: `${session.name} mengirim proposal untuk ${project.title}.`,
      href: `/dashboard/pelamar?project=${project.id}`,
      preferenceKey: "proposalMasuk",
    });
  } catch (error) {
    console.error("Proposal tersimpan, tetapi notifikasi gagal dibuat:", error);
  }

  revalidatePath(`/dashboard/find-projects/${project.id}`);
  revalidatePath("/dashboard/proposals");
  revalidatePath("/dashboard/pelamar");
  revalidatePath("/dashboard");
  redirect("/dashboard/proposals");
}

async function getProposalDecisionViewer() {
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") {
    return { error: "Sesi tidak valid. Silakan login kembali." } as const;
  }

  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true, umkm: { select: { id: true } } },
  });
  if (!viewer || viewer.role !== "UMKM" || !viewer.umkm) {
    return {
      error: "Hanya pemilik UMKM yang dapat menentukan proposal.",
    } as const;
  }

  return { session, umkmId: viewer.umkm.id } as const;
}

function revalidateProposalDecisionPaths() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/pelamar");
  revalidatePath("/dashboard/lowongan-saya");
  revalidatePath("/dashboard/proposals");
  revalidatePath("/dashboard/find-projects");
  revalidatePath("/dashboard/active-projects");
  revalidatePath("/dashboard/messages");
}

export async function acceptProposalAction(
  proposalId: unknown,
): Promise<ProposalDecisionResult> {
  const parsedProposalId = proposalIdSchema.safeParse(proposalId);
  if (!parsedProposalId.success) {
    return { success: false, error: parsedProposalId.error.issues[0]?.message };
  }

  const viewer = await getProposalDecisionViewer();
  if ("error" in viewer) return { success: false, error: viewer.error };

  try {
    const outcome = await prisma.$transaction(async (transaction) => {
      const proposal = await transaction.proposal.findFirst({
        where: {
          id: parsedProposalId.data,
          project: { umkmId: viewer.umkmId },
        },
        select: {
          id: true,
          status: true,
          studentId: true,
          student: {
            select: {
              userId: true,
              user: { select: { name: true } },
            },
          },
          project: {
            select: {
              id: true,
              title: true,
              status: true,
              studentId: true,
            },
          },
        },
      });
      if (!proposal) {
        throw new ProposalDecisionError(
          "Proposal tidak ditemukan pada project milik Anda.",
        );
      }

      if (
        proposal.status === "ACCEPTED" &&
        proposal.project.studentId === proposal.studentId &&
        proposal.project.status === "PROPOSAL"
      ) {
        return {
          newlyAccepted: false,
          projectId: proposal.project.id,
          projectTitle: proposal.project.title,
          acceptedUserId: proposal.student.userId,
          acceptedStudentName: proposal.student.user.name || "Talent Jembara",
          rejectedUserIds: [] as string[],
        };
      }

      if (proposal.status !== "PENDING") {
        throw new ProposalDecisionError(
          "Proposal ini sudah memiliki keputusan dan tidak dapat diterima.",
        );
      }
      if (
        proposal.project.studentId ||
        !DECIDABLE_PROJECT_STATUSES.includes(proposal.project.status)
      ) {
        throw new ProposalDecisionError(
          "Project sudah tidak menerima pemilihan kandidat.",
        );
      }

      const claimedProject = await transaction.project.updateMany({
        where: {
          id: proposal.project.id,
          umkmId: viewer.umkmId,
          studentId: null,
          status: { in: DECIDABLE_PROJECT_STATUSES },
        },
        data: {
          studentId: proposal.studentId,
          status: "PROPOSAL",
        },
      });
      if (claimedProject.count !== 1) {
        throw new ProposalDecisionError(
          "Kandidat lain telah dipilih untuk project ini. Muat ulang halaman.",
        );
      }

      const acceptedProposal = await transaction.proposal.updateMany({
        where: { id: proposal.id, status: "PENDING" },
        data: { status: "ACCEPTED" },
      });
      if (acceptedProposal.count !== 1) {
        throw new ProposalDecisionError(
          "Status proposal berubah. Muat ulang halaman dan coba lagi.",
        );
      }

      const proposalsToReject = await transaction.proposal.findMany({
        where: {
          projectId: proposal.project.id,
          id: { not: proposal.id },
          status: "PENDING",
        },
        select: { student: { select: { userId: true } } },
      });
      await transaction.proposal.updateMany({
        where: {
          projectId: proposal.project.id,
          id: { not: proposal.id },
          status: "PENDING",
        },
        data: { status: "REJECTED" },
      });

      return {
        newlyAccepted: true,
        projectId: proposal.project.id,
        projectTitle: proposal.project.title,
        acceptedUserId: proposal.student.userId,
        acceptedStudentName: proposal.student.user.name || "Talent Jembara",
        rejectedUserIds: proposalsToReject.map(({ student }) => student.userId),
      };
    });

    if (outcome.newlyAccepted) {
      try {
        await createUserNotifications([
          {
            userId: outcome.acceptedUserId,
            type: "PROJECT",
            title: "Proposal diterima",
            message: `Anda terpilih untuk ${outcome.projectTitle}. Pengerjaan dimulai setelah pembayaran UMKM terverifikasi.`,
            href: "/dashboard/proposals",
            preferenceKey: "updateProyek",
          },
          ...outcome.rejectedUserIds.map((userId) => ({
            userId,
            type: "PROJECT",
            title: "Proposal belum terpilih",
            message: `UMKM telah memilih kandidat lain untuk ${outcome.projectTitle}.`,
            href: "/dashboard/proposals",
            preferenceKey: "updateProyek" as const,
          })),
        ]);
      } catch {
        console.error(
          `Kandidat ${outcome.acceptedStudentName} terpilih, tetapi sebagian notifikasi project ${outcome.projectId} gagal dibuat.`,
        );
      }
    }

    revalidateProposalDecisionPaths();
    return {
      success: true,
      projectId: outcome.projectId,
      paymentRequired: true,
    };
  } catch (error) {
    if (error instanceof ProposalDecisionError) {
      return { success: false, error: error.message };
    }
    console.error("Gagal menerima proposal:", error);
    return {
      success: false,
      error: "Proposal belum dapat diterima. Silakan coba lagi.",
    };
  }
}

export async function rejectProposalAction(
  proposalId: unknown,
): Promise<ProposalDecisionResult> {
  const parsedProposalId = proposalIdSchema.safeParse(proposalId);
  if (!parsedProposalId.success) {
    return { success: false, error: parsedProposalId.error.issues[0]?.message };
  }

  const viewer = await getProposalDecisionViewer();
  if ("error" in viewer) return { success: false, error: viewer.error };

  try {
    const outcome = await prisma.$transaction(async (transaction) => {
      const proposal = await transaction.proposal.findFirst({
        where: {
          id: parsedProposalId.data,
          project: { umkmId: viewer.umkmId },
        },
        select: {
          id: true,
          status: true,
          student: { select: { userId: true } },
          project: {
            select: {
              id: true,
              title: true,
              status: true,
              studentId: true,
            },
          },
        },
      });
      if (!proposal) {
        throw new ProposalDecisionError(
          "Proposal tidak ditemukan pada project milik Anda.",
        );
      }
      if (proposal.status === "REJECTED") {
        return {
          newlyRejected: false,
          projectTitle: proposal.project.title,
          studentUserId: proposal.student.userId,
        };
      }
      if (proposal.status !== "PENDING") {
        throw new ProposalDecisionError(
          "Proposal yang sudah diterima tidak dapat ditolak.",
        );
      }
      if (
        proposal.project.studentId ||
        !DECIDABLE_PROJECT_STATUSES.includes(proposal.project.status)
      ) {
        throw new ProposalDecisionError(
          "Project sudah tidak menerima keputusan proposal.",
        );
      }

      const rejectedProposal = await transaction.proposal.updateMany({
        where: {
          id: proposal.id,
          status: "PENDING",
          project: {
            umkmId: viewer.umkmId,
            studentId: null,
            status: { in: DECIDABLE_PROJECT_STATUSES },
          },
        },
        data: { status: "REJECTED" },
      });
      if (rejectedProposal.count !== 1) {
        throw new ProposalDecisionError(
          "Status proposal berubah. Muat ulang halaman dan coba lagi.",
        );
      }

      return {
        newlyRejected: true,
        projectTitle: proposal.project.title,
        studentUserId: proposal.student.userId,
      };
    });

    if (outcome.newlyRejected) {
      try {
        await createUserNotification({
          userId: outcome.studentUserId,
          type: "PROJECT",
          title: "Proposal belum diterima",
          message: `Proposal Anda untuk ${outcome.projectTitle} belum dapat dipilih.`,
          href: "/dashboard/proposals",
          preferenceKey: "updateProyek",
        });
      } catch (error) {
        console.error("Proposal ditolak, tetapi notifikasi gagal dibuat:", error);
      }
    }

    revalidateProposalDecisionPaths();
    return { success: true };
  } catch (error) {
    if (error instanceof ProposalDecisionError) {
      return { success: false, error: error.message };
    }
    console.error("Gagal menolak proposal:", error);
    return {
      success: false,
      error: "Proposal belum dapat ditolak. Silakan coba lagi.",
    };
  }
}
