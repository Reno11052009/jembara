import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  transaction: vi.fn(),
  projectFindFirst: vi.fn(),
  projectUpdateMany: vi.fn(),
  submissionCreate: vi.fn(),
  submissionUpdate: vi.fn(),
  paymentUpdateMany: vi.fn(),
  userUpdate: vi.fn(),
  balanceCreate: vi.fn(),
  studentUpdate: vi.fn(),
  notificationCreate: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ verifySession: mocks.verifySession }));
vi.mock("@/lib/notifications", () => ({
  createUserNotification: mocks.notificationCreate,
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/prisma", () => ({
  default: { $transaction: mocks.transaction },
}));

import {
  approveProjectResultAction,
  submitProjectResultAction,
} from "@/app/actions/project-lifecycle";

const PROJECT_ID = "22222222-2222-4222-8222-222222222222";

function transactionClient() {
  return {
    project: {
      findFirst: mocks.projectFindFirst,
      updateMany: mocks.projectUpdateMany,
    },
    project_submission: {
      create: mocks.submissionCreate,
      update: mocks.submissionUpdate,
    },
    project_payment: { updateMany: mocks.paymentUpdateMany },
    user: { update: mocks.userUpdate },
    balance_transaction: { create: mocks.balanceCreate },
    student: { update: mocks.studentUpdate },
  };
}

describe("project payment lifecycle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({
      userId: "student-user-1",
      role: "STUDENT",
      name: "Ayu",
    });
    mocks.projectUpdateMany.mockResolvedValue({ count: 1 });
    mocks.paymentUpdateMany.mockResolvedValue({ count: 1 });
    mocks.userUpdate.mockResolvedValue({ saldo: 600_000 });
    mocks.submissionCreate.mockResolvedValue({ id: "submission-1" });
    mocks.balanceCreate.mockResolvedValue({ id: "balance-1" });
    mocks.studentUpdate.mockResolvedValue({ id: "student-1" });
    mocks.notificationCreate.mockResolvedValue({ id: "notification-1" });
    mocks.transaction.mockImplementation(
      async (callback: (transaction: unknown) => Promise<unknown>) =>
        callback(transactionClient()),
    );
  });

  it("lets the selected student submit work only after funds are held", async () => {
    mocks.projectFindFirst.mockResolvedValue({
      id: PROJECT_ID,
      title: "Website UMKM",
      status: "IN_PROGRESS",
      studentId: "student-1",
      umkm: { userId: "owner-user-1" },
      payment: { status: "HELD" },
      submission: null,
    });
    const formData = new FormData();
    formData.set("projectId", PROJECT_ID);
    formData.set("resultUrl", "https://example.com/result");
    formData.set("notes", "Website sudah selesai dan siap diperiksa oleh pemilik UMKM.");

    await expect(submitProjectResultAction(formData)).resolves.toEqual({ success: true });
    expect(mocks.submissionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          projectId: PROJECT_ID,
          studentId: "student-1",
          status: "SUBMITTED",
        }),
      }),
    );
    expect(mocks.projectUpdateMany).toHaveBeenCalledWith({
      where: { id: PROJECT_ID, status: "IN_PROGRESS", studentId: "student-1" },
      data: { status: "REVIEW" },
    });
  });

  it("atomically releases held funds into the student balance after approval", async () => {
    mocks.verifySession.mockResolvedValue({
      userId: "owner-user-1",
      role: "UMKM",
      name: "Rina",
    });
    mocks.projectFindFirst.mockResolvedValue({
      id: PROJECT_ID,
      title: "Website UMKM",
      status: "REVIEW",
      studentId: "student-1",
      student: {
        id: "student-1",
        user: { id: "student-user-1", saldo: 100_000 },
      },
      payment: { id: "payment-1", status: "HELD", amount: 500_000 },
      submission: { id: "submission-1", status: "SUBMITTED" },
    });

    await expect(approveProjectResultAction(PROJECT_ID)).resolves.toEqual({
      success: true,
    });
    expect(mocks.paymentUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "payment-1", status: "HELD" },
        data: expect.objectContaining({
          status: "RELEASED",
          releasedToUserId: "student-user-1",
        }),
      }),
    );
    expect(mocks.userUpdate).toHaveBeenCalledWith({
      where: { id: "student-user-1" },
      data: { saldo: { increment: 500_000 } },
      select: { saldo: true },
    });
    expect(mocks.balanceCreate).toHaveBeenCalledWith({
      data: {
        userId: "student-user-1",
        projectPaymentId: "payment-1",
        type: "PROJECT_EARNING",
        amount: 500_000,
        balanceBefore: 100_000,
        balanceAfter: 600_000,
      },
      select: { id: true },
    });
    expect(mocks.projectUpdateMany).toHaveBeenCalledWith({
      where: { id: PROJECT_ID, status: "REVIEW", studentId: "student-1" },
      data: { status: "COMPLETED" },
    });
  });

  it("does not add the balance again when an approval is replayed", async () => {
    mocks.verifySession.mockResolvedValue({
      userId: "owner-user-1",
      role: "UMKM",
      name: "Rina",
    });
    mocks.projectFindFirst.mockResolvedValue({
      id: PROJECT_ID,
      title: "Website UMKM",
      status: "COMPLETED",
      studentId: "student-1",
      student: {
        id: "student-1",
        user: { id: "student-user-1", saldo: 600_000 },
      },
      payment: { id: "payment-1", status: "RELEASED", amount: 500_000 },
      submission: { id: "submission-1", status: "APPROVED" },
    });

    await expect(approveProjectResultAction(PROJECT_ID)).resolves.toEqual({
      success: true,
    });
    expect(mocks.paymentUpdateMany).not.toHaveBeenCalled();
    expect(mocks.userUpdate).not.toHaveBeenCalled();
    expect(mocks.balanceCreate).not.toHaveBeenCalled();
  });
});
