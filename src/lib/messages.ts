import "server-only";
import { randomUUID } from "node:crypto";
import { after } from "next/server";
import { z } from "zod";
import prisma from "./prisma";
import { requireAuthenticatedSession } from "./auth-guard";
import { createUserNotification } from "./notifications";
import {
  consumeRateLimit,
  consumeRateLimits,
  createRateLimitKey,
} from "./rate-limit";
import {
  getMessageAttachmentValidationError,
  hasExpectedMessageAttachmentSignature,
  MAX_MESSAGE_ATTACHMENT_BYTES,
} from "./message-attachment-policy";
import {
  getMessageAttachmentBucketName,
  getSupabaseResumableUploadEndpoint,
  getSupabaseStorageAdmin,
  isMessageAttachmentStorageConfigured,
} from "./supabase-storage";
import { config } from "@/config/unifiedConfig";
import type {
  ChatMessage,
  Conversation,
  FinalizeAttachmentUploadResult,
  MessageActionResult,
  MessagesData,
  PrepareAttachmentUploadResult,
} from "@/types/messages";

const PROJECT_MESSAGE_STATUSES = ["IN_PROGRESS", "REVIEW", "COMPLETED"];
const SENDABLE_PROJECT_STATUSES = ["IN_PROGRESS", "REVIEW"];
const MAX_MESSAGES_PER_PROJECT = 100;
const MAX_PENDING_UPLOADS_PER_USER = 5;
const ATTACHMENT_UPLOAD_TTL_MS = 2 * 60 * 60 * 1000;
const ATTACHMENT_DOWNLOAD_TTL_SECONDS = 60;
const ATTACHMENT_SIGNATURE_BYTES = 4096;

type StorageAdmin = ReturnType<typeof getSupabaseStorageAdmin>;

async function readStoredAttachmentHeader(
  storage: StorageAdmin,
  bucketName: string,
  storagePath: string,
) {
  const signed = await storage.storage
    .from(bucketName)
    .createSignedUrl(storagePath, 60);
  if (signed.error || !signed.data?.signedUrl) throw new Error("SIGNED_URL_FAILED");

  const response = await fetch(signed.data.signedUrl, {
    headers: { Range: `bytes=0-${ATTACHMENT_SIGNATURE_BYTES - 1}` },
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok || !response.body) throw new Error("FILE_HEADER_UNAVAILABLE");

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (total < ATTACHMENT_SIGNATURE_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      const remaining = ATTACHMENT_SIGNATURE_BYTES - total;
      const chunk = value.slice(0, remaining);
      chunks.push(chunk);
      total += chunk.byteLength;
      if (value.byteLength > remaining) break;
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }

  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return result;
}

async function removeStoredAttachments(
  storage: StorageAdmin,
  bucketName: string,
  storagePaths: string[],
) {
  if (storagePaths.length === 0) return true;
  const removal = await storage.storage.from(bucketName).remove(storagePaths);
  if (removal.error) {
    console.error("Gagal menghapus objek lampiran dari Storage:", removal.error);
    return false;
  }
  return true;
}

export async function cleanupExpiredMessageAttachmentUploads(options?: {
  uploaderId?: string;
  limit?: number;
}) {
  const limit = Math.min(Math.max(options?.limit ?? 500, 1), 500);
  const expiredUploads = await prisma.message_attachment_upload.findMany({
    where: {
      ...(options?.uploaderId ? { uploaderId: options.uploaderId } : {}),
      expiresAt: { lte: new Date() },
    },
    orderBy: { expiresAt: "asc" },
    take: limit,
    select: { id: true, storagePath: true },
  });
  if (expiredUploads.length === 0) return 0;

  const storage = getSupabaseStorageAdmin();
  const bucketName = getMessageAttachmentBucketName();
  const removed = await removeStoredAttachments(
    storage,
    bucketName,
    expiredUploads.map(({ storagePath }) => storagePath),
  );
  if (!removed) throw new Error("STORAGE_CLEANUP_FAILED");

  const deleted = await prisma.message_attachment_upload.deleteMany({
    where: { id: { in: expiredUploads.map(({ id }) => id) } },
  });
  return deleted.count;
}

const projectIdSchema = z.string().uuid("ID proyek tidak valid.");
const sendMessageSchema = z.object({
  projectId: projectIdSchema,
  content: z
    .string()
    .trim()
    .min(1, "Pesan tidak boleh kosong.")
    .max(2000, "Pesan maksimal 2000 karakter."),
});
const prepareAttachmentSchema = z.object({
  projectId: projectIdSchema,
  fileName: z.string().trim().min(1).max(255),
  contentType: z.string().trim().max(255),
  sizeBytes: z
    .number()
    .int()
    .min(1)
    .max(MAX_MESSAGE_ATTACHMENT_BYTES),
});
const uploadIdSchema = z.string().uuid("ID upload tidak valid.");
const attachmentIdSchema = z.string().uuid("ID lampiran tidak valid.");

function normalizeAttachmentFileName(fileName: string) {
  const withoutPath = fileName.split(/[\\/]/).pop() || "lampiran";
  return withoutPath.replace(/[\u0000-\u001f\u007f]/g, "").trim();
}

function getStorageFileExtension(fileName: string) {
  const extension = fileName.match(/\.([a-zA-Z0-9]{1,10})$/)?.[1];
  return extension ? `.${extension.toLowerCase()}` : "";
}

function attachmentDownloadUrl(attachmentId: string) {
  return `/api/messages/attachments/${attachmentId}`;
}

function isSameCalendarDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function formatClock(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(value);
}

function formatDateLabel(value: Date, now: Date) {
  if (isSameCalendarDay(value, now)) return "Hari ini";

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameCalendarDay(value, yesterday)) return "Kemarin";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: value.getFullYear() === now.getFullYear() ? undefined : "numeric",
  }).format(value);
}

