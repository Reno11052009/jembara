import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedSession: vi.fn(),
  userFindUnique: vi.fn(),
  proposalFindMany: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("./auth-guard", () => ({
  requireAuthenticatedSession: mocks.requireAuthenticatedSession,
}));
vi.mock("./prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    proposal: { findMany: mocks.proposalFindMany },
  },
}));
vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import { getStudentProposals } from "./proposals";

describe("getStudentProposals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuthenticatedSession.mockResolvedValue({
      userId: "user-1",
      role: "STUDENT",
      name: "Andi",
    });
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
