"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import {
  createProjectPaymentAction,
  syncProjectPaymentAction,
} from "@/app/actions/payments";
import type {
  ProjectPaymentData,
  ProjectPaymentStatus,
} from "@/types/payment";

const paymentStatusLabels: Record<ProjectPaymentStatus, string> = {
  NOT_CREATED: "Belum dibayar",
  CREATING: "Menyiapkan pembayaran",
  PENDING: "Menunggu pembayaran",
  HELD: "Dana ditahan Jembara",
  RELEASED: "Saldo telah diteruskan",
  FAILED: "Pembayaran gagal",
  EXPIRED: "Pembayaran kedaluwarsa",
  CANCELLED: "Pembayaran dibatalkan",
  REFUNDED: "Dana dikembalikan",
  CHARGEBACK: "Pembayaran ditarik kembali",
};

const retryableStatuses: ProjectPaymentStatus[] = [
  "NOT_CREATED",
  "FAILED",
  "EXPIRED",
  "CANCELLED",
];
const serverAuthoritativeStatuses: ProjectPaymentStatus[] = [
  "HELD",
  "RELEASED",
  "REFUNDED",
  "CHARGEBACK",
];

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

interface PaymentCheckoutProps {
  payment: ProjectPaymentData;
  paymentFinished?: boolean;
}

