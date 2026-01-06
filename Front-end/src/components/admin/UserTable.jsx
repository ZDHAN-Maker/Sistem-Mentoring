export default function UserTable({ users, onChangeRole, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#8B6F47] text-white">
            <th className="border border-gray-300 p-3 text-left">ID</th>
            <th className="border border-gray-300 p-3 text-left">Nama</th>
            <th className="border border-gray-300 p-3 text-left">Email</th>
            <th className="border border-gray-300 p-3 text-left">Role</th>
            <th className="border border-gray-300 p-3 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u, i) => (
            <tr
              key={u.id}
              className={i % 2 === 0 ? "bg-[#F7F3EF]" : "bg-white"}
            >
              <td className="border border-gray-300 p-3">{u.id}</td>
              <td className="border border-gray-300 p-3">{u.name}</td>
              <td className="border border-gray-300 p-3">{u.email}</td>

              {/* Dropdown Role */}
              <td className="border border-gray-300 p-3">
                <select
                  value={u.role}
                  onChange={(e) => onChangeRole(u.id, e.target.value)}
                  className="border border-gray-400 px-3 py-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#C2A68C]"
                >
                  <option value="admin">Admin</option>
                  <option value="mentor">Mentor</option>
                  <option value="mentee">Mentee</option>
                </select>
              </td>

              <td className="border border-gray-300 p-3 text-center">
                <button
                  className="bg-red-600 hover:bg-red-700 transition text-white px-3 py-1.5 rounded shadow-sm"
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
    </div>
  );
}
