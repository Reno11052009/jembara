"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSession, deleteSession, verifySession } from "@/lib/session";
import { LoginFormData, RegisterFormData } from "@/types/auth";
import { validateEmail, validatePassword, validateFullName } from "@/lib/validation";

export async function loginAction(formData: LoginFormData): Promise<{ error?: string } | never> {
  // Database connection temporarily disabled
  const { email } = formData;
  await createSession("mock-user-id", "STUDENT");
  redirect("/dashboard");
}

export async function registerAction(formData: RegisterFormData): Promise<{ error?: string } | never> {
  // Database connection temporarily disabled
  await createSession("mock-user-id", "STUDENT", formData.fullName || "Pengguna Baru");
  redirect("/pilih-role");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}

export async function selectRoleAction(formData: FormData) {
  const role = formData.get("role") as string;
  const session = await verifySession();

  if (!session) {
    // Jika belum ada session (misal baru register via supabase client), buat session baru
    await createSession("mock-user-id", role);
  } else {
    // Update session dengan role baru
    await createSession(session.userId, role, session.name);
  }

  redirect("/dashboard");
}
