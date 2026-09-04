// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
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
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mocks.routerPush,
    refresh: mocks.routerRefresh,
  }),
}));

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
});
