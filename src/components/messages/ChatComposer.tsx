"use client";

import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { FileUp, Paperclip, RotateCcw, Send, X } from "lucide-react";
import { Upload } from "tus-js-client";
import {
  cancelMessageAttachmentUploadAction,
  finalizeMessageAttachmentUploadAction,
  prepareMessageAttachmentUploadAction,
  sendMessageAction,
} from "@/app/actions/messages";
import {
  formatMessageAttachmentSize,
  getMessageAttachmentValidationError,
  MESSAGE_ATTACHMENT_TUS_CHUNK_BYTES,
} from "@/lib/message-attachment-policy";
import type { ChatMessage } from "@/types/messages";

interface ChatComposerProps {
  conversationId: string;
  canSend: boolean;
  onOptimisticSend: (message: ChatMessage) => void;
  onSendSuccess: (messageId: string) => void;
  onSendError: (messageId: string) => void;
}

interface UploadState {
  fileName: string;
  sizeBytes: number;
  progress: number;
  status: "uploading" | "verifying" | "verification-failed";
}

const jakartaClockFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export default function ChatComposer({
  conversationId,
  canSend,
  onOptimisticSend,
  onSendSuccess,
  onSendError,
}: ChatComposerProps) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [uploadState, setUploadState] = useState<UploadState | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUploadRef = useRef<Upload | null>(null);
  const activeUploadIdRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      void activeUploadRef.current?.abort(true);
      const uploadId = activeUploadIdRef.current;
      if (uploadId) void cancelMessageAttachmentUploadAction(uploadId);
    };
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSend || !draft.trim() || isPending || uploadState) return;

    const content = draft.trim();
    const optimisticId = "optimistic-" + crypto.randomUUID();
    setError("");
    setDraft("");
    onOptimisticSend({
      id: optimisticId,
      sender: "me",
      text: content,
      timeLabel: jakartaClockFormatter.format(new Date()),
      deliveryStatus: "sending",
    });

    startTransition(async () => {
      try {
        const result = await sendMessageAction(conversationId, content);
        if (!result.success) {
          onSendError(optimisticId);
          setDraft((currentDraft) => currentDraft || content);
          setError(result.error || "Pesan gagal dikirim.");
          return;
        }

        onSendSuccess(optimisticId);
      } catch {
        onSendError(optimisticId);
        setDraft((currentDraft) => currentDraft || content);
        setError("Pesan gagal dikirim. Silakan coba lagi.");
      }
    });
  }

  async function finishAttachmentUpload(uploadId: string) {
    setUploadState((current) =>
      current ? { ...current, progress: 100, status: "verifying" } : current,
    );
    const result = await finalizeMessageAttachmentUploadAction(uploadId);
    if (!isMountedRef.current) return;
    if (!result.success) {
      setError(result.error);
      setUploadState((current) =>
        current ? { ...current, status: "verification-failed" } : current,
      );
      return;
    }

    activeUploadIdRef.current = null;
    activeUploadRef.current = null;
    setUploadState(null);
    onOptimisticSend(result.message);
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !canSend || isPending || uploadState) return;

    const validationError = getMessageAttachmentValidationError(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setUploadState({
      fileName: file.name,
      sizeBytes: file.size,
      progress: 0,
      status: "uploading",
    });

    let prepared;
    try {
      prepared = await prepareMessageAttachmentUploadAction(
        conversationId,
        file.name,
        file.type,
        file.size,
      );
    } catch {
      setError("Upload belum dapat dimulai. Silakan coba lagi.");
      setUploadState(null);
      return;
    }
    if (!prepared.success) {
      setError(prepared.error);
      setUploadState(null);
      return;
    }
    if (!isMountedRef.current) {
      void cancelMessageAttachmentUploadAction(prepared.upload.uploadId);
      return;
    }

    activeUploadIdRef.current = prepared.upload.uploadId;
    const upload = new Upload(file, {
      endpoint: prepared.upload.endpoint,
      headers: { "x-signature": prepared.upload.token },
      metadata: {
        bucketName: prepared.upload.bucketName,
        objectName: prepared.upload.storagePath,
        contentType: file.type || "application/octet-stream",
        cacheControl: "3600",
      },
      uploadDataDuringCreation: true,
      chunkSize: MESSAGE_ATTACHMENT_TUS_CHUNK_BYTES,
      retryDelays: [0, 3_000, 5_000, 10_000, 20_000],
      storeFingerprintForResuming: false,
      onProgress(bytesUploaded, bytesTotal) {
        if (!isMountedRef.current) return;
        const progress =
          bytesTotal > 0 ? Math.min(100, (bytesUploaded / bytesTotal) * 100) : 0;
        setUploadState((current) =>
          current ? { ...current, progress } : current,
        );
      },
      onError(uploadError) {
        console.error("Upload lampiran gagal:", uploadError);
        if (isMountedRef.current) {
          setError(
            "Upload terputus setelah beberapa percobaan. Pilih file untuk mencoba lagi.",
          );
          setUploadState(null);
        }
        activeUploadRef.current = null;
        const uploadId = activeUploadIdRef.current;
        activeUploadIdRef.current = null;
        if (uploadId) void cancelMessageAttachmentUploadAction(uploadId);
      },
      onSuccess() {
        if (isMountedRef.current) {
          void finishAttachmentUpload(prepared.upload.uploadId);
        }
      },
    });
    activeUploadRef.current = upload;
    upload.start();
  }

  async function cancelUpload() {
    const upload = activeUploadRef.current;
    const uploadId = activeUploadIdRef.current;
    activeUploadRef.current = null;
    activeUploadIdRef.current = null;
    setUploadState(null);
    setError("");

    await upload?.abort(true).catch(() => undefined);
    if (uploadId) await cancelMessageAttachmentUploadAction(uploadId);
  }

  const isBusy = isPending || Boolean(uploadState);

  return (
    <div className="border-t border-hairline px-6 py-4">
      {uploadState && (
        <div className="mb-3 rounded-xl border border-hairline bg-canvas px-3 py-2.5">
          <div className="flex items-center gap-3">
            <FileUp size={18} className="shrink-0 text-brand" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="truncate font-medium text-ink">
                  {uploadState.fileName}
                </span>
                <span className="shrink-0 text-ink-muted">
                  {uploadState.status === "verifying" && "Memverifikasi…"}
                  {uploadState.status === "verification-failed" &&
                    "Verifikasi gagal"}
                  {uploadState.status === "uploading" &&
                    `${Math.round(uploadState.progress)}%`}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-hairline">
                <div
                  className="h-full rounded-full bg-brand transition-[width]"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-ink-muted">
                {formatMessageAttachmentSize(uploadState.sizeBytes)} · maks. 25 MB
              </p>
            </div>
            <div className="flex shrink-0 items-center">
              {uploadState.status === "verification-failed" && (
                <button
                  type="button"
                  onClick={() => {
                    const uploadId = activeUploadIdRef.current;
                    if (uploadId) void finishAttachmentUpload(uploadId);
                  }}
                  aria-label="Coba verifikasi lagi"
                  title="Coba verifikasi lagi"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-brand hover:bg-hairline"
                >
                  <RotateCcw size={15} />
                </button>
              )}
              <button
                type="button"
                onClick={() => void cancelUpload()}
                aria-label="Batalkan upload"
                title="Batalkan upload"
                disabled={uploadState.status === "verifying"}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-hairline disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => void handleFileChange(event)}
          disabled={!canSend || isBusy}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Lampirkan file, maksimal 25 MB"
          title="Lampirkan file (maks. 25 MB)"
          disabled={!canSend || isBusy}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-canvas hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Paperclip size={18} />
        </button>
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={2000}
          disabled={!canSend || isBusy}
          placeholder={
            canSend ? "Ketik pesan..." : "Percakapan proyek ini sudah ditutup"
          }
          className="flex-1 rounded-full bg-canvas px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          aria-label="Kirim pesan"
          disabled={!canSend || !draft.trim() || isBusy}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-2 pl-14 font-body text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
