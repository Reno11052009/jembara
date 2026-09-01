import { ReactNode } from "react";
import AppShell from "@/components/layout/AppShell";
import { requireAuthenticatedSession } from "@/lib/auth-guard";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await requireAuthenticatedSession();

  return (
    <AppShell role={session.role} userId={session.userId}>
      {children}
    </AppShell>
  );
}
