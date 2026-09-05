// Lampiran pesan bukan pengganti penyimpanan video mentah. Batas yang kecil
// menahan biaya Storage/bandwidth saat signed upload URL disalahgunakan.
export const MAX_MESSAGE_ATTACHMENT_BYTES = 25 * 1024 * 1024;
export const MESSAGE_ATTACHMENT_TUS_CHUNK_BYTES = 6 * 1024 * 1024;

const ALLOWED_ATTACHMENT_TYPES: Record<string, readonly string[]> = {
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
  webp: ["image/webp"],
  pdf: ["application/pdf"],
  txt: ["text/plain"],
};

function normalizeContentType(value?: string) {
  return value?.split(";", 1)[0]?.trim().toLowerCase() || "";
}

function getExtension(fileName: string) {
  return fileName.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase() || "";
}

export function getMessageAttachmentValidationError(file: {
  name: string;
  size: number;
  type?: string;
}) {
  if (!file.name.trim()) return "Nama file tidak valid.";
  if (file.name.length > 255) return "Nama file maksimal 255 karakter.";
  if (!Number.isSafeInteger(file.size) || file.size < 1) {
    return "File kosong atau ukurannya tidak valid.";
  }
  if (file.size > MAX_MESSAGE_ATTACHMENT_BYTES) {
    return "Ukuran file maksimal 25 MB.";
  }

  const extension = getExtension(file.name);
  const allowedTypes = ALLOWED_ATTACHMENT_TYPES[extension];
  if (!allowedTypes) {
    return "Format lampiran harus JPG, PNG, WebP, PDF, atau TXT.";
  }
  const contentType = normalizeContentType(file.type);
  if (!contentType || !allowedTypes.includes(contentType)) {
    return "Ekstensi dan tipe isi file tidak cocok.";
  }

  return null;
}

export function hasExpectedMessageAttachmentSignature(file: {
  name: string;
  type: string;
  bytes: Uint8Array;
}) {
  const extension = getExtension(file.name);
  const contentType = normalizeContentType(file.type);
  const bytes = file.bytes;
  if (!ALLOWED_ATTACHMENT_TYPES[extension]?.includes(contentType)) return false;

  if (extension === "png") {
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (value, index) => bytes[index] === value,
    );
  }
  if (extension === "jpg" || extension === "jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (extension === "webp") {
    const decoder = new TextDecoder();
    return (
      decoder.decode(bytes.slice(0, 4)) === "RIFF" &&
      decoder.decode(bytes.slice(8, 12)) === "WEBP"
    );
  }
  if (extension === "pdf") {
    return new TextDecoder().decode(bytes.slice(0, 1024)).includes("%PDF-");
  }
  if (extension === "txt") {
    if (bytes.some((byte) => byte === 0)) return false;
    try {
      new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function formatMessageAttachmentSize(sizeBytes: number) {
  if (sizeBytes >= 1024 ** 3) {
    return `${(sizeBytes / 1024 ** 3).toFixed(2)} GB`;
  }
  if (sizeBytes >= 1024 ** 2) {
    return `${(sizeBytes / 1024 ** 2).toFixed(1)} MB`;
  }
  if (sizeBytes >= 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }
  return `${sizeBytes} B`;
}