function formatConversationTime(value: Date, now: Date) {
  if (isSameCalendarDay(value, now)) return formatClock(value);

  const dayDifference = Math.floor(
    (startOfDay(now).getTime() - startOfDay(value).getTime()) / 86_400_000,
  );
  if (dayDifference === 1) return "Kemarin";
  if (dayDifference > 1 && dayDifference < 7) {
    return new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(value);
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(value);
}

export async function getMessagesData(
  requestedProjectId?: unknown,
): Promise<MessagesData> {
  const session = await requireAuthenticatedSession();
  const attachmentsEnabled = isMessageAttachmentStorageConfigured();
  const now = new Date();
  const projects = await prisma.project.findMany({
    where: {
      status: { in: PROJECT_MESSAGE_STATUSES },
      studentId: { not: null },
      OR: [
        { umkm: { is: { userId: session.userId } } },
        { student: { is: { userId: session.userId } } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
    select: {
      id: true,
      title: true,
      status: true,
      updatedAt: true,
      umkm: {
        select: {
          nama_usaha: true,
          user: { select: { id: true, name: true } },
        },
      },
      student: {
        select: { user: { select: { id: true, name: true } } },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          senderId: true,
          recipientId: true,
          content: true,
          readAt: true,
          createdAt: true,
          attachment: {
            select: { fileName: true },
          },
        },
      },
      _count: {
        select: {
          messages: {
            where: { recipientId: session.userId, readAt: null },
          },
        },
      },
    },
  });

  const mapped = projects.map((project) => {
    const viewerIsUmkm = project.umkm.user.id === session.userId;
    const contactName = viewerIsUmkm
      ? project.student?.user.name || "Pelajar"
      : project.umkm.nama_usaha || project.umkm.user.name || "UMKM";
    const latestMessage = project.messages[0];
    const activityAt = latestMessage?.createdAt ?? project.updatedAt;

    const conversation: Conversation = {
      id: project.id,
      contactName,
      lastMessagePreview:
        latestMessage?.attachment?.fileName ??
        latestMessage?.content ??
        "Belum ada pesan.",
      timeLabel: formatConversationTime(activityAt, now),
      unread: project._count.messages > 0,
      isOnline: false,
      projectName: project.title,
      canSend: SENDABLE_PROJECT_STATUSES.includes(project.status),
    };

    return { conversation, activityAt };
  });

  mapped.sort((first, second) =>
    second.activityAt.getTime() - first.activityAt.getTime(),
  );

  const conversations = mapped.map(({ conversation }) => conversation);
  const parsedRequestedProjectId = projectIdSchema.safeParse(requestedProjectId);
  const selectedConversationId =
    parsedRequestedProjectId.success &&
    conversations.some(({ id }) => id === parsedRequestedProjectId.data)
      ? parsedRequestedProjectId.data
      : conversations[0]?.id ?? "";

  if (!selectedConversationId) {
    return {
      conversations,
      conversationMessages: {},
      selectedConversationId: "",
      attachmentsEnabled,
    };
  }

  const selectedMessages = await prisma.message.findMany({
    where: {
      projectId: selectedConversationId,
      OR: [
        { senderId: session.userId },
        { recipientId: session.userId },
      ],
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: MAX_MESSAGES_PER_PROJECT,
    select: {
      id: true,
      senderId: true,
      content: true,
      createdAt: true,
      attachment: {
        select: {
          id: true,
          fileName: true,
          contentType: true,
          sizeBytes: true,
        },
      },
    },
  });
  const orderedMessages = selectedMessages.reverse();
  const messages = orderedMessages.map<ChatMessage>((message, index) => {
    const previousMessage = orderedMessages[index - 1];
    return {
      id: message.id,
      sender: message.senderId === session.userId ? "me" : "contact",
      text: message.content,
      timeLabel: formatClock(message.createdAt),
      dateDividerLabel:
        !previousMessage ||
        !isSameCalendarDay(previousMessage.createdAt, message.createdAt)
          ? formatDateLabel(message.createdAt, now)
          : undefined,
      attachment: message.attachment
        ? {
            id: message.attachment.id,
            fileName: message.attachment.fileName,
            contentType: message.attachment.contentType,
            sizeBytes: Number(message.attachment.sizeBytes),
            downloadUrl: attachmentDownloadUrl(message.attachment.id),
          }
        : undefined,
    };
  });

  return {
    conversations,
    conversationMessages: { [selectedConversationId]: messages },
    selectedConversationId,
    attachmentsEnabled,
  };
}

async function getSendableParticipantProject(projectId: string, userId: string) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      status: { in: SENDABLE_PROJECT_STATUSES },
      studentId: { not: null },
      OR: [
        { umkm: { is: { userId } } },
        { student: { is: { userId } } },
      ],
    },
    select: {
      title: true,
      umkm: { select: { userId: true } },
      student: { select: { userId: true } },
    },
  });
}

