import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../../axiosInstance";
import PlanBadgeIcon from "../../../components/PlanBadgeIcon";
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
  Video,
  MessageCircle,
  TrendingUp,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Award
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

  // Filter jadwal hari ini
  const todaySchedules = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return schedules.filter((sch) => {
      if (!sch.start_time) return false;
      const schDateStr = new Date(sch.start_time).toISOString().slice(0, 10);
      return schDateStr === todayStr && sch.status !== "cancelled" && sch.status !== "canceled";
    });
  }, [schedules]);

  // Format nomor WA
  const formatWaNumber = (phone) => {
    if (!phone) return "";
    let cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("0")) return "62" + cleaned.slice(1);
    return cleaned;
  };

  const sendWaReminder = (sch) => {
    const mentee = sch.pairing?.mentee;
    if (!mentee?.phone) {
      alert("Nomor telepon mentee belum terisi di profil.");
      return;
    }
    const phone = formatWaNumber(mentee.phone);
    const timeStr = sch.start_time
      ? new Date(sch.start_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      : "";
    const msg = encodeURIComponent(
      `Halo ${mentee.name || "Mentee"}, mengingatkan sesi mentoring kita hari ini pukul ${timeStr} WIB (${sch.title}). Link meeting: ${sch.meeting_link || "-"}. Sampai jumpa!`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16 text-gray-500">
        <RefreshCw className="animate-spin text-[#b38867] mr-3" size={24} />
        <span className="font-medium">Memuat dashboard mentor...</span>
      </div>
    );
  }

  const statCards = [
    { title: "Total Mentee", value: stats?.total_mentee ?? mentees.length, icon: Users, color: "bg-blue-50 text-blue-600", border: "border-blue-200", link: "/mentor-dashboard/mentees" },
    { title: "Pairing Aktif", value: stats?.pairing_aktif ?? mentees.filter(m => m.status === 'active').length, icon: CheckSquare, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-200", link: "/mentor-dashboard/mentees" },
    { title: "Perlu Dinilai", value: stats?.submission_menunggu_review ?? 0, icon: AlertCircle, color: "bg-rose-50 text-rose-600", border: "border-rose-200", link: "/mentor-dashboard/reports" },
    { title: "Total Materi", value: stats?.total_materi ?? 0, icon: BookOpen, color: "bg-amber-50 text-amber-600", border: "border-amber-200", link: "/mentor-dashboard/materials" },
    { title: "Tugas Diberikan", value: stats?.total_tugas ?? 0, icon: FileText, color: "bg-purple-50 text-purple-600", border: "border-purple-200", link: "/mentor-dashboard/tasks" },
    { title: "Laporan Dibuat", value: stats?.progress_report_dibuat ?? 0, icon: Clock, color: "bg-teal-50 text-teal-600", border: "border-teal-200", link: "/mentor-dashboard/reports" },
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
          className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 transition shadow-sm"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Widget Agenda Bimbingan Hari Ini (Jika ada) */}
      {todaySchedules.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-white p-5 rounded-2xl border border-amber-300/60 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-[#b38867] text-white rounded-xl shadow-sm shrink-0">
                <Calendar size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-amber-200 text-amber-900 rounded-md">
                    Agenda Hari Ini
                  </span>
                  <span className="text-xs text-gray-500">
                    {todaySchedules.length} sesi pertemuan dijadwalkan
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mt-1">
                  {todaySchedules[0].title}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-2">
                  <span>Mentee: <strong>{todaySchedules[0].pairing?.mentee?.name || "Mentee"}</strong></span>
                  <span>•</span>
                  <span>
                    {todaySchedules[0].start_time
                      ? new Date(todaySchedules[0].start_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                      : ""}{" "}
                    WIB
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {todaySchedules[0].meeting_link && (
                <a
                  href={todaySchedules[0].meeting_link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Video size={14} />
                  <span>Buka Meeting</span>
                </a>
              )}

              {todaySchedules[0].pairing?.mentee?.phone && (
                <button
                  onClick={() => sendWaReminder(todaySchedules[0])}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <MessageCircle size={14} />
                  <span>Ingatkan WA</span>
                </button>
              )}

              <Link
                to="/mentor-dashboard/schedules"
                className="px-3.5 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold transition"
              >
                Lihat Jadwal
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Grid Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              to={card.link}
              key={idx}
              className={`bg-white p-5 rounded-2xl border ${card.border} shadow-sm hover:shadow-md transition flex items-center justify-between group`}
            >
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.title}</p>
                <p className="text-3xl font-extrabold text-gray-800 mt-2">{card.value}</p>
              </div>
              <div className={`p-3.5 rounded-2xl ${card.color} group-hover:scale-105 transition-transform`}>
                <Icon size={24} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Aksi Cepat Mentor */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-4">Aksi Cepat Mentor</h2>
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
                <h2 className="text-base font-bold text-gray-800">Jadwal Bimbingan Terdekat</h2>
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
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          sch.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {sch.status === "completed" ? "Selesai" : "Terjadwal"}
                      </span>
                    </div>
                    <p className="text-gray-500">
                      {sch.start_time ? new Date(sch.start_time).toLocaleDateString("id-ID", {
                        weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                      }) : ""}
                    </p>
                    {sch.meeting_link && (
                      <div className="pt-1 flex items-center justify-between">
                        <a href={sch.meeting_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 font-medium">
                          <Video size={12} /> Buka Link Meeting
                        </a>
                        {sch.pairing?.mentee?.phone && (
                          <button
                            onClick={() => sendWaReminder(sch)}
                            className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
                          >
                            <MessageCircle size={12} /> WA Mentee
                          </button>
                        )}
                      </div>
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
                <h2 className="text-base font-bold text-gray-800">
                  Mentee Bimbingan ({mentees.length})
                </h2>
              </div>
              <Link to="/mentor-dashboard/mentees" className="text-xs text-[#b38867] font-semibold hover:underline">
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-3">
              {mentees.length > 0 ? (
                mentees.slice(0, 4).map((item, idx) => {
                  const mentee = item.mentee || {};
                  return (
                    <div key={idx} className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-[#b38867]/20 text-[#b38867] font-bold flex items-center justify-center text-sm shrink-0">
                          {mentee?.name ? mentee.name.charAt(0) : "M"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-800 text-xs truncate">{mentee?.name || "Mentee"}</p>
                          <p className="text-[11px] text-gray-400 truncate">{item.subscription_name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.remaining_days !== undefined && item.status === "active" && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Sisa {item.remaining_days} Hari
                          </span>
                        )}
                        {mentee?.phone && (
                          <a
                            href={`https://wa.me/${formatWaNumber(mentee.phone)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition"
                            title="Chat WhatsApp"
                          >
                            <MessageCircle size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <Users size={28} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-xs">Belum ada mentee yang dipasangkan ke Anda oleh Admin.</p>
                </div>
              )}
            </div>
          </div>

          <Link
            to="/mentor-dashboard/mentees"
            className="mt-4 w-full py-2.5 text-center text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition"
          >
            Kelola Semua Mentee
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;