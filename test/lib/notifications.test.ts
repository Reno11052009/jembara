import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  findMany: vi.fn(),
  updateMany: vi.fn(),
  create: vi.fn(),
  createMany: vi.fn(),
  preferenceFindUnique: vi.fn(),
  preferenceFindMany: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/session", () => ({ verifySession: mocks.verifySession }));
vi.mock("@/lib/notification-preferences", () => ({
  defaultNotificationPreferences: {
    proposalMasuk: true,
    pesanBaru: true,
    pembayaran: true,
    updateProyek: true,
    promosiInfo: false,
  },
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    notification: {
      findMany: mocks.findMany,
      updateMany: mocks.updateMany,
      create: mocks.create,
      createMany: mocks.createMany,
    },
    notification_preference: {
      findUnique: mocks.preferenceFindUnique,
      findMany: mocks.preferenceFindMany,
    },
  },
}));

import {
  createUserNotification,
  createUserNotifications,
  getCurrentNotifications,
  markCurrentNotificationAsRead,
} from "@/lib/notifications";

describe("notifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({
      userId: "77919e28-7f44-4de2-973c-4e5054b268e4",
      role: "UMKM",
      name: "Pemilik",
    });
  });

  it("loads only the authenticated user's notifications", async () => {
    const createdAt = new Date("2026-08-22T10:00:00.000Z");
    mocks.findMany.mockResolvedValue([
      {
        id: "72ac43c8-17e4-4af7-87d4-512d36eb5770",
        type: "INFO",
        title: "Tersimpan",
        message: "Profil diperbarui",
        href: "/dashboard/profile",
        isRead: false,
        createdAt,
      },
    ]);

    const result = await getCurrentNotifications();

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "77919e28-7f44-4de2-973c-4e5054b268e4" },
        take: 20,
      }),
    );
    expect(result[0].createdAt).toBe(createdAt.toISOString());
  });

  it("marks a notification read only when it belongs to the current user", async () => {
    mocks.updateMany.mockResolvedValue({ count: 1 });

    await expect(
      markCurrentNotificationAsRead("72ac43c8-17e4-4af7-87d4-512d36eb5770"),
    ).resolves.toBe(true);
    expect(mocks.updateMany).toHaveBeenCalledWith({
      where: {
        id: "72ac43c8-17e4-4af7-87d4-512d36eb5770",
        userId: "77919e28-7f44-4de2-973c-4e5054b268e4",
      },
      data: { isRead: true },
    });
  });

  it("rejects invalid notification ids without querying the database", async () => {
    await expect(markCurrentNotificationAsRead("not-a-uuid")).resolves.toBe(false);
    expect(mocks.verifySession).not.toHaveBeenCalled();
    expect(mocks.updateMany).not.toHaveBeenCalled();
  });

  it("does not create optional notifications disabled by user preferences", async () => {
    mocks.preferenceFindUnique.mockResolvedValue({ promosiInfo: false });

    await expect(
      createUserNotification({
        userId: "77919e28-7f44-4de2-973c-4e5054b268e4",
        type: "INFO",
        title: "Promo",
        message: "Info terbaru",
        preferenceKey: "promosiInfo",
      }),
    ).resolves.toBeNull();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("bulk creates enabled notifications with two queries instead of one pair per user", async () => {
    mocks.preferenceFindMany.mockResolvedValue([
      {
        userId: "user-1",
        proposalMasuk: true,
        pesanBaru: true,
        pembayaran: true,
        updateProyek: true,
        promosiInfo: false,
      },
      {
        userId: "user-2",
        proposalMasuk: true,
        pesanBaru: true,
        pembayaran: true,
        updateProyek: false,
        promosiInfo: false,
      },
    ]);
    mocks.createMany.mockResolvedValue({ count: 1 });

    await expect(
      createUserNotifications([
        {
          userId: "user-1",
          type: "PROJECT",
          title: "Terpilih",
          message: "Proposal diterima",
          preferenceKey: "updateProyek",
        },
        {
          userId: "user-2",
          type: "PROJECT",
          title: "Belum terpilih",
          message: "Kandidat lain dipilih",
          preferenceKey: "updateProyek",
        },
      ]),
    ).resolves.toEqual({ count: 1 });

    expect(mocks.preferenceFindMany).toHaveBeenCalledTimes(1);
    expect(mocks.createMany).toHaveBeenCalledTimes(1);
    expect(mocks.createMany).toHaveBeenCalledWith({
      data: [expect.objectContaining({ userId: "user-1" })],
    });
    expect(mocks.preferenceFindUnique).not.toHaveBeenCalled();
  });
});
