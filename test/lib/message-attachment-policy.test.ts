import { describe, expect, it } from "vitest";
import {
  getMessageAttachmentValidationError,
  hasExpectedMessageAttachmentSignature,
  MAX_MESSAGE_ATTACHMENT_BYTES,
} from "@/lib/message-attachment-policy";

describe("message attachment policy", () => {
  it("accepts a file exactly at the 25 MB limit", () => {
    expect(
      getMessageAttachmentValidationError({
        name: "brief.pdf",
        size: MAX_MESSAGE_ATTACHMENT_BYTES,
        type: "application/pdf",
      }),
    ).toBeNull();
  });

  it("rejects a file larger than 25 MB", () => {
    expect(
      getMessageAttachmentValidationError({
        name: "brief.pdf",
        size: MAX_MESSAGE_ATTACHMENT_BYTES + 1,
        type: "application/pdf",
      }),
    ).toBe("Ukuran file maksimal 25 MB.");
  });

  it("blocks formats outside the allowlist", () => {
    expect(
      getMessageAttachmentValidationError({ name: "invoice.EXE", size: 10 }),
    ).toBe("Format lampiran harus JPG, PNG, WebP, PDF, atau TXT.");
  });

  it("blocks active content even when the extension looks harmless", () => {
    expect(
      getMessageAttachmentValidationError({
        name: "preview.txt",
        size: 10,
        type: "text/html; charset=utf-8",
      }),
    ).toBe("Ekstensi dan tipe isi file tidak cocok.");
  });

  it("checks magic bytes instead of trusting metadata", () => {
    expect(
      hasExpectedMessageAttachmentSignature({
        name: "brief.pdf",
        type: "application/pdf",
        bytes: new TextEncoder().encode("<script>not a PDF</script>"),
      }),
    ).toBe(false);
    expect(
      hasExpectedMessageAttachmentSignature({
        name: "brief.pdf",
        type: "application/pdf",
        bytes: new TextEncoder().encode("%PDF-1.7\n"),
      }),
    ).toBe(true);
  });
});
