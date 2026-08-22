"use server";

import { revalidatePath } from "next/cache";
import {
  getCurrentNotifications,
  markAllCurrentNotificationsAsRead,
  markCurrentNotificationAsRead,
} from "@/lib/notifications";
import type { HeaderNotification } from "@/types/notification";

export async function getNotificationsAction(): Promise<HeaderNotification[]> {
  return getCurrentNotifications();
}

export async function markNotificationAsReadAction(id: unknown) {
  const success = await markCurrentNotificationAsRead(id);
  if (success) revalidatePath("/dashboard");
  return { success };
}

export async function markAllNotificationsAsReadAction() {
  const success = await markAllCurrentNotificationsAsRead();
  if (success) revalidatePath("/dashboard");
  return { success };
}
