import fs from "node:fs";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { config } from "@/config/unifiedConfig";
import { getSafeChatbotRecommendation } from "@/lib/chatbot-recommendations";
import { consumeRateLimits, createRateLimitKey } from "@/lib/rate-limit";
import { verifySession } from "@/lib/session";

const MAX_BODY_BYTES = 24 * 1024;
const MAX_PROVIDER_REPLY_LENGTH = 6_000;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const RETRYABLE_PROVIDER_STATUSES = new Set([401, 403, 408, 429]);

const chatMessageSchema = z
  .object({
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1).max(2_000),
  })
  .strict();

const requestSchema = z
  .object({
    messages: z.array(chatMessageSchema).min(1).max(9),
  })
  .strict()
  .superRefine(({ messages }, context) => {
    if (messages[0]?.role !== "user" || messages.at(-1)?.role !== "user") {
      context.addIssue({
        code: "custom",
        path: ["messages"],
        message: "Percakapan harus dimulai dan diakhiri oleh pengguna",
      });
      return;
    }

    for (let index = 1; index < messages.length; index += 1) {
      if (messages[index]?.role === messages[index - 1]?.role) {
        context.addIssue({
          code: "custom",
          path: ["messages", index, "role"],
          message: "Urutan percakapan tidak valid",
        });
      }
    }
  });

const providerResponseSchema = z.object({
  choices: z
    .array(
      z.object({
        message: z.object({ content: z.string().max(20_000) }),
      }),
    )
    .min(1),
});

let cachedBaseSystemPrompt: string | undefined;

function json(body: object, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

function getBaseSystemPrompt(): string {
  if (cachedBaseSystemPrompt) return cachedBaseSystemPrompt;

  try {
    const promptPath = path.join(
      process.cwd(),
      "src",
      "config",
      "chatbot-prompt.txt",
    );
    cachedBaseSystemPrompt = fs.readFileSync(promptPath, "utf-8").trim();
  } catch {
    cachedBaseSystemPrompt =
      "Kamu adalah Jelita, Asisten Virtual Jembara. Jawab pertanyaan tentang platform Jembara dalam bahasa Indonesia secara ringkas, ramah, dan membantu. Jangan gunakan tabel markdown.";
  }

  return cachedBaseSystemPrompt;
}

async function readLimitedJson(request: NextRequest): Promise<unknown> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    throw new Error("UNSUPPORTED_MEDIA_TYPE");
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
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
    if (byteLength > MAX_BODY_BYTES) {
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

async function enforceRateLimit(userId: string) {
  const limits = config.security.auth.rateLimit;
  const results = await consumeRateLimits([
    {
      key: createRateLimitKey("chatbot-minute", userId),
      ...limits.chatbotByUserMinute,
    },
    {
      key: createRateLimitKey("chatbot-day", userId),
      ...limits.chatbotByUserDay,
    },
  ]);

  return results.find((result) => !result.allowed) ?? results[0];
}

export async function POST(request: NextRequest) {
  const session = await verifySession();
  if (!session) return json({ error: "Unauthorized" }, 401);

  try {
    const rateLimit = await enforceRateLimit(session.userId);
    if (!rateLimit.allowed) {
      return json(
        { error: "Terlalu banyak permintaan chatbot. Silakan coba lagi nanti." },
        429,
        { "Retry-After": String(rateLimit.retryAfterSeconds) },
      );
    }

    let rawBody: unknown;
    try {
      rawBody = await readLimitedJson(request);
    } catch (error) {
      if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") {
        return json({ error: "Ukuran request terlalu besar" }, 413);
      }
      if (error instanceof Error && error.message === "UNSUPPORTED_MEDIA_TYPE") {
        return json({ error: "Content-Type harus application/json" }, 415);
      }
      return json({ error: "Body request tidak valid" }, 400);
    }

    const parsedBody = requestSchema.safeParse(rawBody);
    if (!parsedBody.success) {
      return json({ error: "Format percakapan tidak valid" }, 400);
    }

    const latestUserMessage = parsedBody.data.messages.at(-1)!.content;
    const recommendation = await getSafeChatbotRecommendation({
      userId: session.userId,
      role: session.role,
      latestUserMessage,
    });

    // Hasil rekomendasi dibentuk server dari DTO allowlist. Data database tidak
    // pernah dikirim ke model dan model tidak pernah memperoleh tool SQL.
    if (recommendation.handled) {
      return json({
        message: recommendation.message,
        ...(recommendation.links?.length
          ? { links: recommendation.links }
          : {}),
      });
    }

    const apiKeys = Array.from(
      new Set(
        [process.env.CHATBOT_AI, process.env.CHATBOT_AI_BACKUP]
          .filter((key): key is string => typeof key === "string")
          .map((key) => key.trim())
          .filter(Boolean),
      ),
    );
    if (apiKeys.length === 0) {
      return json({ error: "Layanan AI belum dikonfigurasi" }, 503);
    }

    const roleLabel =
      session.role === "UMKM"
        ? "Pemilik UMKM"
        : session.role === "STUDENT"
          ? "Pelajar/Talent"
          : "Administrator";
    const systemPrompt = {
      role: "system" as const,
      content: [
        getBaseSystemPrompt(),
        `Role pengguna terautentikasi: ${roleLabel}. Jangan meminta atau mengungkap data pribadi maupun data rahasia.`,
      ].join("\n\n"),
    };

    let providerResponse: Response | null = null;
    for (const key of apiKeys) {
      try {
        const response = await fetch(GROQ_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            // Riwayat assistant berasal dari klien sehingga tidak dipercaya dan
            // mungkin memuat rekomendasi DB dari respons sebelumnya. Hanya pesan
            // user terbaru yang boleh diteruskan ke penyedia AI.
            messages: [
              systemPrompt,
              { role: "user", content: latestUserMessage },
            ],
            temperature: 0.7,
            max_tokens: 768,
          }),
          cache: "no-store",
          signal: AbortSignal.timeout(15_000),
        });

        if (response.ok) {
          providerResponse = response;
          break;
        }

        if (
          !RETRYABLE_PROVIDER_STATUSES.has(response.status) &&
          response.status < 500
        ) {
          break;
        }
      } catch {
        // Timeout atau gangguan jaringan pada key utama boleh mencoba key cadangan.
      }
    }

    if (!providerResponse) {
      return json({ error: "Layanan AI sedang tidak tersedia" }, 503);
    }

    let providerData: unknown;
    try {
      providerData = await providerResponse.json();
    } catch {
      return json({ error: "Respons layanan AI tidak valid" }, 502);
    }

    const parsedProviderData = providerResponseSchema.safeParse(providerData);
    if (!parsedProviderData.success) {
      return json({ error: "Respons layanan AI tidak valid" }, 502);
    }

    const replyContent = parsedProviderData.data.choices[0].message.content
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .trim()
      .slice(0, MAX_PROVIDER_REPLY_LENGTH);

    return json({
      message:
        replyContent || "Maaf, saya tidak dapat memproses tanggapan saat ini.",
    });
  } catch {
    return json({ error: "Terjadi kesalahan saat memproses chatbot" }, 500);
  }
}
