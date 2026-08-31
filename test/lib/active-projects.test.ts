import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedSession: vi.fn(),
  userFindUnique: vi.fn(),
  projectFindMany: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth-guard", () => ({
  requireAuthenticatedSession: mocks.requireAuthenticatedSession,
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    project: { findMany: mocks.projectFindMany },
  },
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import { getActiveProjectsData } from "@/lib/active-projects";

function createProjectRecord(
  overrides: Partial<{
    id: string;
    title: string;
    status: string;
    budget: number | null;
  }> = {},
) {
  return {
    id: overrides.id ?? "project-1",
    title: overrides.title ?? "Website UMKM",
    status: overrides.status ?? "IN_PROGRESS",
    budget: overrides.budget ?? 2_000_000,
    deadline: null,
    updatedAt: new Date(),
    umkm: { nama_usaha: "Kopi Jembara" },
    student: { user: { name: "Andi Pelajar" } },
    skillsNeeded: [{ skill: { name: "Web Development" } }],
    _count: { proposals: 3 },
  };
}

describe("getActiveProjectsData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuthenticatedSession.mockResolvedValue({
      userId: "user-1",
      role: "STUDENT",
      name: "Pengguna",
    });
  });

  it("loads only projects assigned to the authenticated student", async () => {
    mocks.userFindUnique.mockResolvedValue({
      role: "STUDENT",
      student: { id: "student-1", rating: 4.8 },
      umkm: null,
    });
    mocks.projectFindMany.mockResolvedValue([createProjectRecord()]);

    const data = await getActiveProjectsData();

    expect(mocks.projectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          studentId: "student-1",
          status: { in: ["IN_PROGRESS", "REVIEW", "COMPLETED"] },
        },
      }),
    );
    expect(data).toMatchObject({
      role: "STUDENT",
      pageTitle: "Proyek Aktif Saya",
      tabCounts: { "In Progress": 1, "In Review": 0, Completed: 0 },
    });
    expect(data.projects[0]).toMatchObject({
      clientName: "Kopi Jembara",
      counterpartLabel: "UMKM",
      status: "In Progress",
    });
  });

  it("loads owned business projects with selected talent information", async () => {
    mocks.userFindUnique.mockResolvedValue({
      role: "UMKM",
      student: null,
      umkm: { id: "umkm-1" },
    });
    mocks.projectFindMany.mockResolvedValue([
      createProjectRecord({ status: "REVIEW" }),
    ]);

    const data = await getActiveProjectsData();

    expect(mocks.projectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          umkmId: "umkm-1",
          status: { in: ["IN_PROGRESS", "REVIEW", "COMPLETED"] },
        },
      }),
    );
    expect(data).toMatchObject({
      role: "UMKM",
      pageTitle: "Kolaborasi Proyek UMKM",
      tabCounts: { "In Progress": 0, "In Review": 1, Completed: 0 },
    });
    expect(data.projects[0]).toMatchObject({
      clientName: "Andi Pelajar",
      counterpartLabel: "Talent",
      proposalCount: 3,
    });
  });

  it("allows admin to inspect active projects without an ownership filter", async () => {
    mocks.userFindUnique.mockResolvedValue({
      role: "ADMIN",
      student: null,
      umkm: null,
    });
    mocks.projectFindMany.mockResolvedValue([]);

    const data = await getActiveProjectsData();

    expect(mocks.projectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: { in: ["IN_PROGRESS", "REVIEW", "COMPLETED"] } },
      }),
    );
    expect(data.role).toBe("ADMIN");
  });

  it("returns an empty dashboard when a role profile is not created yet", async () => {
    mocks.userFindUnique.mockResolvedValue({
      role: "STUDENT",
      student: null,
      umkm: null,
    });

    const data = await getActiveProjectsData();

    expect(mocks.projectFindMany).not.toHaveBeenCalled();
    expect(data.projects).toEqual([]);
    expect(data.tabCounts).toEqual({
      "In Progress": 0,
      "In Review": 0,
      Completed: 0,
    });
  });
});
