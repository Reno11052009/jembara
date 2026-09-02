import { getMessageAttachmentDownloadUrl } from "@/lib/messages";

export async function GET(
  _request: Request,
  context: { params: Promise<{ attachmentId: string }> },
) {
  const { attachmentId } = await context.params;
  const downloadUrl = await getMessageAttachmentDownloadUrl(attachmentId);
  if (!downloadUrl) {
    return Response.json(
      { error: "Lampiran tidak ditemukan atau tidak dapat diakses." },
      { status: 404 },
    );
  }
  return Response.redirect(downloadUrl, 307);
}
