import "server-only";

import { z } from "zod";
import prisma from "./prisma";
import { verifySession } from "./session";
import { defaultNotificationPreferences } from "./notification-preferences";
import type {
  HeaderNotification,
  NotificationPreferenceKey,
} from "@/types/notification";

const notificationIdSchema = z.string().uuid();

async function getAuthenticatedUserId() {
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") return null;
  return session.userId;
}

export async function getCurrentNotifications(limit = 20): Promise<HeaderNotification[]> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return [];

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: Math.min(Math.max(limit, 1), 50),
    select: {
      id: true,
      type: true,
      title: true,
      message: true,
      href: true,
      isRead: true,
      createdAt: true,
    },
  });

  return notifications.map((notification) => ({
    ...notification,
    createdAt: notification.createdAt.toISOString(),
  }));
}

export async function markCurrentNotificationAsRead(id: unknown) {
  const parsedId = notificationIdSchema.safeParse(id);
  if (!parsedId.success) return false;

  const userId = await getAuthenticatedUserId();
  if (!userId) return false;

  const result = await prisma.notification.updateMany({
    where: { id: parsedId.data, userId },
    data: { isRead: true },
  });

  return result.count === 1;
}

export async function markAllCurrentNotificationsAsRead() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return false;

  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  return true;
}

export async function createUserNotification(input: {
  userId: string;
  type: string;
  title: string;
  message: string;
  href?: string | null;
  preferenceKey?: NotificationPreferenceKey;
}) {
  if (input.preferenceKey) {
    const preferences = await prisma.notification_preference.findUnique({
      where: { userId: input.userId },
      select: {
        proposalMasuk: true,
        pesanBaru: true,
        pembayaran: true,
        updateProyek: true,
        promosiInfo: true,
      },
    });
    const enabled = preferences?.[input.preferenceKey]
      ?? defaultNotificationPreferences[input.preferenceKey];
    if (!enabled) return null;
  }

  return prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      href: input.href ?? null,
    },
    select: { id: true },
  });
}

type UserNotificationInput = Parameters<typeof createUserNotification>[0];

export async function createUserNotifications(inputs: UserNotificationInput[]) {
  if (inputs.length === 0) return { count: 0 };

  const preferenceUserIds = [
    ...new Set(
      inputs
        .filter((input) => input.preferenceKey)
        .map((input) => input.userId),
    ),
  ];
  const preferences = preferenceUserIds.length > 0
    ? await prisma.notification_preference.findMany({
        where: { userId: { in: preferenceUserIds } },
        select: {
          userId: true,
          proposalMasuk: true,
          pesanBaru: true,
          pembayaran: true,
          updateProyek: true,
          promosiInfo: true,
        },
      })
    : [];
  const preferencesByUserId = new Map(
    preferences.map((preference) => [preference.userId, preference]),
  );
  const enabledInputs = inputs.filter((input) => {
    if (!input.preferenceKey) return true;
    const preference = preferencesByUserId.get(input.userId);
    return preference?.[input.preferenceKey]
      ?? defaultNotificationPreferences[input.preferenceKey];
  });

  if (enabledInputs.length === 0) return { count: 0 };

  return prisma.notification.createMany({
    data: enabledInputs.map((input) => ({
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      href: input.href ?? null,
    })),
  });
}
