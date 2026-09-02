export const MAX_MESSAGE_ATTACHMENT_BYTES = 512 * 1024 * 1024;
export const MESSAGE_ATTACHMENT_TUS_CHUNK_BYTES = 6 * 1024 * 1024;

const BLOCKED_FILE_EXTENSIONS = new Set([
  "apk",
  "app",
  "bat",
  "cmd",
  "com",
  "dmg",
  "exe",
  "hta",
  "jar",
  "js",
  "jse",
  "msi",
  "msp",
  "ps1",
  "scr",
  "sh",
  "vbs",
  "wsf",
]);

export function getMessageAttachmentValidationError(file: {
  name: string;
  size: number;
}) {
  if (!file.name.trim()) return "Nama file tidak valid.";
  if (file.name.length > 255) return "Nama file maksimal 255 karakter.";
  if (!Number.isSafeInteger(file.size) || file.size < 1) {
    return "File kosong atau ukurannya tidak valid.";
  }
  if (file.size > MAX_MESSAGE_ATTACHMENT_BYTES) {
    return "Ukuran file maksimal 512 MB.";
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension && BLOCKED_FILE_EXTENSIONS.has(extension)) {
    return "Jenis file executable atau script tidak diizinkan.";
  }

  return null;
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
