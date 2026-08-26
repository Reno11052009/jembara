import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

describe("security proxy", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("uses a per-request script nonce without unsafe-inline", () => {
    vi.stubEnv("NODE_ENV", "production");

    const firstCsp = proxy(new NextRequest("https://jembara.web.id/")).headers.get(
      "content-security-policy",
    );
    const secondCsp = proxy(new NextRequest("https://jembara.web.id/")).headers.get(
      "content-security-policy",
    );

    expect(firstCsp).toMatch(/script-src 'self' 'nonce-[^']+' 'strict-dynamic'/);
    expect(firstCsp?.match(/script-src[^;]+/)?.[0]).not.toContain("'unsafe-inline'");
    expect(firstCsp).not.toContain("'unsafe-eval'");
    expect(secondCsp).not.toBe(firstCsp);
  });
});
