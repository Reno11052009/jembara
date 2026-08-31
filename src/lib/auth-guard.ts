import "server-only";
import { redirect } from "next/navigation";
import { verifySession } from "./session";

export async function requireAuthenticatedSession() {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAdminSession() {
  const session = await requireAuthenticatedSession();

  if (session.role !== "ADMIN") {
    redirect("/forbidden");
  }

  return session;
}
