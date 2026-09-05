// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createPayment: vi.fn(),
  syncPayment: vi.fn(),
  routerPush: vi.fn(),
  routerRefresh: vi.fn(),
  snapPay: vi.fn(),
}));

vi.mock("@/app/actions/payments", () => ({
  createProjectPaymentAction: mocks.createPayment,
  syncProjectPaymentAction: mocks.syncPayment,
}));
vi.mock("next/navigation", () => {
  const router = {
    push: mocks.routerPush,
    refresh: mocks.routerRefresh,
  };
  return { useRouter: () => router };
});

import PaymentCheckout from "@/components/payments/PaymentCheckout";
import type { ProjectPaymentData } from "@/types/payment";

const payment: ProjectPaymentData = {
  projectId: "project-1",
  projectTitle: "Website UMKM",
  studentName: "Ayu",
  amount: 500_000,
  amountLabel: "Rp500.000",
  status: "NOT_CREATED",
  statusLabel: "Belum dibayar",
  redirectUrl: null,
  snapToken: null,
  clientKey: "client-key",
  snapScriptUrl: "https://app.sandbox.midtrans.com/snap/snap.js",
  canPay: true,
  canSync: false,
};

describe("PaymentCheckout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.snap = { pay: mocks.snapPay };
    mocks.createPayment.mockResolvedValue({
      success: true,
      status: "PENDING",
      snapToken: "snap-token-1",
      redirectUrl: "https://app.sandbox.midtrans.com/snap/v4/redirection/token",
    });
    mocks.syncPayment.mockResolvedValue({
      success: true,
      status: "PENDING",
    });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    delete window.snap;
  });

  it("activates pending status and synchronization after creating a transaction", async () => {
    render(<PaymentCheckout payment={payment} />);

    fireEvent.click(screen.getByRole("button", { name: "Bayar Sekarang (Popup)" }));

    await waitFor(() => {
      expect(mocks.snapPay).toHaveBeenCalledWith(
        "snap-token-1",
        expect.objectContaining({ onPending: expect.any(Function) }),
      );
    });
    expect(
      screen.getByRole("button", {
        name: /Cek Status Pembayaran|Memeriksa\.\.\./,
      }),
    ).toBeTruthy();
    expect(screen.getByText("Menunggu pembayaran")).toBeTruthy();

    await waitFor(() => {
      expect(mocks.syncPayment).toHaveBeenCalledWith("project-1");
    });
  });

  it("keeps checking after a minute and only confirms payment after server verification", async () => {
    vi.useFakeTimers();
    render(<PaymentCheckout payment={{ ...payment, status: "PENDING", statusLabel: "Menunggu pembayaran" }} />);
    await act(async () => { await vi.advanceTimersByTimeAsync(70_000); });
    expect(mocks.syncPayment.mock.calls.length).toBeGreaterThanOrEqual(8);
    expect(screen.queryByText("Pembayaran Berhasil Diverifikasi!")).toBeNull();

    mocks.syncPayment.mockResolvedValue({ success: true, status: "HELD" });
    await act(async () => { await vi.advanceTimersByTimeAsync(10_000); });
    expect(screen.getByText("Pembayaran Berhasil Diverifikasi!")).toBeTruthy();
    expect(mocks.routerRefresh).toHaveBeenCalledOnce();
    const callsAfterSuccess = mocks.syncPayment.mock.calls.length;
    await act(async () => { await vi.advanceTimersByTimeAsync(20_000); });
    expect(mocks.syncPayment).toHaveBeenCalledTimes(callsAfterSuccess);
  });

  it("shows background verification errors and recovers on a later successful check", async () => {
    vi.useFakeTimers();
    mocks.syncPayment.mockResolvedValue({ success: false, error: "Midtrans belum menemukan transaksi untuk ID pesanan ini." });
    render(<PaymentCheckout payment={{ ...payment, status: "PENDING" }} />);
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    expect(screen.getByRole("alert").textContent).toContain("ID pesanan");
    mocks.syncPayment.mockResolvedValue({ success: true, status: "PENDING" });
    await act(async () => { await vi.advanceTimersByTimeAsync(10_000); });
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("uses the Snap transaction ID as a server lookup hint without trusting callback success", async () => {
    render(<PaymentCheckout payment={{ ...payment, status: "PENDING", snapToken: "snap-token" }} />);
    await waitFor(() => expect(mocks.syncPayment).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole("button", { name: "Bayar Sekarang (Popup)" }));
    const callbacks = mocks.snapPay.mock.calls[0][1];
    const transactionId = "A120260905101415U461HEEMUJID";
    await act(async () => {
      callbacks.onSuccess({ transaction_id: transactionId, transaction_status: "settlement" });
    });
    expect(mocks.syncPayment).toHaveBeenLastCalledWith("project-1", transactionId);
    expect(screen.queryByText("Pembayaran Berhasil Diverifikasi!")).toBeNull();
  });

  it("explains simulator payments and the QRIS limit for a large sandbox payment", () => {
    render(<PaymentCheckout payment={{ ...payment, amount: 20_000_000, environment: "sandbox", orderId: "JEM-order-1" }} />);
    expect(screen.getByText("Mode uji coba Sandbox")).toBeTruthy();
    expect(screen.getByText(/QRIS mendukung maksimal Rp10.000.000/)).toBeTruthy();
    expect(screen.getByText("JEM-order-1")).toBeTruthy();
  });
});
