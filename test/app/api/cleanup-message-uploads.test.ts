import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ cleanup: vi.fn() }));

vi.mock("@/lib/messages", () => ({
  cleanupExpiredMessageAttachmentUploads: mocks.cleanup,
}));

import { GET } from "@/app/api/cron/cleanup-message-uploads/route";

describe("expired message upload cleanup cron", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("CRON_SECRET", "cron-secret-for-tests");
    mocks.cleanup.mockResolvedValue(3);
  });

  it("requires the configured bearer secret", async () => {
    const response = await GET(new Request("http://localhost/api/cron/cleanup"));

    expect(response.status).toBe(401);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(mocks.cleanup).not.toHaveBeenCalled();
  });

  it("deletes expired reservations and their storage objects", async () => {
    const response = await GET(
      new Request("http://localhost/api/cron/cleanup", {
        headers: { Authorization: "Bearer cron-secret-for-tests" },
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ deleted: 3 });
    expect(mocks.cleanup).toHaveBeenCalledWith({ limit: 500 });
  });
});
