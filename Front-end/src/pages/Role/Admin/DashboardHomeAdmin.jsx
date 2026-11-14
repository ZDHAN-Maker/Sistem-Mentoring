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
  RefreshCw,
  Package,
  Clock,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Crown,
  ExternalLink,
  Eye,
  Sparkles,
  Phone,
  Mail,
  Video
} from "lucide-react";

const DashboardHomeAdmin = () => {
  const [stats, setStats] = useState(null);
  const [pairings, setPairings] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, pairingRes, scheduleRes, actRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/pairings"),
        api.get("/schedules").catch(() => ({ data: { data: [] } })),
        api.get("/learning-activities").catch(() => ({ data: { data: [] } }))
      ]);

      setStats(dashRes.data.cards || {});
      setPairings(pairingRes.data.data || []);
      setSchedules(scheduleRes.data.data || []);
      setActivities(actRes.data.data || []);
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

  const formatDateIndo = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const formatDateTimeIndo = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 gap-3">
        <RefreshCw className="animate-spin text-[#b38867]" size={32} />
        <span className="text-gray-600 font-medium text-sm">Menyiapkan ringkasan ekosistem mentoring...</span>
      </div>
    );
  }

  // Primary Metrics
  const primaryCards = [
    { 
      title: "Total Pengguna", 
      value: stats?.total_user ?? 0, 
      sub: `${stats?.total_admin ?? 1} Admin • ${stats?.total_mentor ?? 0} Mentor • ${stats?.total_mentee ?? 0} Mentee`,
      icon: Users, 
      color: "bg-blue-50 text-blue-600", 
      border: "border-blue-100" 
    },
    { 
      title: "Mentor Terdaftar", 
      value: stats?.total_mentor ?? 0, 
      sub: `${stats?.total_mentor ?? 0} Mentor Siap Bimbing`,
      icon: UserCheck, 
      color: "bg-amber-50 text-amber-600", 
      border: "border-amber-100" 
    },
    { 
      title: "Mentee Terdaftar", 
      value: stats?.total_mentee ?? 0, 
      sub: stats?.mentees_tanpa_pairing > 0 
        ? `${stats.mentees_tanpa_pairing} Mentee butuh pairing` 
        : "Semua mentee telah dipasangkan",
      alert: (stats?.mentees_tanpa_pairing ?? 0) > 0,
      icon: GraduationCap, 
      color: "bg-emerald-50 text-emerald-600", 
      border: "border-emerald-100" 
    },
    { 
      title: "Langganan & Pairing Aktif", 
      value: stats?.total_pairing_aktif ?? 0, 
      sub: `${stats?.total_pairing_selesai ?? 0} Sesi telah selesai`,
      icon: Crown, 
      color: "bg-[#b38867]/15 text-[#b38867]", 
      border: "border-[#b38867]/20" 
    },
    { 
      title: "Jadwal Tutoring", 
      value: stats?.total_jadwal ?? 0, 
      sub: `${stats?.jadwal_mendatang ?? 0} Sesi terjadwal mendatang`,
      icon: Calendar, 
      color: "bg-purple-50 text-purple-600", 
      border: "border-purple-100" 
    },
    { 
      title: "e-Sertifikat Kelulusan", 
      value: stats?.sertifikat_diterbitkan ?? 0, 
      sub: "Diterbitkan resmi untuk mentee",
      icon: Award, 
      color: "bg-rose-50 text-rose-600", 
      border: "border-rose-100" 
    },
  ];

  // Upcoming schedules (sorted)
  const upcomingSchedules = schedules.slice(0, 4);

  return (
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#7B5E4A] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#f8fafc] border border-white/15">
            <ShieldCheck size={14} className="text-[#b38867]" />
            <span>Pusat Kendali Administrator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ringkasan Ekosistem Mentoring
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Pantau performa program bimbingan, masa aktif langganan mentee, beban kuota mentor, serta jadwal sesi tutoring secara *real-time*.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/20 transition shadow-sm"
          >
            <RefreshCw size={15} />
            <span>Perbarui Data</span>
          </button>
          <Link
            to="/admin-dashboard/pairings"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#b38867] hover:bg-[#a27355] text-white rounded-xl shadow-md transition"
          >
            <PlusCircle size={15} />
            <span>Pasangkan Mentee</span>
          </Link>
        </div>

        {/* Decorative background element */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">×</button>
        </div>
      )}

      {/* Grid Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {primaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`bg-white p-5 rounded-2xl border ${card.border} shadow-sm hover:shadow-md transition flex items-start justify-between relative overflow-hidden`}
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.title}</p>
                <p className="text-3xl font-extrabold text-gray-800">{card.value}</p>
                <p className={`text-xs mt-1 ${card.alert ? "text-amber-600 font-bold" : "text-gray-400 font-medium"}`}>
                  {card.sub}
                </p>
              </div>
              <div className={`p-3 rounded-2xl ${card.color} shrink-0`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-Column Overview: Status Langganan & Jadwal Bimbingan Terdekat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Kolom Kiri (1/3): Status Masa Langganan & Health Check */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Crown size={18} className="text-[#b38867]" />
                <h3 className="font-bold text-gray-800 text-sm">Status Masa Langganan</h3>
              </div>
              <Link to="/admin-dashboard/plans" className="text-xs font-semibold text-[#b38867] hover:underline">
                Kelola Paket
              </Link>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <div>
                    <div className="font-bold text-gray-800 text-xs">Langganan Aktif</div>
                    <div className="text-[11px] text-gray-500">Masa bimbingan sedang berjalan</div>
                  </div>
                </div>
                <span className="text-lg font-extrabold text-emerald-700">
                  {stats?.total_langganan_aktif ?? 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <div>
                    <div className="font-bold text-gray-800 text-xs">Segera Berakhir (≤14 Hari)</div>
                    <div className="text-[11px] text-gray-500">Perlu konfirmasi perpanjangan</div>
                  </div>
                </div>
                <span className="text-lg font-extrabold text-amber-700">
                  {stats?.total_langganan_segera_habis ?? 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
                  <div>
                    <div className="font-bold text-gray-800 text-xs">Sesi Selesai / Diarsipkan</div>
                    <div className="text-[11px] text-gray-500">Telah menyelesaikan kurikulum</div>
                  </div>
                </div>
                <span className="text-lg font-extrabold text-gray-700">
                  {stats?.total_pairing_selesai ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Mentee Unpaired Alert Widget */}
          {(stats?.mentees_tanpa_pairing ?? 0) > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <AlertTriangle size={20} className="text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold text-gray-800">
                    {stats?.mentees_tanpa_pairing} Mentee Menunggu Pasangan
                  </div>
                  <div className="text-gray-500 text-[11px]">
                    Belum dijodohkan dengan mentor bimbingan.
                  </div>
                </div>
              </div>
              <Link
                to="/admin-dashboard/pairings"
                className="px-3 py-1.5 bg-[#b38867] hover:bg-[#a27355] text-white font-semibold rounded-lg shrink-0 transition"
              >
                Pasangkan
              </Link>
            </div>
          )}
        </div>

        {/* Kolom Kanan (2/3): Jadwal Bimbingan Terdekat */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#b38867]" />
                <h3 className="font-bold text-gray-800 text-sm">Jadwal Bimbingan Mentoring Terdekat</h3>
              </div>
              <Link to="/admin-dashboard/schedules" className="text-xs font-semibold text-[#b38867] hover:underline flex items-center gap-1">
                Kelola Semua Jadwal <ArrowRight size={13} />
              </Link>
            </div>

            <div className="divide-y divide-gray-100 mt-2">
              {upcomingSchedules.length > 0 ? (
                upcomingSchedules.map((sch) => (
                  <div key={sch.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/70 px-2 rounded-xl transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex flex-col items-center justify-center font-bold text-xs shrink-0">
                        <Clock size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-xs sm:text-sm">
                          {sch.title || "Sesi Mentoring Rutin"}
                        </h4>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                          <span>Mentor: <strong>{sch.pairing?.mentor?.name || "Mentor"}</strong></span>
                          <span>•</span>
                          <span>Mentee: <strong>{sch.pairing?.mentee?.name || "Mentee"}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-gray-700">
                        {formatDateTimeIndo(sch.start_time)}
                      </div>
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                        sch.status === "completed" 
                          ? "bg-gray-100 text-gray-600" 
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {sch.status === "completed" ? "Selesai" : "Terencana"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-gray-400 text-xs">
                  <Calendar size={28} className="mx-auto mb-1 text-gray-300" />
                  <span>Belum ada jadwal sesi bimbingan dalam waktu dekat.</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Total Agenda Terjadwal: <strong>{stats?.total_jadwal ?? 0} Sesi</strong></span>
            <Link to="/admin-dashboard/schedules" className="text-[#b38867] hover:underline font-semibold">
              Buka Kalender Mentoring →
            </Link>
          </div>
        </div>
      </div>

      {/* Tabel Pairing Terbaru */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Daftar Pasangan Mentoring Terkini</h2>
            <p className="text-xs text-gray-500 mt-0.5">Ringkasan status bimbingan, paket langganan, dan masa aktif</p>
          </div>
          <Link
            to="/admin-dashboard/pairings"
            className="text-xs font-semibold text-[#b38867] hover:underline flex items-center gap-1"
          >
            Buka Manajemen Pairing <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100 text-xs">
              <tr>
                <th className="py-3.5 px-6">ID</th>
                <th className="py-3.5 px-6">Mentor Pembimbing</th>
                <th className="py-3.5 px-6">Mentee Peserta</th>
                <th className="py-3.5 px-6">Paket Langganan</th>
                <th className="py-3.5 px-6">Durasi & Periode</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {pairings.length > 0 ? (
                pairings.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3.5 px-6 font-mono font-semibold text-gray-500">#{item.id}</td>
                    
                    {/* Mentor */}
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-gray-800">{item.mentor?.name || "Mentor #" + item.mentor_id}</div>
                      <div className="text-[11px] text-gray-400">{item.mentor?.email}</div>
                    </td>

                    {/* Mentee */}
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-gray-800">{item.mentee?.name || "Mentee #" + item.mentee_id}</div>
                      <div className="text-[11px] text-gray-400">{item.mentee?.email}</div>
                    </td>

                    {/* Paket Langganan */}
                    <td className="py-3.5 px-6">
                      <span className="font-semibold text-[#b38867] block">
                        {item.subscription_name || item.subscription_plan?.title || "Paket Standar"}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {item.duration_months ? `${item.duration_months} Bulan` : "1 Bulan"}
                      </span>
                    </td>

                    {/* Periode */}
                    <td className="py-3.5 px-6 text-gray-600">
                      <div>Mulai: {formatDateIndo(item.started_at)}</div>
                      <div className="text-gray-400 text-[11px]">Selesai: {formatDateIndo(item.ended_at)}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-6 text-center">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          item.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.status === "active" ? "Aktif" : "Selesai"}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-6 text-center">
                      <Link
                        to="/admin-dashboard/pairings"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#b38867] hover:underline"
                      >
                        <Eye size={13} />
                        <span>Kelola</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 text-xs">
                    Belum ada data pairing mentor-mentee. Silakan buat pasangan baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid Master Data & Aksi Cepat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Bidang Keahlian Mentoring */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-[#b38867]" />
              <h3 className="font-bold text-gray-800 text-sm">Bidang Keahlian Pembelajaran</h3>
            </div>
            <Link to="/admin-dashboard/learning-activities" className="text-xs font-semibold text-[#b38867] hover:underline">
              Kelola Semua ({activities.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activities.length > 0 ? (
              activities.map((act) => (
                <div key={act.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#b38867]/15 text-[#b38867] flex items-center justify-center font-bold text-xs shrink-0">
                    <Sparkles size={13} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-800 text-xs truncate">{act.title}</div>
                    <div className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{act.description || "Topik kurikulum"}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-400 text-xs py-4">
                Belum ada data bidang keahlian.
              </div>
            )}
          </div>
        </div>

        {/* Menu Navigasi Cepat Admin */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-[#b38867]" />
              <h3 className="font-bold text-gray-800 text-sm">Pusat Navigasi & Tindakan Cepat</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <Link
              to="/admin-dashboard/pairings"
              className="p-3 rounded-xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200 transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <Crown size={18} className="text-emerald-700" />
                <ArrowRight size={14} className="text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="mt-2">
                <div className="font-bold text-gray-800">Manajemen Pairing</div>
                <div className="text-[11px] text-gray-500">Pasangkan & kelola masa aktif</div>
              </div>
            </Link>

            <Link
              to="/admin-dashboard/plans"
              className="p-3 rounded-xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200 transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <Package size={18} className="text-amber-700" />
                <ArrowRight size={14} className="text-amber-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="mt-2">
                <div className="font-bold text-gray-800">Paket Langganan</div>
                <div className="text-[11px] text-gray-500">Tarif, harga, & fitur benefit</div>
              </div>
            </Link>

            <Link
              to="/admin-dashboard/users"
              className="p-3 rounded-xl bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200 transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <Users size={18} className="text-blue-700" />
                <ArrowRight size={14} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="mt-2">
                <div className="font-bold text-gray-800">Manajemen Pengguna</div>
                <div className="text-[11px] text-gray-500">Daftar akun mentor & mentee</div>
              </div>
            </Link>

            <Link
              to="/admin-dashboard/reports"
              className="p-3 rounded-xl bg-purple-50/60 hover:bg-purple-100/70 border border-purple-200 transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <FileText size={18} className="text-purple-700" />
                <ArrowRight size={14} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="mt-2">
                <div className="font-bold text-gray-800">Laporan Perkembangan</div>
                <div className="text-[11px] text-gray-500">Evaluasi bimbingan mentee</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomeAdmin;
