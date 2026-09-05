"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { config } from "@/config/unifiedConfig";
import prisma from "@/lib/prisma";
import { consumeRateLimit, createRateLimitKey } from "@/lib/rate-limit";
import { verifySession } from "@/lib/session";

export interface ProjectActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

const projectIdSchema = z.string().uuid("Project tidak valid.");

const projectSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, "Judul minimal 5 karakter.")
      .max(120, "Judul maksimal 120 karakter."),
    description: z
      .string()
      .trim()
      .min(20, "Deskripsi minimal 20 karakter.")
      .max(3000, "Deskripsi maksimal 3000 karakter."),
    budget: z.coerce
      .number()
      .int("Budget harus berupa angka bulat.")
      .min(50_000, "Budget minimal Rp50.000.")
      .max(1_000_000_000, "Budget maksimal Rp1.000.000.000."),
    deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Deadline tidak valid."),
    workMode: z.enum(["REMOTE", "HYBRID", "ONSITE"]),
    location: z.string().trim().max(120, "Lokasi maksimal 120 karakter."),
    requiredSkillIds: z
      .array(z.string().uuid("Skill tidak valid."))
      .min(1, "Pilih minimal satu skill.")
      .max(10, "Maksimal 10 skill per project."),
    optionalSkillIds: z.array(z.string().uuid("Skill tidak valid.")).max(9),
  })
  .superRefine((data, context) => {
    if (data.requiredSkillIds.length + data.optionalSkillIds.length > 10) {
      context.addIssue({
        code: "custom",
        path: ["optionalSkillIds"],
        message: "Total skill wajib dan opsional maksimal 10.",
      });
    }
    if (data.optionalSkillIds.some((id) => data.requiredSkillIds.includes(id))) {
      context.addIssue({
        code: "custom",
        path: ["optionalSkillIds"],
        message: "Skill yang sama tidak boleh wajib sekaligus opsional.",
      });
    }
    if (data.workMode !== "REMOTE" && !data.location) {
      context.addIssue({
        code: "custom",
        path: ["location"],
        message: "Lokasi wajib diisi untuk project hybrid atau onsite.",
      });
    }
  });

function getBudgetInput(formData: FormData) {
  const rawBudget = formData.get("budgetRaw");

  return typeof rawBudget === "string" && rawBudget.trim()
    ? rawBudget
    : formData.get("budget");
}

