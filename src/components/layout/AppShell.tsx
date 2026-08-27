import { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import DashboardFooter from "@/components/layout/DashboardFooter";

interface AppShellProps {
  children: ReactNode;
  role: string;
}

export default function AppShell({ children, role }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 px-6 py-8 sm:px-8">{children}</main>
        <DashboardFooter />
      </div>
    </div>
  );
}