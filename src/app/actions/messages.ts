"use server";

import { revalidatePath } from "next/cache";
import {
  markCurrentProjectMessagesAsRead,
  sendCurrentMessage,
} from "@/lib/messages";
import type { MessageActionResult } from "@/types/messages";

export async function sendMessageAction(
  projectId: unknown,
  content: unknown,
): Promise<MessageActionResult> {
  try {
    const result = await sendCurrentMessage(projectId, content);
    if (result.success) revalidatePath("/dashboard/messages");
    return result;
  } catch (error) {
    console.error("Gagal mengirim pesan:", error);
    return {
      success: false,
      error: "Pesan gagal dikirim. Silakan coba lagi.",
    };
  }
}

export async function markMessagesAsReadAction(projectId: unknown) {
  try {
    const success = await markCurrentProjectMessagesAsRead(projectId);
    if (success) revalidatePath("/dashboard/messages");
    return { success };
  } catch (error) {
    console.error("Gagal menandai pesan sebagai dibaca:", error);
    return { success: false };
  }
}
