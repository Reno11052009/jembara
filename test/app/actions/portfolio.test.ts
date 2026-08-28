import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  userFindUnique: vi.fn(),
  studentUpsert: vi.fn(),
  portfolioCount: vi.fn(),
  portfolioCreate: vi.fn(),
  consumeRateLimit: vi.fn(),
  transaction: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/session", () => ({ verifySession: mocks.verifySession }));
vi.mock("@/lib/rate-limit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  createRateLimitKey: vi.fn(() => "portfolio:test"),
}));
vi.mock("@/config/unifiedConfig", () => ({
  config: {
    security: {
      auth: {
        rateLimit: {
          portfolioCreateByUser: { limit: 5, windowMs: 600_000 },
        },
      },
    },
  },
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    $transaction: mocks.transaction,
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import { createPortfolioAction } from "@/app/actions/portfolio";

function createFormData(overrides: Partial<Record<string, string>> = {}) {
  const formData = new FormData();
  formData.set("title", overrides.title ?? "Website Katalog Kopi");
  formData.set("description", overrides.description ?? "Katalog produk UMKM");
  formData.set("link", overrides.link ?? "example.com/karya");
  formData.set("image", overrides.image ?? "https://example.com/image.jpg");
  return formData;
}

describe("createPortfolioAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({
      userId: "user-1",
      role: "STUDENT",
      name: "Andi",
    });
    mocks.userFindUnique.mockResolvedValue({
      role: "STUDENT",
      student: { id: "student-1" },
    });
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 4,
      retryAfterSeconds: 0,
    });
    mocks.studentUpsert.mockResolvedValue({ id: "student-1" });
    mocks.portfolioCount.mockResolvedValue(0);
    mocks.portfolioCreate.mockResolvedValue({ id: "portfolio-1" });
    mocks.transaction.mockImplementation(async (callback) =>
      callback({
        student: { upsert: mocks.studentUpsert },
        portfolio: {
          count: mocks.portfolioCount,
          create: mocks.portfolioCreate,
        },
      }),
    );
  });

  it("creates a portfolio owned by the authenticated student", async () => {
    await expect(createPortfolioAction(createFormData())).resolves.toEqual({
      success: true,
    });

    expect(mocks.portfolioCreate).toHaveBeenCalledWith({
      data: {
        studentId: "student-1",
        title: "Website Katalog Kopi",
        description: "Katalog produk UMKM",
        link: "https://example.com/karya",
        image: "https://example.com/image.jpg",
      },
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard/portfolio");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard/profile");
  });

  it("creates the student profile when it does not exist yet", async () => {
    mocks.userFindUnique.mockResolvedValue({ role: "STUDENT", student: null });
    mocks.studentUpsert.mockResolvedValue({ id: "student-new" });

    const result = await createPortfolioAction(createFormData());

    expect(result.success).toBe(true);
    expect(mocks.studentUpsert).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      update: {},
      create: { userId: "user-1" },
      select: { id: true },
    });
    expect(mocks.portfolioCreate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ studentId: "student-new" }) }),
    );
  });

  it("rejects non-student users before creating a portfolio", async () => {
    mocks.userFindUnique.mockResolvedValue({ role: "UMKM", student: null });

    const result = await createPortfolioAction(createFormData());

    expect(result).toEqual({
      success: false,
      error: "Hanya akun student yang dapat menambah portofolio.",
    });
    expect(mocks.portfolioCreate).not.toHaveBeenCalled();
  });

  it("rejects invalid input before accessing portfolio data", async () => {
    const result = await createPortfolioAction(
      createFormData({ title: "A", image: "alamat gambar tidak valid" }),
    );

    expect(result.success).toBe(false);
    expect(mocks.userFindUnique).not.toHaveBeenCalled();
    expect(mocks.portfolioCreate).not.toHaveBeenCalled();
  });

  it("rate limits portfolio creation with a fixed user bucket", async () => {
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: false,
      remaining: 0,
      retryAfterSeconds: 60,
    });

    await expect(createPortfolioAction(createFormData())).resolves.toEqual({
      success: false,
      error: "Terlalu banyak portofolio ditambahkan. Silakan coba lagi nanti.",
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("enforces the maximum number of portfolios", async () => {
    mocks.portfolioCount.mockResolvedValue(20);

    await expect(createPortfolioAction(createFormData())).resolves.toEqual({
      success: false,
      error: "Maksimal 20 portofolio per pelajar.",
    });
    expect(mocks.portfolioCreate).not.toHaveBeenCalled();
  });
});