export async function sendCurrentMessage(
  projectId: unknown,
  content: unknown,
): Promise<MessageActionResult> {
  const parsed = sendMessageSchema.safeParse({ projectId, content });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Pesan tidak valid.",
    };
  }

  const session = await requireAuthenticatedSession();
  // Bucket global memakai identitas tepercaya dari sesi. Jangan memakai
  // projectId yang dikirim klien sebelum proyek dan kepemilikannya diverifikasi,
  // karena UUID acak dapat menghasilkan baris rate-limit tanpa batas.
  const userRateLimit = await consumeRateLimit({
    key: createRateLimitKey("message:send:user", session.userId),
    ...config.security.auth.rateLimit.messageByUser,
  });
  if (!userRateLimit.allowed) {
    return {
      success: false,
      error: "Terlalu banyak pesan. Tunggu sebentar sebelum mengirim lagi.",
    };
  }

  const project = await getSendableParticipantProject(
    parsed.data.projectId,
    session.userId,
  );

  if (!project?.student) {
    return {
      success: false,
      error: "Percakapan tidak ditemukan atau proyek sudah tidak aktif.",
    };
  }

  const projectRateLimit = await consumeRateLimit({
    key: createRateLimitKey(
      "message:send:user-project",
      `${session.userId}:${parsed.data.projectId}`,
    ),
    ...config.security.auth.rateLimit.messageByProjectAndUser,
  });
  if (!projectRateLimit.allowed) {
    return {
      success: false,
      error: "Terlalu banyak pesan. Tunggu sebentar sebelum mengirim lagi.",
    };
  }

  const recipientId =
    project.umkm.userId === session.userId
      ? project.student.userId
      : project.umkm.userId;

  await prisma.$transaction(async (transaction) => {
    await transaction.message.create({
      data: {
        projectId: parsed.data.projectId,
        senderId: session.userId,
        recipientId,
        content: parsed.data.content,
      },
    });
    await transaction.project.update({
      where: { id: parsed.data.projectId },
      data: { updatedAt: new Date() },
      select: { id: true },
    });
  });

  after(async () => {
    try {
      await createUserNotification({
        userId: recipientId,
        type: "MESSAGE",
        title: `Pesan baru dari ${session.name}`,
        message: `${project.title}: ${parsed.data.content.slice(0, 120)}`,
        href: "/dashboard/messages",
        preferenceKey: "pesanBaru",
      });
    } catch (error) {
      console.error("Pesan tersimpan, tetapi notifikasi gagal dibuat:", error);
    }
  });

  return { success: true };
}

