import ChangePasswordCard from "@/components/security/Changepasswordcard";
import TwoFactorAuthCard from "@/components/security/Twofactorauthcard";
import ActiveSessionsCard from "@/components/security/Activesessionscard";
import type { ActiveSession } from "@/types/settings";

export default function SecuritySettingsView({ sessions, twoFactorEnabled = false }: { sessions: ActiveSession[]; twoFactorEnabled?: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      <ChangePasswordCard />
      <TwoFactorAuthCard enabled={twoFactorEnabled} />
      <ActiveSessionsCard
        key={sessions.map(({ id }) => id).join(":")}
        initialSessions={sessions}
      />
    </div>
  );
}
