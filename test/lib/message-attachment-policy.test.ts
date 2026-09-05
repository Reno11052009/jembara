import { describe, expect, it } from "vitest";
import {
  getMessageAttachmentValidationError,
  MAX_MESSAGE_ATTACHMENT_BYTES,
} from "@/lib/message-attachment-policy";

describe("message attachment policy", () => {
  it("accepts a file exactly at the 25 MB limit", () => {
    expect(
      getMessageAttachmentValidationError({
        name: "video.mp4",
        size: MAX_MESSAGE_ATTACHMENT_BYTES,
      }),
    ).toBeNull();
  });

  it("rejects a file larger than 25 MB", () => {
    expect(
      getMessageAttachmentValidationError({
        name: "video.mp4",
        size: MAX_MESSAGE_ATTACHMENT_BYTES + 1,
      }),
    ).toBe("Ukuran file maksimal 25 MB.");
  });

  it("blocks executable attachments", () => {
    expect(
      getMessageAttachmentValidationError({ name: "invoice.EXE", size: 10 }),
    ).toBe("Jenis file executable atau script tidak diizinkan.");
  });

  it("blocks active content even when the extension looks harmless", () => {
    expect(
      getMessageAttachmentValidationError({
        name: "preview.txt",
        size: 10,
        type: "text/html; charset=utf-8",
      }),
    ).toBe("Tipe konten aktif atau executable tidak diizinkan.");
  });
});
