import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../axiosInstance";
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  ShieldCheck, 
  BookOpen, 
  Calendar, 
  FileText, 
  Award,
  PlusCircle,
  ArrowRight,
  RefreshCw
} from "lucide-react";

const DashboardHomeAdmin = () => {
  const [stats, setStats] = useState(null);
  const [pairings, setPairings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, pairingRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/pairings")
      ]);

      setStats(dashRes.data.cards || {});
      setPairings(pairingRes.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err);
      setError("Gagal memuat data statistik dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="animate-spin text-[#b38867] mr-3" size={24} />
        <span className="text-gray-600 font-medium">Memuat data dashboard admin...</span>
      </div>
    );
  }

  const statCards = [
    { title: "Total Pengguna", value: stats?.total_user ?? 0, icon: Users, color: "bg-blue-50 text-blue-600", border: "border-blue-200" },
    { title: "Mentor Terdaftar", value: stats?.total_mentor ?? 0, icon: UserCheck, color: "bg-amber-50 text-amber-600", border: "border-amber-200" },
    { title: "Mentee Terdaftar", value: stats?.total_mentee ?? 0, icon: GraduationCap, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-200" },
    { title: "Pairing Aktif", value: stats?.total_pairing_aktif ?? 0, icon: Award, color: "bg-purple-50 text-purple-600", border: "border-purple-200" },
    { title: "Bidang Keahlian", value: stats?.total_learning_activity ?? 0, icon: BookOpen, color: "bg-rose-50 text-rose-600", border: "border-rose-200" },
    { title: "Laporan Perkembangan", value: stats?.total_progress_report ?? 0, icon: FileText, color: "bg-teal-50 text-teal-600", border: "border-teal-200" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Salam & Tombol Refresh */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ringkasan Sistem Mentoring</h1>
          <p className="text-gray-500 text-sm mt-1">
            Pantau dan kelola seluruh aktivitas pengguna, pairing mentor-mentee, dan program pembelajaran.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition"
        >
          <RefreshCw size={16} />
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Grid Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`bg-white p-5 rounded-2xl border ${card.border} shadow-sm hover:shadow-md transition flex items-center justify-between`}
            >
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.title}</p>
                <p className="text-3xl font-extrabold text-gray-800 mt-2">{card.value}</p>
              </div>
              <div className={`p-3.5 rounded-2xl ${card.color}`}>
                <Icon size={26} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin-dashboard/pairings"
            className="flex items-center justify-between p-4 rounded-xl border border-[#b38867]/30 bg-[#b38867]/5 hover:bg-[#b38867]/10 transition group"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="text-[#b38867]" size={22} />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Kelola Pairing</p>
                <p className="text-xs text-gray-500">Pasangkan Mentor & Mentee</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-[#b38867] group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/admin-dashboard/learning-activities"
            className="flex items-center justify-between p-4 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition group"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="text-blue-600" size={22} />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Bidang Keahlian</p>
                <p className="text-xs text-gray-500">Master Data Keahlian</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/admin-dashboard/users"
            className="flex items-center justify-between p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition group"
          >
            <div className="flex items-center gap-3">
              <Users className="text-emerald-600" size={22} />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Manajemen Pengguna</p>
                <p className="text-xs text-gray-500">Daftar Mentor & Mentee</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Tabel Pairing Terbaru */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Daftar Pairing Mentoring Terkini</h2>
            <p className="text-xs text-gray-500 mt-0.5">Pasangan mentoring aktif dan selesai di sistem</p>
          </div>
          <Link
            to="/admin-dashboard/pairings"
            className="text-xs font-semibold text-[#b38867] hover:underline flex items-center gap-1"
          >
            Lihat Semua Pairing <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-6">ID</th>
                <th className="py-3.5 px-6">Mentor</th>
                <th className="py-3.5 px-6">Mentee</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Dimulai</th>
                <th className="py-3.5 px-6">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pairings.length > 0 ? (
                pairings.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3.5 px-6 font-mono text-xs text-gray-500">#{item.id}</td>
                    <td className="py-3.5 px-6">
                      <div className="font-medium text-gray-800">{item.mentor?.name || "N/A"}</div>
                      <div className="text-xs text-gray-400">{item.mentor?.email}</div>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-medium text-gray-800">{item.mentee?.name || "N/A"}</div>
                      <div className="text-xs text-gray-400">{item.mentee?.email}</div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.status === "active" ? "Aktif" : "Selesai"}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-gray-500 text-xs">
                      {item.started_at ? new Date(item.started_at).toLocaleDateString("id-ID") : "-"}
                    </td>
                    <td className="py-3.5 px-6 text-gray-500 text-xs truncate max-w-xs">
                      {item.notes || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 text-sm">
                    Belum ada data pairing mentor-mentee. Silakan buat pairing baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomeAdmin;
