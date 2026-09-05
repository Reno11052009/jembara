import "server-only";

import { redirect } from "next/navigation";
import type { PortfolioData } from "@/types/portfolio";
import { requireAuthenticatedSession } from "./auth-guard";
import { formatRelativeDate } from "./dashboard-utils";
import prisma from "./prisma";

function normalizeStoredUrl(value: string | null) {
  if (!value) return null;
  const normalizedValue = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const url = new URL(normalizedValue);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function normalizeStoredImage(value: string | null) {
  if (value?.startsWith("data:image/")) return value;
  return normalizeStoredUrl(value);
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const session = await requireAuthenticatedSession();
  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      role: true,
      student: {
        select: {
          portfolios: {
            orderBy: { updatedAt: "desc" },
            select: {
              id: true,
              title: true,
              description: true,
              link: true,
              image: true,
              updatedAt: true,
            },
          },
          skills: {
            orderBy: { createdAt: "asc" },
            select: {
              id: true,
              isVerified: true,
              level: true,
              evidencePortfolioId: true,
              skill: { select: { name: true, category: true } },
            },
          },
          projects: {
            where: { status: "COMPLETED" },
            select: { id: true },
          },
          reviews: {
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              rating: true,
              comment: true,
              project: { select: { title: true } },
              umkm: { select: { nama_usaha: true } },
            },
          },
        },
      },
    },
  });

  if (!viewer) {
    throw new Error("Pengguna pada sesi tidak ditemukan");
  }
  if (viewer.role !== "STUDENT") {
    redirect("/forbidden");
  }

  const student = viewer.student;
  if (!student) {
    return {
      projects: [],
      skills: [],
      testimonials: [],
      summary: {
        portfolioCount: 0,
        completedProjectCount: 0,
        averageRating: 0,
        verifiedSkillCount: 0,
      },
    };
  }

  const averageRating = student.reviews.length
    ? student.reviews.reduce((total, review) => total + review.rating, 0) /
      student.reviews.length
    : 0;

  return {
    projects: student.portfolios.map((portfolio) => ({
      id: portfolio.id,
      title: portfolio.title,
      description: portfolio.description,
      link: normalizeStoredUrl(portfolio.link),
      imageUrl: normalizeStoredImage(portfolio.image),
      updatedLabel: `Diperbarui ${formatRelativeDate(portfolio.updatedAt).toLocaleLowerCase("id-ID")}`,
    })),
    skills: student.skills.map(({ id, isVerified, level, evidencePortfolioId, skill }) => ({
      id,
      name: skill.name,
      category: skill.category,
      isVerified,
      level,
      evidencePortfolioId,
    })),
    testimonials: student.reviews.map((review) => ({
      id: review.id,
      clientName: review.umkm.nama_usaha,
      projectTitle: review.project.title,
      rating: review.rating,
      quote: review.comment?.trim() || "Klien belum menambahkan komentar.",
    })),
    summary: {
      portfolioCount: student.portfolios.length,
      completedProjectCount: student.projects.length,
      averageRating,
      verifiedSkillCount: student.skills.filter(({ isVerified }) => isVerified)
        .length,
    },
  };
}
