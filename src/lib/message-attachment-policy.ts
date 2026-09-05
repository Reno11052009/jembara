// Lampiran pesan bukan pengganti penyimpanan video mentah. Batas yang kecil
// menahan biaya Storage/bandwidth saat signed upload URL disalahgunakan.
export const MAX_MESSAGE_ATTACHMENT_BYTES = 25 * 1024 * 1024;
export const MESSAGE_ATTACHMENT_TUS_CHUNK_BYTES = 6 * 1024 * 1024;

const BLOCKED_FILE_EXTENSIONS = new Set([
  "apk",
  "app",
  "appref-ms",
  "application",
  "bat",
  "cmd",
  "com",
  "command",
  "cpl",
  "dll",
  "dmg",
  "docm",
  "exe",
  "gadget",
  "hta",
  "inf",
  "ins",
  "isu",
  "jar",
  "job",
  "js",
  "jse",
  "lnk",
  "msc",
  "msi",
  "msp",
  "mst",
  "paf",
  "pif",
  "ps1",
  "reg",
  "rgs",
  "scr",
  "sct",
  "scf",
  "sh",
  "sys",
  "url",
  "vb",
  "vbe",
  "vbs",
  "workflow",
  "ws",
  "wsc",
  "wsf",
  "wsh",
  "xlsm",
  "pptm",
]);

const BLOCKED_CONTENT_TYPES = new Set([
  "application/hta",
  "application/javascript",
  "application/x-executable",
  "application/x-msdos-program",
  "application/x-sh",
  "application/xhtml+xml",
  "image/svg+xml",
  "text/html",
  "text/javascript",
]);

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

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension && BLOCKED_FILE_EXTENSIONS.has(extension)) {
    return "Jenis file executable atau script tidak diizinkan.";
  }
  const contentType = file.type?.split(";", 1)[0]?.trim().toLowerCase();
  if (contentType && BLOCKED_CONTENT_TYPES.has(contentType)) {
    return "Tipe konten aktif atau executable tidak diizinkan.";
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
