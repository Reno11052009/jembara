// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  acceptProposal: vi.fn(),
  rejectProposal: vi.fn(),
  routerPush: vi.fn(),
  swalFire: vi.fn(),
}));

vi.mock("@/app/actions/proposals", () => ({
  acceptProposalAction: mocks.acceptProposal,
  rejectProposalAction: mocks.rejectProposal,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.routerPush }),
}));
vi.mock("sweetalert2", () => ({
  default: { fire: mocks.swalFire },
}));

import ApplicantRow from "@/components/dashboard/umkm/pelamar/ApplicantRow";
import type { Applicant } from "@/types/applicant";

const applicant: Applicant = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Ayu",
  rating: null,
  reviewCount: 0,
  location: "Bandung",
  isRemote: true,
  appliedAtLabel: "Diajukan baru saja",
  matchPercent: 100,
  proposal: "Saya siap membantu mengerjakan project ini.",
  skills: ["React"],
  status: "Pending",
  budgetMatch: true,
  portfolioUrl: null,
};

describe("ApplicantRow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.acceptProposal.mockResolvedValue({ success: true });
    mocks.rejectProposal.mockResolvedValue({ success: true });
    mocks.swalFire.mockResolvedValue({ isConfirmed: true });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("allows a pending applicant to be accepted", async () => {
    render(<ApplicantRow applicant={applicant} />);

    fireEvent.click(screen.getByRole("button", { name: "Terima" }));

    await waitFor(() => {
      expect(mocks.acceptProposal).toHaveBeenCalledWith(applicant.id);
    });
    expect(mocks.swalFire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Terima Ayu?",
        showCancelButton: true,
      }),
    );
  });

  it("does not accept an applicant when the dialog is cancelled", async () => {
    mocks.swalFire.mockResolvedValueOnce({ isConfirmed: false });
    render(<ApplicantRow applicant={applicant} />);

    fireEvent.click(screen.getByRole("button", { name: "Terima" }));

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalled();
    });
    expect(mocks.acceptProposal).not.toHaveBeenCalled();
  });

  it("hides decision controls after a proposal has a decision", () => {
    render(<ApplicantRow applicant={{ ...applicant, status: "Diterima" }} />);

    expect(screen.queryByRole("button", { name: "Terima" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Tolak" })).toBeNull();
  });
});
