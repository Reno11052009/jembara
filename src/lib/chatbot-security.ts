import "server-only";

import prisma from "./prisma";
import { createRateLimitKey } from "./rate-limit";

const BAN_MINUTES = [2, 3, 5, 10, 15, 20, 30] as const;
const VIOLATION_THRESHOLD = 10;
const PERMANENT_MS = 100 * 365 * 24 * 60 * 60 * 1000;

const BANNED_PATTERNS: readonly RegExp[] = [
  /\b(buatkan|buat|tuliskan|tulis|bikinkan|bikin|generate|sediakan|kasih|berikan)\b.*?\b(kode|koding|coding|sintaks|syntax|snippet|script|skrip|program)\b/i,
  /\b(kode|koding|coding|sintaks|syntax|snippet|script|skrip|program)\b.*?\b(rust|python|javascript|typescript|c\+\+|c#|golang|php|java|ruby|swift|kotlin|html|css|sql|bash|powershell)\b/i,
  /\b(rust|python|javascript|typescript|c\+\+|c#|golang|php|java|ruby|swift|kotlin|html|css|sql|bash|powershell)\b.*?\b(kode|koding|coding|sintaks|syntax|snippet|script|skrip|program)\b/i,
  /\b(bahasa\s+pemrograman|programming\s+language)\b.*?\b(contoh|implementasi|snippet|sintaks|kode)/i,
  /\b(contoh|implementasi)\b.*?\b(bahasa\s+pemrograman|kode|sintaks)/i,
  /\b(hello\s+world|print\s*\(['"]|console\.log|println!|fn\s+main|def\s+\w+\(|public\s+static\s+void|#include\s*<)\b/i,
  /\b(jailbreak|developer\s+mode|dan\s+mode|abaikan\s+(?:semua\s+)?instruksi|ignore\s+all\s+instructions)\b/i,
  /\b(base64|rot13|hex\s+decode|binary\s+decode)\b.*?\b(decode|terjemahkan|eksekusi)\b/i,
];

export type ChatbotBanStatus =
  | { isBanned: false }
  | {
      isBanned: true;
      isPermanent: boolean;
      remainingMinutes: number;
      retryAfterSeconds: number;
    };

export type ViolationResult =
  | {
      banned: false;
      violationCount: number;
    }
  | {
      banned: true;
      isPermanent: boolean;
      banDurationMinutes: number;
      retryAfterSeconds: number;
    };

export function isBannedChatbotPrompt(message: string): boolean {
  return BANNED_PATTERNS.some((pattern) => pattern.test(message));
}

export async function getChatbotBanStatus(
  userId: string,
): Promise<ChatbotBanStatus> {
  const banKey = createRateLimitKey("chatbot-ban", userId);
  const record = await prisma.security_rate_limit.findUnique({
    where: { key: banKey },
  });

  if (!record) {
    return { isBanned: false };
  }

  const now = Date.now();
  const resetAtTime = record.resetAt.getTime();
  if (resetAtTime <= now) {
    return { isBanned: false };
  }

  const isPermanent = record.count >= BAN_MINUTES.length;
  const remainingMs = resetAtTime - now;
  const retryAfterSeconds = Math.max(1, Math.ceil(remainingMs / 1000));
  const remainingMinutes = Math.max(1, Math.ceil(remainingMs / 60000));

  return {
    isBanned: true,
    isPermanent,
    remainingMinutes,
    retryAfterSeconds,
  };
}

export async function recordChatbotViolation(
  userId: string,
): Promise<ViolationResult> {
  const strikeKey = createRateLimitKey("chatbot-strike", userId);
  const tierKey = createRateLimitKey("chatbot-tier", userId);
  const banKey = createRateLimitKey("chatbot-ban", userId);
  const now = Date.now();

  const [tierRecord, strikeRecord] = await Promise.all([
    prisma.security_rate_limit.findUnique({ where: { key: tierKey } }),
    prisma.security_rate_limit.findUnique({ where: { key: strikeKey } }),
  ]);

  const currentTier = tierRecord?.count ?? 0;
  const currentStrikes = strikeRecord?.count ?? 0;

  if (currentTier === 0) {
    const newStrikes = currentStrikes + 1;
    if (newStrikes < VIOLATION_THRESHOLD) {
      await prisma.security_rate_limit.upsert({
        where: { key: strikeKey },
        create: {
          key: strikeKey,
          count: newStrikes,
          resetAt: new Date(now + 30 * 24 * 60 * 60 * 1000),
        },
        update: {
          count: newStrikes,
          updatedAt: new Date(now),
        },
      });

      return {
        banned: false,
        violationCount: newStrikes,
      };
    }

    const firstTierDuration = BAN_MINUTES[0];
    const resetAt = new Date(now + firstTierDuration * 60 * 1000);

    await Promise.all([
      prisma.security_rate_limit.upsert({
        where: { key: tierKey },
        create: {
          key: tierKey,
          count: 1,
          resetAt: new Date(now + 365 * 24 * 60 * 60 * 1000),
        },
        update: {
          count: 1,
          updatedAt: new Date(now),
        },
      }),
      prisma.security_rate_limit.upsert({
        where: { key: banKey },
        create: {
          key: banKey,
          count: 0,
          resetAt,
        },
        update: {
          count: 0,
          resetAt,
          updatedAt: new Date(now),
        },
      }),
    ]);

    return {
      banned: true,
      isPermanent: false,
      banDurationMinutes: firstTierDuration,
      retryAfterSeconds: firstTierDuration * 60,
    };
  }

  const nextTierIndex = currentTier;
  const isPermanent = nextTierIndex >= BAN_MINUTES.length;
  const banDurationMinutes = isPermanent
    ? 0
    : BAN_MINUTES[nextTierIndex];
  const resetAt = isPermanent
    ? new Date(now + PERMANENT_MS)
    : new Date(now + banDurationMinutes * 60 * 1000);

  await Promise.all([
    prisma.security_rate_limit.upsert({
      where: { key: tierKey },
      create: {
        key: tierKey,
        count: currentTier + 1,
        resetAt: new Date(now + 365 * 24 * 60 * 60 * 1000),
      },
      update: {
        count: currentTier + 1,
        updatedAt: new Date(now),
      },
    }),
    prisma.security_rate_limit.upsert({
      where: { key: banKey },
      create: {
        key: banKey,
        count: nextTierIndex,
        resetAt,
      },
      update: {
        count: nextTierIndex,
        resetAt,
        updatedAt: new Date(now),
      },
    }),
  ]);

  return {
    banned: true,
    isPermanent,
    banDurationMinutes,
    retryAfterSeconds: isPermanent ? 3153600000 : banDurationMinutes * 60,
  };
}
