"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { config } from "@/config/unifiedConfig";
import prisma from "@/lib/prisma";
import { consumeRateLimit, createRateLimitKey } from "@/lib/rate-limit";
import { verifySession } from "@/lib/session";

export interface PortfolioActionResult {
  success: boolean;
  error?: string;
}

const portfolioSchema = z.object({
  title: z.string().trim().min(2, "Judul minimal 2 karakter").max(100),
  description: z.string().trim().max(1000, "Deskripsi maksimal 1000 karakter"),
  link: z.string().max(2048),
  image: z.string().max(2048),
});

const MAX_PORTFOLIOS_PER_STUDENT = 20;
const MAX_TRANSACTION_ATTEMPTS = 3;

function normalizeOptionalUrl(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return null;

  const normalizedValue = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const url = new URL(normalizedValue);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export async function createPortfolioAction(
  formData: FormData,
): Promise<PortfolioActionResult> {
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") {
    return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
  }

  const parsed = portfolioSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    link: formData.get("link") ?? "",
    image: formData.get("image") ?? "",
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Data portofolio tidak valid.",
    };
  }

  const link = normalizeOptionalUrl(parsed.data.link);
  const image = normalizeOptionalUrl(parsed.data.image);
  if (link === undefined || image === undefined) {
    return {
      success: false,
      error: "Tautan karya dan gambar harus berupa URL yang valid.",
    };
  }

  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true, student: { select: { id: true } } },
  });

  if (!viewer || viewer.role !== "STUDENT") {
    return {
      success: false,
      error: "Hanya akun student yang dapat menambah portofolio.",
    };
  }


  const rateLimit = await consumeRateLimit({
    key: createRateLimitKey("portfolio:create:user", session.userId),
    ...config.security.auth.rateLimit.portfolioCreateByUser,
  });
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: "Terlalu banyak portofolio ditambahkan. Silakan coba lagi nanti.",
    };
  }

  try {
    let created = false;
    for (let attempt = 0; attempt < MAX_TRANSACTION_ATTEMPTS; attempt += 1) {
      try {
        created = await prisma.$transaction(
          async (transaction) => {
            const student = await transaction.student.upsert({
              where: { userId: session.userId },
              update: {},
              create: { userId: session.userId },
              select: { id: true },
            });
            const portfolioCount = await transaction.portfolio.count({
              where: { studentId: student.id },
            });
            if (portfolioCount >= MAX_PORTFOLIOS_PER_STUDENT) return false;

            await transaction.portfolio.create({
              data: {
                studentId: student.id,
                title: parsed.data.title,
                description: parsed.data.description || null,
                link,
                image,
              },
            });
            return true;
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
        break;
      } catch (error) {
        const shouldRetry =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2034" &&
          attempt < MAX_TRANSACTION_ATTEMPTS - 1;
        if (!shouldRetry) throw error;
      }
    }

    if (!created) {
      return {
        success: false,
        error: `Maksimal ${MAX_PORTFOLIOS_PER_STUDENT} portofolio per pelajar.`,
      };
    }
  } catch (error) {
    console.error("Gagal menambahkan portofolio:", error);
    return {
      success: false,
      error: "Portofolio gagal disimpan. Silakan coba lagi.",
    };
  }

  revalidatePath("/dashboard/portfolio");
  revalidatePath("/dashboard/profile");
  return { success: true };
}
