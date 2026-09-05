import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  consumeRateLimit: vi.fn(),
  userFindUnique: vi.fn(),
  studentUpdateMany: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ verifySession: mocks.verifySession }));
vi.mock("@/lib/rate-limit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  createRateLimitKey: vi.fn(() => "privacy:test"),
}));
vi.mock("@/config/unifiedConfig", () => ({
  config: {
    security: {
      auth: { rateLimit: { privacyUpdateByUser: { limit: 10, windowMs: 600_000 } } },
    },
  },
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    student: { updateMany: mocks.studentUpdateMany },
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import { updateProfileVisibilityAction } from "@/app/actions/privacy";

describe("updateProfileVisibilityAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({
      userId: "11111111-1111-4111-8111-111111111111",
      role: "STUDENT",
      name: "Andi",
    });
    mocks.consumeRateLimit.mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
    mocks.userFindUnique.mockResolvedValue({
      role: "STUDENT",
      student: { id: "22222222-2222-4222-8222-222222222222" },
    });
    mocks.studentUpdateMany.mockResolvedValue({ count: 1 });
  });

  it("persists the student visibility choice", async () => {
    await expect(
      updateProfileVisibilityAction({ isPublicProfile: true }),
    ).resolves.toEqual({ success: true });
    expect(mocks.studentUpdateMany).toHaveBeenCalledWith({
      where: {
        id: "22222222-2222-4222-8222-222222222222",
        userId: "11111111-1111-4111-8111-111111111111",
      },
      data: { isPublicProfile: true },
    });
  });

  it("rejects unsupported client fields", async () => {
    await expect(
      updateProfileVisibilityAction({ isPublicProfile: true, userId: "attacker" }),
    ).resolves.toEqual({ success: false, error: "Pilihan privasi tidak valid." });
    expect(mocks.verifySession).not.toHaveBeenCalled();
  });
});
