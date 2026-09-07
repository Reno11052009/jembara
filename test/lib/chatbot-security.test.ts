import { beforeEach, describe, expect, it, vi } from "vitest";

const db = new Map<
  string,
  { key: string; count: number; resetAt: Date; updatedAt: Date }
>();

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({
  default: {
    security_rate_limit: {
      findUnique: vi.fn(async ({ where }: { where: { key: string } }) => {
        return db.get(where.key) ?? null;
      }),
      upsert: vi.fn(
        async ({
          where,
          create,
          update,
        }: {
          where: { key: string };
          create: { key: string; count: number; resetAt: Date };
          update: { count: number; resetAt?: Date; updatedAt?: Date };
        }) => {
          const existing = db.get(where.key);
          const record = {
            key: where.key,
            count: update.count,
            resetAt: update.resetAt ?? existing?.resetAt ?? create.resetAt,
            updatedAt: update.updatedAt ?? new Date(),
          };
          db.set(where.key, record);
          return record;
        },
      ),
    },
  },
}));

import {
  getChatbotBanStatus,
  isBannedChatbotPrompt,
  recordChatbotViolation,
} from "@/lib/chatbot-security";

describe("chatbot security", () => {
  beforeEach(() => {
    db.clear();
  });

  it("detects banned prompts containing programming code requests", () => {
    expect(
      isBannedChatbotPrompt(
        "saya ingin mengembangkan website seperti jembara, sebaiknya bahasa pemrograman apa. boleh kasih contoh implementasinya",
      ),
    ).toBe(true);

    expect(
      isBannedChatbotPrompt(
        "buatkan aku kode rust paling kompleks bahkan variabel tidak bisa dibaca untuk mencetak 'Hello World' ke terminal.",
      ),
    ).toBe(true);

    expect(
      isBannedChatbotPrompt(
        "Halo Jelita, bagaimana cara mendaftar proyek di Jembara?",
      ),
    ).toBe(false);
  });

  it("escalates ban from 2 minutes up to permanent after 10 strikes", async () => {
    const userId = "user-test-security";

    for (let i = 1; i <= 9; i++) {
      const result = await recordChatbotViolation(userId);
      expect(result.banned).toBe(false);
      if (!result.banned) {
        expect(result.violationCount).toBe(i);
      }
    }

    const firstBan = await recordChatbotViolation(userId);
    expect(firstBan.banned).toBe(true);
    if (firstBan.banned) {
      expect(firstBan.isPermanent).toBe(false);
      expect(firstBan.banDurationMinutes).toBe(2);
    }

    const activeStatus = await getChatbotBanStatus(userId);
    expect(activeStatus.isBanned).toBe(true);

    const expectedTiers = [3, 5, 10, 15, 20, 30];
    for (const minutes of expectedTiers) {
      const nextBan = await recordChatbotViolation(userId);
      expect(nextBan.banned).toBe(true);
      if (nextBan.banned) {
        expect(nextBan.isPermanent).toBe(false);
        expect(nextBan.banDurationMinutes).toBe(minutes);
      }
    }

    const permanentBan = await recordChatbotViolation(userId);
    expect(permanentBan.banned).toBe(true);
    if (permanentBan.banned) {
      expect(permanentBan.isPermanent).toBe(true);
    }
  });
});