export async function prepareMessageAttachmentUpload(
  projectId: unknown,
  rawFileName: unknown,
  contentType: unknown,
  sizeBytes: unknown,
): Promise<PrepareAttachmentUploadResult> {
  const fileName =
    typeof rawFileName === "string"
      ? normalizeAttachmentFileName(rawFileName)
      : rawFileName;
  const parsed = prepareAttachmentSchema.safeParse({
    projectId,
    fileName,
    contentType:
      typeof contentType === "string" && contentType.trim()
        ? contentType.toLowerCase()
        : "application/octet-stream",
    sizeBytes,
  });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Informasi file tidak valid.",
    };
  }

  const validationError = getMessageAttachmentValidationError({
    name: parsed.data.fileName,
    size: parsed.data.sizeBytes,
    type: parsed.data.contentType,
  });
  if (validationError) return { success: false, error: validationError };

  const session = await requireAuthenticatedSession();
  const project = await getSendableParticipantProject(
    parsed.data.projectId,
    session.userId,
  );
  if (!project?.student) {
    return {
      success: false,
      error: "Percakapan tidak ditemukan atau proyek sudah tidak aktif.",
    };
  }

  if (!isMessageAttachmentStorageConfigured()) {
    return { success: false, error: "Penyimpanan lampiran belum dikonfigurasi." };
  }

  const uploadRateLimits = await consumeRateLimits([
    {
      key: createRateLimitKey("attachment:upload:user-hour", session.userId),
      ...config.security.auth.rateLimit.attachmentUploadByUserHour,
    },
    {
      key: createRateLimitKey("attachment:upload:user-day", session.userId),
      ...config.security.auth.rateLimit.attachmentUploadByUserDay,
    },
  ]);
  if (uploadRateLimits.some(({ allowed }) => !allowed)) {
    return {
      success: false,
      error: "Batas upload lampiran tercapai. Silakan coba lagi nanti.",
    };
  }

  try {
    await cleanupExpiredMessageAttachmentUploads({
      uploaderId: session.userId,
      limit: 25,
    });
  } catch (error) {
    console.error("Lampiran kedaluwarsa belum dapat dibersihkan:", error);
    return {
      success: false,
      error: "Penyimpanan lampiran sedang tidak tersedia. Coba lagi nanti.",
    };
  }
  const pendingUploadCount = await prisma.message_attachment_upload.count({
    where: { uploaderId: session.userId, expiresAt: { gt: new Date() } },
  });
  if (pendingUploadCount >= MAX_PENDING_UPLOADS_PER_USER) {
    return {
      success: false,
      error: "Terlalu banyak upload yang belum selesai. Coba lagi nanti.",
    };
  }

  let storage;
  let bucketName;
  let endpoint;
  try {
    storage = getSupabaseStorageAdmin();
    bucketName = getMessageAttachmentBucketName();
    endpoint = getSupabaseResumableUploadEndpoint();
  } catch (error) {
    console.error("Konfigurasi Supabase Storage belum siap:", error);
    return {
      success: false,
      error: "Penyimpanan lampiran belum dikonfigurasi.",
    };
  }

  const storagePath = `projects/${parsed.data.projectId}/${session.userId}/${randomUUID()}${getStorageFileExtension(parsed.data.fileName)}`;
  const upload = await prisma.message_attachment_upload.create({
    data: {
      projectId: parsed.data.projectId,
      uploaderId: session.userId,
      storagePath,
      fileName: parsed.data.fileName,
      contentType: parsed.data.contentType,
      sizeBytes: BigInt(parsed.data.sizeBytes),
      expiresAt: new Date(Date.now() + ATTACHMENT_UPLOAD_TTL_MS),
    },
    select: { id: true },
  });

  const signedUpload = await storage.storage
    .from(bucketName)
    .createSignedUploadUrl(storagePath, { upsert: false });
  if (signedUpload.error || !signedUpload.data) {
    await prisma.message_attachment_upload.delete({ where: { id: upload.id } });
    console.error("Gagal membuat token upload Supabase:", signedUpload.error);
    return {
      success: false,
      error: "Upload belum dapat dimulai. Silakan coba lagi.",
    };
  }

  return {
    success: true,
    upload: {
      endpoint,
      token: signedUpload.data.token,
      bucketName,
      storagePath,
      uploadId: upload.id,
    },
  };
}

