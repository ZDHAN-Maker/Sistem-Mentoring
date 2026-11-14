import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import api from "../../../axiosInstance";
import { 
  Users, 
  RefreshCw, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  User
} from "lucide-react";

const ListOfMentees = () => {
  const { user } = useAuth();
  const [pairings, setPairings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMentees = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/my-mentees");
      setPairings(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching mentees:", err);
      setError("Gagal memuat daftar mentee bimbingan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentees();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Mentee Bimbingan</h1>
          <p className="text-gray-500 text-sm mt-1">
            Mentee yang saat ini aktif dipasangkan dengan Anda untuk program pendampingan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMentees}
            className="p-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
            title="Refresh Data"
          >
            <RefreshCw size={18} />
          </button>
          <span className="text-xs font-semibold px-3 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl">
            Total Mentee: {pairings.length}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Mentee Cards */}
      {loading ? (
        <div className="p-16 flex items-center justify-center text-gray-500 bg-white rounded-2xl border border-gray-200">
          <RefreshCw className="animate-spin text-[#b38867] mr-3" size={24} />
          <span>Memuat data mentee bimbingan...</span>
        </div>
      ) : pairings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pairings.map((item, index) => {
            const mentee = item.mentee;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-gray-400">Pairing #{item.pairing_id}</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status === "active" ? "Aktif" : "Selesai"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#b38867]/20 text-[#b38867] font-bold text-lg flex items-center justify-center border border-[#b38867]/30 shrink-0">
                      {mentee?.name ? mentee.name.charAt(0).toUpperCase() : "M"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 text-base truncate">{mentee?.name || "Mentee"}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                        <Mail size={12} /> {mentee?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions untuk Mentee ini */}
                <div className="pt-4 mt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
                  <Link
                    to="/mentor-dashboard/tasks"
                    className="px-3 py-2 text-center text-xs font-semibold bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <FileText size={14} className="text-[#b38867]" />
                    <span>Beri Tugas</span>
                  </Link>

                  <Link
                    to="/mentor-dashboard/schedules"
                    className="px-3 py-2 text-center text-xs font-semibold bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Calendar size={14} className="text-blue-600" />
                    <span>Atur Jadwal</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-2xl border border-gray-200 text-gray-400">
          <Users size={40} className="mx-auto mb-3 text-gray-300" />
          <h3 className="text-base font-bold text-gray-700">Belum Ada Mentee Bimbingan</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Administrator belum memasangkan mentee ke akun Anda. Ketika pairing dibuat oleh admin, mentee akan otomatis muncul di sini.
          </p>
        </div>
      )}
    </div>
  );
};

export default ListOfMentees;
