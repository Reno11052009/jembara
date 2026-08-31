// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendMessage: vi.fn(),
}));

vi.mock("@/app/actions/messages", () => ({
  sendMessageAction: mocks.sendMessage,
}));

import ChatPanel from "@/components/messages/ChatPanel";

describe("ChatPanel optimistic messages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows a message immediately while the server action is pending", async () => {
    let resolveSend: ((value: { success: true }) => void) | undefined;
    mocks.sendMessage.mockImplementation(
      () =>
        new Promise<{ success: true }>((resolve) => {
          resolveSend = resolve;
        }),
    );

    render(
      <ChatPanel
        conversation={{
          id: "project-1",
          contactName: "Kopi Maju",
          projectName: "Project Kopi",
          lastMessagePreview: "Belum ada pesan.",
          timeLabel: "",
          unread: false,
          isOnline: false,
          canSend: true,
        }}
        messages={[]}
      />,
    );

    const input = screen.getByPlaceholderText("Ketik pesan...");
    fireEvent.change(input, { target: { value: "Pesan cepat" } });
    fireEvent.submit(input.closest("form")!);

    expect(screen.getByText("Pesan cepat")).toBeTruthy();
    expect(screen.getByText(/Mengirim/)).toBeTruthy();
    expect((input as HTMLInputElement).value).toBe("");

    resolveSend?.({ success: true });
    await waitFor(() => {
      expect(screen.queryByText(/Mengirim/)).toBeNull();
    });
    expect(mocks.sendMessage).toHaveBeenCalledWith("project-1", "Pesan cepat");
  });

  it("rolls back the optimistic message and restores the draft on failure", async () => {
    mocks.sendMessage.mockResolvedValue({
      success: false,
      error: "Pesan gagal dikirim.",
    });

    render(
      <ChatPanel
        conversation={{
          id: "project-1",
          contactName: "Kopi Maju",
          projectName: "Project Kopi",
          lastMessagePreview: "Belum ada pesan.",
          timeLabel: "",
          unread: false,
          isOnline: false,
          canSend: true,
        }}
        messages={[]}
      />,
    );

    const input = screen.getByPlaceholderText("Ketik pesan...");
    fireEvent.change(input, { target: { value: "Coba lagi" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(screen.queryByText("Coba lagi")).toBeNull();
      expect((input as HTMLInputElement).value).toBe("Coba lagi");
      expect(screen.getByRole("alert").textContent).toContain(
        "Pesan gagal dikirim.",
      );
    });
  });
});
