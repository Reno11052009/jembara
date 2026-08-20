import { ReactNode } from "react";
import AppShell from "@/components/layout/AppShell";
import { requireAuthenticatedSession } from "@/lib/auth-guard";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireAuthenticatedSession();

  return <AppShell>{children}</AppShell>;
}
