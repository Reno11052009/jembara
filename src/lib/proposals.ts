import "server-only";

import { redirect } from "next/navigation";
import prisma from "./prisma";
import { requireAuthenticatedSession } from "./auth-guard";
import {
  calculateSkillMatch,
  formatBudget,
  formatRelativeDate,
} from "./dashboard-utils";
import type {
  Proposal,
  ProposalStatus,
  ProposalSummary,
  ProposalsData,
} from "@/types/proposal";

function mapProposalStatus(status: string): ProposalStatus {
  if (status === "ACCEPTED") return "Accepted";
  if (status === "REJECTED") return "Rejected";
  return "Pending";
}

function createSummary(proposals: readonly Proposal[]): ProposalSummary {
  return proposals.reduce<ProposalSummary>(
    (summary, proposal) => {
      summary.total += 1;
      if (proposal.status === "Pending") summary.pending += 1;
      if (proposal.status === "Accepted") summary.accepted += 1;
      if (proposal.status === "Rejected") summary.rejected += 1;
      return summary;
    },
    { total: 0, pending: 0, accepted: 0, rejected: 0 },
  );
}

export async function getStudentProposals(): Promise<ProposalsData> {
  const session = await requireAuthenticatedSession();
  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      role: true,
      student: {
        select: {
          id: true,
          skills: { select: { skill: { select: { name: true } } } },
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

  if (!viewer.student) {
    const summary = createSummary([]);
    return {
      proposals: [],
      summary,
      tabCounts: {
        Semua: summary.total,
        Pending: summary.pending,
        Accepted: summary.accepted,
        Rejected: summary.rejected,
      },
    };
  }

  const studentSkills = viewer.student.skills.map(({ skill }) => skill.name);
  const proposalRecords = await prisma.proposal.findMany({
    where: { studentId: viewer.student.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      coverLetter: true,
      status: true,
      createdAt: true,
      project: {
        select: {
          title: true,
          description: true,
          budget: true,
          umkm: { select: { nama_usaha: true } },
          skillsNeeded: {
            select: { skill: { select: { name: true } } },
          },
        },
      },
    },
  });

  const proposals = proposalRecords.map<Proposal>((proposal) => {
    const requiredSkills = proposal.project.skillsNeeded.map(
      ({ skill }) => skill.name,
    );

    return {
      id: proposal.id,
      title: proposal.project.title,
      clientName: proposal.project.umkm.nama_usaha,
      description:
        proposal.coverLetter?.trim() ||
        "Proposal dikirim tanpa surat pengantar.",
      matchPercent: calculateSkillMatch(studentSkills, requiredSkills),
      status: mapProposalStatus(proposal.status),
      tags: requiredSkills,
      budgetLabel: formatBudget(proposal.project.budget),
      submittedLabel: `Diajukan ${formatRelativeDate(proposal.createdAt).toLocaleLowerCase("id-ID")}`,
    };
  });
  const summary = createSummary(proposals);

  return {
    proposals,
    summary,
    tabCounts: {
      Semua: summary.total,
      Pending: summary.pending,
      Accepted: summary.accepted,
      Rejected: summary.rejected,
    },
  };
}
