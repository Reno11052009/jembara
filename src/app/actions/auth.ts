"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
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
  await createSession("mock-user-id", "STUDENT");
  redirect("/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
