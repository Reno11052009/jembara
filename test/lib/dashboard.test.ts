import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedSession: vi.fn(),
  userFindUnique: vi.fn(),
  userFindMany: vi.fn(),
  userCount: vi.fn(),
  studentCount: vi.fn(),
  umkmCount: vi.fn(),
  projectCount: vi.fn(),
  projectGroupBy: vi.fn(),
  projectFindMany: vi.fn(),
  proposalCount: vi.fn(),
  proposalGroupBy: vi.fn(),
  proposalFindMany: vi.fn(),
  reviewAggregate: vi.fn(),
  notificationFindMany: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth-guard", () => ({
  requireAuthenticatedSession: mocks.requireAuthenticatedSession,
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: mocks.userFindUnique,
      findMany: mocks.userFindMany,
      count: mocks.userCount,
    },
    student: { count: mocks.studentCount },
    umkm: { count: mocks.umkmCount },
    project: {
      count: mocks.projectCount,
      groupBy: mocks.projectGroupBy,
      findMany: mocks.projectFindMany,
    },
    proposal: {
      count: mocks.proposalCount,
      groupBy: mocks.proposalGroupBy,
      findMany: mocks.proposalFindMany,
    },
    review: { aggregate: mocks.reviewAggregate },
    notification: { findMany: mocks.notificationFindMany },
  },
}));

import { getDashboardData } from "@/lib/dashboard";

describe("getDashboardData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads an authenticated UMKM dashboard from owned database records", async () => {
    const now = new Date();

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
    mocks.projectGroupBy.mockResolvedValue([
      { status: "OPEN", _count: { _all: 1 } },
      { status: "IN_PROGRESS", _count: { _all: 1 } },
      { status: "COMPLETED", _count: { _all: 1 } },
    ]);
    mocks.proposalCount.mockResolvedValue(3);
    mocks.proposalFindMany.mockResolvedValue([
      {
        id: "proposal-1",
        createdAt: now,
        project: {
          title: "Katalog Produk",
          skillsNeeded: [{ skill: { name: "UI/UX Design" } }],
        },
        student: {
          jurusan: "Desain Komunikasi Visual",
          user: { name: "Talent Baru", avatar: null },
          skills: [{ skill: { name: "UI/UX Design" } }],
        },
      },
    ]);
    mocks.projectFindMany
      .mockResolvedValueOnce([
        {
          id: "project-1",
          title: "Katalog Produk",
          status: "OPEN",
          budget: 1_500_000,
          deadline: null,
          umkm: { nama_usaha: "Warung Jembara" },
          student: null,
          skillsNeeded: [{ skill: { name: "UI/UX Design" } }],
          _count: { proposals: 3 },
        },
      ])
      .mockResolvedValueOnce([]);
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
      userName: "Pemilik",
      profileCompletionPercent: 86,
      notifications: [],
      umkmOverview: {
        businessName: "Warung Jembara",
        stats: [
          { id: "lowongan-aktif", value: "1 Lowongan" },
          { id: "total-pelamar", value: "3 Orang" },
          { id: "proyek-berjalan", value: "1 Proyek" },
          { id: "proyek-selesai", value: "1 Proyek" },
        ],
        recentJobListings: [
          expect.objectContaining({
            id: "project-1",
            applicantCount: 3,
            status: "Aktif",
          }),
        ],
        recentApplicants: [
          expect.objectContaining({
            id: "proposal-1",
            name: "Talent Baru",
            matchPercent: 100,
          }),
        ],
      },
    });
    expect(dashboard.metrics.map((metric) => metric.value)).toEqual([
      "3 Proyek",
      "3 Proposal",
      "1 Aktif",
      "1 Selesai",
    ]);
    expect(mocks.proposalFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { project: { umkmId: "umkm-1" } },
      }),
    );
  });

  it("loads the admin overview from platform database aggregates", async () => {
    const now = new Date();

    mocks.requireAuthenticatedSession.mockResolvedValue({
      userId: "admin-user-1",
      role: "ADMIN",
      name: "Admin Jembara",
    });
    mocks.userFindUnique.mockResolvedValue({
      id: "admin-user-1",
      name: "Admin Jembara",
      avatar: null,
      bio: null,
      location: null,
      portfolioUrl: null,
      github: null,
      linkedin: null,
      behance: null,
      role: "ADMIN",
      student: null,
      umkm: null,
    });
    mocks.studentCount
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(2);
    mocks.umkmCount
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(1);
    mocks.userCount.mockResolvedValueOnce(5);
    mocks.projectGroupBy.mockResolvedValue([
      { status: "OPEN", _count: { _all: 4 } },
      { status: "IN_PROGRESS", _count: { _all: 2 } },
      { status: "COMPLETED", _count: { _all: 1 } },
      { status: "CANCELLED", _count: { _all: 1 } },
    ]);
    mocks.proposalGroupBy.mockResolvedValue([
      { status: "PENDING", _count: { _all: 3 } },
      { status: "ACCEPTED", _count: { _all: 2 } },
      { status: "REJECTED", _count: { _all: 1 } },
    ]);
    mocks.userFindMany
      .mockResolvedValueOnce([{ createdAt: now }])
      .mockResolvedValueOnce([
        {
          id: "student-user-1",
          email: "talent@example.com",
          name: "Talent Baru",
          role: "STUDENT",
          createdAt: now,
        },
      ]);
    mocks.projectFindMany.mockResolvedValue([
      {
        id: "project-1",
        title: "Katalog Produk",
        status: "OPEN",
        budget: 1_500_000,
        deadline: null,
        createdAt: now,
        updatedAt: now,
        umkm: { nama_usaha: "UMKM Maju" },
        student: null,
        skillsNeeded: [],
        _count: { proposals: 2 },
      },
    ]);
    mocks.notificationFindMany.mockResolvedValue([]);

    const dashboard = await getDashboardData();

    expect(dashboard).toMatchObject({
      role: "ADMIN",
      userName: "Admin Jembara",
      adminOverview: {
        stats: [
          { id: "talent", value: "10" },
          { id: "umkm", value: "3" },
          { id: "lowongan", value: "8" },
          { id: "proyek", value: "2" },
          { id: "proposal", value: "6" },
        ],
        quickActions: expect.arrayContaining([
          expect.objectContaining({ href: "/dashboard/daftar-user" }),
          expect.objectContaining({ href: "/dashboard/lowongan" }),
        ]),
      },
    });
    expect(dashboard.adminOverview?.userGrowthData).toHaveLength(6);
    expect(dashboard.adminOverview?.platformActivities).toHaveLength(2);
    expect(mocks.userFindMany).toHaveBeenCalledTimes(2);
    expect(mocks.projectFindMany).toHaveBeenCalledTimes(1);
  });
});
