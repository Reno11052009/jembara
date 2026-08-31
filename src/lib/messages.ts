import "server-only";

<<<<<<< HEAD
=======
import { after } from "next/server";
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
import { z } from "zod";
import prisma from "./prisma";
import { requireAuthenticatedSession } from "./auth-guard";
import { createUserNotification } from "./notifications";
import { consumeRateLimit, createRateLimitKey } from "./rate-limit";
import { config } from "@/config/unifiedConfig";
import type {
  ChatMessage,
  Conversation,
  MessageActionResult,
  MessagesData,
} from "@/types/messages";

const PROJECT_MESSAGE_STATUSES = ["IN_PROGRESS", "REVIEW", "COMPLETED"];
const SENDABLE_PROJECT_STATUSES = ["IN_PROGRESS", "REVIEW"];
const MAX_MESSAGES_PER_PROJECT = 100;
<<<<<<< HEAD
=======
const JEMBARA_TIME_ZONE = "Asia/Jakarta";

const calendarDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: JEMBARA_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63

const projectIdSchema = z.string().uuid("ID proyek tidak valid.");
const sendMessageSchema = z.object({
  projectId: projectIdSchema,
  content: z
    .string()
    .trim()
    .min(1, "Pesan tidak boleh kosong.")
    .max(2000, "Pesan maksimal 2000 karakter."),
});

<<<<<<< HEAD
function isSameCalendarDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
=======
function getCalendarDate(value: Date) {
  const parts = Object.fromEntries(
    calendarDateFormatter
      .formatToParts(value)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value: partValue }) => [type, Number(partValue)]),
  );

  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    ordinal: Date.UTC(parts.year, parts.month - 1, parts.day) / 86_400_000,
  };
}

function calendarDayDifference(later: Date, earlier: Date) {
  return getCalendarDate(later).ordinal - getCalendarDate(earlier).ordinal;
}

function isSameCalendarDay(first: Date, second: Date) {
  return calendarDayDifference(first, second) === 0;
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
}

function formatClock(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
<<<<<<< HEAD
=======
    timeZone: JEMBARA_TIME_ZONE,
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(value);
}

function formatDateLabel(value: Date, now: Date) {
<<<<<<< HEAD
  if (isSameCalendarDay(value, now)) return "Hari ini";

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameCalendarDay(value, yesterday)) return "Kemarin";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: value.getFullYear() === now.getFullYear() ? undefined : "numeric",
=======
  const dayDifference = calendarDayDifference(now, value);
  if (dayDifference === 0) return "Hari ini";
  if (dayDifference === 1) return "Kemarin";

  const valueYear = getCalendarDate(value).year;
  const currentYear = getCalendarDate(now).year;

  return new Intl.DateTimeFormat("id-ID", {
    timeZone: JEMBARA_TIME_ZONE,
    day: "numeric",
    month: "long",
    year: valueYear === currentYear ? undefined : "numeric",
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
  }).format(value);
}

function formatConversationTime(value: Date, now: Date) {
<<<<<<< HEAD
  if (isSameCalendarDay(value, now)) return formatClock(value);

  const dayDifference = Math.floor(
    (startOfDay(now).getTime() - startOfDay(value).getTime()) / 86_400_000,
  );
  if (dayDifference === 1) return "Kemarin";
  if (dayDifference > 1 && dayDifference < 7) {
    return new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(value);
  }

  return new Intl.DateTimeFormat("id-ID", {
=======
  const dayDifference = calendarDayDifference(now, value);
  if (dayDifference === 0) return formatClock(value);
  if (dayDifference === 1) return "Kemarin";
  if (dayDifference > 1 && dayDifference < 7) {
    return new Intl.DateTimeFormat("id-ID", {
      timeZone: JEMBARA_TIME_ZONE,
      weekday: "long",
    }).format(value);
  }

  return new Intl.DateTimeFormat("id-ID", {
    timeZone: JEMBARA_TIME_ZONE,
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
    day: "2-digit",
    month: "short",
  }).format(value);
}

export async function getMessagesData(
  requestedProjectId?: unknown,
): Promise<MessagesData> {
  const session = await requireAuthenticatedSession();
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
      lastMessagePreview: latestMessage?.content ?? "Belum ada pesan.",
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
    };
  });

  return {
    conversations,
    conversationMessages: { [selectedConversationId]: messages },
    selectedConversationId,
  };
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

  const project = await prisma.project.findFirst({
    where: {
      id: parsed.data.projectId,
      status: { in: SENDABLE_PROJECT_STATUSES },
      studentId: { not: null },
      OR: [
        { umkm: { is: { userId: session.userId } } },
        { student: { is: { userId: session.userId } } },
      ],
    },
    select: {
      title: true,
      umkm: { select: { userId: true } },
      student: { select: { userId: true } },
    },
  });

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

<<<<<<< HEAD
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
=======
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
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63

  return { success: true };
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
<<<<<<< HEAD


=======
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
