// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ChatBubbleWidget from "@/components/chatbot/ChatBubbleWidget";

const STUDENT_STORAGE_KEY =
  "jembara:jelita-history:v1:user-student:STUDENT";

describe("ChatBubbleWidget session history", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it("restores validated messages and recommendation links for the same user", async () => {
    window.sessionStorage.setItem(
      STUDENT_STORAGE_KEY,
      JSON.stringify([
        {
          id: "7",
          sender: "assistant",
          text: "Project yang cocok untukmu",
          timeLabel: "14.30",
          links: [
            {
              label: "Lihat project",
              href: "/dashboard/find-projects/project-1",
            },
          ],
        },
      ]),
    );

    render(<ChatBubbleWidget role="STUDENT" userId="user-student" />);
    fireEvent.click(
      screen.getByRole("button", { name: "Buka Asisten AI Jembara" }),
    );

    expect(await screen.findByText("Project yang cocok untukmu")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Lihat project" }).getAttribute("href"),
    ).toBe("/dashboard/find-projects/project-1");
  });

  it("stores new chat messages in sessionStorage without a database request", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ message: "Jawaban dari Jelita" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ChatBubbleWidget role="STUDENT" userId="user-student" />);
    fireEvent.click(
      screen.getByRole("button", { name: "Buka Asisten AI Jembara" }),
    );
    const input = screen.getByPlaceholderText("Tanyakan sesuatu...");
    await waitFor(() => {
      expect((input as HTMLInputElement).disabled).toBe(false);
    });
    fireEvent.change(input, { target: { value: "Apa itu Jembara?" } });
    fireEvent.submit(input.closest("form")!);

    expect(await screen.findByText("Jawaban dari Jelita")).toBeTruthy();
    await waitFor(() => {
      const storedMessages = JSON.parse(
        window.sessionStorage.getItem(STUDENT_STORAGE_KEY) ?? "[]",
      ) as Array<{ sender: string; text: string }>;
      expect(storedMessages).toMatchObject([
        { sender: "user", text: "Apa itu Jembara?" },
        { sender: "assistant", text: "Jawaban dari Jelita" },
      ]);
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not restore another user's chat history", async () => {
    window.sessionStorage.setItem(
      STUDENT_STORAGE_KEY,
      JSON.stringify([
        {
          id: "1",
          sender: "user",
          text: "Riwayat akun sebelumnya",
          timeLabel: "14.30",
        },
      ]),
    );

    render(<ChatBubbleWidget role="STUDENT" userId="different-user" />);
    fireEvent.click(
      screen.getByRole("button", { name: "Buka Asisten AI Jembara" }),
    );

    await waitFor(() => {
      expect(screen.queryByText("Riwayat akun sebelumnya")).toBeNull();
      expect(screen.getByText(/Halo, saya Jelita/)).toBeTruthy();
    });
  });
});
