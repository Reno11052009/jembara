import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedSession: vi.fn(),
  userFindUnique: vi.fn(),
  userCount: vi.fn(),
  projectCount: vi.fn(),
  projectFindMany: vi.fn(),
  proposalCount: vi.fn(),
  reviewAggregate: vi.fn(),
  notificationFindMany: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("./auth-guard", () => ({
  requireAuthenticatedSession: mocks.requireAuthenticatedSession,
}));
vi.mock("./prisma", () => ({
  default: {
    user: {
      findUnique: mocks.userFindUnique,
      count: mocks.userCount,
    },
    project: {
      count: mocks.projectCount,
      findMany: mocks.projectFindMany,
    },
    proposal: { count: mocks.proposalCount },
    review: { aggregate: mocks.reviewAggregate },
    notification: { findMany: mocks.notificationFindMany },
  },
}));

import { getDashboardData } from "./dashboard";

describe("getDashboardData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads an authenticated UMKM dashboard from owned database records", async () => {
    mocks.requireAuthenticatedSession.mockResolvedValue({
      userId: "user-1",
      role: "UMKM",
      name: "Pemilik",
    });
    mocks.userFindUnique.mockResolvedValue({
      id: "user-1",
      name: "Pemilik",
      avatar: null,
      bio: "Usaha makanan lokal",
      location: "Malang",
      portfolioUrl: null,
      github: null,
      linkedin: null,
      behance: null,
      role: "UMKM",
      student: null,
      umkm: {
        id: "umkm-1",
        nama_usaha: "Warung Jembara",
        kategori_usaha: "Kuliner",
        website: "jembara.example",
      },
    });
    mocks.projectCount
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(1);
    mocks.proposalCount.mockResolvedValue(3);
    mocks.projectFindMany.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
    mocks.notificationFindMany.mockResolvedValue([]);

    const dashboard = await getDashboardData();

    expect(mocks.userFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "user-1" } }),
    );
    expect(mocks.proposalCount).toHaveBeenCalledWith({
      where: { project: { umkmId: "umkm-1" } },
    });
    expect(dashboard).toMatchObject({
      role: "UMKM",
      userName: "Warung Jembara",
      profileCompletionPercent: 86,
      managedProjects: [],
      notifications: [],
    });
    expect(dashboard.metrics.map((metric) => metric.value)).toEqual([
      "2 Proyek",
      "3 Proposal",
      "1 Aktif",
      "1 Selesai",
    ]);
  });
});
