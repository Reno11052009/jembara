import ChangePasswordCard from "@/components/security/Changepasswordcard";
import TwoFactorAuthCard from "@/components/security/Twofactorauthcard";
import ActiveSessionsCard from "@/components/security/Activesessionscard";

export default function SecuritySettingsView() {
  return (
    <div className="flex flex-col gap-6">
      <ChangePasswordCard />
      <TwoFactorAuthCard />
      <ActiveSessionsCard />

      <div className="flex justify-end">
        <button
          type="button"
          className="font-body text-sm font-semibold text-white bg-brand hover:bg-brand-dark transition-colors rounded-full px-6 py-3"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}
