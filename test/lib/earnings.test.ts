import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedSession: vi.fn(),
  userFindUnique: vi.fn(),
  projectFindMany: vi.fn(),
  projectGroupBy: vi.fn(),
  projectAggregate: vi.fn(),
  queryRaw: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth-guard", () => ({
  requireAuthenticatedSession: mocks.requireAuthenticatedSession,
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    project: { findMany: mocks.projectFindMany, groupBy: mocks.projectGroupBy, aggregate: mocks.projectAggregate },
    $queryRaw: mocks.queryRaw,
  },
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import { getEarningsData } from "@/lib/earnings";

describe("getEarningsData", () => {
  const now = new Date("2026-08-24T12:00:00.000Z");

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuthenticatedSession.mockResolvedValue({
      userId: "user-1",
      role: "STUDENT",
      name: "Andi",
    });
    mocks.userFindUnique.mockResolvedValue({
      role: "STUDENT",
      student: { id: "student-1" },
    });
    mocks.projectGroupBy.mockResolvedValue([]);
    mocks.projectAggregate.mockResolvedValue({ _sum: { budget: null } });
    mocks.queryRaw.mockResolvedValue([]);
  });

  it("loads only the authenticated student's project values", async () => {
    mocks.projectFindMany.mockResolvedValue([
      {
        id: "project-completed-current",
        title: "Website Katalog",
        budget: 2_000_000,
        status: "COMPLETED",
        updatedAt: new Date("2026-08-10T10:00:00.000Z"),
        umkm: { nama_usaha: "Kopi Maju" },
      },
      {
        id: "project-completed-previous",
        title: "Desain Logo",
        budget: 1_000_000,
        status: "COMPLETED",
        updatedAt: new Date("2026-07-12T10:00:00.000Z"),
        umkm: { nama_usaha: "Toko Cerah" },
      },
      {
        id: "project-completed-no-budget",
        title: "Konten Sosial Media",
        budget: null,
        status: "COMPLETED",
        updatedAt: new Date("2026-08-15T10:00:00.000Z"),
        umkm: { nama_usaha: "Usaha Baru" },
      },
      {
        id: "project-review",
        title: "Foto Produk",
        budget: 500_000,
        status: "REVIEW",
        updatedAt: new Date("2026-08-20T10:00:00.000Z"),
        umkm: { nama_usaha: "Rasa Lokal" },
      },
      {
        id: "project-running",
        title: "Video Promosi",
        budget: 750_000,
        status: "IN_PROGRESS",
        updatedAt: new Date("2026-08-21T10:00:00.000Z"),
        umkm: { nama_usaha: "Kriya Kita" },
      },
    ]);
    mocks.projectGroupBy.mockResolvedValue([
      { status: "COMPLETED", _count: { _all: 2 }, _sum: { budget: 3_000_000 } },
      { status: "REVIEW", _count: { _all: 1 }, _sum: { budget: 500_000 } },
      { status: "IN_PROGRESS", _count: { _all: 1 }, _sum: { budget: 750_000 } },
    ]);
    mocks.projectAggregate.mockResolvedValue({ _sum: { budget: 2_000_000 } });
    mocks.queryRaw.mockResolvedValue([
      { period: new Date("2026-07-01T00:00:00.000Z"), amount: 1_000_000 },
      { period: new Date("2026-08-01T00:00:00.000Z"), amount: 2_000_000 },
    ]);

    const result = await getEarningsData(now);

    expect(mocks.projectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          studentId: "student-1",
          status: { in: ["IN_PROGRESS", "REVIEW", "COMPLETED"] },
          budget: { not: null },
        },
      }),
    );
    expect(result.stats.find(({ id }) => id === "total")?.value).toContain(
      "3.000.000",
    );
    expect(result.stats.find(({ id }) => id === "month")?.value).toContain(
      "2.000.000",
    );
    expect(result.stats.find(({ id }) => id === "pending")?.value).toContain(
      "500.000",
    );
    expect(result.stats.find(({ id }) => id === "average")?.value).toContain(
      "1.500.000",
    );
    expect(result.transactions).toHaveLength(4);
    expect(result.transactions.map(({ status }) => status)).toEqual([
      "Selesai",
      "Selesai",
      "Dalam Review",
      "Berjalan",
    ]);
  });

  it("groups completed project values by month and zero-fills six months", async () => {
    mocks.projectFindMany.mockResolvedValue([
      {
        id: "project-july",
        title: "Desain Logo",
        budget: 1_000_000,
        status: "COMPLETED",
        updatedAt: new Date("2026-07-12T10:00:00.000Z"),
        umkm: { nama_usaha: "Toko Cerah" },
      },
      {
        id: "project-august",
        title: "Website Katalog",
        budget: 2_000_000,
        status: "COMPLETED",
        updatedAt: new Date("2026-08-10T10:00:00.000Z"),
        umkm: { nama_usaha: "Kopi Maju" },
      },
    ]);
    mocks.projectGroupBy.mockResolvedValue([{ status: "COMPLETED", _count: { _all: 2 }, _sum: { budget: 3_000_000 } }]);
    mocks.projectAggregate.mockResolvedValue({ _sum: { budget: 2_000_000 } });
    mocks.queryRaw.mockResolvedValue([
      { period: new Date("2026-07-01T00:00:00.000Z"), amount: 1_000_000 },
      { period: new Date("2026-08-01T00:00:00.000Z"), amount: 2_000_000 },
    ]);

    const result = await getEarningsData(now);

    expect(result.chartData.map(({ period }) => period)).toEqual([
      "2026-03",
      "2026-04",
      "2026-05",
      "2026-06",
      "2026-07",
      "2026-08",
    ]);
    expect(result.chartData.slice(-2).map(({ amount }) => amount)).toEqual([
      1_000_000,
      2_000_000,
    ]);
  });

  it("returns empty data before the student profile exists", async () => {
    mocks.userFindUnique.mockResolvedValue({ role: "STUDENT", student: null });

    const result = await getEarningsData(now);

    expect(mocks.projectFindMany).not.toHaveBeenCalled();
    expect(result.transactions).toEqual([]);
    expect(result.chartData).toHaveLength(6);
    expect(result.stats.every(({ value }) => value.includes("0"))).toBe(true);
  });

  it("loads only projects owned by the authenticated UMKM", async () => {
    mocks.userFindUnique.mockResolvedValue({
      role: "UMKM",
      student: null,
      umkm: { id: "umkm-1" },
    });
    mocks.projectFindMany.mockResolvedValue([
      {
        id: "project-umkm",
        title: "Katalog Produk",
        budget: 1_500_000,
        status: "IN_PROGRESS",
        updatedAt: new Date("2026-08-20T10:00:00.000Z"),
        umkm: { nama_usaha: "Kopi Maju" },
        student: { user: { name: "Andi" } },
      },
    ]);
    mocks.projectGroupBy.mockResolvedValue([{ status: "IN_PROGRESS", _count: { _all: 1 }, _sum: { budget: 1_500_000 } }]);

    const result = await getEarningsData(now);

    expect(mocks.projectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          umkmId: "umkm-1",
          status: { in: ["IN_PROGRESS", "REVIEW", "COMPLETED"] },
          budget: { not: null },
        },
      }),
    );
    expect(result.transactions[0]).toMatchObject({
      clientName: "Andi",
      status: "Berjalan",
    });
  });

  it("allows admin to view the platform project-value overview", async () => {
    mocks.userFindUnique.mockResolvedValue({
      role: "ADMIN",
      student: null,
      umkm: null,
    });
    mocks.projectFindMany.mockResolvedValue([]);

    await getEarningsData(now);

    expect(mocks.projectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: { in: ["IN_PROGRESS", "REVIEW", "COMPLETED"] },
          budget: { not: null },
        },
      }),
    );
  });
});
