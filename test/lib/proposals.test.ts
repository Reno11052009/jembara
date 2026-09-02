import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedSession: vi.fn(),
  userFindUnique: vi.fn(),
  proposalFindMany: vi.fn(),
  proposalGroupBy: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth-guard", () => ({
  requireAuthenticatedSession: mocks.requireAuthenticatedSession,
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    proposal: { findMany: mocks.proposalFindMany, groupBy: mocks.proposalGroupBy },
  },
}));
vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import { getStudentProposals } from "@/lib/proposals";

describe("getStudentProposals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuthenticatedSession.mockResolvedValue({
      userId: "user-1",
      role: "STUDENT",
      name: "Andi",
    });
    mocks.proposalGroupBy.mockResolvedValue([]);
  });

  it("loads only proposals owned by the authenticated student", async () => {
    mocks.userFindUnique.mockResolvedValue({
      role: "STUDENT",
      student: {
        id: "student-1",
        skills: [{ skill: { name: "Figma" } }],
      },
    });
    mocks.proposalFindMany.mockResolvedValue([
      {
        id: "proposal-1",
        coverLetter: "Saya siap membantu membuat desain.",
        status: "PENDING",
        createdAt: new Date(),
        project: {
          title: "Desain Katalog",
          description: "Membuat katalog digital",
          budget: 2_000_000,
          umkm: { nama_usaha: "UMKM Maju" },
          skillsNeeded: [{ skill: { name: "Figma" } }],
        },
      },
    ]);
    mocks.proposalGroupBy.mockResolvedValue([{ status: "PENDING", _count: { _all: 1 } }]);

    const data = await getStudentProposals();

    expect(mocks.proposalFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { studentId: "student-1" } }),
    );
    expect(data.proposals[0]).toMatchObject({
      id: "proposal-1",
      clientName: "UMKM Maju",
      status: "Pending",
      matchPercent: 100,
    });
    expect(data.summary).toEqual({
      total: 1,
      pending: 1,
      accepted: 0,
      rejected: 0,
    });
  });

  it("returns an empty proposal dashboard before the student profile exists", async () => {
    mocks.userFindUnique.mockResolvedValue({ role: "STUDENT", student: null });

    const data = await getStudentProposals();

    expect(mocks.proposalFindMany).not.toHaveBeenCalled();
    expect(data.summary.total).toBe(0);
    expect(data.proposals).toEqual([]);
  });

  it.each(["UMKM", "ADMIN"])("rejects direct access for role %s", async (role) => {
    mocks.userFindUnique.mockResolvedValue({ role, student: null });
    mocks.redirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    await expect(getStudentProposals()).rejects.toThrow("NEXT_REDIRECT");
    expect(mocks.proposalFindMany).not.toHaveBeenCalled();
  });
});
