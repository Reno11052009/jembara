"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { config } from "@/config/unifiedConfig";
import prisma from "@/lib/prisma";
import { consumeRateLimit, createRateLimitKey } from "@/lib/rate-limit";
import { verifySession } from "@/lib/session";

const privacySchema = z
  .object({ isPublicProfile: z.boolean() })
  .strict();

export async function updateProfileVisibilityAction(input: unknown) {
  const parsed = privacySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Pilihan privasi tidak valid." };

  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") {
    return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
  }

  const rateLimit = await consumeRateLimit({
    key: createRateLimitKey("privacy:update:user", session.userId),
    ...config.security.auth.rateLimit.privacyUpdateByUser,
  });
  if (!rateLimit.allowed) {
    return { success: false, error: "Terlalu banyak perubahan. Coba lagi nanti." };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true, student: { select: { id: true } } },
  });
  if (!user || user.role !== "STUDENT" || !user.student) {
    return { success: false, error: "Pengaturan ini hanya tersedia untuk Student." };
  }

  const updated = await prisma.student.updateMany({
    where: { id: user.student.id, userId: session.userId },
    data: { isPublicProfile: parsed.data.isPublicProfile },
  });
  if (updated.count !== 1) {
    return { success: false, error: "Profil tidak ditemukan." };
  }

  revalidatePath("/dashboard/settings/privasi");
  revalidatePath("/dashboard/settings");
  revalidatePath("/");
  return { success: true };
}
