"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import type { HeaderNotification } from "@/types/notification";

async function getAuthenticatedUserId() {
  const session = await verifySession();

  if (!session?.userId || session.userId === "mock-user-id") {
    return null;
  }

  return session.userId;
}

export async function getNotificationsAction(): Promise<HeaderNotification[]> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return [];

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
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

export async function markNotificationAsReadAction(id: string) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false };

  const result = await prisma.notification.updateMany({
    where: { id, userId },
    data: { isRead: true },
  });

  return { success: result.count === 1 };
}

export async function markAllNotificationsAsReadAction() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false };

  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  return { success: true };
}
