import { SignJWT } from "jose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  testSecret: "test-session-secret-that-is-at-least-32-bytes",
  cookieGet: vi.fn(),
  cookieSet: vi.fn(),
  cookieDelete: vi.fn(),
  sessionFindFirst: vi.fn(),
  sessionFindMany: vi.fn(),
  sessionUpdateMany: vi.fn(),
  sessionDeleteMany: vi.fn(),
  sessionCreate: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: mocks.cookieGet,
    set: mocks.cookieSet,
    delete: mocks.cookieDelete,
  })),
  headers: vi.fn(async () => new Headers()),
}));
vi.mock("./prisma", () => ({
  default: {
    auth_session: {
      findFirst: mocks.sessionFindFirst,
      findMany: mocks.sessionFindMany,
      updateMany: mocks.sessionUpdateMany,
      deleteMany: mocks.sessionDeleteMany,
      create: mocks.sessionCreate,
    },
    security_rate_limit: {},
    $transaction: mocks.transaction,
  },
}));
vi.mock("@/config/unifiedConfig", () => ({
  config: {
    security: {
      auth: {
        session: {
          secret: mocks.testSecret,
          issuer: "jembara",
          audience: "jembara:web",
        },
      },
    },
  },
}));

import { createSession, decrypt, encrypt, verifySession } from "./session";

describe("session JWT", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.sessionDeleteMany.mockResolvedValue({ count: 0 });
    mocks.sessionCreate.mockResolvedValue({ id: "new-session" });
    mocks.sessionFindMany.mockResolvedValue([]);
    mocks.transaction.mockImplementation(async (callback) =>
      callback({
        auth_session: {
          create: mocks.sessionCreate,
          deleteMany: mocks.sessionDeleteMany,
          findMany: mocks.sessionFindMany,
        },
      }),
    );
  });

  it("round-trips a valid session", async () => {
    const token = await encrypt({
      sessionId: "session-id",
      userId: "user-id",
      role: "STUDENT",
      name: "Chello",
    });

    await expect(decrypt(token)).resolves.toEqual({
      sessionId: "session-id",
      userId: "user-id",
      role: "STUDENT",
      name: "Chello",
    });
  });

  it("rejects a token without the required issuer and audience", async () => {
    const legacyToken = await new SignJWT({
      userId: "user-id",
      role: "ADMIN",
      name: "Attacker",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(mocks.testSecret));

    await expect(decrypt(legacyToken)).resolves.toBeNull();
  });

  it("rejects a token with an invalid payload shape", async () => {
    const malformedToken = await new SignJWT({ userId: "user-id" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer("jembara")
      .setAudience("jembara:web")
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(mocks.testSecret));

    await expect(decrypt(malformedToken)).resolves.toBeNull();
  });

  it("accepts a JWT only while its server-side session exists", async () => {
    const token = await encrypt({
      sessionId: "session-id",
      userId: "user-id",
      role: "STUDENT",
      name: "Nama lama",
    });
    mocks.cookieGet.mockReturnValue({ value: token });
    mocks.sessionFindFirst.mockResolvedValue({
      id: "session-id",
      expiresAt: new Date(Date.now() + 60_000),
      lastSeenAt: new Date(),
      user: { role: "UMKM", name: "Nama terbaru" },
    });

    await expect(verifySession()).resolves.toEqual({
      sessionId: "session-id",
      userId: "user-id",
      role: "UMKM",
      name: "Nama terbaru",
    });
  });

  it("rejects a valid JWT after its server-side session is revoked", async () => {
    const token = await encrypt({
      sessionId: "revoked-session",
      userId: "user-id",
      role: "STUDENT",
      name: "Andi",
    });
    mocks.cookieGet.mockReturnValue({ value: token });
    mocks.sessionFindFirst.mockResolvedValue(null);

    await expect(verifySession()).resolves.toBeNull();
  });

  it("revokes a session after twenty-four hours of inactivity", async () => {
    const token = await encrypt({
      sessionId: "idle-session",
      userId: "user-id",
      role: "STUDENT",
      name: "Andi",
    });
    mocks.cookieGet.mockReturnValue({ value: token });
    mocks.sessionFindFirst.mockResolvedValue({
      id: "idle-session",
      expiresAt: new Date(Date.now() + 60_000),
      lastSeenAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
      user: { role: "STUDENT", name: "Andi" },
    });

    await expect(verifySession()).resolves.toBeNull();
    expect(mocks.sessionDeleteMany).toHaveBeenCalledWith({
      where: { id: "idle-session", userId: "user-id" },
    });
  });

  it("removes active sessions outside the ten most recent sessions", async () => {
    mocks.sessionFindMany.mockResolvedValue(
      Array.from({ length: 10 }, (_, index) => ({ id: `session-${index}` })),
    );

    await createSession("user-id", "STUDENT", "Andi");

    expect(mocks.sessionDeleteMany).toHaveBeenCalledWith({
      where: {
        userId: "user-id",
        id: {
          notIn: Array.from({ length: 10 }, (_, index) => `session-${index}`),
        },
      },
    });
  });
});
