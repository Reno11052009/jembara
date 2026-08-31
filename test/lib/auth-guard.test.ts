import { beforeEach, describe, expect, it, vi } from "vitest";

const { redirectMock, verifySessionMock } = vi.hoisted(() => ({
  redirectMock: vi.fn(),
  verifySessionMock: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));
vi.mock("@/lib/session", () => ({ verifySession: verifySessionMock }));

import { requireAdminSession, requireAuthenticatedSession } from "@/lib/auth-guard";

describe("requireAuthenticatedSession", () => {
  beforeEach(() => {
    redirectMock.mockReset();
    verifySessionMock.mockReset();
  });

  it("redirects unauthenticated users to login", async () => {
    verifySessionMock.mockResolvedValue(null);
    redirectMock.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    await expect(requireAuthenticatedSession()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledOnce();
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  it("returns a valid authenticated session", async () => {
    const session = {
      userId: "user-id",
      role: "STUDENT",
      name: "Chello",
    };
    verifySessionMock.mockResolvedValue(session);

    await expect(requireAuthenticatedSession()).resolves.toEqual(session);
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("rejects authenticated users without the ADMIN role", async () => {
    verifySessionMock.mockResolvedValue({
      userId: "student-id",
      role: "STUDENT",
      name: "Pelajar",
    });
    redirectMock.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    await expect(requireAdminSession()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/forbidden");
  });

  it("returns the session for an ADMIN user", async () => {
    const session = {
      userId: "admin-id",
      role: "ADMIN",
      name: "Admin Jembara",
    };
    verifySessionMock.mockResolvedValue(session);

    await expect(requireAdminSession()).resolves.toEqual(session);
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
