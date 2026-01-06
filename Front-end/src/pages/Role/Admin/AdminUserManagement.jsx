import useAdminUsers from "../../../hooks/Admin/useAdminUsers";
import UserTable from "../../../components/admin/UserTable";

export default function AdminUserManagement() {
  const { users, loading, updateRole, deleteUser } = useAdminUsers();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-[#F7F3EF] min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <UserTable 
          users={users} 
          onChangeRole={updateRole} 
          onDelete={deleteUser} 
        />
      </div>
    </div>
  );
}
