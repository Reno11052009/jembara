import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  userFindUnique: vi.fn(),
  transaction: vi.fn(),
  proposalFindFirst: vi.fn(),
  proposalFindMany: vi.fn(),
  proposalUpdateMany: vi.fn(),
  projectUpdateMany: vi.fn(),
  createNotification: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ verifySession: mocks.verifySession }));
vi.mock("@/lib/rate-limit", () => ({
  consumeRateLimit: vi.fn(),
  createRateLimitKey: vi.fn(),
}));
vi.mock("@/config/unifiedConfig", () => ({
  config: {
    security: {
      auth: {
        rateLimit: {
          proposalCreateByUser: { limit: 10, windowMs: 3_600_000 },
        },
      },
    },
  },
}));
vi.mock("@/lib/notifications", () => ({
  createUserNotification: mocks.createNotification,
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    project: { findFirst: vi.fn() },
    proposal: { create: vi.fn() },
    $transaction: mocks.transaction,
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

import {
  acceptProposalAction,
  rejectProposalAction,
} from "@/app/actions/proposals";

const PROPOSAL_ID = "11111111-1111-4111-8111-111111111111";
const PROJECT_ID = "22222222-2222-4222-8222-222222222222";

const pendingProposal = {
  id: PROPOSAL_ID,
  status: "PENDING",
  studentId: "student-1",
  student: {
    userId: "student-user-1",
    user: { name: "Ayu" },
  },
  project: {
    id: PROJECT_ID,
    title: "Website Katalog",
    status: "OPEN",
    studentId: null,
  },
};

describe("proposal decisions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({
      userId: "owner-user-1",
      role: "UMKM",
      name: "Rina",
    });
    mocks.userFindUnique.mockResolvedValue({
      role: "UMKM",
      umkm: { id: "umkm-1" },
    });
    mocks.proposalFindFirst.mockResolvedValue(pendingProposal);
    mocks.proposalFindMany.mockResolvedValue([
      { student: { userId: "student-user-2" } },
    ]);
    mocks.proposalUpdateMany.mockResolvedValue({ count: 1 });
    mocks.projectUpdateMany.mockResolvedValue({ count: 1 });
    mocks.createNotification.mockResolvedValue({ id: "notification-1" });
    mocks.transaction.mockImplementation(
      async (callback: (transaction: unknown) => Promise<unknown>) =>
        callback({
          proposal: {
            findFirst: mocks.proposalFindFirst,
            findMany: mocks.proposalFindMany,
            updateMany: mocks.proposalUpdateMany,
          },
          project: { updateMany: mocks.projectUpdateMany },
        }),
    );
  });

  it("selects one candidate, waits for payment, and rejects other proposals", async () => {
    await expect(acceptProposalAction(PROPOSAL_ID)).resolves.toEqual({
      success: true,
      projectId: PROJECT_ID,
      paymentRequired: true,
    });

    expect(mocks.projectUpdateMany).toHaveBeenCalledWith({
      where: {
        id: PROJECT_ID,
        umkmId: "umkm-1",
        studentId: null,
        status: { in: ["OPEN", "PROPOSAL"] },
      },
      data: { studentId: "student-1", status: "PROPOSAL" },
    });
    expect(mocks.proposalUpdateMany).toHaveBeenNthCalledWith(1, {
      where: { id: PROPOSAL_ID, status: "PENDING" },
      data: { status: "ACCEPTED" },
    });
    expect(mocks.proposalUpdateMany).toHaveBeenNthCalledWith(2, {
      where: {
        projectId: PROJECT_ID,
        id: { not: PROPOSAL_ID },
        status: "PENDING",
      },
      data: { status: "REJECTED" },
    });
    expect(mocks.createNotification).toHaveBeenCalledTimes(2);
    expect(mocks.revalidatePath).toHaveBeenCalledWith(
      "/dashboard/active-projects",
    );
  });

  it("rejects a pending proposal without changing the project owner or candidate", async () => {
    await expect(rejectProposalAction(PROPOSAL_ID)).resolves.toEqual({
      success: true,
    });

    expect(mocks.projectUpdateMany).not.toHaveBeenCalled();
    expect(mocks.proposalUpdateMany).toHaveBeenCalledWith({
      where: {
        id: PROPOSAL_ID,
        status: "PENDING",
        project: {
          umkmId: "umkm-1",
          studentId: null,
          status: { in: ["OPEN", "PROPOSAL"] },
        },
      },
      data: { status: "REJECTED" },
    });
    expect(mocks.createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "student-user-1",
        title: "Proposal belum diterima",
      }),
    );
  });

  it("prevents a non-UMKM user from deciding a proposal", async () => {
    mocks.userFindUnique.mockResolvedValue({ role: "STUDENT", umkm: null });

    await expect(acceptProposalAction(PROPOSAL_ID)).resolves.toEqual({
      success: false,
      error: "Hanya pemilik UMKM yang dapat menentukan proposal.",
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("does not overwrite a candidate selected by a concurrent request", async () => {
    mocks.projectUpdateMany.mockResolvedValue({ count: 0 });

    const result = await acceptProposalAction(PROPOSAL_ID);

    expect(result.success).toBe(false);
    expect(result.error).toContain("Kandidat lain telah dipilih");
    expect(mocks.proposalUpdateMany).not.toHaveBeenCalled();
  });
});
