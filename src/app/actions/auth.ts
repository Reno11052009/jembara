"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import { LoginFormData, RegisterFormData } from "@/types/auth";
import { validateEmail, validatePassword, validateFullName } from "@/lib/validation";

export async function loginAction(formData: LoginFormData) {
  const { email, password } = formData;

  // Validate inputs
  if (validateEmail(email) || validatePassword(password)) {
    return { error: "Email atau password tidak valid." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Email atau password salah." };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: "Email atau password salah." };
    }

    await createSession(user.id, user.role);
    
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Terjadi kesalahan saat masuk. Silakan coba lagi." };
  }

  redirect("/dashboard");
}

export async function registerAction(formData: RegisterFormData) {
  const { fullName, email, password } = formData;

  // Validate inputs
  if (validateFullName(fullName) || validateEmail(email) || validatePassword(password)) {
    return { error: "Mohon periksa kembali data yang dimasukkan." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        // Default role is STUDENT as per schema
      },
    });

    // We can also create an empty student profile here if needed,
    // but we'll wait for user input or just let them complete profile later.

    await createSession(user.id, user.role);
    
  } catch (error) {
    console.error("Register error:", error);
    return { error: "Terjadi kesalahan saat mendaftar. Silakan coba lagi." };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
