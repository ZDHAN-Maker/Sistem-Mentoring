import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../axiosInstance";
import { 
  Users, 
  Calendar, 
  BookOpen, 
  FileText, 
  CheckSquare, 
  Clock, 
  AlertCircle,
  PlusCircle,
  ArrowRight,
  RefreshCw,
  Video
} from "lucide-react";

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, schRes, menteeRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/schedules"),
        api.get("/my-mentees")
      ]);

      setStats(dashRes.data?.cards || {});
      setSchedules(schRes.data?.data || schRes.data || []);
      setMentees(menteeRes.data?.data || menteeRes.data || []);
    } catch (err) {
      console.error("Gagal mengambil data dashboard mentor:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-500">
        <RefreshCw className="animate-spin text-[#b38867] mr-3" size={24} />
        <span className="font-medium">Memuat dashboard mentor...</span>
      </div>
    );
  }

  const statCards = [
    { title: "Total Mentee", value: stats?.total_mentee ?? 0, icon: Users, color: "bg-blue-50 text-blue-600", border: "border-blue-200" },
    { title: "Pairing Aktif", value: stats?.pairing_aktif ?? 0, icon: CheckSquare, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-200" },
    { title: "Menunggu Review", value: stats?.submission_menunggu_review ?? 0, icon: AlertCircle, color: "bg-rose-50 text-rose-600", border: "border-rose-200" },
    { title: "Total Materi", value: stats?.total_materi ?? 0, icon: BookOpen, color: "bg-amber-50 text-amber-600", border: "border-amber-200" },
    { title: "Tugas Diberikan", value: stats?.total_tugas ?? 0, icon: FileText, color: "bg-purple-50 text-purple-600", border: "border-purple-200" },
    { title: "Laporan Dibuat", value: stats?.progress_report_dibuat ?? 0, icon: Clock, color: "bg-teal-50 text-teal-600", border: "border-teal-200" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Salam & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel Mentor</h1>
          <p className="text-gray-500 text-sm mt-1">
            Pantau perkembangan mentee, jadwal sesi bimbingan, materi pembelajaran, dan review tugas.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 transition"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

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
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.title}</p>
                <p className="text-3xl font-extrabold text-gray-800 mt-2">{card.value}</p>
              </div>
              <div className={`p-3.5 rounded-2xl ${card.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Aksi Cepat Mentor */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat Mentor</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/mentor-dashboard/tasks"
            className="flex items-center justify-between p-4 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 transition group"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="text-purple-600" size={22} />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Beri Tugas</p>
                <p className="text-xs text-gray-500">Tugaskan Latihan Baru</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/mentor-dashboard/schedules"
            className="flex items-center justify-between p-4 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition group"
          >
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" size={22} />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Jadwal Sesi</p>
                <p className="text-xs text-gray-500">Atur Pertemuan Mentoring</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/mentor-dashboard/materials"
            className="flex items-center justify-between p-4 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition group"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="text-amber-600" size={22} />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Upload Materi</p>
                <p className="text-xs text-gray-500">Bagikan Modul / Video</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-amber-600 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/mentor-dashboard/reports"
            className="flex items-center justify-between p-4 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 transition group"
          >
            <div className="flex items-center gap-3">
              <CheckSquare className="text-rose-600" size={22} />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Review Tugas</p>
                <p className="text-xs text-gray-500">Nilai & Beri Evaluasi</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-rose-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Grid 2 Kolom: Jadwal Terdekat & Mentee Bimbingan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Upcoming Schedule */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <Calendar size={18} />
                </span>
                <h2 className="text-lg font-bold text-gray-800">Jadwal Bimbingan Terdekat</h2>
              </div>
              <Link to="/mentor-dashboard/schedules" className="text-xs text-[#b38867] font-semibold hover:underline">
                Kelola Semua
              </Link>
            </div>

            <div className="space-y-3">
              {schedules.length > 0 ? (
                schedules.slice(0, 4).map((sch) => (
                  <div key={sch.id} className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm">{sch.title}</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 font-semibold rounded-md text-[10px]">
                        {sch.status || "Scheduled"}
                      </span>
                    </div>
                    <p className="text-gray-500">
                      {sch.schedule_date ? new Date(sch.schedule_date).toLocaleDateString("id-ID", {
                        weekday: "short", day: "numeric", month: "short", year: "numeric"
                      }) : ""} {sch.start_time ? `| ${sch.start_time}` : ""}
                    </p>
                    {sch.meeting_link && (
                      <a href={sch.meeting_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 font-medium pt-1">
                        <Video size={12} /> Buka Link Meeting
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <Calendar size={28} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-xs">Belum ada jadwal bimbingan yang dijadwalkan.</p>
                </div>
              )}
            </div>
          </div>

          <Link
            to="/mentor-dashboard/schedules"
            className="mt-4 w-full py-2.5 text-center text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition"
          >
            + Tambah Jadwal Baru
          </Link>
        </div>

        {/* Card Mentee Bimbingan */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-100 text-blue-800 rounded-xl">
                  <Users size={18} />
                </span>
                <h2 className="text-lg font-bold text-gray-800">
                  Mentee Bimbingan ({mentees.length})
                </h2>
              </div>
              <Link to="/mentor-dashboard/mentees" className="text-xs text-[#b38867] font-semibold hover:underline">
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-3">
              {mentees.length > 0 ? (
                mentees.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#b38867]/20 text-[#b38867] font-bold flex items-center justify-center text-sm">
                        {item.mentee?.name ? item.mentee.name.charAt(0) : "M"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-xs">{item.mentee?.name || "Mentee"}</p>
                        <p className="text-[11px] text-gray-400">{item.mentee?.email}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-emerald-100 text-emerald-700">
                      {item.status === "active" ? "Aktif" : "Selesai"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <Users size={28} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-xs">Belum ada mentee yang dipasangkan ke Anda oleh Admin.</p>
                </div>
              )}
            </div>
          </div>

          <Link
            to="/mentor-dashboard/tasks"
            className="mt-4 w-full py-2.5 text-center text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition"
          >
            Beri Tugas ke Mentee
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
