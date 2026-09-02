import { ReactNode, Suspense } from "react";
import AppShell from "@/components/layout/AppShell";
import DashboardShellSkeleton from "@/components/layout/DashboardShellSkeleton";
import { requireAuthenticatedSession } from "@/lib/auth-guard";

// Every route under /dashboard requires a signed-in session (reads the auth
// cookie), so it can never be prerendered as a static/instant shell anyway —
// opt this segment out of Next 16's instant-navigation prerender check.
export const instant = false;

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
