"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { config } from "@/config/unifiedConfig";
import prisma from "@/lib/prisma";
import { consumeRateLimit, createRateLimitKey } from "@/lib/rate-limit";
import { verifySession } from "@/lib/session";

export interface ProjectActionState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

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
    skillIds: z
      .array(z.string().uuid("Skill tidak valid."))
      .min(1, "Pilih minimal satu skill.")
      .max(10, "Maksimal 10 skill per project."),
  })
  .superRefine((data, context) => {
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

  const uniqueSkillIds = [
    ...new Set(
      formData
        .getAll("skillIds")
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
    skillIds: uniqueSkillIds,
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
    where: { id: { in: parsed.data.skillIds } },
    select: { id: true },
  });
  if (skills.length !== parsed.data.skillIds.length) {
    return {
      error: "Satu atau lebih skill tidak tersedia. Muat ulang halaman dan coba lagi.",
    };
  }

  try {
    await prisma.project.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        budget: parsed.data.budget,
        deadline,
        workMode: parsed.data.workMode,
        location:
          parsed.data.workMode === "REMOTE" ? null : parsed.data.location,
        status: "OPEN",
        umkmId: viewer.umkm.id,
        skillsNeeded: {
          create: skills.map((skill) => ({ skillId: skill.id })),
        },
      },
      select: { id: true },
    });
  } catch (error) {
    console.error("Gagal membuat project:", error);
    return { error: "Project gagal disimpan. Silakan coba lagi." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/lowongan-saya");
  revalidatePath("/dashboard/find-projects");
  revalidatePath("/dashboard/cari-talent");
  redirect("/dashboard/lowongan-saya");
}
