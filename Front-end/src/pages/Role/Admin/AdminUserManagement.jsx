import useAdminUsers from "../../../hooks/Admin/useAdminUsers";
import UserTable from "../../../components/admin/UserTable";

export default function AdminUserManagement() {
  const { users, loading, updateRole, deleteUser } = useAdminUsers();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Kelola User</h1>

      <UserTable
        users={users}
        onChangeRole={updateRole}
        onDelete={deleteUser}
      />
    </div>
  );
}
