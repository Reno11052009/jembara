"use server";

import { revalidatePath } from "next/cache";
import {
  changeCurrentUserPassword,
  revokeCurrentUserSession,
} from "@/lib/account-security";
import { beginTwoFactorSetup, confirmTwoFactorSetup, disableTwoFactor } from "@/lib/two-factor";

export async function changePasswordAction(input: unknown) {
  const result = await changeCurrentUserPassword(input);
  if (result.success) revalidatePath("/dashboard/settings/security");
  return result;
}

export async function beginTwoFactorSetupAction(password: unknown) { return beginTwoFactorSetup(password); }
export async function confirmTwoFactorSetupAction(code: unknown) { const result = await confirmTwoFactorSetup(code); if (result.success) revalidatePath("/dashboard/settings"); return result; }
export async function disableTwoFactorAction(password: unknown) { const result = await disableTwoFactor(password); if (result.success) revalidatePath("/dashboard/settings"); return result; }

export async function revokeSessionAction(sessionId: unknown) {
  const result = await revokeCurrentUserSession(sessionId);
  if (result.success && !result.revokedCurrentSession) {
    revalidatePath("/dashboard/settings/security");
  }
  return result;
}
