import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendCurrentMessage: vi.fn(),
  markCurrentProjectMessagesAsRead: vi.fn(),
  prepareMessageAttachmentUpload: vi.fn(),
  finalizeMessageAttachmentUpload: vi.fn(),
  cancelMessageAttachmentUpload: vi.fn(),
  revalidatePath: vi.fn(),
  after: vi.fn(),
  afterCallbacks: [] as Array<() => unknown>,
}));

vi.mock("@/lib/messages", () => ({
  sendCurrentMessage: mocks.sendCurrentMessage,
  markCurrentProjectMessagesAsRead: mocks.markCurrentProjectMessagesAsRead,
  prepareMessageAttachmentUpload: mocks.prepareMessageAttachmentUpload,
  finalizeMessageAttachmentUpload: mocks.finalizeMessageAttachmentUpload,
  cancelMessageAttachmentUpload: mocks.cancelMessageAttachmentUpload,
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("next/server", () => ({ after: mocks.after }));

import {
  finalizeMessageAttachmentUploadAction,
  markMessagesAsReadAction,
  prepareMessageAttachmentUploadAction,
  sendMessageAction,
} from "@/app/actions/messages";

describe("message actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.afterCallbacks.length = 0;
    mocks.after.mockImplementation((callback: () => unknown) => {
      mocks.afterCallbacks.push(callback);
    });
  });

  it("revalidates the messages route after responding to a successful send", async () => {
    mocks.sendCurrentMessage.mockResolvedValue({ success: true });

    await expect(sendMessageAction("project-1", "Halo")).resolves.toEqual({
      success: true,
    });
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(mocks.afterCallbacks).toHaveLength(1);
    await mocks.afterCallbacks[0]();
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard/messages");
  });

  it("does not revalidate when sending is rejected", async () => {
    mocks.sendCurrentMessage.mockResolvedValue({
      success: false,
      error: "Tidak diizinkan",
    });

    await expect(sendMessageAction("project-1", "Halo")).resolves.toEqual({
      success: false,
      error: "Tidak diizinkan",
    });
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("marks messages read and revalidates on success", async () => {
    mocks.markCurrentProjectMessagesAsRead.mockResolvedValue(true);

    await expect(markMessagesAsReadAction("project-1")).resolves.toEqual({
      success: true,
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard/messages");
  });

  it("prepares upload metadata without revalidating the page", async () => {
    mocks.prepareMessageAttachmentUpload.mockResolvedValue({
      success: true,
      upload: { uploadId: "upload-1" },
    });

    await expect(
      prepareMessageAttachmentUploadAction(
        "project-1",
        "brief.pdf",
        "application/pdf",
        100,
      ),
    ).resolves.toEqual({
      success: true,
      upload: { uploadId: "upload-1" },
    });
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("revalidates messages after finalizing an attachment", async () => {
    mocks.finalizeMessageAttachmentUpload.mockResolvedValue({
      success: true,
      message: { id: "message-1" },
    });

    await expect(
      finalizeMessageAttachmentUploadAction("upload-1"),
    ).resolves.toEqual({
      success: true,
      message: { id: "message-1" },
    });
    expect(mocks.afterCallbacks).toHaveLength(1);
    await mocks.afterCallbacks[0]();
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard/messages");
  });
});
