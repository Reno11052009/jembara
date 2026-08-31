// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getNotifications: vi.fn(),
  markAllAsRead: vi.fn(),
  markAsRead: vi.fn(),
}));

vi.mock("@/app/actions/notifications", () => ({
  getNotificationsAction: mocks.getNotifications,
  markAllNotificationsAsReadAction: mocks.markAllAsRead,
  markNotificationAsReadAction: mocks.markAsRead,
}));

import NotificationMenu from "@/components/layout/NotificationMenu";

const unreadNotification = {
  id: "72ac43c8-17e4-4af7-87d4-512d36eb5770",
  type: "PROPOSAL",
  title: "Proposal baru masuk",
  message: "Seorang pelajar mengirim proposal.",
  href: "/dashboard/pelamar",
  isRead: false,
  createdAt: "2026-08-29T01:00:00.000Z",
};

describe("NotificationMenu", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getNotifications.mockResolvedValue([unreadNotification]);
    mocks.markAllAsRead.mockResolvedValue({ success: true });
    mocks.markAsRead.mockResolvedValue({ success: true });
  });

  it("loads unread notifications as soon as the header mounts", async () => {
    render(<NotificationMenu />);

    await waitFor(() => {
      expect(mocks.getNotifications).toHaveBeenCalledTimes(1);
      expect(
        screen.getByRole("button", {
          name: "Notifikasi, 1 belum dibaca",
        }),
      ).toBeTruthy();
    });
  });

  it("refreshes notifications when the window regains focus", async () => {
    mocks.getNotifications
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([unreadNotification]);
    render(<NotificationMenu />);

    await waitFor(() => {
      expect(mocks.getNotifications).toHaveBeenCalledTimes(1);
    });

    fireEvent.focus(window);

    await waitFor(() => {
      expect(mocks.getNotifications).toHaveBeenCalledTimes(2);
      expect(
        screen.getByRole("button", {
          name: "Notifikasi, 1 belum dibaca",
        }),
      ).toBeTruthy();
    });
  });
});
