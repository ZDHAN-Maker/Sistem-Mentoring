import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/useAuth";
import api from "../../../axiosInstance";

const ListOfMentees = () => {
  const { user } = useAuth();
  const [pairings, setPairings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMentees = async () => {
      if (!user || !user.id) {
        setError("User data tidak tersedia. Silakan login ulang.");
        setLoading(false);
        return;
      }

      try {
        console.log("📡 Fetching mentees for mentor ID:", user.id);
        const res = await api.get(`/api/mentors/${user.id}/mentees`);
        console.log("✅ Mentees data:", res.data);
        setPairings(res.data.data || res.data.mentees || res.data || []);
      } catch (err) {
        console.error("❌ Error fetching mentees:", err);
        setError(err.response?.data?.message || err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, [user]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">List of Mentees</h1>
          <p className="text-sm text-gray-500">
            Daftar mentee yang Anda bimbing.
          </p>
        </div>

        <div className="text-sm text-gray-600">
          Total mentee: <span className="font-semibold">{pairings.length}</span>
        </div>
      </div>

      {/* Card utama */}
      <div className="bg-white rounded-2xl shadow">
        {loading && (
          <div className="p-6 text-sm text-gray-500">
            Memuat daftar mentee...
          </div>
        )}

        {error && !loading && (
          <div className="p-6 text-sm text-red-500">{error}</div>
        )}

        {!loading && !error && pairings.length === 0 && (
          <div className="p-6 text-sm text-gray-500">
            Belum ada mentee yang terdaftar pada Anda.
          </div>
        )}

        {!loading && !error && pairings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f5f5f5]">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">No</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Nama Mentee</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Status Pairing</th>
                </tr>
              </thead>
              <tbody>
                {pairings.map((pair, index) => {
                  const mentee = pair.mentee || pair;
                  return (
                    <tr key={pair.id || index} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-3">{index + 1}</td>
                      <td className="px-6 py-3">{mentee.name || mentee.full_name || "-"}</td>
                      <td className="px-6 py-3">{mentee.email || mentee.username || "-"}</td>
                      <td className="px-6 py-3 capitalize">{pair.status || "active"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListOfMentees;