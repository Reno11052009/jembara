import { getMessageAttachmentDownloadUrl } from "@/lib/messages";
import { verifySession } from "@/lib/session";

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };

export async function GET(
  _request: Request,
  context: { params: Promise<{ attachmentId: string }> },
) {
  const session = await verifySession();
  if (!session) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, headers: PRIVATE_HEADERS },
    );
  }

  const { attachmentId } = await context.params;
  const downloadUrl = await getMessageAttachmentDownloadUrl(attachmentId);
  if (!downloadUrl) {
    return Response.json(
      { error: "Lampiran tidak ditemukan atau tidak dapat diakses." },
      { status: 404, headers: PRIVATE_HEADERS },
    );
  }
  return new Response(null, {
    status: 307,
    headers: { ...PRIVATE_HEADERS, Location: downloadUrl },
  });
}
