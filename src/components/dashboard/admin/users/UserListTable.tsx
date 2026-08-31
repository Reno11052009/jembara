import UserListRow from "@/components/dashboard/admin/users/UserListRow";
import type { AdminUserRow } from "@/types/admin-users";

export default function UserListTable({ users }: { users: AdminUserRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-hairline bg-card">
      <div className="min-w-[900px] divide-y divide-hairline">
        {users.length > 0 ? users.map((user) => <UserListRow key={user.id} user={user} />) : <p className="px-6 py-12 text-center text-sm text-ink-muted">Tidak ada talent yang sesuai dengan filter.</p>}
      </div>
    </div>
  );
}
