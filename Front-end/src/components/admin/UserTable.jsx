export default function UserTable({ users, onChangeRole, onDelete }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">ID</th>
          <th className="border p-2">Nama</th>
          <th className="border p-2">Email</th>
          <th className="border p-2">Role</th>
          <th className="border p-2">Aksi</th>
        </tr>
      </thead>

      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td className="border p-2">{u.id}</td>
            <td className="border p-2">{u.name}</td>
            <td className="border p-2">{u.email}</td>

            {/* Dropdown Role */}
            <td className="border p-2">
              <select
                value={u.role}
                onChange={(e) => onChangeRole(u.id, e.target.value)}
                className="border px-2 py-1"
              >
                <option value="admin">Admin</option>
                <option value="mentor">Mentor</option>
                <option value="mentee">Mentee</option>
              </select>
            </td>

            <td className="border p-2">
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => {
                  if (confirm("Hapus user ini?")) onDelete(u.id);
                }}
              >
                Hapus
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
