import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/lib/session";
import fs from "fs";
import path from "path";

interface ChatMessagePayload {
  role: "user" | "assistant" | "system";
  content: string;
}

function getBaseSystemPrompt(): string {
  try {
    const promptPath = path.join(process.cwd(), "src", "config", "chatbot-prompt.txt");
    return fs.readFileSync(promptPath, "utf-8").trim();
  } catch {
    return `Kamu adalah Jelita, Asisten Virtual Jembara. Jembara adalah platform yang menghubungkan siswa/mahasiswa berbakat dengan UMKM untuk proyek digital. Tugasmu adalah membantu pengguna mengenai fitur platform Jembara. Jawab dalam bahasa Indonesia yang ringkas, ramah, dan membantu. DILARANG menggunakan format tabel markdown. Gunakan poin-poin sederhana atau paragraf singkat.`;
  }
}

export async function POST(request: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const primaryKey = process.env.CHATBOT_AI;
  const backupKey = process.env.CHATBOT_AI_BACKUP;
  const apiKeys = [primaryKey, backupKey].filter(
    (k): k is string => typeof k === "string" && k.trim().length > 0
  );

  if (apiKeys.length === 0) {
    return NextResponse.json(
      { error: "API Key Chatbot belum dikonfigurasi" },
      { status: 500 }
    );
  }

  let body: { messages?: ChatMessagePayload[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body request tidak valid" }, { status: 400 });
  }

  const userMessages = Array.isArray(body.messages) ? body.messages : [];
  if (userMessages.length === 0) {
    return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
  }

  const basePrompt = getBaseSystemPrompt();
  const userContext = `Informasi Pengguna saat ini: ${session.name} (${
    session.role === "UMKM" ? "Pemilik UMKM" : "Pelajar/Talent"
  }).`;

  const systemPrompt: ChatMessagePayload = {
    role: "system",
    content: `${basePrompt}\n\n${userContext}`,
  };

  let response: Response | null = null;
  let lastStatus = 500;

  for (const key of apiKeys) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [systemPrompt, ...userMessages.slice(-10)],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (res.ok) {
        response = res;
        break;
      }
      lastStatus = res.status;
    } catch {
      continue;
    }
  }

  if (!response) {
    return NextResponse.json(
      { error: "Gagal berkomunikasi dengan layanan AI" },
      { status: lastStatus }
    );
  }

  try {
    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const rawContent = data.choices?.[0]?.message?.content || "";
    const replyContent =
      rawContent.replace(/<think>[\s\S]*?<\/think>/gi, "").trim() ||
      "Maaf, saya tidak dapat memproses tanggapan saat ini.";

    return NextResponse.json({ message: replyContent });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan pada layanan AI" },
      { status: 500 }
    );
  }
}
