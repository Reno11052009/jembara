import { timingSafeEqual } from "node:crypto";
import { cleanupExpiredMessageAttachmentUploads } from "@/lib/messages";

function authorized(request: Request) {
  const configuredSecret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization");
  if (!configuredSecret || !authorization?.startsWith("Bearer ")) return false;

  const suppliedSecret = authorization.slice("Bearer ".length);
  const expected = Buffer.from(configuredSecret);
  const supplied = Buffer.from(suppliedSecret);
  return (
    expected.length === supplied.length && timingSafeEqual(expected, supplied)
  );
}

function json(body: object, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(request: Request) {
  if (!authorized(request)) return json({ error: "Unauthorized" }, 401);

  try {
    const deleted = await cleanupExpiredMessageAttachmentUploads({ limit: 500 });
    return json({ deleted });
  } catch (error) {
    console.error("Cron pembersihan lampiran gagal:", error);
    return json({ error: "Cleanup failed" }, 500);
  }
}
