import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdminSession: vi.fn(),
  redirect: vi.fn(),
  userFindUnique: vi.fn(),
  studentCount: vi.fn(),
  studentFindMany: vi.fn(),
  skillFindMany: vi.fn(),
  umkmCount: vi.fn(),
  umkmFindMany: vi.fn(),
  projectCount: vi.fn(),
  projectFindMany: vi.fn(),
  messageCount: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/auth-guard", () => ({
  requireAdminSession: mocks.requireAdminSession,
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    student: { count: mocks.studentCount, findMany: mocks.studentFindMany },
    skill: { findMany: mocks.skillFindMany },
    umkm: { count: mocks.umkmCount, findMany: mocks.umkmFindMany },
    project: { count: mocks.projectCount, findMany: mocks.projectFindMany },
    message: { count: mocks.messageCount },
  },
}));

import {
  getAdminChatMonitoringData,
  getAdminJobsData,
  getAdminRelationsData,
  getAdminUmkmData,
  getAdminUsersData,
} from "@/lib/admin";

describe("admin data access", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAdminSession.mockResolvedValue({
      userId: "admin-user-1",
      role: "ADMIN",
      name: "Admin Jembara",
    });
    mocks.userFindUnique.mockResolvedValue({
      name: "Admin Jembara",
      avatar: null,
      role: "ADMIN",
      admin: { id: "admin-profile-1" },
    });
    mocks.redirect.mockImplementation((path: string) => {
      throw new Error(`NEXT_REDIRECT:${path}`);
    });
  });

  it("does not query Prisma when the admin guard rejects the request", async () => {
    mocks.requireAdminSession.mockRejectedValue(
      new Error("NEXT_REDIRECT:/forbidden"),
    );

    await expect(getAdminUsersData()).rejects.toThrow(
      "NEXT_REDIRECT:/forbidden",
    );
    expect(mocks.userFindUnique).not.toHaveBeenCalled();
    expect(mocks.studentCount).not.toHaveBeenCalled();
    expect(mocks.studentFindMany).not.toHaveBeenCalled();
  });

  it("rejects an ADMIN session without a valid admin profile", async () => {
    mocks.userFindUnique.mockResolvedValue({
      name: "Admin",
      avatar: null,
      role: "ADMIN",
      admin: null,
    });

    await expect(getAdminUsersData()).rejects.toThrow(
      "NEXT_REDIRECT:/forbidden",
    );
    expect(mocks.studentCount).not.toHaveBeenCalled();
  });

  it("loads paginated talent data with server-side filters and a cold-start rating", async () => {
    mocks.studentCount.mockResolvedValue(21);
    mocks.skillFindMany.mockResolvedValue([{ name: "React" }]);
    mocks.studentFindMany.mockResolvedValue([
      {
        id: "student-1",
        available: true,
        rating: 0,
        createdAt: new Date("2026-08-01T00:00:00Z"),
        user: {
          id: "student-user-1",
          name: "Ayu",
          email: "ayu@example.com",
          createdAt: new Date("2026-07-31T00:00:00Z"),
        },
        skills: [{ skill: { name: "React" } }],
        _count: { reviews: 0 },
      },
    ]);

    const data = await getAdminUsersData({
      q: "ayu",
      availability: "tersedia",
      skill: "React",
      page: "2",
    });

    expect(mocks.studentFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 20, take: 20 }),
    );
    const call = mocks.studentFindMany.mock.calls[0][0];
    expect(call.select.user.select).toEqual({
      id: true,
      name: true,
      email: true,
      createdAt: true,
    });
    expect(call.select.user.select).not.toHaveProperty("password");
    expect(data).toMatchObject({
      currentPage: 2,
      totalPages: 2,
      filters: { query: "ayu", availability: "tersedia", skill: "React" },
      users: [
        {
          id: "student-user-1",
          name: "Ayu",
          rating: null,
          availability: "tersedia",
          skill: "React",
        },
      ],
    });
  });

  it("maps UMKM profile completeness without claiming verification", async () => {
    mocks.umkmCount.mockResolvedValue(1);
    mocks.umkmFindMany.mockResolvedValue([
      {
        id: "umkm-1",
        nama_usaha: "Kopi Jembara",
        kategori_usaha: null,
        kabupaten_nama: "Bandung",
        provinsi_nama: "Jawa Barat",
        createdAt: new Date("2026-08-01T00:00:00Z"),
        user: {
          name: "Budi",
          email: "budi@example.com",
          location: "Bandung",
        },
        _count: { projects: 2 },
      },
    ]);

    const data = await getAdminUmkmData({
      q: "kopi",
      profileStatus: "perlu_dilengkapi",
    });

    expect(mocks.umkmCount.mock.calls[0][0].where.AND).toHaveLength(2);
    expect(data.rows[0]).toMatchObject({
      businessName: "Kopi Jembara",
      location: "Bandung",
      jobCount: 2,
      profileStatus: "perlu_dilengkapi",
    });
  });

  it("loads real project statistics and lifecycle statuses", async () => {
    mocks.projectCount
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(2);
    mocks.projectFindMany.mockResolvedValue([
      {
        id: "project-1",
        title: "Website UMKM",
        budget: 2_500_000,
        status: "IN_PROGRESS",
        umkm: { nama_usaha: "Kopi Jembara" },
        skillsNeeded: [
          { skill: { name: "React", category: "Web Development" } },
        ],
        _count: { proposals: 4 },
      },
    ]);

    const data = await getAdminJobsData();

    expect(data.stats.map(({ value }) => value)).toEqual(["10", "3", "5", "2"]);
    expect(data.rows[0]).toMatchObject({
      id: "project-1",
      category: "Web Development",
      applicantCount: 4,
      status: "IN_PROGRESS",
    });
  });

  it("loads only selected-student projects for admin relations", async () => {
    mocks.projectFindMany.mockResolvedValue([
      {
        id: "project-1",
        title: "Logo Produk",
        budget: 750_000,
        status: "COMPLETED",
        umkm: {
          nama_usaha: "Kopi Jembara",
          user: { name: "Budi" },
        },
        student: {
          school: "SMK Negeri 1",
          user: { name: "Ayu" },
        },
        review: { rating: 4.5 },
      },
    ]);

    const data = await getAdminRelationsData({ status: "selesai" });

    expect(mocks.projectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          studentId: { not: null },
          status: { in: ["COMPLETED"] },
        },
      }),
    );
    expect(data.rows[0]).toMatchObject({
      talentName: "Ayu",
      status: "selesai",
      rating: 4.5,
    });
  });

  it("returns aggregate chat statistics without exposing private messages", async () => {
    mocks.projectCount.mockResolvedValue(8);
    mocks.messageCount.mockResolvedValue(17);

    const data = await getAdminChatMonitoringData();

    expect(data.stats.map(({ value }) => value)).toEqual([
      "8",
      "17",
      "Belum tersedia",
    ]);
    expect(data.conversations).toEqual([]);
    expect(data.messages).toEqual([]);
    expect(mocks.projectFindMany).not.toHaveBeenCalled();
  });
});
