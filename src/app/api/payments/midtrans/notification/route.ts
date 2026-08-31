import { NextResponse } from "next/server";
import { z } from "zod";
import { createUserNotification } from "@/lib/notifications";
import {
  midtransStatusSchema,
  verifyMidtransSignature,
} from "@/lib/midtrans";
import { applyMidtransStatus, PaymentFlowError } from "@/lib/payments";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = midtransStatusSchema.parse(await request.json());
    if (!verifyMidtransSignature(payload)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const outcome = await applyMidtransStatus(payload);
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
    return NextResponse.json({ received: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    if (error instanceof PaymentFlowError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    console.error("Webhook Midtrans gagal diproses:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
