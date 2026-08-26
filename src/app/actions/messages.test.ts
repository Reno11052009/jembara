import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendCurrentMessage: vi.fn(),
  markCurrentProjectMessagesAsRead: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/messages", () => ({
  sendCurrentMessage: mocks.sendCurrentMessage,
  markCurrentProjectMessagesAsRead: mocks.markCurrentProjectMessagesAsRead,
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import {
  markMessagesAsReadAction,
  sendMessageAction,
} from "./messages";

describe("message actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("revalidates the messages route after a successful send", async () => {
    mocks.sendCurrentMessage.mockResolvedValue({ success: true });

    await expect(sendMessageAction("project-1", "Halo")).resolves.toEqual({
      success: true,
    });
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
});
