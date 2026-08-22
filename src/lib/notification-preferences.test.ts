import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedSession: vi.fn(),
  findUnique: vi.fn(),
  upsert: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("./auth-guard", () => ({
  requireAuthenticatedSession: mocks.requireAuthenticatedSession,
}));
vi.mock("./prisma", () => ({
  default: {
    notification_preference: {
      findUnique: mocks.findUnique,
      upsert: mocks.upsert,
    },
  },
}));

import {
  defaultNotificationPreferences,
  getCurrentNotificationPreferences,
  updateCurrentNotificationPreferences,
} from "./notification-preferences";

describe("notification preferences", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuthenticatedSession.mockResolvedValue({
      userId: "user-1",
      role: "UMKM",
      name: "Pemilik",
    });
  });

  it("uses application defaults when the user has no stored preferences", async () => {
    mocks.findUnique.mockResolvedValue(null);

    await expect(getCurrentNotificationPreferences()).resolves.toEqual(
      defaultNotificationPreferences,
    );
    expect(mocks.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1" } }),
    );
  });

  it("upserts valid preferences for the authenticated user", async () => {
    const preferences = {
      proposalMasuk: false,
      pesanBaru: true,
      pembayaran: false,
      updateProyek: true,
      promosiInfo: true,
    };
    mocks.upsert.mockResolvedValue(preferences);

    await expect(updateCurrentNotificationPreferences(preferences)).resolves.toEqual(
      preferences,
    );
    expect(mocks.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-1" },
        update: preferences,
        create: { userId: "user-1", ...preferences },
      }),
    );
  });

  it("rejects malformed settings before accessing the session or database", async () => {
    await expect(
      updateCurrentNotificationPreferences({ proposalMasuk: "yes" }),
    ).resolves.toBeNull();
    expect(mocks.requireAuthenticatedSession).not.toHaveBeenCalled();
    expect(mocks.upsert).not.toHaveBeenCalled();
  });
});
