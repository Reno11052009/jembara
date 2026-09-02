import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let storageClient: SupabaseClient | undefined;

function requiredStorageEnvironmentValue(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} wajib tersedia untuk upload lampiran.`);
  return value;
}

export function getMessageAttachmentBucketName() {
  const bucketName =
    process.env.SUPABASE_STORAGE_BUCKET?.trim() || "message-attachments";
  if (!/^[a-z0-9][a-z0-9._-]{0,99}$/.test(bucketName)) {
    throw new Error("SUPABASE_STORAGE_BUCKET tidak valid.");
  }
  return bucketName;
}

export function getSupabaseStorageAdmin() {
  if (storageClient) return storageClient;

  storageClient = createClient(
    requiredStorageEnvironmentValue("SUPABASE_URL"),
    requiredStorageEnvironmentValue("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
  return storageClient;
}

export function getSupabaseResumableUploadEndpoint() {
  const projectUrl = new URL(requiredStorageEnvironmentValue("SUPABASE_URL"));
  if (
    projectUrl.protocol === "https:" &&
    projectUrl.hostname.endsWith(".supabase.co") &&
    !projectUrl.hostname.endsWith(".storage.supabase.co")
  ) {
    const projectRef = projectUrl.hostname.slice(0, -".supabase.co".length);
    projectUrl.hostname = `${projectRef}.storage.supabase.co`;
  }

  projectUrl.pathname = "/storage/v1/upload/resumable";
  projectUrl.search = "";
  projectUrl.hash = "";
  return projectUrl.toString();
}