export default function PaymentCheckout({
  payment,
  paymentFinished = false,
}: PaymentCheckoutProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  const [localStatus, setLocalStatus] =
    useState<ProjectPaymentStatus | null>(null);
  const [activePayment, setActivePayment] = useState({
    snapToken: payment.snapToken ?? null,
    redirectUrl: payment.redirectUrl,
  });
  const isSyncingRef = useRef(false);
  const pollCountRef = useRef(0);
  const currentStatus = serverAuthoritativeStatuses.includes(payment.status)
    ? payment.status
    : localStatus ?? payment.status;
  const canPay =
    payment.canPay &&
    (retryableStatuses.includes(currentStatus) || currentStatus === "PENDING");
  const canSync = currentStatus === "PENDING" || currentStatus === "CREATING";

  // 1. Muat skrip Snap.js Midtrans untuk popup/overlay
  useEffect(() => {
    const scriptUrl =
      payment.snapScriptUrl || "https://app.sandbox.midtrans.com/snap/snap.js";
    const scriptId = "midtrans-snap-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (window.snap) return;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = scriptUrl;
      script.setAttribute("data-client-key", payment.clientKey || "");
      script.async = true;
      script.onerror = () => {
        console.warn("Gagal memuat Snap.js, fallback ke redirect akan digunakan.");
      };
      document.body.appendChild(script);
    }
  }, [payment.snapScriptUrl, payment.clientKey]);

  const performSync = useCallback(
    async (silent = false) => {
      if (
        isSyncingRef.current ||
        currentStatus === "HELD" ||
        currentStatus === "RELEASED"
      ) {
        return;
      }
      isSyncingRef.current = true;
      if (!silent) {
        setError(null);
        setSyncMessage("Memeriksa status ke Midtrans...");
      }

      try {
        const result = await syncProjectPaymentAction(payment.projectId);
        if (result.success) {
          if (result.status) {
            setLocalStatus(result.status);
            if (retryableStatuses.includes(result.status)) {
              setActivePayment({ snapToken: null, redirectUrl: null });
            }
          }
          if (result.status === "HELD") {
            setSyncMessage("Pembayaran berhasil diverifikasi!");
            router.refresh();
          } else if (!silent) {
            setSyncMessage(
              "Pembayaran belum terkonfirmasi oleh Midtrans. Jika sudah membayar, silakan tunggu beberapa saat lalu coba lagi.",
            );
          }
        } else if (!silent) {
          setError(result.error || "Status pembayaran belum dapat diperbarui.");
          setSyncMessage(null);
        }
      } catch {
        if (!silent) {
          setError("Gagal menghubungi server. Silakan coba lagi.");
          setSyncMessage(null);
        }
      } finally {
        isSyncingRef.current = false;
      }
    },
    [currentStatus, payment.projectId, router],
  );

  function handleManualSync() {
    startTransition(async () => {
      await performSync(false);
    });
  }

  function triggerSnapPopup(token: string, fallbackUrl?: string | null) {
    if (typeof window !== "undefined" && window.snap && typeof window.snap.pay === "function") {
      window.snap.pay(token, {
        onSuccess: function () {
          setSyncMessage("Pembayaran berhasil! Sedang memverifikasi data...");
          performSync(false);
        },
        onPending: function () {
          setSyncMessage("Instruksi pembayaran telah dibuat. Silakan selesaikan pembayaran Anda.");
          performSync(false);
        },
        onError: function () {
          setError("Pembayaran gagal atau dibatalkan. Silakan coba lagi.");
        },
        onClose: function () {
          // Pengguna menutup popup; periksa otomatis barangkali pembayaran sudah selesai sesaat sebelum ditutup
          performSync(true);
        },
      });
    } else if (fallbackUrl) {
      // Fallback ke redirect jika skrip popup terhalang oleh browser extension
      window.location.assign(fallbackUrl);
    } else {
      setError("Antarmuka pembayaran Midtrans sedang memuat. Tunggu beberapa detik lalu coba lagi.");
    }
  }

  function startPayment() {
    setError(null);
    setSyncMessage(null);

    // Jika snapToken sudah tersedia dan snap.js siap, buka popup langsung tanpa request baru
    if (activePayment.snapToken && typeof window !== "undefined" && window.snap) {
      triggerSnapPopup(activePayment.snapToken, activePayment.redirectUrl);
      return;
    }

    startTransition(async () => {
      const result = await createProjectPaymentAction(payment.projectId);
      if (!result.success || (!result.snapToken && !result.redirectUrl)) {
        setError(result.error || "Gagal menyiapkan pembayaran.");
        return;
      }
      if (result.status) setLocalStatus(result.status);
      setActivePayment({
        snapToken: result.snapToken ?? null,
        redirectUrl: result.redirectUrl ?? null,
      });

      if (result.snapToken && typeof window !== "undefined" && window.snap) {
        triggerSnapPopup(result.snapToken, result.redirectUrl);
      } else if (result.redirectUrl) {
        window.location.assign(result.redirectUrl);
      }
    });
  }

  // 2. Auto-sync on mount jika pengguna dialihkan kembali dari Midtrans (payment=finish)
  useEffect(() => {
    if (!paymentFinished && currentStatus !== "PENDING") return;

    const timeout = window.setTimeout(() => void performSync(true), 0);
    return () => window.clearTimeout(timeout);
  }, [currentStatus, paymentFinished, performSync]);

  // 3. Auto-sync saat tab aktif kembali (misal setelah membuka m-banking / simulator Midtrans)
  useEffect(() => {
    if (currentStatus !== "PENDING" && currentStatus !== "CREATING") return;

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        performSync(true);
      }
    }

    window.addEventListener("focus", handleVisibilityChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("focus", handleVisibilityChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentStatus, performSync]);

  // 4. Background polling tiap 3.5s selama status PENDING (maksimal 15 kali = ~50 detik)
  useEffect(() => {
    if (currentStatus !== "PENDING") return;

    pollCountRef.current = 0;

    const interval = setInterval(() => {
      pollCountRef.current += 1;
      if (pollCountRef.current > 15) {
        clearInterval(interval);
        return;
      }
      performSync(true);
    }, 3500);

    return () => clearInterval(interval);
  }, [currentStatus, performSync]);

  // 5. Jika status sudah HELD, arahkan otomatis dalam 3 detik ke /dashboard/active-projects
  useEffect(() => {
    if (currentStatus !== "HELD") return;

    const interval = setInterval(() => {
      setRedirectCountdown((previous) => Math.max(previous - 1, 0));
    }, 1000);
    const redirectTimeout = window.setTimeout(() => {
      router.push("/dashboard/active-projects");
    }, 3000);

    return () => {
      clearInterval(interval);
      window.clearTimeout(redirectTimeout);
    };
  }, [currentStatus, router]);

  return (
    <div className="rounded-2xl border border-hairline bg-card p-6 shadow-sm sm:p-8">
      {currentStatus === "HELD" ? (
        <div className="text-center py-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="mt-4 font-display text-2xl font-black text-ink">
            Pembayaran Berhasil Diverifikasi!
          </h2>
          <p className="mt-2 text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
            Dana proyek sebesar <span className="font-bold text-ink">{payment.amountLabel}</span> telah aman ditahan oleh Jembara. Status proyek kini aktif dan kolaborasi resmi dimulai.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard/active-projects"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-display font-bold text-white shadow-md hover:opacity-95 transition-opacity"
            >
              Buka Proyek Aktif <ArrowRight size={16} />
            </Link>
          </div>

          {redirectCountdown > 0 && (
            <p className="mt-4 text-xs text-ink-muted">
              Mengarahkan otomatis dalam {redirectCountdown} detik...
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-success/10 p-3 text-success">
              <ShieldCheck size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-xl font-black text-ink">
                  Pembayaran Aman Midtrans
                </h2>
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand">
                  Popup Instan
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-ink-muted">
                Dana ditahan aman oleh sistem escrow Jembara dan baru diteruskan ke talent setelah hasil kerja Anda setujui.
              </p>
            </div>
          </div>

          <dl className="mt-6 divide-y divide-hairline rounded-xl bg-canvas px-5">
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-sm text-ink-muted">Proyek</dt>
              <dd className="text-right text-sm font-bold text-ink">{payment.projectTitle}</dd>
            </div>
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-sm text-ink-muted">Talent Terpilih</dt>
              <dd className="text-right text-sm font-bold text-ink">{payment.studentName}</dd>
            </div>
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-sm text-ink-muted">Total Pembayaran</dt>
              <dd className="text-right font-display text-lg font-black text-brand">{payment.amountLabel}</dd>
            </div>
            <div className="flex justify-between gap-4 py-4 items-center">
              <dt className="text-sm text-ink-muted">Status Saat Ini</dt>
              <dd className="flex items-center gap-2">
                {currentStatus === "PENDING" && (
                  <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                )}
                <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
                  {currentStatus === payment.status
                    ? payment.statusLabel
                    : paymentStatusLabels[currentStatus]}
                </span>
              </dd>
            </div>
          </dl>

          {currentStatus === "PENDING" && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 p-4 text-xs font-medium text-amber-800 dark:text-amber-300">
              <Clock size={16} className="shrink-0" />
              <span>
                Jika Anda sudah menyelesaikan pembayaran di popup Midtrans, sistem sedang memverifikasi secara otomatis. Anda juga dapat menekan tombol <strong>Cek Status Pembayaran</strong> di bawah.
              </span>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {canPay && (
              <button
                type="button"
                disabled={isPending}
                onClick={startPayment}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-display font-bold text-white hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Menyiapkan Popup...
                  </>
                ) : activePayment.redirectUrl ? (
                  "Buka Popup Pembayaran"
                ) : (
                  "Bayar Sekarang (Popup)"
                )}
              </button>
            )}
            {canSync && (
              <button
                type="button"
                disabled={isPending}
                onClick={handleManualSync}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink px-5 py-3 text-sm font-display font-bold text-ink hover:border-brand hover:text-brand disabled:opacity-60 transition-colors"
              >
                <RefreshCw size={16} className={isPending ? "animate-spin" : ""} />
                {isPending ? "Memeriksa..." : "Cek Status Pembayaran"}
              </button>
            )}
            {activePayment.redirectUrl && (
              <a
                href={activePayment.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-brand transition-colors"
              >
                Buka di tab baru <ExternalLink size={13} />
              </a>
            )}
          </div>

          {syncMessage && (
            <p className="mt-4 rounded-lg bg-brand-soft p-3 text-sm font-semibold text-brand">
              {syncMessage}
            </p>
          )}
          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-danger-soft p-3 text-sm font-semibold text-danger">
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}
