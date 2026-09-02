"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import {
  cancelMessageAttachmentUpload,
  finalizeMessageAttachmentUpload,
  markCurrentProjectMessagesAsRead,
  prepareMessageAttachmentUpload,
  sendCurrentMessage,
} from "@/lib/messages";
import type {
  FinalizeAttachmentUploadResult,
  MessageActionResult,
  PrepareAttachmentUploadResult,
} from "@/types/messages";

export async function sendMessageAction(
  projectId: unknown,
  content: unknown,
): Promise<MessageActionResult> {
  try {
    const result = await sendCurrentMessage(projectId, content);
    if (result.success) {
      after(() => revalidatePath("/dashboard/messages"));
    }
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

export async function prepareMessageAttachmentUploadAction(
  projectId: unknown,
  fileName: unknown,
  contentType: unknown,
  sizeBytes: unknown,
): Promise<PrepareAttachmentUploadResult> {
  try {
    return await prepareMessageAttachmentUpload(
      projectId,
      fileName,
      contentType,
      sizeBytes,
    );
  } catch (error) {
    console.error("Gagal menyiapkan upload lampiran:", error);
    return {
      success: false,
      error: "Upload belum dapat dimulai. Silakan coba lagi.",
    };
  }
}

export async function finalizeMessageAttachmentUploadAction(
  uploadId: unknown,
): Promise<FinalizeAttachmentUploadResult> {
  try {
    const result = await finalizeMessageAttachmentUpload(uploadId);
    if (result.success) {
      after(() => revalidatePath("/dashboard/messages"));
    }
    return result;
  } catch (error) {
    console.error("Gagal menyimpan pesan lampiran:", error);
    return {
      success: false,
      error: "Lampiran gagal dikirim. Silakan coba lagi.",
    };
  }
}

export async function cancelMessageAttachmentUploadAction(uploadId: unknown) {
  try {
    return { success: await cancelMessageAttachmentUpload(uploadId) };
  } catch (error) {
    console.error("Gagal membatalkan upload lampiran:", error);
    return { success: false };
  }
}
