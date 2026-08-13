import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Masuk Antrean"
      title="Selamat datang kembali"
      subtitle="Lanjutkan pencarian kerja yang sudah cocok untukmu."
      footer={
        <>
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-queue-soft hover:text-queue">
            Daftar
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}