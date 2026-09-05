import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

describe("security proxy", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("uses a static production CSP compatible with cached app shells", () => {
    vi.stubEnv("NODE_ENV", "production");

    const firstCsp = proxy(new NextRequest("https://jembara.web.id/")).headers.get(
      "content-security-policy",
    );
    const secondCsp = proxy(new NextRequest("https://jembara.web.id/")).headers.get(
      "content-security-policy",
    );

    expect(firstCsp).toContain("script-src 'self'");
    expect(firstCsp).not.toContain("nonce-");
    expect(firstCsp).not.toContain("strict-dynamic");
    expect(firstCsp?.match(/script-src[^;]+/)?.[0]).toContain("'unsafe-inline'");
    expect(firstCsp?.match(/script-src[^;]+/)?.[0]).toContain(
      "https://app.midtrans.com",
    );
    expect(firstCsp?.match(/script-src[^;]+/)?.[0]).not.toContain(
      "https://*.cloudfront.net",
    );
    expect(firstCsp).toContain("script-src-attr 'none'");
    expect(firstCsp?.match(/connect-src[^;]+/)?.[0]).toContain(
      "https://*.veritrans.co.id",
    );
    expect(firstCsp?.match(/frame-src[^;]+/)?.[0]).toContain(
      "https://*.midtrans.com",
    );
    expect(firstCsp).not.toContain("frame-src 'none'");
    expect(firstCsp).not.toContain("'unsafe-eval'");
    expect(secondCsp).toBe(firstCsp);
  });
});
