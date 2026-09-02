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
import type { ProposalFilter } from "@/types/proposal";
import { createPagination, normalizePage } from "./pagination";

const PAGE_SIZE = 8;

function mapProposalStatus(status: string): ProposalStatus {
  if (status === "ACCEPTED") return "Accepted";
  if (status === "REJECTED") return "Rejected";
  return "Pending";
}

function normalizeFilter(value: unknown): ProposalFilter {
  const firstValue = Array.isArray(value) ? value[0] : value;
  return firstValue === "Pending" || firstValue === "Accepted" || firstValue === "Rejected"
    ? firstValue
    : "Semua";
}

export async function getStudentProposals(options: {
  page?: unknown;
  status?: unknown;
} = {}): Promise<ProposalsData> {
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
    const summary = { total: 0, pending: 0, accepted: 0, rejected: 0 };
    return {
      proposals: [],
      summary,
      tabCounts: {
        Semua: summary.total,
        Pending: summary.pending,
        Accepted: summary.accepted,
        Rejected: summary.rejected,
      },
      activeFilter: normalizeFilter(options.status),
      pagination: createPagination(normalizePage(options.page), 0, PAGE_SIZE),
    };
  }

  const studentSkills = viewer.student.skills.map(({ skill }) => skill.name);
  const activeFilter = normalizeFilter(options.status);
  const statusGroups = await prisma.proposal.groupBy({
    by: ["status"],
    where: { studentId: viewer.student.id },
    _count: { _all: true },
  });
  const countFor = (status: string) =>
    statusGroups.find((group) => group.status === status)?._count._all ?? 0;
  const summary: ProposalSummary = {
    total: statusGroups.reduce((total, group) => total + group._count._all, 0),
    pending: countFor("PENDING"),
    accepted: countFor("ACCEPTED"),
    rejected: countFor("REJECTED"),
  };
  const selectedStatus =
    activeFilter === "Semua" ? undefined : activeFilter.toUpperCase();
  const filteredTotal = selectedStatus
    ? countFor(selectedStatus)
    : summary.total;
  const pagination = createPagination(
    normalizePage(options.page),
    filteredTotal,
    PAGE_SIZE,
  );
  const proposalRecords = await prisma.proposal.findMany({
    where: {
      studentId: viewer.student.id,
      ...(selectedStatus ? { status: selectedStatus } : {}),
    },
    orderBy: { createdAt: "desc" },
    skip: (pagination.currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
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
  return {
    proposals,
    summary,
    tabCounts: {
      Semua: summary.total,
      Pending: summary.pending,
      Accepted: summary.accepted,
      Rejected: summary.rejected,
    },
    activeFilter,
    pagination,
  };
}
