"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSession, deleteSession, verifySession } from "@/lib/session";
import { LoginFormData, RegisterFormData } from "@/types/auth";
import { validateEmail, validatePassword, validateFullName } from "@/lib/validation";

<<<<<<< HEAD
console.log("Prisma instance loaded in auth.ts:", !!prisma.user);

export async function loginAction(formData: LoginFormData): Promise<{ error?: string, success?: boolean }> {
  const { email, password } = formData;
  if (!email || !password) return { error: "Email dan password wajib diisi" };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Email tidak ditemukan" };

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return { error: "Password salah" };

    await createSession(user.id, user.role, user.name || "");
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Terjadi kesalahan pada server" };
  }
}

export async function registerAction(formData: RegisterFormData): Promise<{ error?: string, success?: boolean }> {
  const { fullName, email, password, address } = formData;

  if (validateEmail(email) || validatePassword(password) || validateFullName(fullName)) {
    return { error: "Data tidak valid" };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "Email sudah terdaftar" };

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: fullName,
        email,
        password: hashedPassword,
        location: address,
        role: "STUDENT"
      }
    });

    await createSession(user.id, user.role, user.name || "");
    return { success: true };
  } catch (error) {
    console.error("Register error:", error);
    return { error: "Gagal mendaftarkan akun" };
  }
=======
export async function loginAction(formData: LoginFormData): Promise<{ error?: string } | never> {
  // Database connection temporarily disabled
  const { email } = formData;
  await createSession("mock-user-id", "STUDENT");
  redirect("/dashboard");
}

export async function registerAction(formData: RegisterFormData): Promise<{ error?: string } | never> {
  // Database connection temporarily disabled
  await createSession("mock-user-id", "STUDENT");
  redirect("/pilih-role");
>>>>>>> 6b377d4e35d41ab9957334ec63bf9f6dcb17e899
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}

export async function selectRoleAction(formData: FormData) {
  const role = formData.get("role") as string;
  const session = await verifySession();

  if (session && session.userId && session.userId !== "mock-user-id") {
    try {
      await prisma.user.update({
        where: { id: session.userId },
        data: { role }
      });
      
      if (role === "STUDENT") {
        const student = await prisma.student.findUnique({ where: { userId: session.userId } });
        if (!student) {
          await prisma.student.create({ data: { userId: session.userId } });
        }
      } else if (role === "UMKM") {
        const umkm = await prisma.umkm.findUnique({ where: { userId: session.userId } });
        if (!umkm) {
          await prisma.umkm.create({ data: { userId: session.userId, nama_usaha: session.name || "Usaha Baru" } });
        }
      }

      await createSession(session.userId, role, session.name || "");
    } catch (error) {
      console.error("Select role error:", error);
    }
  } else if (!session) {
    await createSession("mock-user-id", role);
  } else {
    await createSession(session.userId, role, session.name || "");
  }

  redirect("/dashboard");
}
