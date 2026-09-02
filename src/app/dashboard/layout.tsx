import { ReactNode, Suspense } from "react";
import AppShell from "@/components/layout/AppShell";
import DashboardShellSkeleton from "@/components/layout/DashboardShellSkeleton";
import { requireAuthenticatedSession } from "@/lib/auth-guard";

async function AuthenticatedDashboardShell({ children }: { children: ReactNode }) {
  const session = await requireAuthenticatedSession();

  return (
    <AppShell role={session.role} userId={session.userId}>
      {children}
    </AppShell>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<DashboardShellSkeleton />}>
      <AuthenticatedDashboardShell>{children}</AuthenticatedDashboardShell>
    </Suspense>
  );
}
