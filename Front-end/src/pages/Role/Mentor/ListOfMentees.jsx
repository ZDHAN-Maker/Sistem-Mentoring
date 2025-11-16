import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { useAuth } from "../../../context/useAuth";

const ListOfMentees = () => {
  const { role } = useAuth(); // Ambil langsung dari context

  const [pairings, setPairings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        // SESUAIKAN endpoint dengan route API kamu
        const res = await fetch("/api/mentor/mentees");

        if (!res.ok) {
          throw new Error("Gagal mengambil data mentee");
        }

        const data = await res.json();
        setPairings(data || []);
      } catch (err) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Konten Dashboard */}
        <main className="flex-1 px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">List of Mentees</h1>
              <p className="text-sm text-gray-500">
                Daftar mentee yang Anda bimbing.
              </p>
            </div>

            <div className="text-sm text-gray-600">
              Total mentee:{" "}
              <span className="font-semibold">{pairings.length}</span>
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
                      <th className="px-6 py-3 text-left font-semibold text-gray-600">
                        No
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-600">
                        Nama Mentee
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-600">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-600">
                        Status Pairing
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pairings.map((pair, index) => {
                      const mentee = pair.mentee || {};
                      return (
                        <tr
                          key={pair.id || index}
                          className="border-t hover:bg-gray-50"
                        >
                          <td className="px-6 py-3">{index + 1}</td>
                          <td className="px-6 py-3">
                            {mentee.name || mentee.full_name || "-"}
                          </td>
                          <td className="px-6 py-3">
                            {mentee.email || mentee.username || "-"}
                          </td>
                          <td className="px-6 py-3 capitalize">
                            {pair.status || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ListOfMentees;
