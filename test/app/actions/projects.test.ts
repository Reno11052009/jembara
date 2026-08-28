import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  userFindUnique: vi.fn(),
  skillFindMany: vi.fn(),
  projectCreate: vi.fn(),
  consumeRateLimit: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ verifySession: mocks.verifySession }));
vi.mock("@/lib/rate-limit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  createRateLimitKey: vi.fn(() => "project:create:test"),
}));
vi.mock("@/config/unifiedConfig", () => ({
  config: {
    security: {
      auth: {
        rateLimit: {
          projectCreateByUser: { limit: 10, windowMs: 3_600_000 },
        },
      },
    },
  },
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    skill: { findMany: mocks.skillFindMany },
    project: { create: mocks.projectCreate },
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import { createProjectAction } from "@/app/actions/projects";

const SKILL_ID = "11111111-1111-4111-8111-111111111111";

function createFormData(overrides: Partial<Record<string, string>> = {}) {
  const formData = new FormData();
  formData.set("title", overrides.title ?? "Website katalog produk UMKM");
  formData.set(
    "description",
    overrides.description ?? "Membangun website katalog responsif untuk produk UMKM.",
  );
  formData.set("budget", overrides.budget ?? "2500000");
  formData.set("deadline", overrides.deadline ?? "2030-12-31");
  formData.set("workMode", overrides.workMode ?? "HYBRID");
  formData.set("location", overrides.location ?? "Malang");
  formData.append("skillIds", overrides.skillIds ?? SKILL_ID);
  return formData;
}

describe("createProjectAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({
      userId: "owner-user-1",
      role: "UMKM",
      name: "Pemilik",
    });
    mocks.userFindUnique.mockResolvedValue({
      role: "UMKM",
      umkm: { id: "umkm-1" },
    });
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 9,
      retryAfterSeconds: 0,
    });
    mocks.skillFindMany.mockResolvedValue([{ id: SKILL_ID }]);
    mocks.projectCreate.mockResolvedValue({ id: "project-1" });
    mocks.redirect.mockImplementation((path: string) => {
      throw new Error(`NEXT_REDIRECT:${path}`);
    });
  });

  it("creates an OPEN project owned by the authenticated UMKM", async () => {
    await expect(createProjectAction({}, createFormData())).rejects.toThrow(
      "NEXT_REDIRECT:/dashboard/lowongan-saya",
    );

    expect(mocks.projectCreate).toHaveBeenCalledWith({
      data: {
        title: "Website katalog produk UMKM",
        description: "Membangun website katalog responsif untuk produk UMKM.",
        budget: 2_500_000,
        deadline: new Date("2030-12-31T23:59:59.999+07:00"),
        workMode: "HYBRID",
        location: "Malang",
        status: "OPEN",
        umkmId: "umkm-1",
        skillsNeeded: { create: [{ skillId: SKILL_ID }] },
      },
      select: { id: true },
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith(
      "/dashboard/lowongan-saya",
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith(
      "/dashboard/find-projects",
    );
  });

  it("rejects invalid input before reading ownership data", async () => {
    const result = await createProjectAction(
      {},
      createFormData({ title: "A", budget: "1000" }),
    );

    expect(result.error).toBeTruthy();
    expect(mocks.userFindUnique).not.toHaveBeenCalled();
    expect(mocks.projectCreate).not.toHaveBeenCalled();
  });

  it("rejects a user that is not an UMKM owner", async () => {
    mocks.userFindUnique.mockResolvedValue({ role: "STUDENT", umkm: null });

    await expect(createProjectAction({}, createFormData())).resolves.toEqual({
      error: "Hanya akun UMKM yang dapat membuat project.",
    });
    expect(mocks.projectCreate).not.toHaveBeenCalled();
  });

  it("rejects skill IDs that are not in the master taxonomy", async () => {
    mocks.skillFindMany.mockResolvedValue([]);

    const result = await createProjectAction({}, createFormData());

    expect(result.error).toContain("skill tidak tersedia");
    expect(mocks.projectCreate).not.toHaveBeenCalled();
  });
});
