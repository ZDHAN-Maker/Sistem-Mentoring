import { useEffect, useState } from "react";
import api, { getCsrfCookie } from "../../../axiosInstance";
import { useAdminPairing } from "../../../hooks/Admin/useAdminPairing";

const PairingManagement = () => {
  const { pairings, loading, createPairing, deletePairing } =
    useAdminPairing();

  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [mentorId, setMentorId] = useState("");
  const [menteeId, setMenteeId] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getCsrfCookie();
        const res = await api.get("/api/admin/users");

        setMentors(res.data.users.filter((u) => u.role === "mentor"));
        setMentees(res.data.users.filter((u) => u.role === "mentee"));
      } catch (err) {
        console.error("Fetch users error:", err.response?.data || err);
      }
    };

    fetchUsers();
  }, []);

  const handleCreate = async () => {
    if (!mentorId || !menteeId) {
      alert("Mentor dan mentee wajib dipilih");
      return;
    }

    try {
      await createPairing(mentorId, menteeId);
      setMentorId("");
      setMenteeId("");
    } catch {
      alert("Gagal membuat pairing");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Pairing Management</h1>

      {/* FORM */}
      <div className="flex gap-4 mb-6">
        <select
          value={mentorId}
          onChange={(e) => setMentorId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Pilih Mentor</option>
          {mentors.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <select
          value={menteeId}
          onChange={(e) => setMenteeId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Pilih Mentee</option>
          {mentees.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Buat Pairing
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Mentor</th>
              <th className="border p-2">Mentee</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pairings.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  Belum ada pairing
                </td>
              </tr>
            ) : (
              pairings.map((p) => (
                <tr key={p.id}>
                  <td className="border p-2">{p.mentor?.name}</td>
                  <td className="border p-2">{p.mentee?.name}</td>
                  <td className="border p-2">{p.status}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => deletePairing(p.id)}
                      className="text-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PairingManagement;
