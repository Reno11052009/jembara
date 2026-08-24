import { AdminQuickAction } from "@/types/admin-dashboard";

export default function QuickActionsCard({ actions }: { actions: AdminQuickAction[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-hairline bg-card p-6">
      <h2 className="font-display text-lg font-black text-ink">Aksi Cepat Admin</h2>
      <div className="flex flex-col gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <div
              key={action.id}
              className="flex items-center gap-3 rounded-xl bg-brand-soft/60 px-4 py-3"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                <Icon size={16} />
              </span>
              <span className="text-sm font-semibold text-ink">{action.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
