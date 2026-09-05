import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedSession: vi.fn(),
  projectFindMany: vi.fn(),
  projectFindFirst: vi.fn(),
  projectUpdate: vi.fn(),
  messageFindMany: vi.fn(),
  messageCreate: vi.fn(),
  messageUpdateMany: vi.fn(),
  attachmentUploadDeleteMany: vi.fn(),
  attachmentUploadFindMany: vi.fn(),
  attachmentUploadCount: vi.fn(),
  attachmentUploadCreate: vi.fn(),
  attachmentUploadFindFirst: vi.fn(),
  attachmentUploadDelete: vi.fn(),
  attachmentUploadUpdateMany: vi.fn(),
  attachmentFindFirst: vi.fn(),
  storageFrom: vi.fn(),
  createSignedUploadUrl: vi.fn(),
  storageInfo: vi.fn(),
  createSignedUrl: vi.fn(),
  storageRemove: vi.fn(),
  createUserNotification: vi.fn(),
  fetch: vi.fn(),
  consumeRateLimit: vi.fn(),
  consumeRateLimits: vi.fn(),
  transaction: vi.fn(),
  after: vi.fn(),
  afterCallbacks: [] as Array<() => unknown>,
}));

vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ after: mocks.after }));
vi.mock("@/lib/auth-guard", () => ({
  requireAuthenticatedSession: mocks.requireAuthenticatedSession,
}));
vi.mock("@/lib/notifications", () => ({
  createUserNotification: mocks.createUserNotification,
}));
vi.mock("@/lib/rate-limit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  consumeRateLimits: mocks.consumeRateLimits,
  createRateLimitKey: vi.fn(() => "message:test"),
}));
vi.mock("@/lib/supabase-storage", () => ({
  isMessageAttachmentStorageConfigured: () => true,
  getSupabaseStorageAdmin: () => ({
    storage: { from: mocks.storageFrom },
  }),
  getMessageAttachmentBucketName: () => "message-attachments",
  getSupabaseResumableUploadEndpoint: () =>
    "https://project.storage.supabase.co/storage/v1/upload/resumable",
}));
vi.mock("@/config/unifiedConfig", () => ({
  config: {
    security: {
      auth: {
        rateLimit: {
          messageByUser: { limit: 60, windowMs: 60_000 },
          messageByProjectAndUser: { limit: 20, windowMs: 60_000 },
          attachmentUploadByUserHour: { limit: 10, windowMs: 3_600_000 },
          attachmentUploadByUserDay: { limit: 20, windowMs: 86_400_000 },
        },
      },
    },
  },
}));
vi.mock("@/lib/prisma", () => ({
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
    message_attachment_upload: {
      findMany: mocks.attachmentUploadFindMany,
      deleteMany: mocks.attachmentUploadDeleteMany,
      count: mocks.attachmentUploadCount,
      create: mocks.attachmentUploadCreate,
      findFirst: mocks.attachmentUploadFindFirst,
      delete: mocks.attachmentUploadDelete,
      updateMany: mocks.attachmentUploadUpdateMany,
    },
    message_attachment: {
      findFirst: mocks.attachmentFindFirst,
    },
    $transaction: mocks.transaction,
  },
}));

import {
  cancelMessageAttachmentUpload,
  cleanupExpiredMessageAttachmentUploads,
  finalizeMessageAttachmentUpload,
  getMessageAttachmentDownloadUrl,
  getMessagesData,
  markCurrentProjectMessagesAsRead,
  prepareMessageAttachmentUpload,
  sendCurrentMessage,
} from "@/lib/messages";

const viewerId = "11111111-1111-4111-8111-111111111111";
const umkmUserId = "22222222-2222-4222-8222-222222222222";
const projectId = "44444444-4444-4444-8444-444444444444";

