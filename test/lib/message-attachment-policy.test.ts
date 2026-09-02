import { describe, expect, it } from "vitest";
import {
  getMessageAttachmentValidationError,
  MAX_MESSAGE_ATTACHMENT_BYTES,
} from "@/lib/message-attachment-policy";

describe("message attachment policy", () => {
  it("accepts a file exactly at the 512 MB limit", () => {
    expect(
      getMessageAttachmentValidationError({
        name: "video.mp4",
        size: MAX_MESSAGE_ATTACHMENT_BYTES,
      }),
    ).toBeNull();
  });

  it("rejects a file larger than 512 MB", () => {
    expect(
      getMessageAttachmentValidationError({
        name: "video.mp4",
        size: MAX_MESSAGE_ATTACHMENT_BYTES + 1,
      }),
    ).toBe("Ukuran file maksimal 512 MB.");
  });

  it("blocks executable attachments", () => {
    expect(
      getMessageAttachmentValidationError({ name: "invoice.EXE", size: 10 }),
    ).toBe("Jenis file executable atau script tidak diizinkan.");
  });
});
