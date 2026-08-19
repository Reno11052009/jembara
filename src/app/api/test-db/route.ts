import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.user.count();
    const users = await prisma.user.findMany({ take: 5 });
    return NextResponse.json({ success: true, count, users, hasPrismaUser: !!prisma.user });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error), stack: error instanceof Error ? error.stack : undefined });
  }
}
