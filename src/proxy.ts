import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const MIDTRANS_SOURCES = [
  "https://*.midtrans.com",
  "https://*.veritrans.co.id",
  "https://*.cloudfront.net",
  "https://*.mixpanel.com",
  "https://*.google-analytics.com",
].join(" ");

function createContentSecurityPolicy() {
  const isDevelopment = process.env.NODE_ENV !== "production";
  return [
    "default-src 'self'",
    // Cache Components/PPR streams inline React bootstrap and RSC payloads.
    // A per-request nonce would disable the prerendered app shell, so allow
    // those inline scripts while SRI protects the external production chunks.
    `script-src 'self' 'unsafe-inline' ${MIDTRANS_SOURCES}${isDevelopment ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https:",
    "font-src 'self' data:",
    `connect-src 'self' ${MIDTRANS_SOURCES}${isDevelopment ? " ws:" : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    `frame-src ${MIDTRANS_SOURCES}`,
    "worker-src 'self' blob:",
    ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

export function proxy(request: NextRequest) {
  void request;
  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", createContentSecurityPolicy());
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
