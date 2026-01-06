import { useEffect, useState } from "react";
import api, { getCsrfCookie } from "../../../axiosInstance";
import { useAdminPairing } from "../../../hooks/Admin/useAdminPairing";
import {
  UserGroupIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";

const PairingManagement = () => {
  const { pairings, loading, createPairing, deletePairing } = useAdminPairing();

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
    <div className="p-6 bg-gray-50 min-h-screen backdrop-blur-sm">
      {/* FORM CARD */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ArrowsRightLeftIcon className="w-6 h-6 text-blue-600" />
          Buat Pairing Mentor & Mentee
        </h2>

        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={mentorId}
            onChange={(e) => setMentorId(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/70 backdrop-blur"
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
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/70 backdrop-blur"
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
            className="bg-[#8B5E34] hover:bg-[#6F4828] transition text-white px-5 py-2 rounded-lg font-medium shadow-sm"
          >
            Buat Pairing
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <UserGroupIcon className="w-6 h-6 text-blue-600" />
          Daftar Pairing
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse backdrop-blur">
              <thead>
                <tr className="bg-gray-100/60 backdrop-blur text-gray-700">
                  <th className="border px-4 py-3 text-left">Mentor</th>
                  <th className="border px-4 py-3 text-left">Mentee</th>
                  <th className="border px-4 py-3 text-center">Status</th>
                  <th className="border px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pairings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      Belum ada pairing
                    </td>
                  </tr>
                ) : (
                  pairings.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-gray-50/60 backdrop-blur transition"
                    >
                      <td className="border px-4 py-3">{p.mentor?.name}</td>
                      <td className="border px-4 py-3">{p.mentee?.name}</td>
                      <td className="border px-4 py-3 text-center">
                        <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                          {p.status}
                        </span>
                      </td>
                      <td className="border px-4 py-3 text-center">
                        <button
                          onClick={() => deletePairing(p.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PairingManagement;
