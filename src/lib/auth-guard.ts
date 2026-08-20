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
