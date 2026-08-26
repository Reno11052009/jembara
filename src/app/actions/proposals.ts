"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { config } from "@/config/unifiedConfig";
import { createUserNotification } from "@/lib/notifications";
import prisma from "@/lib/prisma";
import { consumeRateLimit, createRateLimitKey } from "@/lib/rate-limit";
import { verifySession } from "@/lib/session";

export interface ProposalActionState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

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