export async function createProjectAction(
  _previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") {
    return { error: "Sesi tidak valid. Silakan login kembali." };
  }

  const requiredSkillIds = [
    ...new Set(
      formData
        .getAll("requiredSkillIds")
        .filter((value): value is string => typeof value === "string"),
    ),
  ];
  const optionalSkillIds = [
    ...new Set(
      formData
        .getAll("optionalSkillIds")
        .filter((value): value is string => typeof value === "string"),
    ),
  ];
  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    budget: getBudgetInput(formData),
    deadline: formData.get("deadline"),
    workMode: formData.get("workMode"),
    location: formData.get("location") ?? "",
    requiredSkillIds,
    optionalSkillIds,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message || "Data project tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const deadline = new Date(`${parsed.data.deadline}T23:59:59.999+07:00`);
  if (Number.isNaN(deadline.getTime()) || deadline <= new Date()) {
    return {
      error: "Deadline harus setelah waktu saat ini.",
      fieldErrors: { deadline: ["Deadline harus setelah waktu saat ini."] },
    };
  }

  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true, umkm: { select: { id: true } } },
  });
  if (!viewer || viewer.role !== "UMKM" || !viewer.umkm) {
    return { error: "Hanya akun UMKM yang dapat membuat project." };
  }
  const umkmId = viewer.umkm.id;

  const rateLimit = await consumeRateLimit({
    key: createRateLimitKey("project:create:user", session.userId),
    ...config.security.auth.rateLimit.projectCreateByUser,
  });
  if (!rateLimit.allowed) {
    return {
      error: "Terlalu banyak project dibuat. Silakan coba lagi nanti.",
    };
  }

  const skills = await prisma.skill.findMany({
    where: {
      id: { in: [...parsed.data.requiredSkillIds, ...parsed.data.optionalSkillIds] },
    },
    select: { id: true },
  });
  if (
    skills.length !==
    parsed.data.requiredSkillIds.length + parsed.data.optionalSkillIds.length
  ) {
    return {
      error: "Satu atau lebih skill tidak tersedia. Muat ulang halaman dan coba lagi.",
    };
  }

  try {
    await prisma.$transaction(async (transaction) => {
      const project = await transaction.project.create({
        data: {
          title: parsed.data.title,
          description: parsed.data.description,
          budget: parsed.data.budget,
          deadline,
          workMode: parsed.data.workMode,
          location:
            parsed.data.workMode === "REMOTE" ? null : parsed.data.location,
          status: "OPEN",
          umkmId,
          skillsNeeded: {
            create: skills.map((skill) => ({
              skillId: skill.id,
              required: parsed.data.requiredSkillIds.includes(skill.id),
            })),
          },
        },
        select: { id: true },
      });
      await transaction.project_status_history.create({
        data: {
          projectId: project.id,
          toStatus: "OPEN",
          reason: "Project dipublikasikan",
          actorUserId: session.userId,
        },
      });
      await transaction.audit_log.create({
        data: {
          actorUserId: session.userId,
          action: "PROJECT_CREATED",
          entityType: "project",
          entityId: project.id,
        },
      });
    });
  } catch (error) {
    console.error("Gagal membuat project:", error);
    return { error: "Project gagal disimpan. Silakan coba lagi." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/lowongan-saya");
  revalidatePath("/dashboard/find-projects");
  revalidatePath("/dashboard/cari-talent");
  revalidateTag("marketplace-filter-options", "max");
  redirect("/dashboard/lowongan-saya");
}

export async function cancelProjectAction(projectId: unknown): Promise<ProjectActionState> {
  const parsed = projectIdSchema.safeParse(projectId);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") return { error: "Sesi tidak valid." };

  try {
    await prisma.$transaction(async (transaction) => {
      const project = await transaction.project.findFirst({
        where: { id: parsed.data, status: "OPEN", studentId: null, umkm: { userId: session.userId } },
        select: { id: true, _count: { select: { proposals: true } } },
      });
      if (!project) throw new Error("PROJECT_NOT_CANCELLABLE");
      const changed = await transaction.project.updateMany({ where: { id: project.id, status: "OPEN", studentId: null }, data: { status: "CANCELLED" } });
      if (changed.count !== 1) throw new Error("PROJECT_NOT_CANCELLABLE");
      if (project._count.proposals > 0) await transaction.proposal.updateMany({ where: { projectId: project.id, status: "PENDING" }, data: { status: "REJECTED" } });
      await transaction.project_status_history.create({ data: { projectId: project.id, fromStatus: "OPEN", toStatus: "CANCELLED", reason: "Dibatalkan oleh UMKM sebelum memilih talent", actorUserId: session.userId } });
      await transaction.audit_log.create({ data: { actorUserId: session.userId, action: "PROJECT_CANCELLED", entityType: "project", entityId: project.id } });
    });
    revalidatePath("/dashboard/lowongan-saya");
    revalidatePath("/dashboard/find-projects");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "PROJECT_NOT_CANCELLABLE") return { error: "Hanya project OPEN yang belum memilih talent yang dapat dibatalkan." };
    console.error("Gagal membatalkan project:", error);
    return { error: "Project gagal dibatalkan." };
  }
}

export async function updateProjectAction(formData: FormData): Promise<void> {
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") redirect("/login");
  const projectId = projectIdSchema.parse(formData.get("projectId"));
  const requiredSkillIds = [...new Set(formData.getAll("requiredSkillIds").filter((value): value is string => typeof value === "string"))];
  const optionalSkillIds = [...new Set(formData.getAll("optionalSkillIds").filter((value): value is string => typeof value === "string"))];
  const parsed = projectSchema.safeParse({ title: formData.get("title"), description: formData.get("description"), budget: getBudgetInput(formData), deadline: formData.get("deadline"), workMode: formData.get("workMode"), location: formData.get("location") ?? "", requiredSkillIds, optionalSkillIds });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Data project tidak valid.");
  const deadline = new Date(`${parsed.data.deadline}T23:59:59.999+07:00`);
  if (deadline <= new Date()) throw new Error("Deadline harus setelah waktu saat ini.");
  const skillIds = [...parsed.data.requiredSkillIds, ...parsed.data.optionalSkillIds];
  const skillCount = await prisma.skill.count({ where: { id: { in: skillIds } } });
  if (skillCount !== skillIds.length) throw new Error("Satu atau lebih skill tidak tersedia.");

  await prisma.$transaction(async (transaction) => {
    const project = await transaction.project.findFirst({ where: { id: projectId, status: "OPEN", studentId: null, umkm: { userId: session.userId }, proposals: { none: {} } }, select: { id: true } });
    if (!project) throw new Error("Project hanya dapat diedit ketika OPEN dan belum menerima proposal.");
    await transaction.project.update({ where: { id: project.id }, data: { title: parsed.data.title, description: parsed.data.description, budget: parsed.data.budget, deadline, workMode: parsed.data.workMode, location: parsed.data.workMode === "REMOTE" ? null : parsed.data.location, skillsNeeded: { deleteMany: {}, create: skillIds.map((skillId) => ({ skillId, required: parsed.data.requiredSkillIds.includes(skillId) })) } } });
    await transaction.audit_log.create({ data: { actorUserId: session.userId, action: "PROJECT_UPDATED", entityType: "project", entityId: project.id } });
  });
  revalidatePath("/dashboard/lowongan-saya"); revalidatePath("/dashboard/find-projects"); revalidatePath("/");
  redirect("/dashboard/lowongan-saya");
}
