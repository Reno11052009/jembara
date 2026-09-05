import "server-only";

import { calculateSmartMatch } from "./matching";
import prisma from "./prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function saveMatchingSnapshot(projectId: string, studentId: string) {
  const [project, student] = await Promise.all([
    prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        budget: true,
        workMode: true,
        location: true,
        skillsNeeded: {
          select: { required: true, skill: { select: { id: true, name: true, category: true } } },
        },
      },
    }),
    prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        rating: true,
        available: true,
        expectedBudgetMin: true,
        expectedBudgetMax: true,
        provinsi_nama: true,
        kabupaten_nama: true,
        skills: { select: { skill: { select: { id: true, name: true, category: true } } } },
        portfolios: {
          select: {
            title: true,
            description: true,
            skillEvidence: { select: { skillId: true } },
          },
        },
        _count: { select: { reviews: true } },
      },
    }),
  ]);
  if (!project || !student) return null;

  const result = calculateSmartMatch({
    project: {
      budget: project.budget,
      workMode: project.workMode,
      location: project.location,
      skills: project.skillsNeeded.map(({ required, skill }) => ({ ...skill, required })),
    },
    student: {
      skills: student.skills.map(({ skill }) => skill),
      portfolios: student.portfolios.map((portfolio) => ({
        title: portfolio.title,
        description: portfolio.description,
        evidenceSkillIds: portfolio.skillEvidence.map(({ skillId }) => skillId),
      })),
      rating: student.rating,
      reviewCount: student._count.reviews,
      available: student.available,
      expectedBudgetMin: student.expectedBudgetMin,
      expectedBudgetMax: student.expectedBudgetMax,
      provinceName: student.provinsi_nama,
      regencyName: student.kabupaten_nama,
    },
  });

  return prisma.matching_score.upsert({
    where: { projectId_studentId: { projectId, studentId } },
    update: {
      skillsScore: result.factors.skills,
      portfolioScore: result.factors.portfolio,
      ratingScore: result.factors.rating,
      budgetScore: result.factors.budget,
      availabilityScore: result.factors.availability,
      locationScore: result.factors.location,
      totalScore: result.totalScore,
      eligible: result.eligible,
      reasons: result.reasons,
      inputs: result.inputs as Prisma.InputJsonValue,
      calculatedAt: new Date(),
    },
    create: {
      projectId,
      studentId,
      skillsScore: result.factors.skills,
      portfolioScore: result.factors.portfolio,
      ratingScore: result.factors.rating,
      budgetScore: result.factors.budget,
      availabilityScore: result.factors.availability,
      locationScore: result.factors.location,
      totalScore: result.totalScore,
      eligible: result.eligible,
      reasons: result.reasons,
      inputs: result.inputs as Prisma.InputJsonValue,
    },
  });
}
