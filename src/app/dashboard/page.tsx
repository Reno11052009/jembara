import { verifySession } from "@/lib/session";
import { logoutAction } from "@/app/actions/auth";
import Button from "@/components/ui/Button";

export default async function DashboardPage() {
  const session = await verifySession();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-ink">Dashboard</h1>
        <p className="mb-6 text-sm text-ink-muted">
          Selamat datang kembali. Anda berhasil login!
        </p>
        
        <div className="mb-6 rounded-lg bg-sand-muted p-4">
          <p className="text-sm font-medium text-ink">User ID:</p>
          <p className="text-xs text-ink-muted break-all">{session?.userId}</p>
          
          <p className="mt-3 text-sm font-medium text-ink">Role:</p>
          <p className="text-xs text-ink-muted">{session?.role}</p>
        </div>

        <form action={logoutAction}>
          <Button type="submit" className="w-full">
            Keluar
          </Button>
        </form>
      </div>
    </div>
  );
}