describe("messages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.afterCallbacks.length = 0;
    mocks.after.mockImplementation((callback: () => unknown) => {
      mocks.afterCallbacks.push(callback);
    });
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
    mocks.consumeRateLimits.mockResolvedValue([
      { allowed: true, remaining: 9, retryAfterSeconds: 0 },
      { allowed: true, remaining: 19, retryAfterSeconds: 0 },
    ]);
    mocks.attachmentUploadDeleteMany.mockResolvedValue({ count: 0 });
    mocks.attachmentUploadFindMany.mockResolvedValue([]);
    mocks.attachmentUploadUpdateMany.mockResolvedValue({ count: 1 });
    mocks.attachmentUploadCount.mockResolvedValue(0);
    mocks.storageFrom.mockReturnValue({
      createSignedUploadUrl: mocks.createSignedUploadUrl,
      info: mocks.storageInfo,
      createSignedUrl: mocks.createSignedUrl,
      remove: mocks.storageRemove,
    });
    mocks.storageRemove.mockResolvedValue({ data: [], error: null });
    mocks.createSignedUrl.mockResolvedValue({
      data: { signedUrl: "https://storage.example.test/file" },
      error: null,
    });
    mocks.fetch.mockResolvedValue(new Response("%PDF-1.7\n"));
    vi.stubGlobal("fetch", mocks.fetch);
    mocks.transaction.mockImplementation(async (callback) =>
      callback({
        message: { create: mocks.messageCreate },
        project: { update: mocks.projectUpdate },
        message_attachment_upload: { delete: mocks.attachmentUploadDelete },
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

  it("formats message time and calendar day in Asia/Jakarta on a UTC server", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-24T17:30:00.000Z"));
    const messageTime = new Date("2026-08-24T17:05:00.000Z");
    mocks.projectFindMany.mockResolvedValue([
      {
        id: projectId,
        title: "Website UMKM",
        status: "IN_PROGRESS",
        updatedAt: messageTime,
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
            content: "Pesan setelah tengah malam WIB.",
            readAt: null,
            createdAt: messageTime,
          },
        ],
        _count: { messages: 1 },
      },
    ]);
    mocks.messageFindMany.mockResolvedValue([
      {
        id: "55555555-5555-4555-8555-555555555555",
        senderId: umkmUserId,
        content: "Pesan setelah tengah malam WIB.",
        createdAt: messageTime,
      },
    ]);

    try {
      const result = await getMessagesData(projectId);

      expect(result.conversations[0].timeLabel).toBe("00.05");
      expect(result.conversationMessages[projectId][0]).toMatchObject({
        timeLabel: "00.05",
        dateDividerLabel: "Hari ini",
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it("returns an empty state when the user has no collaboration project", async () => {
    mocks.projectFindMany.mockResolvedValue([]);

    await expect(getMessagesData()).resolves.toEqual({
      conversations: [],
      conversationMessages: {},
      selectedConversationId: "",
      attachmentsEnabled: true,
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
    expect(mocks.createUserNotification).not.toHaveBeenCalled();
    expect(mocks.afterCallbacks).toHaveLength(1);
    await mocks.afterCallbacks[0]();
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

  it("prepares a private resumable upload only for a project participant", async () => {
    mocks.projectFindFirst.mockResolvedValue({
      title: "Website UMKM",
      umkm: { userId: umkmUserId },
      student: { userId: viewerId },
    });
    mocks.attachmentUploadCreate.mockResolvedValue({
      id: "77777777-7777-4777-8777-777777777777",
    });
    mocks.createSignedUploadUrl.mockResolvedValue({
      data: { token: "signed-upload-token" },
      error: null,
    });

    const result = await prepareMessageAttachmentUpload(
      projectId,
      "brief-final.pdf",
      "application/pdf",
      25 * 1024 * 1024,
    );

    expect(result).toMatchObject({
      success: true,
      upload: {
        uploadId: "77777777-7777-4777-8777-777777777777",
        token: "signed-upload-token",
        bucketName: "message-attachments",
      },
    });
    expect(mocks.attachmentUploadCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        projectId,
        uploaderId: viewerId,
        fileName: "brief-final.pdf",
        contentType: "application/pdf",
        sizeBytes: BigInt(25 * 1024 * 1024),
        storagePath: expect.stringMatching(
          new RegExp(`^projects/${projectId}/${viewerId}/.+\\.pdf$`),
        ),
      }),
      select: { id: true },
    });
    expect(mocks.createSignedUploadUrl).toHaveBeenCalledWith(
      expect.stringContaining(`projects/${projectId}/${viewerId}/`),
      { upsert: false },
    );
  });

  it("rejects files larger than 25 MB before accessing the session", async () => {
    const result = await prepareMessageAttachmentUpload(
      projectId,
      "video.mp4",
      "video/mp4",
      25 * 1024 * 1024 + 1,
    );

    expect(result.success).toBe(false);
    expect(mocks.requireAuthenticatedSession).not.toHaveBeenCalled();
    expect(mocks.attachmentUploadCreate).not.toHaveBeenCalled();
  });

  it("removes expired objects before deleting their reservations", async () => {
    mocks.attachmentUploadFindMany.mockResolvedValue([
      { id: "upload-1", storagePath: "projects/expired-1.pdf" },
      { id: "upload-2", storagePath: "projects/expired-2.pdf" },
    ]);
    mocks.attachmentUploadDeleteMany.mockResolvedValue({ count: 2 });

    await expect(
      cleanupExpiredMessageAttachmentUploads({ uploaderId: viewerId }),
    ).resolves.toBe(2);

    expect(mocks.storageRemove).toHaveBeenCalledWith([
      "projects/expired-1.pdf",
      "projects/expired-2.pdf",
    ]);
    expect(mocks.attachmentUploadDeleteMany).toHaveBeenCalledWith({
      where: { id: { in: ["upload-1", "upload-2"] } },
    });
  });

  it("cancels an upload without discarding the cleanup reservation", async () => {
    const uploadId = "77777777-7777-4777-8777-777777777777";
    mocks.attachmentUploadFindFirst.mockResolvedValue({
      id: uploadId,
      storagePath: "projects/pending.pdf",
    });

    await expect(cancelMessageAttachmentUpload(uploadId)).resolves.toBe(true);

    expect(mocks.storageRemove).toHaveBeenCalledWith(["projects/pending.pdf"]);
    expect(mocks.attachmentUploadUpdateMany).toHaveBeenCalledWith({
      where: { id: uploadId, uploaderId: viewerId, cancelledAt: null },
      data: { cancelledAt: expect.any(Date) },
    });
    expect(mocks.attachmentUploadDelete).not.toHaveBeenCalled();
  });

  it("verifies storage size before creating an attachment message", async () => {
    const uploadId = "77777777-7777-4777-8777-777777777777";
    const attachmentId = "88888888-8888-4888-8888-888888888888";
    const sizeBytes = 25 * 1024 * 1024;
    mocks.attachmentUploadFindFirst.mockResolvedValue({
      id: uploadId,
      projectId,
      storagePath: `projects/${projectId}/${viewerId}/file.pdf`,
      fileName: "brief-final.pdf",
      contentType: "application/pdf",
      sizeBytes: BigInt(sizeBytes),
      project: {
        title: "Website UMKM",
        umkm: { userId: umkmUserId },
        student: { userId: viewerId },
      },
    });
    mocks.storageInfo.mockResolvedValue({
      data: { size: sizeBytes, contentType: "application/pdf" },
      error: null,
    });
    mocks.messageCreate.mockResolvedValue({
      id: "99999999-9999-4999-8999-999999999999",
      createdAt: new Date("2026-09-02T10:00:00.000Z"),
      attachment: {
        id: attachmentId,
        fileName: "brief-final.pdf",
        contentType: "application/pdf",
        sizeBytes: BigInt(sizeBytes),
      },
    });

    const result = await finalizeMessageAttachmentUpload(uploadId);

    expect(result).toMatchObject({
      success: true,
      message: {
        sender: "me",
        attachment: {
          id: attachmentId,
          sizeBytes,
          downloadUrl: `/api/messages/attachments/${attachmentId}`,
        },
      },
    });
    expect(mocks.messageCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          projectId,
          senderId: viewerId,
          recipientId: umkmUserId,
          attachment: {
            create: expect.objectContaining({
              storagePath: `projects/${projectId}/${viewerId}/file.pdf`,
              sizeBytes: BigInt(sizeBytes),
            }),
          },
        }),
      }),
    );
    expect(mocks.attachmentUploadDelete).toHaveBeenCalledWith({
      where: { id: uploadId },
    });
  });

  it("does not create a message when the stored object size differs", async () => {
    const uploadId = "77777777-7777-4777-8777-777777777777";
    mocks.attachmentUploadFindFirst.mockResolvedValue({
      id: uploadId,
      projectId,
      storagePath: "projects/file.pdf",
      fileName: "brief-final.pdf",
      contentType: "application/pdf",
      sizeBytes: BigInt(100),
      project: {
        title: "Website UMKM",
        umkm: { userId: umkmUserId },
        student: { userId: viewerId },
      },
    });
    mocks.storageInfo.mockResolvedValue({
      data: { size: 99, contentType: "application/pdf" },
      error: null,
    });

    await expect(finalizeMessageAttachmentUpload(uploadId)).resolves.toEqual({
      success: false,
      error: "Verifikasi ukuran file gagal. Silakan unggah ulang.",
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
    expect(mocks.storageRemove).toHaveBeenCalledWith(["projects/file.pdf"]);
    expect(mocks.attachmentUploadUpdateMany).toHaveBeenCalledWith({
      where: { id: uploadId, uploaderId: viewerId },
      data: { cancelledAt: expect.any(Date) },
    });
  });

  it("does not sign a download URL for an unauthorized attachment", async () => {
    mocks.attachmentFindFirst.mockResolvedValue(null);

    await expect(
      getMessageAttachmentDownloadUrl(
        "88888888-8888-4888-8888-888888888888",
      ),
    ).resolves.toBeNull();
    expect(mocks.createSignedUrl).not.toHaveBeenCalled();
  });
});
