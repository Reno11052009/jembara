import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { clearRateLimit, consumeRateLimit } from "./rate-limit";

describe("consumeRateLimit", () => {
  const key = "test:rate-limit";

  beforeEach(() => {
    clearRateLimit(key);
  });

  it("blocks requests after the configured limit", () => {
    expect(consumeRateLimit({ key, limit: 2, windowMs: 1_000, now: 0 }).allowed).toBe(true);
    expect(consumeRateLimit({ key, limit: 2, windowMs: 1_000, now: 1 }).allowed).toBe(true);

    const blocked = consumeRateLimit({ key, limit: 2, windowMs: 1_000, now: 2 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(1);
  });

  it("starts a new bucket after the window expires", () => {
    consumeRateLimit({ key, limit: 1, windowMs: 1_000, now: 0 });

    expect(consumeRateLimit({ key, limit: 1, windowMs: 1_000, now: 1_000 }).allowed).toBe(true);
  });
});
