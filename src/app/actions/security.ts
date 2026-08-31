"use server";

import { revalidatePath } from "next/cache";
import {
  changeCurrentUserPassword,
  revokeCurrentUserSession,
} from "@/lib/account-security";

export async function changePasswordAction(input: unknown) {
  const result = await changeCurrentUserPassword(input);
  if (result.success) revalidatePath("/dashboard/settings/security");
  return result;
}

export async function revokeSessionAction(sessionId: unknown) {
  const result = await revokeCurrentUserSession(sessionId);
  if (result.success && !result.revokedCurrentSession) {
    revalidatePath("/dashboard/settings/security");
  }
  return result;
}
