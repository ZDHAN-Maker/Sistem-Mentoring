import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import api from "../../../axiosInstance";
import { 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Award, 
  UserCheck, 
  ArrowRight, 
  FileText, 
  AlertCircle,
  Video,
  ExternalLink,
  RefreshCw,
  Bell
} from "lucide-react";

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [dashRes, taskRes, schRes, mentorRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/tasks"),
        api.get("/schedules"),
        api.get("/my-mentor").catch(() => ({ data: { data: null } }))
      ]);

      setStats(dashRes.data?.cards || {});
      setTasks(taskRes.data?.data || []);
      setSchedules(schRes.data?.data || schRes.data || []);
      setMentorData(mentorRes.data?.data || null);
    } catch (err) {
      console.error("Gagal memuat dashboard mentee:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16 text-gray-500">
        <RefreshCw className="animate-spin text-[#b38867] mr-3" size={24} />
        <span className="font-medium">Memuat data dashboard mentee...</span>
      </div>
    );
  }

  const statCards = [
    {
      title: "Progress Belajar",
      value: `${stats?.progress_belajar_persen ?? 0}%`,
      subtitle: `${stats?.materi_selesai ?? 0} dari ${stats?.total_materi ?? 0} materi`,
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100"
    },
    {
      title: "Tugas Aktif",
      value: stats?.tugas_aktif ?? 0,
      subtitle: `${stats?.submission_saya ?? 0} sudah dikumpulkan`,
      icon: CheckCircle2,
      color: "bg-amber-50 text-amber-600",
      border: "border-amber-100"
    },
    {
      title: "Nilai Terakhir",
      value: stats?.nilai_terakhir ? Number(stats.nilai_terakhir).toFixed(0) : "Belum Ada",
      subtitle: "Evaluasi mentor",
      icon: Award,
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100"
    },
    {
      title: "Laporan Evaluasi",
      value: stats?.progress_report ?? 0,
      subtitle: "Laporan perkembangan",
      icon: FileText,
      color: "bg-purple-50 text-purple-600",
      border: "border-purple-100"
    }
  ];

  const upcomingSchedules = schedules
    .filter(s => new Date(s.start_time) >= new Date())
    .slice(0, 3);

  const pendingTasks = tasks.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#b38867] to-[#7B5E4A] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Portal Mentee
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Semangat Belajar, {user?.name || "Mentee"}! 👋
          </h1>
          <p className="mt-2 text-white/90 text-sm sm:text-base leading-relaxed">
            Pantau materi pembelajaran, selesaikan tugas tepat waktu, dan jangan lewatkan sesi mentoring bersama pembimbing Anda.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/mentee-dashboard/tasks"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#7B5E4A] font-semibold text-sm rounded-xl hover:bg-amber-50 shadow transition-colors"
            >
              Lihat Tugas Saya
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/mentee-dashboard/schedule"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm rounded-xl transition-colors"
            >
              Jadwal Sesi Mentoring
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className={`bg-white p-5 rounded-2xl border ${c.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {c.title}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {c.value}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{c.subtitle}</p>
                </div>
                <div className={`p-3 rounded-2xl ${c.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Mentor Info & Next Session */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mentor Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#b38867]" />
              Mentor Pembimbing
            </h3>
            <Link
              to="/mentee-dashboard/mentor"
              className="text-xs font-semibold text-[#b38867] hover:underline"
            >
              Detail
            </Link>
          </div>

          {mentorData?.mentor ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-amber-100 text-[#b38867] flex items-center justify-center font-bold text-xl uppercase border-2 border-[#b38867]/20">
                  {mentorData.mentor.name?.charAt(0) || "M"}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {mentorData.mentor.name}
                  </h4>
                  <p className="text-xs text-gray-500">{mentorData.mentor.email}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {mentorData.status === "active" ? "Aktif Membimbing" : mentorData.status}
                  </span>
                </div>
              </div>

              {mentorData.notes && (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600">
                  <span className="font-medium text-gray-700">Catatan Program: </span>
                  {mentorData.notes}
                </div>
              )}

              {mentorData.mentor.learning_activities?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-1.5 font-medium">Bidang Keahlian:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {mentorData.mentor.learning_activities.map((act) => (
                      <span
                        key={act.id}
                        className="px-2 py-0.5 rounded-lg text-xs bg-amber-50 text-[#7B5E4A] font-medium border border-amber-200/60"
                      >
                        {act.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Link
                to="/mentee-dashboard/mentor"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors"
              >
                Lihat Profil Mentor & Riwayat
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400 mb-3">
                <UserCheck size={24} />
              </div>
              <p className="text-sm font-semibold text-gray-700">Belum Ada Mentor</p>
              <p className="text-xs text-gray-400 mt-1">
                Admin sedang memproses pasangan mentor terbaik untuk Anda.
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Mentoring Schedule */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Jadwal Sesi Mendatang
            </h3>
            <Link
              to="/mentee-dashboard/schedule"
              className="text-xs font-semibold text-[#b38867] hover:underline"
            >
              Semua
            </Link>
          </div>

          {upcomingSchedules.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-gray-400 mb-2">
                <Calendar size={24} />
              </div>
              <p className="text-sm font-medium text-gray-600">Belum Ada Sesi Bimbingan</p>
              <p className="text-xs text-gray-400 mt-1">
                Mentor akan mengatur jadwal sesi tatap muka atau online berikutnya.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSchedules.map((sch) => (
                <div
                  key={sch.id}
                  className="p-3.5 rounded-xl border border-gray-100 hover:border-indigo-100 bg-gray-50/50 hover:bg-indigo-50/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                        {sch.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(sch.start_time).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                        {sch.location && <span>• {sch.location}</span>}
                      </div>
                    </div>
                    {sch.meeting_link && (
                      <a
                        href={sch.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        title="Buka Link Meeting"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Task Tracker */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-500" />
              Tugas Terbaru
            </h3>
            <Link
              to="/mentee-dashboard/tasks"
              className="text-xs font-semibold text-[#b38867] hover:underline"
            >
              Buka Semua
            </Link>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-emerald-500 mb-2">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-sm font-medium text-gray-600">Semua Tugas Beres!</p>
              <p className="text-xs text-gray-400 mt-1">
                Tidak ada tugas yang menunggu saat ini.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl border border-gray-100 hover:border-amber-200 bg-white shadow-xs transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {t.title}
                    </h4>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                      {t.type}
                    </span>
                  </div>
                  {t.due_date && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                      <Clock size={12} />
                      Tenggat: {new Date(t.due_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                  )}
                  <Link
                    to="/mentee-dashboard/tasks"
                    className="mt-2 text-xs font-medium text-[#b38867] hover:underline inline-flex items-center gap-1"
                  >
                    Kerjakan / Kumpulkan &rarr;
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
