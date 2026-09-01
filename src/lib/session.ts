import "server-only";

import { randomUUID } from "node:crypto";
import { cache } from "react";
import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { config } from "@/config/unifiedConfig";
import { Prisma } from "@/generated/prisma/client";
import prisma from "./prisma";
import { getClientAddress } from "./rate-limit";

const sessionConfig = config.security.auth.session;
const encodedKey = new TextEncoder().encode(sessionConfig.secret);
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_IDLE_TIMEOUT_MS = 24 * 60 * 60 * 1000;
const LAST_SEEN_WRITE_INTERVAL_MS = 5 * 60 * 1000;
const MAX_ACTIVE_SESSIONS_PER_USER = 10;
const MAX_SESSION_TRANSACTION_ATTEMPTS = 3;
const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Host-jembara_session"
    : "jembara_session";

type SessionPayload = {
  sessionId: string;
  userId: string;
  role: string;
  name: string;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(sessionConfig.issuer)
    .setAudience(sessionConfig.audience)
    .setJti(payload.sessionId)
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = "",
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
      issuer: sessionConfig.issuer,
      audience: sessionConfig.audience,
    });

    if (
      typeof payload.sessionId !== "string" ||
      typeof payload.userId !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.name !== "string" ||
      payload.jti !== payload.sessionId
    ) {
      return null;
    }

    return {
      sessionId: payload.sessionId,
      userId: payload.userId,
      role: payload.role,
      name: payload.name,
    };
  } catch {
    return null;
  }
}

export async function createSession(
  userId: string,
  role: string,
  name: string = "Pengguna Baru",
) {
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const requestHeaders = await headers();
  const cookieStore = await cookies();
  const previousSession = await decrypt(
    cookieStore.get(SESSION_COOKIE_NAME)?.value,
  );
  const userAgent = requestHeaders.get("user-agent")?.slice(0, 512) || null;
  const clientAddress = await getClientAddress();
  const ipAddress = clientAddress === "unknown" ? null : clientAddress.slice(0, 64);
  const session = await encrypt({ sessionId, userId, role, name });

  const now = new Date();
  await prisma.auth_session.deleteMany({
    where: {
      OR: [
        { expiresAt: { lte: now } },
        { lastSeenAt: { lte: new Date(now.getTime() - SESSION_IDLE_TIMEOUT_MS) } },
      ],
    },
  });

  for (let attempt = 0; attempt < MAX_SESSION_TRANSACTION_ATTEMPTS; attempt += 1) {
    try {
      await prisma.$transaction(
        async (transaction) => {
          await transaction.auth_session.create({
            data: {
              id: sessionId,
              userId,
              userAgent,
              ipAddress,
              expiresAt,
            },
            select: { id: true },
          });
          if (previousSession) {
            await transaction.auth_session.deleteMany({
              where: {
                id: previousSession.sessionId,
                userId: previousSession.userId,
              },
            });
          }

          const retainedSessions = await transaction.auth_session.findMany({
            where: { userId },
            orderBy: [{ lastSeenAt: "desc" }, { createdAt: "desc" }],
            take: MAX_ACTIVE_SESSIONS_PER_USER,
            select: { id: true },
          });
          if (retainedSessions.length === MAX_ACTIVE_SESSIONS_PER_USER) {
            await transaction.auth_session.deleteMany({
              where: {
                userId,
                id: { notIn: retainedSessions.map(({ id }) => id) },
              },
            });
          }
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      break;
    } catch (error) {
      const shouldRetry =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034" &&
        attempt < MAX_SESSION_TRANSACTION_ATTEMPTS - 1;
      if (!shouldRetry) throw error;
    }
  }

  try {
    cookieStore.set(SESSION_COOKIE_NAME, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
      priority: "high",
    });
    cookieStore.delete("session");
  } catch (error) {
    await prisma.auth_session.deleteMany({ where: { id: sessionId, userId } });
    throw error;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await decrypt(sessionCookie);

  if (session) {
    await prisma.auth_session.deleteMany({
      where: { id: session.sessionId, userId: session.userId },
    });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete("session");
}

async function verifySessionUncached() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) return null;

  const now = new Date();
  const storedSession = await prisma.auth_session.findFirst({
    where: {
      id: session.sessionId,
      userId: session.userId,
    },
    select: {
      id: true,
      expiresAt: true,
      lastSeenAt: true,
      user: { select: { role: true, name: true } },
    },
  });
  if (!storedSession) return null;

  const idleCutoff = new Date(now.getTime() - SESSION_IDLE_TIMEOUT_MS);
  if (storedSession.expiresAt <= now || storedSession.lastSeenAt <= idleCutoff) {
    await prisma.auth_session.deleteMany({
      where: { id: storedSession.id, userId: session.userId },
    });
    return null;
  }

  if (
    now.getTime() - storedSession.lastSeenAt.getTime() >=
    LAST_SEEN_WRITE_INTERVAL_MS
  ) {
    await prisma.auth_session.updateMany({
      where: { id: storedSession.id, userId: session.userId },
      data: { lastSeenAt: now },
    });
  }

  return {
    sessionId: storedSession.id,
    userId: session.userId,
    role: storedSession.user.role,
    name: storedSession.user.name || "Pengguna",
  };
}

// Layout dan page/data-access layer sering memverifikasi sesi yang sama dalam
// satu render. React cache membagikan hasil hanya selama request tersebut,
// sehingga validasi database tetap dijalankan lagi pada request berikutnya.
export const verifySession = cache(verifySessionUncached);