export async function finalizeMessageAttachmentUpload(
  rawUploadId: unknown,
): Promise<FinalizeAttachmentUploadResult> {
  const parsedUploadId = uploadIdSchema.safeParse(rawUploadId);
  if (!parsedUploadId.success) {
    return { success: false, error: "Upload tidak valid." };
  }

  const session = await requireAuthenticatedSession();
  const pendingUpload = await prisma.message_attachment_upload.findFirst({
    where: {
      id: parsedUploadId.data,
      uploaderId: session.userId,
      cancelledAt: null,
      expiresAt: { gt: new Date() },
      project: {
        is: {
          status: { in: SENDABLE_PROJECT_STATUSES },
          studentId: { not: null },
          OR: [
            { umkm: { is: { userId: session.userId } } },
            { student: { is: { userId: session.userId } } },
          ],
        },
      },
    },
    select: {
      id: true,
      projectId: true,
      storagePath: true,
      fileName: true,
      contentType: true,
      sizeBytes: true,
      project: {
        select: {
          title: true,
          umkm: { select: { userId: true } },
          student: { select: { userId: true } },
        },
      },
    },
  });
  if (!pendingUpload?.project.student) {
    return {
      success: false,
      error: "Upload kedaluwarsa atau percakapan sudah tidak aktif.",
    };
  }

  let storage;
  let bucketName;
  try {
    storage = getSupabaseStorageAdmin();
    bucketName = getMessageAttachmentBucketName();
  } catch (error) {
    console.error("Konfigurasi Supabase Storage belum siap:", error);
    return {
      success: false,
      error: "Penyimpanan lampiran belum dikonfigurasi.",
    };
  }

  const storedObject = await storage.storage
    .from(bucketName)
    .info(pendingUpload.storagePath);
  if (storedObject.error || !storedObject.data) {
    return {
      success: false,
      error: "File belum selesai diunggah. Silakan lanjutkan upload.",
    };
  }

  const expectedSize = Number(pendingUpload.sizeBytes);
  const storedSize = storedObject.data.size ?? 0;
  const storedValidationError = getMessageAttachmentValidationError({
    name: pendingUpload.fileName,
    size: storedSize,
    type: storedObject.data.contentType || pendingUpload.contentType,
  });
  if (storedSize !== expectedSize || storedValidationError) {
    console.error("Ukuran lampiran di storage tidak cocok dengan reservasi.", {
      uploadId: pendingUpload.id,
      expectedSize,
      storedSize,
      validationError: storedValidationError,
    });
    await removeStoredAttachments(storage, bucketName, [pendingUpload.storagePath]);
    await prisma.message_attachment_upload.updateMany({
      where: { id: pendingUpload.id, uploaderId: session.userId },
      data: { cancelledAt: new Date() },
    });
    return {
      success: false,
      error: "Verifikasi ukuran file gagal. Silakan unggah ulang.",
    };
  }

  try {
    const header = await readStoredAttachmentHeader(
      storage,
      bucketName,
      pendingUpload.storagePath,
    );
    if (
      !hasExpectedMessageAttachmentSignature({
        name: pendingUpload.fileName,
        type: storedObject.data.contentType || pendingUpload.contentType,
        bytes: header,
      })
    ) {
      throw new Error("SIGNATURE_MISMATCH");
    }
  } catch (error) {
    console.error("Isi lampiran tidak cocok dengan format yang dinyatakan:", error);
    await removeStoredAttachments(storage, bucketName, [pendingUpload.storagePath]);
    await prisma.message_attachment_upload.updateMany({
      where: { id: pendingUpload.id, uploaderId: session.userId },
      data: { cancelledAt: new Date() },
    });
    return {
      success: false,
      error: "Verifikasi isi file gagal. Silakan pilih file lain.",
    };
  }

  const recipientId =
    pendingUpload.project.umkm.userId === session.userId
      ? pendingUpload.project.student.userId
      : pendingUpload.project.umkm.userId;
  const message = await prisma.$transaction(async (transaction) => {
    const createdMessage = await transaction.message.create({
      data: {
        projectId: pendingUpload.projectId,
        senderId: session.userId,
        recipientId,
        content: `Lampiran: ${pendingUpload.fileName}`,
        attachment: {
          create: {
            storagePath: pendingUpload.storagePath,
            fileName: pendingUpload.fileName,
            contentType:
              storedObject.data.contentType || pendingUpload.contentType,
            sizeBytes: pendingUpload.sizeBytes,
          },
        },
      },
      select: {
        id: true,
        createdAt: true,
        attachment: {
          select: {
            id: true,
            fileName: true,
            contentType: true,
            sizeBytes: true,
          },
        },
      },
    });
    await transaction.message_attachment_upload.delete({
      where: { id: pendingUpload.id },
    });
    await transaction.project.update({
      where: { id: pendingUpload.projectId },
      data: { updatedAt: new Date() },
      select: { id: true },
    });
    return createdMessage;
  });

  if (!message.attachment) {
    return { success: false, error: "Lampiran gagal disimpan." };
  }

  after(async () => {
    try {
      await createUserNotification({
        userId: recipientId,
        type: "MESSAGE",
        title: `Lampiran baru dari ${session.name}`,
        message: `${pendingUpload.project.title}: ${pendingUpload.fileName}`,
        href: "/dashboard/messages",
        preferenceKey: "pesanBaru",
      });
    } catch (error) {
      console.error("Lampiran tersimpan, tetapi notifikasi gagal dibuat:", error);
    }
  });

  return {
    success: true,
    message: {
      id: message.id,
      sender: "me",
      text: `Lampiran: ${message.attachment.fileName}`,
      timeLabel: formatClock(message.createdAt),
      attachment: {
        id: message.attachment.id,
        fileName: message.attachment.fileName,
        contentType: message.attachment.contentType,
        sizeBytes: Number(message.attachment.sizeBytes),
        downloadUrl: attachmentDownloadUrl(message.attachment.id),
      },
    },
  };
}

