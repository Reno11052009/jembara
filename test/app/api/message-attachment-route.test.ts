import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  getDownloadUrl: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ verifySession: mocks.verifySession }));
vi.mock("@/lib/messages", () => ({
  getMessageAttachmentDownloadUrl: mocks.getDownloadUrl,
}));

import { GET } from "@/app/api/messages/attachments/[attachmentId]/route";

const attachmentId = "88888888-8888-4888-8888-888888888888";

describe("message attachment route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({ userId: "user-1" });
  });

  it("rejects unauthenticated downloads without disclosing attachment state", async () => {
    mocks.verifySession.mockResolvedValue(null);

    const response = await GET(new Request("http://localhost/file"), {
      params: Promise.resolve({ attachmentId }),
    });

    expect(response.status).toBe(401);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.getDownloadUrl).not.toHaveBeenCalled();
  });

  it("returns a private non-cacheable redirect for an authorized attachment", async () => {
    mocks.getDownloadUrl.mockResolvedValue("https://storage.example/signed");

    const response = await GET(new Request("http://localhost/file"), {
      params: Promise.resolve({ attachmentId }),
    });

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://storage.example/signed",
    );
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
});
