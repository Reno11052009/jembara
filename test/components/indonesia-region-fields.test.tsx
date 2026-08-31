// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import IndonesiaRegionFields from "@/components/regions/IndonesiaRegionFields";

describe("IndonesiaRegionFields", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("offers manual region fields when wilayah.id is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("API unavailable")));

    render(
      <form>
        <IndonesiaRegionFields allowManualFallback />
      </form>,
    );

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toContain(
        "Gagal mengambil data wilayah",
      );
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Wilayah tidak ada di daftar? Isi secara manual",
      }),
    );

    expect(screen.getByLabelText(/Provinsi/)).toBeTruthy();
    expect(screen.getByLabelText(/Kabupaten\/Kota/)).toBeTruthy();
    expect(screen.getByLabelText(/Kecamatan/)).toBeTruthy();
    expect(screen.getByLabelText(/Kelurahan\/Desa/)).toBeTruthy();
    expect(
      document.querySelector<HTMLInputElement>('input[name="regionMode"]')?.value,
    ).toBe("manual");
  });
});