export async function cancelMessageAttachmentUpload(rawUploadId: unknown) {
  const parsedUploadId = uploadIdSchema.safeParse(rawUploadId);
  if (!parsedUploadId.success) return false;

  const session = await requireAuthenticatedSession();
  const pendingUpload = await prisma.message_attachment_upload.findFirst({
    where: {
      id: parsedUploadId.data,
      uploaderId: session.userId,
      expiresAt: { gt: new Date() },
      cancelledAt: null,
    },
    select: { id: true, storagePath: true },
  });
  if (!pendingUpload) return false;

  try {
    const removed = await removeStoredAttachments(
      getSupabaseStorageAdmin(),
      getMessageAttachmentBucketName(),
      [pendingUpload.storagePath],
    );
    if (!removed) return false;
  } catch (error) {
    console.error("Upload lampiran belum dapat dibatalkan:", error);
    return false;
  }

  const cancelled = await prisma.message_attachment_upload.updateMany({
    where: {
      id: pendingUpload.id,
      uploaderId: session.userId,
      cancelledAt: null,
    },
    data: { cancelledAt: new Date() },
  });
  return cancelled.count > 0;
}

export async function getMessageAttachmentDownloadUrl(
  rawAttachmentId: unknown,
) {
  const parsedAttachmentId = attachmentIdSchema.safeParse(rawAttachmentId);
  if (!parsedAttachmentId.success) return null;

  const session = await requireAuthenticatedSession();
  const attachment = await prisma.message_attachment.findFirst({
    where: {
      id: parsedAttachmentId.data,
      message: {
        is: {
          OR: [
            { senderId: session.userId },
            { recipientId: session.userId },
          ],
          project: {
            is: {
              OR: [
                { umkm: { is: { userId: session.userId } } },
                { student: { is: { userId: session.userId } } },
              ],
            },
          },
        },
      },
    },
    select: { storagePath: true, fileName: true },
  });
  if (!attachment) return null;

  const signedDownload = await getSupabaseStorageAdmin()
    .storage.from(getMessageAttachmentBucketName())
    .createSignedUrl(attachment.storagePath, ATTACHMENT_DOWNLOAD_TTL_SECONDS, {
      download: attachment.fileName,
    });
  if (signedDownload.error || !signedDownload.data?.signedUrl) {
    console.error("Gagal membuat URL download lampiran:", signedDownload.error);
    return null;
  }
  return signedDownload.data.signedUrl;
}

export async function markCurrentProjectMessagesAsRead(projectId: unknown) {
  const parsed = projectIdSchema.safeParse(projectId);
  if (!parsed.success) return false;

  const session = await requireAuthenticatedSession();
  await prisma.message.updateMany({
    where: {
      projectId: parsed.data,
      recipientId: session.userId,
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  return true;
}
