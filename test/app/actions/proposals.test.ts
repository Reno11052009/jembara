import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  userFindUnique: vi.fn(),
  projectFindFirst: vi.fn(),
  proposalCreate: vi.fn(),
  consumeRateLimit: vi.fn(),
  createUserNotification: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ verifySession: mocks.verifySession }));
vi.mock("@/lib/rate-limit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  createRateLimitKey: vi.fn(() => "proposal:create:test"),
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
  createUserNotification: mocks.createUserNotification,
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    project: { findFirst: mocks.projectFindFirst },
    proposal: { create: mocks.proposalCreate },
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import { createProposalAction } from "@/app/actions/proposals";

const PROJECT_ID = "11111111-1111-4111-8111-111111111111";

function createFormData(overrides: Partial<Record<string, string>> = {}) {
  const formData = new FormData();
  formData.set("projectId", overrides.projectId ?? PROJECT_ID);
  formData.set(
    "coverLetter",
    overrides.coverLetter ??
      "Saya berpengalaman membangun website katalog dan siap menyelesaikan project ini tepat waktu.",
  );
  if (overrides.budgetAgreement !== "missing") {
    formData.set("budgetAgreement", "on");
  }
  return formData;
}

describe("createProposalAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({
      userId: "student-user-1",
      role: "STUDENT",
      name: "Ayu",
    });
    mocks.userFindUnique.mockResolvedValue({
      role: "STUDENT",
      student: { id: "student-1" },
    });
    mocks.consumeRateLimit.mockResolvedValue({ allowed: true });
    mocks.projectFindFirst.mockResolvedValue({
      id: PROJECT_ID,
      title: "Website Katalog",
      umkm: { userId: "owner-user-1" },
    });
    mocks.proposalCreate.mockResolvedValue({ id: "proposal-1" });
    mocks.createUserNotification.mockResolvedValue({ id: "notification-1" });
    mocks.redirect.mockImplementation((path: string) => {
      throw new Error(`NEXT_REDIRECT:${path}`);
    });
  });

  it("creates one pending proposal for the authenticated student", async () => {
    await expect(createProposalAction({}, createFormData())).rejects.toThrow(
      "NEXT_REDIRECT:/dashboard/proposals",
    );

    expect(mocks.proposalCreate).toHaveBeenCalledWith({
      data: {
        projectId: PROJECT_ID,
        studentId: "student-1",
        coverLetter:
          "Saya berpengalaman membangun website katalog dan siap menyelesaikan project ini tepat waktu.",
        budgetMatch: true,
        status: "PENDING",
      },
      select: { id: true },
    });
    expect(mocks.createUserNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "owner-user-1",
        preferenceKey: "proposalMasuk",
      }),
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard/pelamar");
  });

  it("rejects invalid proposal content before database access", async () => {
    const result = await createProposalAction(
      {},
      createFormData({ coverLetter: "Terlalu pendek" }),
    );

    expect(result.error).toContain("minimal 50 karakter");
    expect(mocks.userFindUnique).not.toHaveBeenCalled();
  });

  it("rejects users without a student profile", async () => {
    mocks.userFindUnique.mockResolvedValue({ role: "UMKM", student: null });

    await expect(createProposalAction({}, createFormData())).resolves.toEqual({
      error: "Hanya akun pelajar yang dapat mengirim proposal.",
    });
    expect(mocks.proposalCreate).not.toHaveBeenCalled();
  });

  it("rejects projects that no longer accept proposals", async () => {
    mocks.projectFindFirst.mockResolvedValue(null);

    const result = await createProposalAction({}, createFormData());

    expect(result.error).toContain("tidak menerima proposal");
    expect(mocks.proposalCreate).not.toHaveBeenCalled();
  });
});
