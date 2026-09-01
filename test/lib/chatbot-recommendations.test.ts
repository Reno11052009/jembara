import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  studentFindUnique: vi.fn(),
  studentFindMany: vi.fn(),
  umkmFindUnique: vi.fn(),
  projectFindMany: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({
  default: {
    student: {
      findUnique: mocks.studentFindUnique,
      findMany: mocks.studentFindMany,
    },
    umkm: { findUnique: mocks.umkmFindUnique },
    project: { findMany: mocks.projectFindMany },
  },
}));

import {
  detectChatbotRecommendationIntent,
  getSafeChatbotRecommendation,
} from "@/lib/chatbot-recommendations";

describe("chatbot recommendation intent", () => {
  it("only handles explicit recommendation requests", () => {
    expect(
      detectChatbotRecommendationIntent(
        "Rekomendasikan project yang cocok untuk saya",
        "STUDENT",
      ),
    ).toBe("PROJECTS");
    expect(
      detectChatbotRecommendationIntent(
        "Carikan talent terbaik untuk project saya",
        "UMKM",
      ),
    ).toBe("TALENTS");
    expect(detectChatbotRecommendationIntent("Apa itu project?", "STUDENT")).toBeNull();
  });
});

describe("safe chatbot database recommendations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("recommends public open projects from a strict field allowlist", async () => {
    mocks.studentFindUnique.mockResolvedValue({
      id: "student-1",
      skills: [{ skill: { name: "Figma" } }, { skill: { name: "UI/UX" } }],
    });
    mocks.projectFindMany.mockResolvedValue([
      {
        id: "project-1",
        title: "Desain Aplikasi Kopi",
        budget: 2_000_000,
        deadline: null,
        workMode: "REMOTE",
        location: null,
        createdAt: new Date("2026-08-20T00:00:00.000Z"),
        umkm: { nama_usaha: "Kopi Aman" },
        skillsNeeded: [
          { skill: { name: "Figma" } },
          { skill: { name: "UI/UX" } },
        ],
      },
    ]);

    const result = await getSafeChatbotRecommendation({
      userId: "user-1",
      role: "STUDENT",
      latestUserMessage: "Rekomendasikan project yang cocok untuk saya",
    });

    expect(result).toMatchObject({ handled: true });
    expect(result.handled && result.message).toContain("Desain Aplikasi Kopi");
    expect(result.handled && result.message).toContain("100% kecocokan skill");
    expect(result).toMatchObject({
      handled: true,
      links: [
        {
          label: "Lihat project Desain Aplikasi Kopi",
          href: "/dashboard/find-projects/project-1",
        },
      ],
    });

    const query = mocks.projectFindMany.mock.calls[0][0];
    expect(query.where).toMatchObject({ status: "OPEN", studentId: null });
    expect(query.select).toEqual({
      id: true,
      title: true,
      budget: true,
      deadline: true,
      workMode: true,
      location: true,
      createdAt: true,
      umkm: { select: { nama_usaha: true } },
      skillsNeeded: {
        select: { skill: { select: { name: true } } },
      },
    });
    expect(JSON.stringify(query.select)).not.toMatch(
      /email|password|telepon|saldo|session|message|payment|description/i,
    );
  });

  it("only recommends talent for a project owned by the signed-in UMKM", async () => {
    mocks.umkmFindUnique.mockResolvedValue({ id: "umkm-1" });
    mocks.projectFindMany.mockResolvedValue([
      {
        id: "project-1",
        title: "Website Toko Kopi",
        updatedAt: new Date("2026-08-20T00:00:00.000Z"),
        skillsNeeded: [{ skill: { name: "Web Development" } }],
      },
    ]);
    mocks.studentFindMany.mockResolvedValue([
      {
        id: "student-1",
        rating: 4.8,
        user: { name: "Ayu" },
        skills: [{ skill: { name: "Web Development" } }],
        _count: { portfolios: 2, reviews: 3, projects: 4 },
      },
    ]);

    const result = await getSafeChatbotRecommendation({
      userId: "owner-user-1",
      role: "UMKM",
      latestUserMessage: "Carikan talent terbaik untuk Website Toko Kopi",
    });

    expect(result.handled && result.message).toContain("Ayu");
    expect(result).toMatchObject({
      handled: true,
      links: [
        {
          label: "Lihat profil Ayu",
          href: "/dashboard/cari-talent?project=project-1#talent-student-1",
        },
      ],
    });

    const projectQuery = mocks.projectFindMany.mock.calls[0][0];
    expect(projectQuery.where).toMatchObject({
      umkmId: "umkm-1",
      status: { in: ["OPEN", "PROPOSAL"] },
      studentId: null,
    });

    const studentSelect = mocks.studentFindMany.mock.calls[0][0].select;
    expect(studentSelect.user).toEqual({ select: { name: true } });
    expect(JSON.stringify(studentSelect)).not.toMatch(
      /email|password|telepon|saldo|session|message|payment|alamat|proposal/i,
    );
  });

  it("does not query the database when the role cannot use the requested recommendation", async () => {
    const result = await getSafeChatbotRecommendation({
      userId: "user-1",
      role: "STUDENT",
      latestUserMessage: "Rekomendasikan talent terbaik",
    });

    expect(result).toEqual({
      handled: true,
      message: "Rekomendasi talent saat ini hanya tersedia untuk akun UMKM.",
    });
    expect(mocks.studentFindUnique).not.toHaveBeenCalled();
    expect(mocks.studentFindMany).not.toHaveBeenCalled();
    expect(mocks.umkmFindUnique).not.toHaveBeenCalled();
    expect(mocks.projectFindMany).not.toHaveBeenCalled();
  });
});
