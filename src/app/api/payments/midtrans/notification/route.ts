import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createUserNotification } from "@/lib/notifications";
import {
  midtransStatusSchema,
  verifyMidtransSignature,
} from "@/lib/midtrans";
import { applyMidtransStatus, PaymentFlowError } from "@/lib/payments";

const MAX_WEBHOOK_BODY_BYTES = 64 * 1024;

function json(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function readLimitedJson(request: Request): Promise<unknown> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    throw new Error("UNSUPPORTED_MEDIA_TYPE");
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_WEBHOOK_BODY_BYTES) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }
  if (!request.body) throw new Error("INVALID_JSON");

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let byteLength = 0;
  let raw = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    byteLength += value.byteLength;
    if (byteLength > MAX_WEBHOOK_BODY_BYTES) {
      await reader.cancel();
      throw new Error("PAYLOAD_TOO_LARGE");
    }
    raw += decoder.decode(value, { stream: true });
  }
  raw += decoder.decode();

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error("INVALID_JSON");
  }
}

export async function POST(request: Request) {
  try {
    const payload = midtransStatusSchema.parse(await readLimitedJson(request));
    if (!verifyMidtransSignature(payload)) {
      return json({ error: "Invalid signature" }, 401);
    }

    const outcome = await applyMidtransStatus(payload);
    revalidatePath(`/dashboard/payments/${outcome.project.id}`);
    revalidatePath("/dashboard/active-projects");
    revalidatePath("/dashboard/lowongan-saya");
    revalidatePath("/dashboard/pelamar");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/settings/pembayaran");
    if (outcome.newlyHeld && outcome.project.student) {
      await Promise.allSettled([
        createUserNotification({
          userId: outcome.project.student.userId,
          type: "PAYMENT",
          title: "Dana proyek telah diamankan",
          message: `Pembayaran ${outcome.project.title} sudah diterima. Anda dapat mulai mengerjakan proyek.`,
          href: "/dashboard/active-projects",
          preferenceKey: "pembayaran",
        }),
        createUserNotification({
          userId: outcome.project.umkm.userId,
          type: "PAYMENT",
          title: "Pembayaran berhasil",
          message: `Dana ${outcome.project.title} ditahan sampai hasil kerja disetujui.`,
          href: "/dashboard/active-projects",
          preferenceKey: "pembayaran",
        }),
      ]);
    }
    return json({ received: true });
  } catch (error) {
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") {
      return json({ error: "Payload too large" }, 413);
    }
    if (error instanceof Error && error.message === "UNSUPPORTED_MEDIA_TYPE") {
      return json({ error: "Content-Type must be application/json" }, 415);
    }
    if (error instanceof Error && error.message === "INVALID_JSON") {
      return json({ error: "Invalid payload" }, 400);
    }
    if (error instanceof z.ZodError) {
      return json({ error: "Invalid payload" }, 400);
    }
    if (error instanceof PaymentFlowError) {
      return json({ error: "Notification rejected" }, 422);
    }
    console.error("Webhook Midtrans gagal diproses:", error);
    return json({ error: "Webhook processing failed" }, 500);
  }
}
