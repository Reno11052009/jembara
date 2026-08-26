import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedSession: vi.fn(),
  projectFindMany: vi.fn(),
  projectFindFirst: vi.fn(),
  projectUpdate: vi.fn(),
  messageFindMany: vi.fn(),
  messageCreate: vi.fn(),
  messageUpdateMany: vi.fn(),
  createUserNotification: vi.fn(),
  consumeRateLimit: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("./auth-guard", () => ({
  requireAuthenticatedSession: mocks.requireAuthenticatedSession,
}));
vi.mock("./notifications", () => ({
  createUserNotification: mocks.createUserNotification,
}));
vi.mock("./rate-limit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  createRateLimitKey: vi.fn(() => "message:test"),
}));
vi.mock("@/config/unifiedConfig", () => ({
  config: {
    security: {
      auth: {
        rateLimit: {
          messageByUser: { limit: 60, windowMs: 60_000 },
          messageByProjectAndUser: { limit: 20, windowMs: 60_000 },
        },
      },
    },
  },
}));
vi.mock("./prisma", () => ({
  default: {
    project: {
      findMany: mocks.projectFindMany,
      findFirst: mocks.projectFindFirst,
      update: mocks.projectUpdate,
    },
    message: {
      findMany: mocks.messageFindMany,
      create: mocks.messageCreate,
      updateMany: mocks.messageUpdateMany,
    },
    $transaction: mocks.transaction,
  },
}));

import {
  getMessagesData,
  markCurrentProjectMessagesAsRead,
  sendCurrentMessage,
} from "./messages";

const viewerId = "11111111-1111-4111-8111-111111111111";
const umkmUserId = "22222222-2222-4222-8222-222222222222";
const projectId = "44444444-4444-4444-8444-444444444444";

describe("messages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuthenticatedSession.mockResolvedValue({
      userId: viewerId,
      role: "STUDENT",
      name: "Andi",
    });
    mocks.createUserNotification.mockResolvedValue({ id: "notification-1" });
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 19,
      retryAfterSeconds: 0,
    });
    mocks.transaction.mockImplementation(async (callback) =>
      callback({
        message: { create: mocks.messageCreate },
        project: { update: mocks.projectUpdate },
      }),
    );
  });

  it("loads only project conversations owned by the authenticated user", async () => {
    mocks.projectFindMany.mockResolvedValue([
      {
        id: projectId,
        title: "Website UMKM",
        status: "IN_PROGRESS",
        updatedAt: new Date("2026-08-24T09:00:00.000Z"),
        umkm: {
          nama_usaha: "Kopi Maju",
          user: { id: umkmUserId, name: "Budi" },
        },
        student: { user: { id: viewerId, name: "Andi" } },
        messages: [
          {
            id: "55555555-5555-4555-8555-555555555555",
            senderId: umkmUserId,
            recipientId: viewerId,
            content: "Tolong cek brief terbaru.",
            readAt: null,
            createdAt: new Date("2026-08-24T10:00:00.000Z"),
          },
        ],
        _count: { messages: 1 },
      },
    ]);
    mocks.messageFindMany.mockResolvedValue([
      {
        id: "55555555-5555-4555-8555-555555555555",
        senderId: umkmUserId,
        content: "Tolong cek brief terbaru.",
        createdAt: new Date("2026-08-24T10:00:00.000Z"),
      },
    ]);

    const result = await getMessagesData(projectId);

    expect(mocks.projectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          studentId: { not: null },
          OR: [
            { umkm: { is: { userId: viewerId } } },
            { student: { is: { userId: viewerId } } },
          ],
        }),
      }),
    );
    expect(mocks.messageFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          projectId,
          OR: [{ senderId: viewerId }, { recipientId: viewerId }],
        },
        take: 100,
      }),
    );
    expect(result.conversations[0]).toMatchObject({
      id: projectId,
      contactName: "Kopi Maju",
      unread: true,
      canSend: true,
    });
    expect(result.conversationMessages[projectId][0]).toMatchObject({
      sender: "contact",
      text: "Tolong cek brief terbaru.",
    });
  });

  it("returns an empty state when the user has no collaboration project", async () => {
    mocks.projectFindMany.mockResolvedValue([]);

    await expect(getMessagesData()).resolves.toEqual({
      conversations: [],
      conversationMessages: {},
      selectedConversationId: "",
    });
    expect(mocks.messageFindMany).not.toHaveBeenCalled();
  });

  it("derives sender and recipient from the authenticated project participants", async () => {
    mocks.projectFindFirst.mockResolvedValue({
      title: "Website UMKM",
      umkm: { userId: umkmUserId },
      student: { userId: viewerId },
    });
    mocks.messageCreate.mockResolvedValue({ id: "message-1" });

    await expect(
      sendCurrentMessage(projectId, "  Siap, saya kerjakan.  "),
    ).resolves.toEqual({ success: true });
    expect(mocks.messageCreate).toHaveBeenCalledWith({
      data: {
        projectId,
        senderId: viewerId,
        recipientId: umkmUserId,
        content: "Siap, saya kerjakan.",
      },
    });
    expect(mocks.projectUpdate).toHaveBeenCalledWith({
      where: { id: projectId },
      data: { updatedAt: expect.any(Date) },
      select: { id: true },
    });
    expect(mocks.createUserNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: umkmUserId,
        preferenceKey: "pesanBaru",
        href: "/dashboard/messages",
      }),
    );
    expect(mocks.consumeRateLimit).toHaveBeenCalledTimes(2);
  });

  it("rejects invalid content before accessing session or database", async () => {
    const result = await sendCurrentMessage(projectId, "   ");

    expect(result.success).toBe(false);
    expect(mocks.requireAuthenticatedSession).not.toHaveBeenCalled();
    expect(mocks.projectFindFirst).not.toHaveBeenCalled();
    expect(mocks.messageCreate).not.toHaveBeenCalled();
  });

  it("rate limits message spam before querying the project", async () => {
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: false,
      remaining: 0,
      retryAfterSeconds: 30,
    });

    await expect(sendCurrentMessage(projectId, "Pesan berulang")).resolves.toEqual({
      success: false,
      error: "Terlalu banyak pesan. Tunggu sebentar sebelum mengirim lagi.",
    });
    expect(mocks.projectFindFirst).not.toHaveBeenCalled();
    expect(mocks.messageCreate).not.toHaveBeenCalled();
  });

  it("does not send a message when the user is not an active project participant", async () => {
    mocks.projectFindFirst.mockResolvedValue(null);

    const result = await sendCurrentMessage(projectId, "Pesan rahasia");

    expect(result.success).toBe(false);
    expect(mocks.messageCreate).not.toHaveBeenCalled();
    expect(mocks.createUserNotification).not.toHaveBeenCalled();
    expect(mocks.consumeRateLimit).toHaveBeenCalledTimes(1);
  });

  it("marks read only messages addressed to the authenticated user", async () => {
    mocks.messageUpdateMany.mockResolvedValue({ count: 2 });

    await expect(markCurrentProjectMessagesAsRead(projectId)).resolves.toBe(true);
    expect(mocks.messageUpdateMany).toHaveBeenCalledWith({
      where: {
        projectId,
        recipientId: viewerId,
        readAt: null,
      },
      data: { readAt: expect.any(Date) },
    });
  });
});
