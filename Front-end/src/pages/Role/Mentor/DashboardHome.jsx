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
  Award, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail, 
  Eye, 
  CalendarDays, 
  AlertTriangle, 
  Lightbulb, 
  Check, 
  Copy, 
  X,
  Target
} from "lucide-react";

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedPhone, setCopiedPhone] = useState(null);
  const [selectedMentee, setSelectedMentee] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, schRes, menteeRes, subRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/schedules"),
        api.get("/my-mentees"),
        api.get("/submissions?per_page=6").catch(() => ({ data: { data: [] } }))
      ]);

      setStats(dashRes.data?.cards || {});
      setSchedules(schRes.data?.data || schRes.data || []);
      setMentees(menteeRes.data?.data || menteeRes.data || []);
      setSubmissions(subRes.data?.data || []);
    } catch (err) {
      console.error("Gagal mengambil data dashboard mentor:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format nomor WA
  const formatWaNumber = (phone) => {
    if (!phone) return "";
    let cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("0")) return "62" + cleaned.slice(1);
    return cleaned;
  };

  const handleCopyPhone = (phone, id) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedPhone(id);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  // Filter jadwal hari ini
  const todaySchedules = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return schedules.filter((sch) => {
      if (!sch.start_time) return false;
      const schDateStr = new Date(sch.start_time).toISOString().slice(0, 10);
      return schDateStr === todayStr && sch.status !== "cancelled" && sch.status !== "canceled";
    });
  }, [schedules]);

  // Kirim Pengingat WhatsApp Sesi
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
      `Halo ${mentee.name || "Mentee"}, mengingatkan sesi mentoring kita hari ini pukul ${timeStr} WIB ("${sch.title}"). Link meeting: ${sch.meeting_link || "Akan segera diinfokan"}. Sampai jumpa!`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  // Hitung rata-rata progres tugas mentee
  const averageTaskProgress = useMemo(() => {
    if (mentees.length === 0) return 0;
    const totalPct = mentees.reduce((acc, m) => acc + (m.stats?.task_progress_pct || 0), 0);
    return Math.round(totalPct / mentees.length);
  }, [mentees]);

  // Total sesi selesai
  const totalCompletedSchedules = useMemo(() => {
    return schedules.filter((s) => s.status === "completed").length;
  }, [schedules]);

  // Tugas yang menunggu review
  const pendingSubmissionsCount = stats?.submission_menunggu_review ?? 
    submissions.filter((s) => s.status === "submitted" || !s.grade).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-3">
        <RefreshCw className="animate-spin text-[#b38867]" size={36} />
        <span className="text-gray-600 font-medium text-sm">Menyiapkan panel kerja bimbingan mentor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Salam & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel Kerja Mentor</h1>
          <p className="text-gray-500 text-sm mt-1">
            Pantau perkembangan mentee, jadwal sesi bimbingan, materi pembelajaran, dan evaluasi tugas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-[#b38867]" : ""} />
          </button>
          <Link
            to="/mentor-dashboard/schedules"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-sm font-semibold rounded-xl shadow-sm transition"
          >
            <PlusCircle size={18} />
            <span>Buat Jadwal Sesi</span>
          </Link>
        </div>
      </div>

      {/* 2. Banner Agenda Bimbingan Hari Ini (Jika Ada) */}
      {todaySchedules.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-white p-5 rounded-2xl border border-amber-300 shadow-sm animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#b38867] text-white rounded-xl shadow-sm shrink-0">
                <Calendar size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-amber-200 text-amber-900 rounded-md">
                    Agenda Hari Ini
                  </span>
                  <span className="text-xs text-gray-600 font-medium">
                    {todaySchedules.length} sesi pertemuan dijadwalkan
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  {todaySchedules[0].title}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5 flex flex-wrap items-center gap-2">
                  <span>Mentee: <strong className="text-gray-800">{todaySchedules[0].pairing?.mentee?.name || "Mentee"}</strong></span>
                  <span>•</span>
                  <span className="font-semibold text-gray-700">
                    {todaySchedules[0].start_time
                      ? new Date(todaySchedules[0].start_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                      : ""}{" "}
                    s/d{" "}
                    {todaySchedules[0].end_time
                      ? new Date(todaySchedules[0].end_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                      : ""}{" "}
                    WIB
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {todaySchedules[0].meeting_link && (
                <a
                  href={todaySchedules[0].meeting_link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Video size={14} />
                  <span>Buka Meeting</span>
                  <ExternalLink size={12} />
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
                Lihat Kalender
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. Banner Tugas Menunggu Penilaian Segera (Jika Ada) */}
      {pendingSubmissionsCount > 0 && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900">
                Ada {pendingSubmissionsCount} Tugas Mentee Menunggu Penilaian Anda
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Berikan ulasan dan nilai agar mentee dapat melanjutkan ke bab pembelajaran berikutnya.
              </p>
            </div>
          </div>

          <Link
            to="/mentor-dashboard/reports"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm self-start sm:self-auto shrink-0 flex items-center gap-1.5"
          >
            <Award size={14} />
            <span>Review Tugas Sekarang</span>
          </Link>
        </div>
      )}

      {/* 4. Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Mentee Aktif */}
        <Link
          to="/mentor-dashboard/mentees"
          className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition flex items-center justify-between group"
        >
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mentee Bimbingan</p>
            <p className="text-3xl font-extrabold text-gray-800 mt-1.5">
              {stats?.pairing_aktif ?? mentees.filter(m => m.status === 'active').length}
              <span className="text-xs font-medium text-gray-400 ml-1.5">/ {mentees.length} Total</span>
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Bimbingan Sedang Aktif
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
            <Users size={24} />
          </div>
        </Link>

        {/* Card 2: Tugas Perlu Dinilai */}
        <Link
          to="/mentor-dashboard/reports"
          className={`bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition flex items-center justify-between group ${
            pendingSubmissionsCount > 0 ? "border-rose-300 bg-rose-50/20" : "border-gray-200"
          }`}
        >
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Perlu Dinilai</p>
            <p className={`text-3xl font-extrabold mt-1.5 ${pendingSubmissionsCount > 0 ? "text-rose-600" : "text-gray-800"}`}>
              {pendingSubmissionsCount}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              {pendingSubmissionsCount > 0 ? "Segera berikan feedback" : "Semua tugas telah dinilai"}
            </p>
          </div>
          <div className={`p-3.5 rounded-2xl group-hover:scale-105 transition-transform ${
            pendingSubmissionsCount > 0 ? "bg-rose-100 text-rose-700" : "bg-gray-100 text-gray-600"
          }`}>
            <Award size={24} />
          </div>
        </Link>

        {/* Card 3: Sesi Terlaksana */}
        <Link
          to="/mentor-dashboard/schedules"
          className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition flex items-center justify-between group"
        >
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sesi Terlaksana</p>
            <p className="text-3xl font-extrabold text-gray-800 mt-1.5">
              {totalCompletedSchedules}
              <span className="text-xs font-medium text-gray-400 ml-1.5">/ {schedules.length} Sesi</span>
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 size={12} />
              Telah Diberi Notulensi
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
            <CheckSquare size={24} />
          </div>
        </Link>

        {/* Card 4: Rata-Rata Progres Belajar Mentee */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rata-rata Progres</p>
              <p className="text-3xl font-extrabold text-gray-800 mt-1.5">{averageTaskProgress}%</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-700">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#b38867] rounded-full transition-all duration-500"
                style={{ width: `${averageTaskProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Penyelesaian latihan & modul tugas</p>
          </div>
        </div>
      </div>

      {/* 5. Secondary Quick Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <Link
          to="/mentor-dashboard/materials"
          className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs hover:bg-gray-50 transition flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen size={16} className="text-amber-600" />
            <span className="font-semibold text-gray-700">Materi Terbit</span>
          </div>
          <span className="font-extrabold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
            {stats?.total_materi ?? 0}
          </span>
        </Link>

        <Link
          to="/mentor-dashboard/tasks"
          className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs hover:bg-gray-50 transition flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <FileText size={16} className="text-purple-600" />
            <span className="font-semibold text-gray-700">Tugas Diberikan</span>
          </div>
          <span className="font-extrabold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
            {stats?.total_tugas ?? 0}
          </span>
        </Link>

        <Link
          to="/mentor-dashboard/reports"
          className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs hover:bg-gray-50 transition flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-teal-600" />
            <span className="font-semibold text-gray-700">Progress Report</span>
          </div>
          <span className="font-extrabold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
            {stats?.progress_report_dibuat ?? 0}
          </span>
        </Link>

        <Link
          to="/mentor-dashboard/schedules"
          className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs hover:bg-gray-50 transition flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <CalendarDays size={16} className="text-blue-600" />
            <span className="font-semibold text-gray-700">Jadwal Mendatang</span>
          </div>
          <span className="font-extrabold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
            {schedules.filter((s) => s.status === "planned" || s.status === "scheduled").length}
          </span>
        </Link>
      </div>

      {/* 6. Aksi Cepat Hub */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
          Aksi Cepat Mentor
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to="/mentor-dashboard/tasks"
            className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <PlusCircle className="text-purple-600" size={18} />
              <div>
                <p className="font-bold text-gray-800 text-xs">Beri Tugas</p>
                <p className="text-[10px] text-gray-500">Tugaskan Latihan Baru</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/mentor-dashboard/schedules"
            className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="text-blue-600" size={18} />
              <div>
                <p className="font-bold text-gray-800 text-xs">Atur Jadwal</p>
                <p className="text-[10px] text-gray-500">Kalender Bimbingan</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/mentor-dashboard/materials"
            className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="text-amber-600" size={18} />
              <div>
                <p className="font-bold text-gray-800 text-xs">Upload Modul</p>
                <p className="text-[10px] text-gray-500">Materi & Tautan</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-amber-600 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/mentor-dashboard/reports"
            className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <CheckSquare className="text-rose-600" size={18} />
              <div>
                <p className="font-bold text-gray-800 text-xs">Review Tugas</p>
                <p className="text-[10px] text-gray-500">Nilai & Evaluasi</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-rose-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 7. Grid Utama 2 Kolom: Mentee Hub & Jadwal Mendatang */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Kolom Kiri: Mentee Bimbingan & Submissions (3/5) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Card: Mentee Bimbingan Aktif Tracker */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-100 text-blue-800 rounded-xl">
                  <Users size={18} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-gray-800">
                    Mentee Bimbingan Saya ({mentees.length})
                  </h2>
                  <p className="text-xs text-gray-400">Status masa aktif, kontak WhatsApp, dan progres tugas</p>
                </div>
              </div>
              <Link to="/mentor-dashboard/mentees" className="text-xs text-[#b38867] font-bold hover:underline flex items-center gap-1">
                <span>Kelola Semua</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {mentees.length > 0 ? (
                mentees.map((item, idx) => {
                  const mentee = item.mentee || {};
                  const stats = item.stats || {};
                  const remainingDays = item.remaining_days ?? 0;
                  const isNearExpiry = item.status === "active" && remainingDays <= 30 && remainingDays > 0;

                  return (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50/80 hover:bg-gray-50 border border-gray-200 rounded-xl transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                      {/* Avatar & Kontak Mentee */}
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#b38867]/20 text-[#b38867] font-bold flex items-center justify-center text-sm border border-[#b38867]/30 shrink-0">
                          {mentee?.name ? mentee.name.charAt(0).toUpperCase() : "M"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm truncate">{mentee?.name || "Mentee"}</h4>
                          <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                            <Mail size={11} className="text-gray-400" />
                            {mentee?.email}
                          </p>

                          <div className="flex items-center gap-2 mt-1.5">
                            {mentee?.phone ? (
                              <>
                                <span className="text-[11px] font-mono text-gray-600 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                                  {mentee.phone}
                                </span>
                                <a
                                  href={`https://wa.me/${formatWaNumber(mentee.phone)}?text=${encodeURIComponent(`Halo ${mentee.name}, bagaimana progres bimbingan Anda hari ini?`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white px-2 py-0.5 rounded border border-emerald-200 transition"
                                  title="Chat WhatsApp"
                                >
                                  <MessageCircle size={11} />
                                  <span>WA</span>
                                </a>
                              </>
                            ) : (
                              <span className="text-[10px] text-gray-400 italic">No HP belum diisi</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Paket, Sisa Hari & Progress */}
                      <div className="flex flex-col sm:items-end justify-between shrink-0 gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-700 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                            {item.subscription_name}
                          </span>
                          {item.status === "active" ? (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isNearExpiry
                                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                                  : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              }`}
                            >
                              Sisa {remainingDays} Hari
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              Selesai
                            </span>
                          )}
                        </div>

                        {/* Progress Bar Tugas */}
                        <div className="w-full sm:w-40">
                          <div className="flex items-center justify-between text-[10px] text-gray-500 mb-0.5">
                            <span>Tugas Selesai</span>
                            <span className="font-bold text-gray-700">
                              {stats.completed_tasks ?? 0}/{stats.total_tasks ?? 0} ({stats.task_progress_pct ?? 0}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#b38867] rounded-full"
                              style={{ width: `${stats.task_progress_pct ?? 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-10 text-center text-gray-400">
                  <Users size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-xs">Belum ada mentee yang dipasangkan ke Anda oleh Administrator.</p>
                </div>
              )}
            </div>
          </div>

          {/* Card: Pengumpulan Tugas Terbaru (Recent Submissions) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-purple-100 text-purple-800 rounded-xl">
                  <FileText size={18} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-gray-800">
                    Pengumpulan Tugas Terbaru
                  </h2>
                  <p className="text-xs text-gray-400">Tugas yang baru diserahkan oleh mentee bimbingan</p>
                </div>
              </div>
              <Link to="/mentor-dashboard/reports" className="text-xs text-[#b38867] font-bold hover:underline flex items-center gap-1">
                <span>Semua Submission</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="space-y-2.5">
              {submissions.length > 0 ? (
                submissions.slice(0, 4).map((sub) => {
                  const isReviewed = sub.status === "reviewed" || sub.status === "completed" || sub.grade !== null;
                  return (
                    <div
                      key={sub.id}
                      className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between text-xs gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isReviewed
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800 animate-pulse"
                            }`}
                          >
                            {isReviewed ? "Sudah Dinilai" : "Perlu Dinilai"}
                          </span>
                          <span className="font-bold text-gray-800 truncate">
                            {sub.task?.title || "Tugas #" + sub.task_id}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Oleh: <strong className="text-gray-700">{sub.mentee?.name || "Mentee"}</strong> •{" "}
                          {sub.created_at ? new Date(sub.created_at).toLocaleDateString("id-ID") : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {sub.grade !== null && sub.grade !== undefined && (
                          <span className="font-bold text-[#7B5E4A] bg-amber-50 px-2 py-1 rounded border border-amber-200">
                            {sub.grade}/100
                          </span>
                        )}
                        <Link
                          to="/mentor-dashboard/reports"
                          className="px-3 py-1.5 bg-[#b38867] hover:bg-[#a27355] text-white text-[11px] font-semibold rounded-lg transition"
                        >
                          {isReviewed ? "Ubah" : "Beri Nilai"}
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <CheckSquare size={28} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-xs">Belum ada kiriman tugas dari mentee.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Jadwal Mendatang & Best Practice (2/5) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Jadwal Bimbingan Terdekat */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                    <Calendar size={18} />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-gray-800">Jadwal Bimbingan Terdekat</h2>
                    <p className="text-xs text-gray-400">Sesi pertemuan berikutnya</p>
                  </div>
                </div>
                <Link to="/mentor-dashboard/schedules" className="text-xs text-[#b38867] font-bold hover:underline">
                  Kalender
                </Link>
              </div>

              <div className="space-y-3">
                {schedules.length > 0 ? (
                  schedules.slice(0, 4).map((sch) => {
                    const isCompleted = sch.status === "completed";
                    const mentee = sch.pairing?.mentee;

                    return (
                      <div
                        key={sch.id}
                        className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition ${
                          isCompleted
                            ? "bg-emerald-50/20 border-emerald-100 opacity-80"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-gray-900 text-xs truncate">{sch.title}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                              isCompleted
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {isCompleted ? "Selesai" : "Terjadwal"}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-500">
                          Mentee: <strong>{mentee?.name || "Mentee"}</strong>
                        </p>

                        <p className="text-[11px] text-gray-600 font-medium">
                          {sch.start_time
                            ? new Date(sch.start_time).toLocaleDateString("id-ID", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit"
                              })
                            : "-"}{" "}
                          WIB
                        </p>

                        {/* Meeting & WA link */}
                        <div className="pt-1.5 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
                          {sch.meeting_link ? (
                            <a
                              href={sch.meeting_link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <Video size={12} /> Buka Room
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">Belum ada link</span>
                          )}

                          {!isCompleted && mentee?.phone && (
                            <button
                              onClick={() => sendWaReminder(sch)}
                              className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <MessageCircle size={12} /> Ingatkan WA
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    <Calendar size={28} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-xs">Belum ada jadwal bimbingan yang dibuat.</p>
                  </div>
                )}
              </div>
            </div>

            <Link
              to="/mentor-dashboard/schedules"
              className="mt-4 w-full py-2.5 text-center text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition"
            >
              + Buka Kalender & Atur Jadwal
            </Link>
          </div>

          {/* Card: Panduan & Tips Mentoring Efektif */}
          <div className="bg-gradient-to-br from-[#b38867]/10 via-[#b38867]/5 to-white rounded-2xl border border-[#b38867]/20 p-5 shadow-sm text-xs space-y-3">
            <div className="flex items-center gap-2 text-[#7B5E4A] font-bold text-sm">
              <Lightbulb size={18} className="text-[#b38867]" />
              <span>Prinsip Pendampingan Efektif</span>
            </div>

            <ul className="space-y-2 text-gray-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#b38867] font-bold">•</span>
                <span>
                  <strong>Notulensi Pertemuan:</strong> Selalu catat poin bahasan dan PR mentee setelah sesi Google Meet selesai.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#b38867] font-bold">•</span>
                <span>
                  <strong>Kecepatan Review:</strong> Usahakan memberi nilai dan feedback tugas dalam waktu maksimal 2x24 jam.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#b38867] font-bold">•</span>
                <span>
                  <strong>Evaluasi Berkala:</strong> Buat <em>Progress Report</em> minimal 1 kali sebulan untuk rekap capaian mentee.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;