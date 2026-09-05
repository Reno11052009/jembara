import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  userFindUnique: vi.fn(),
  consumeRateLimit: vi.fn(),
  transaction: vi.fn(),
  methodCount: vi.fn(),
  methodCreate: vi.fn(),
  methodFindFirst: vi.fn(),
  methodUpdateMany: vi.fn(),
  methodUpdate: vi.fn(),
  methodDelete: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/session", () => ({ verifySession: mocks.verifySession }));
vi.mock("@/lib/rate-limit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  createRateLimitKey: (scope: string, value: string) => `${scope}:${value}`,
}));
vi.mock("@/config/unifiedConfig", () => ({
  config: {
    security: {
      auth: {
        rateLimit: {
          payoutMethodMutationByUser: { limit: 20, windowMs: 3_600_000 },
        },
      },
    },
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    $transaction: mocks.transaction,
  },
}));

import {
  createPayoutMethodAction,
  deletePayoutMethodAction,
  setPrimaryPayoutMethodAction,
} from "@/app/actions/payout-methods";

const USER_ID = "11111111-1111-4111-8111-111111111111";
const METHOD_ID = "22222222-2222-4222-8222-222222222222";

function transactionClient() {
  return {
    payout_method: {
      count: mocks.methodCount,
      create: mocks.methodCreate,
      findFirst: mocks.methodFindFirst,
      updateMany: mocks.methodUpdateMany,
      update: mocks.methodUpdate,
      delete: mocks.methodDelete,
    },
  };
}

function validFormData() {
  const formData = new FormData();
  formData.set("provider", "Bank BCA");
  formData.set("accountName", "Ayu Lestari");
  formData.set("accountNumber", "1234-5678-90");
  return formData;
}

describe("payout method actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({ userId: USER_ID, role: "STUDENT" });
    mocks.userFindUnique.mockResolvedValue({ role: "STUDENT", student: { id: "student-1" } });
    mocks.consumeRateLimit.mockResolvedValue({ allowed: true });
    mocks.methodCount.mockResolvedValue(0);
    mocks.methodCreate.mockResolvedValue({ id: METHOD_ID });
    mocks.methodUpdateMany.mockResolvedValue({ count: 1 });
    mocks.methodUpdate.mockResolvedValue({ id: METHOD_ID });
    mocks.methodDelete.mockResolvedValue({ id: METHOD_ID });
    mocks.transaction.mockImplementation(
      async (callback: (transaction: ReturnType<typeof transactionClient>) => Promise<unknown>) =>
        callback(transactionClient()),
    );
  });

  it("stores the first payout method as primary and normalizes its account number", async () => {
    await expect(createPayoutMethodAction(validFormData())).resolves.toEqual({ success: true });

    expect(mocks.methodCreate).toHaveBeenCalledWith({
      data: {
        userId: USER_ID,
        provider: "Bank BCA",
        accountName: "Ayu Lestari",
        accountNumber: "1234567890",
        isPrimary: true,
      },
      select: { id: true },
    });
  });

  it("blocks payout settings for non-student roles", async () => {
    mocks.userFindUnique.mockResolvedValue({ role: "UMKM", student: null });

    await expect(createPayoutMethodAction(validFormData())).resolves.toEqual({
      success: false,
      error: "Hanya Student yang dapat mengelola metode pencairan.",
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("sets only an owned payout method as primary", async () => {
    mocks.methodFindFirst.mockResolvedValue({ id: METHOD_ID, isPrimary: false });

    await expect(setPrimaryPayoutMethodAction(METHOD_ID)).resolves.toEqual({ success: true });

    expect(mocks.methodFindFirst).toHaveBeenCalledWith({
      where: { id: METHOD_ID, userId: USER_ID },
      select: { id: true, isPrimary: true },
    });
    expect(mocks.methodUpdate).toHaveBeenCalledWith({
      where: { id: METHOD_ID },
      data: { isPrimary: true },
      select: { id: true },
    });
  });

  it("promotes the oldest remaining method when deleting the primary method", async () => {
    mocks.methodFindFirst
      .mockResolvedValueOnce({ id: METHOD_ID, isPrimary: true })
      .mockResolvedValueOnce({ id: "replacement-id" });

    await expect(deletePayoutMethodAction(METHOD_ID)).resolves.toEqual({ success: true });

    expect(mocks.methodDelete).toHaveBeenCalledWith({ where: { id: METHOD_ID } });
    expect(mocks.methodUpdate).toHaveBeenCalledWith({
      where: { id: "replacement-id" },
      data: { isPrimary: true },
      select: { id: true },
    });
  });
});
