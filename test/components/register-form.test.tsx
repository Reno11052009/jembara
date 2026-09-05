// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  register: vi.fn(),
}));

vi.mock("@/app/actions/auth", () => ({
  registerAction: mocks.register,
}));

import RegisterForm from "@/components/auth/RegisterForm";

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.register.mockResolvedValue({
      error:
        "Pendaftaran belum dapat diproses. Periksa data atau masuk jika sudah memiliki akun.",
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("shows a generic error when registration cannot continue", async () => {
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
      expect(screen.getByText(/Pendaftaran belum dapat diproses/)).toBeTruthy();
    });
  });
});
