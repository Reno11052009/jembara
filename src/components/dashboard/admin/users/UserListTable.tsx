import UserListRow from "@/components/dashboard/admin/users/UserListRow";
import { AdminUserRow } from "@/types/admin-users";

export default function UserListTable({ users }: { users: AdminUserRow[] }) {
  return (
    <div className="rounded-xl border border-hairline bg-card">
      <div className="divide-y divide-hairline">
        {users.map((user) => (
          <UserListRow key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
