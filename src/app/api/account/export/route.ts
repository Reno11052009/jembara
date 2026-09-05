import { config } from "@/config/unifiedConfig";
import prisma from "@/lib/prisma";
import { consumeRateLimit, createRateLimitKey } from "@/lib/rate-limit";
import { verifySession } from "@/lib/session";

export async function GET() {
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") {
    return Response.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const rateLimit = await consumeRateLimit({
    key: createRateLimitKey("account:export:user", session.userId),
    ...config.security.auth.rateLimit.accountExportByUser,
  });
  if (!rateLimit.allowed) {
    return Response.json(
      { error: "Batas ekspor data tercapai. Coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      no_telepon: true,
      avatar: true,
      bio: true,
      location: true,
      role: true,
      portfolioUrl: true,
      github: true,
      linkedin: true,
      behance: true,
      saldo: true,
      createdAt: true,
      updateAt: true,
      student: {
        include: {
          skills: { include: { skill: true } },
          portfolios: true,
          proposals: true,
          projects: true,
          reviews: true,
          submissions: true,
        },
      },
      umkm: { include: { projects: true, reviews: true } },
      notifications: true,
      notificationPreference: true,
      sentMessages: { include: { attachment: true } },
      receivedMessages: { include: { attachment: true } },
      releasedPayments: {
        select: {
          id: true,
          projectId: true,
          orderId: true,
          amount: true,
          status: true,
          paymentType: true,
          reversedAmount: true,
          paidAt: true,
          releasedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      balanceTransactions: true,
      withdrawalRequests: true,
      payoutMethods: true,
    },
  });

  if (!user) {
    return Response.json({ error: "Akun tidak ditemukan." }, { status: 404 });
  }

  const body = JSON.stringify(
    { exportedAt: new Date().toISOString(), application: "Jembara", user },
    (_key, value) => (typeof value === "bigint" ? value.toString() : value),
    2,
  );
  const date = new Date().toISOString().slice(0, 10);
  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="jembara-data-${date}.json"`,
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
