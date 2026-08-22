"use server";

import { revalidatePath } from "next/cache";
import { updateCurrentNotificationPreferences } from "@/lib/notification-preferences";

export async function updateNotificationPreferencesAction(input: unknown) {
  const preferences = await updateCurrentNotificationPreferences(input);
  if (!preferences) {
    return { success: false as const, error: "Pengaturan notifikasi tidak valid" };
  }

  revalidatePath("/dashboard/settings");
  return { success: true as const, preferences };
}
