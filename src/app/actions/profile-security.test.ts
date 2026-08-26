import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  consumeRateLimit: vi.fn(),
  userFindUnique: vi.fn(),
  transaction: vi.fn(),
  userUpdate: vi.fn(),
  studentUpsert: vi.fn(),
  studentSkillFindMany: vi.fn(),
  studentSkillDeleteMany: vi.fn(),
  studentSkillCreate: vi.fn(),
  skillFindFirst: vi.fn(),
  createUserNotification: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/education", () => ({
  educationLevelOptions: [
    { value: "SMA", label: "SMA" },
    { value: "S1", label: "S1" },
  ],
  educationUsesSemester: (level: string) => level === "S1",
}));
vi.mock("@/lib/session", () => ({ verifySession: mocks.verifySession }));
vi.mock("@/lib/rate-limit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  createRateLimitKey: vi.fn(() => "profile:test"),
}));
vi.mock("@/config/unifiedConfig", () => ({
  config: {
    security: {
      auth: {
        rateLimit: {
          profileUpdateByUser: { limit: 10, windowMs: 600_000 },
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
vi.mock("@/lib/notifications", () => ({
  createUserNotification: mocks.createUserNotification,
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import { updateProfileAction } from "./profile";

function profileForm() {
  const formData = new FormData();
  formData.set("name", "Andi Pelajar");
  return formData;
}

describe("profile action security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({
      sessionId: "session-id",
      userId: "11111111-1111-4111-8111-111111111111",
      role: "STUDENT",
      name: "Andi",
    });
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 9,
      retryAfterSeconds: 0,
    });
    mocks.userFindUnique.mockResolvedValue({ role: "STUDENT" });
    mocks.studentUpsert.mockResolvedValue({ id: "student-1" });
    mocks.studentSkillFindMany.mockResolvedValue([]);
    mocks.skillFindFirst.mockResolvedValue({ id: "skill-1" });
    mocks.transaction.mockImplementation(async (callback) =>
      callback({
        user: { update: mocks.userUpdate },
        student: { upsert: mocks.studentUpsert },
        student_skill: {
          findMany: mocks.studentSkillFindMany,
          deleteMany: mocks.studentSkillDeleteMany,
          create: mocks.studentSkillCreate,
        },
        skill: { findFirst: mocks.skillFindFirst },
      }),
    );
  });

  it("rejects more than twenty skills before opening a transaction", async () => {
    const formData = profileForm();
    formData.set(
      "skills",
      Array.from({ length: 21 }, (_, index) => `Skill ${index + 1}`).join(","),
    );

    await expect(updateProfileAction(formData)).resolves.toEqual({
      error: "Maksimal 20 skill dapat ditambahkan",
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("rejects spoofed image data before a database transaction", async () => {
    const formData = profileForm();
    formData.set(
      "avatarBase64",
      `data:image/webp;base64,${Buffer.from("not-a-webp").toString("base64")}`,
    );

    const result = await updateProfileAction(formData);
    expect(result).toEqual({
      error: "Foto profil maksimal 256 KB dan harus PNG, JPEG, atau WebP",
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("rate limits authenticated profile updates", async () => {
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: false,
      remaining: 0,
      retryAfterSeconds: 30,
    });

    await expect(updateProfileAction(profileForm())).resolves.toEqual({
      error: "Terlalu banyak pembaruan profil. Silakan coba lagi nanti.",
    });
    expect(mocks.userFindUnique).not.toHaveBeenCalled();
  });

  it("rejects a new skill outside the official taxonomy", async () => {
    const formData = profileForm();
    formData.set("skills", "Skill Buatan Penyerang");

    await expect(updateProfileAction(formData)).resolves.toEqual({
      error: "Skill baru harus dipilih dari daftar resmi Jembara.",
    });
    expect(mocks.studentSkillDeleteMany).not.toHaveBeenCalled();
  });

  it("uses an existing canonical skill without creating master data", async () => {
    const formData = profileForm();
    formData.set("skills", "web development");

    await expect(updateProfileAction(formData)).resolves.toEqual({ success: true });
    expect(mocks.skillFindFirst).toHaveBeenCalledWith({
      where: { name: { equals: "Web Development", mode: "insensitive" } },
      select: { id: true },
    });
    expect(mocks.studentSkillCreate).toHaveBeenCalledWith({
      data: { studentId: "student-1", skillId: "skill-1" },
      select: { id: true },
    });
  });
});
