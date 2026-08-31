// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  register: vi.fn(),
  alert: vi.fn(),
}));

vi.mock("@/app/actions/auth", () => ({
  registerAction: mocks.register,
}));
vi.mock("sweetalert2", () => ({
  default: { fire: mocks.alert },
}));

import RegisterForm from "@/components/auth/RegisterForm";

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.alert.mockResolvedValue({});
    mocks.register.mockResolvedValue({
      error: "Email sudah terdaftar. Silakan masuk atau gunakan email lain.",
      code: "EMAIL_ALREADY_REGISTERED",
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("shows an alert when the registration email already exists", async () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText(/Nama Lengkap/), {
      target: { value: "Andi Pelajar" },
    });
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: "andi@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Alamat/), {
      target: { value: "Jalan Merdeka 10" },
    });
    fireEvent.change(screen.getByLabelText(/^Password/), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText(/Konfirmasi Password/), {
      target: { value: "Password123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Gabung Matchmaking" }));

    await waitFor(() => {
      expect(mocks.alert).toHaveBeenCalledWith({
        icon: "warning",
        title: "Email sudah terdaftar",
        text: "Silakan masuk dengan akun tersebut atau gunakan alamat email lain.",
        confirmButtonColor: "#FF6B35",
        confirmButtonText: "Mengerti",
      });
    });
    expect(screen.getByText(/Email sudah terdaftar/)).toBeTruthy();
  });
});
