// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendMessage: vi.fn(),
  prepareAttachment: vi.fn(),
  finalizeAttachment: vi.fn(),
  cancelAttachment: vi.fn(),
}));

vi.mock("@/app/actions/messages", () => ({
  sendMessageAction: mocks.sendMessage,
  prepareMessageAttachmentUploadAction: mocks.prepareAttachment,
  finalizeMessageAttachmentUploadAction: mocks.finalizeAttachment,
  cancelMessageAttachmentUploadAction: mocks.cancelAttachment,
}));
vi.mock("tus-js-client", () => ({
  Upload: class {
    options: {
      onProgress?: (uploaded: number, total: number) => void;
      onSuccess?: () => void;
    };

    constructor(
      _file: File,
      options: {
        onProgress?: (uploaded: number, total: number) => void;
        onSuccess?: () => void;
      },
    ) {
      this.options = options;
    }

    start() {
      this.options.onProgress?.(50, 100);
      this.options.onSuccess?.();
    }

    abort() {
      return Promise.resolve();
    }
  },
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

  it("uploads and renders a file attachment", async () => {
    mocks.prepareAttachment.mockResolvedValue({
      success: true,
      upload: {
        endpoint: "https://storage.example.test/upload/resumable",
        token: "signed-token",
        bucketName: "message-attachments",
        storagePath: "projects/project-1/file.pdf",
        uploadId: "upload-1",
      },
    });
    mocks.finalizeAttachment.mockResolvedValue({
      success: true,
      message: {
        id: "message-file-1",
        sender: "me",
        text: "Lampiran: brief.pdf",
        timeLabel: "15.00",
        attachment: {
          id: "attachment-1",
          fileName: "brief.pdf",
          contentType: "application/pdf",
          sizeBytes: 1024,
          downloadUrl: "/api/messages/attachments/attachment-1",
        },
      },
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

    const fileInput = document.querySelector<HTMLInputElement>(
      'input[type="file"]',
    );
    expect(fileInput).not.toBeNull();
    fireEvent.change(fileInput!, {
      target: {
        files: [new File(["brief"], "brief.pdf", { type: "application/pdf" })],
      },
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Unduh brief.pdf")).toBeTruthy();
    });
    expect(mocks.prepareAttachment).toHaveBeenCalledWith(
      "project-1",
      "brief.pdf",
      "application/pdf",
      5,
    );
    expect(mocks.finalizeAttachment).toHaveBeenCalledWith("upload-1");
  });
});
