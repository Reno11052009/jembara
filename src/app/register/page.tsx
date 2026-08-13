import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Buat Profil"
      title="Mulai matchmaking-mu"
      subtitle="Lengkapi data diri untuk mulai dicocokkan dengan role yang tepat."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-queue-soft hover:text-queue">
            Masuk
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}