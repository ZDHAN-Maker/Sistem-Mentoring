import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import api from "../../../axiosInstance";
import PlanBadgeIcon from "../../../components/PlanBadgeIcon";
import { 
  Users, 
  RefreshCw, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  User,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Search,
  Filter,
  Eye,
  Clock,
  Award,
  ChevronRight,
  X,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Sparkles
} from "lucide-react";

const ListOfMentees = () => {
  const { user } = useAuth();
  const [pairings, setPairings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'completed'
  const [copiedPhone, setCopiedPhone] = useState(null);
  const [selectedMentee, setSelectedMentee] = useState(null);

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

  // Salin nomor HP
  const handleCopyPhone = (phone, id) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedPhone(id);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  // Format nomor WA Indonesia (08xx -> 628xx)
  const formatWaNumber = (phone) => {
    if (!phone) return "";
    let cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "62" + cleaned.slice(1);
    }
    return cleaned;
  };

  // Buat link WA dengan salam pembuka otomatis
  const buildWaLink = (mentee) => {
    const waNumber = formatWaNumber(mentee?.phone);
    if (!waNumber) return "#";
    const greeting = encodeURIComponent(
      `Halo ${mentee?.name || "Mentee"}, saya mentor Anda di Aeterna Mentoring. Bagaimana kabar dan progres bimbingan serta tugas Anda saat ini? Ada yang ingin didiskusikan?`
    );
    return `https://wa.me/${waNumber}?text=${greeting}`;
  };

  // Filter daftar mentee
  const filteredPairings = useMemo(() => {
    return pairings.filter((item) => {
      const mentee = item.mentee || {};
      const matchesSearch =
        (mentee.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (mentee.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (mentee.phone || "").includes(searchQuery) ||
        (item.subscription_name || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [pairings, searchQuery, statusFilter]);

  // Statistik Ringkasan
  const statsSummary = useMemo(() => {
    const total = pairings.length;
    const active = pairings.filter((p) => p.status === "active").length;
    const completedSchedules = pairings.reduce((acc, p) => acc + (p.stats?.completed_schedules || 0), 0);
    const completedTasks = pairings.reduce((acc, p) => acc + (p.stats?.completed_tasks || 0), 0);
    return { total, active, completedSchedules, completedTasks };
  }, [pairings]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Mentee Bimbingan</h1>
          <p className="text-gray-500 text-sm mt-1">
            Pantau perkembangan mentee, sisa masa aktif bimbingan, progres tugas, dan komunikasi via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMentees}
            className="p-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-[#b38867]" : ""} />
          </button>
          <span className="text-xs font-semibold px-3 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl flex items-center gap-1.5 shadow-sm">
            <Users size={14} className="text-[#b38867]" />
            Total Mentee: {pairings.length}
          </span>
        </div>
      </div>

      {/* KPI Cards Ringkasan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Mentee</p>
            <p className="text-2xl font-extrabold text-gray-800 mt-1">{statsSummary.total}</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bimbingan Aktif</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{statsSummary.active}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sesi Terlaksana</p>
            <p className="text-2xl font-extrabold text-amber-700 mt-1">{statsSummary.completedSchedules}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Calendar size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tugas Selesai</p>
            <p className="text-2xl font-extrabold text-purple-600 mt-1">{statsSummary.completedTasks}</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Filter & Pencarian Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, email, no HP mentee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#b38867] focus:border-[#b38867] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
            <Filter size={14} /> Filter:
          </span>
          <div className="inline-flex p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === "all" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Semua ({pairings.length})
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === "active" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Aktif ({pairings.filter((p) => p.status === "active").length})
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === "completed" ? "bg-white text-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Selesai ({pairings.filter((p) => p.status !== "active").length})
            </button>
          </div>
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
      ) : filteredPairings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPairings.map((item, index) => {
            const mentee = item.mentee || {};
            const stats = item.stats || {};
            const hasPhone = Boolean(mentee?.phone);
            const remainingDays = item.remaining_days ?? 0;
            const isNearExpiry = item.status === "active" && remainingDays <= 30 && remainingDays > 0;
            const isExpired = item.status === "active" && remainingDays === 0;

            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6">
                  {/* Top Bar: Pairing ID, Status & Subscription Plan */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                      Pairing #{item.pairing_id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {item.status === "active" ? "Aktif" : "Selesai"}
                    </span>
                  </div>

                  {/* Paket Badge */}
                  <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-medium">
                    <PlanBadgeIcon title={item.subscription_name} size={13} className="text-amber-700" />
                    <span className="truncate max-w-[200px]">{item.subscription_name}</span>
                  </div>

                  {/* Profile Mentee Header */}
                  <div className="flex items-start gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#b38867]/15 text-[#b38867] font-bold text-lg flex items-center justify-center border border-[#b38867]/30 shrink-0">
                      {mentee?.name ? mentee.name.charAt(0).toUpperCase() : "M"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-900 text-base truncate">{mentee?.name || "Mentee"}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                        <Mail size={12} className="text-gray-400 shrink-0" />
                        <span className="truncate">{mentee?.email}</span>
                      </p>
                      
                      {/* Nomor Telepon & Tombol WA Langsung */}
                      <div className="flex items-center gap-2 mt-2">
                        {hasPhone ? (
                          <>
                            <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                              <Phone size={11} className="text-gray-400" />
                              <span className="font-mono">{mentee.phone}</span>
                              <button
                                onClick={() => handleCopyPhone(mentee.phone, item.pairing_id)}
                                title="Salin nomor HP"
                                className="text-gray-400 hover:text-gray-700 ml-1"
                              >
                                {copiedPhone === item.pairing_id ? (
                                  <Check size={11} className="text-emerald-600" />
                                ) : (
                                  <Copy size={11} />
                                )}
                              </button>
                            </div>
                            <a
                              href={buildWaLink(mentee)}
                              target="_blank"
                              rel="noreferrer"
                              title="Chat WhatsApp Mentee"
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-md border border-emerald-200 transition"
                            >
                              <MessageCircle size={12} />
                              <span>WA</span>
                            </a>
                          </>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">No HP belum diisi</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sisa Masa Aktif Bimbingan */}
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Clock size={12} /> Masa Bimbingan
                      </span>
                      {item.status === "active" ? (
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            isExpired
                              ? "bg-red-100 text-red-700"
                              : isNearExpiry
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {isExpired ? "Kedaluwarsa" : `Sisa ${remainingDays} Hari`}
                        </span>
                      ) : (
                        <span className="font-semibold text-gray-500">Selesai</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                      <span>{item.started_at || "-"}</span>
                      <span>s/d</span>
                      <span>{item.ended_at || "-"}</span>
                    </div>
                  </div>

                  {/* Statistik Aktivitas Mentee */}
                  <div className="grid grid-cols-3 gap-2 text-center py-2 px-3 bg-slate-50/70 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">Tugas</p>
                      <p className="text-xs font-bold text-gray-800 mt-0.5">
                        {stats.completed_tasks ?? 0}/{stats.total_tasks ?? 0}
                      </p>
                    </div>
                    <div className="border-x border-slate-200">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">Sesi Hadir</p>
                      <p className="text-xs font-bold text-gray-800 mt-0.5">
                        {stats.completed_schedules ?? 0}/{stats.total_schedules ?? 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">Evaluasi</p>
                      <p className="text-xs font-bold text-gray-800 mt-0.5">
                        {stats.total_reports ?? 0} Lap.
                      </p>
                    </div>
                  </div>

                  {/* Task Progress Bar */}
                  {stats.total_tasks > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                        <span>Penyelesaian Tugas</span>
                        <span className="font-bold text-gray-700">{stats.task_progress_pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#b38867] rounded-full transition-all duration-300"
                          style={{ width: `${stats.task_progress_pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Quick Actions */}
                <div className="p-3 bg-gray-50/80 border-t border-gray-100 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedMentee(item)}
                    className="py-2 text-center text-xs font-semibold bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl transition flex items-center justify-center gap-1 shadow-2xs"
                    title="Lihat Detail Mentee"
                  >
                    <Eye size={13} className="text-[#b38867]" />
                    <span>Detail</span>
                  </button>

                  <Link
                    to="/mentor-dashboard/tasks"
                    className="py-2 text-center text-xs font-semibold bg-white hover:bg-purple-50 hover:text-purple-700 border border-gray-200 text-gray-700 rounded-xl transition flex items-center justify-center gap-1 shadow-2xs"
                    title="Beri Tugas"
                  >
                    <FileText size={13} className="text-purple-600" />
                    <span>Tugas</span>
                  </Link>

                  <Link
                    to="/mentor-dashboard/schedules"
                    className="py-2 text-center text-xs font-semibold bg-white hover:bg-blue-50 hover:text-blue-700 border border-gray-200 text-gray-700 rounded-xl transition flex items-center justify-center gap-1 shadow-2xs"
                    title="Atur Jadwal"
                  >
                    <Calendar size={13} className="text-blue-600" />
                    <span>Jadwal</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-2xl border border-gray-200 text-gray-400">
          <Users size={40} className="mx-auto mb-3 text-gray-300" />
          <h3 className="text-base font-bold text-gray-700">
            {searchQuery ? "Tidak Ditemukan Mentee" : "Belum Ada Mentee Bimbingan"}
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `Tidak ada data mentee yang cocok dengan kata kunci "${searchQuery}". Coba kata kunci lain.`
              : "Administrator belum memasangkan mentee ke akun Anda. Ketika pairing dibuat oleh admin, mentee akan otomatis muncul di sini."}
          </p>
        </div>
      )}

      {/* Modal Detail Profil & Riwayat Mentee */}
      {selectedMentee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-amber-800 rounded-xl">
                  <User size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-800">Detail Mentee Bimbingan</h2>
                  <p className="text-xs text-gray-400">Pairing #{selectedMentee.pairing_id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMentee(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Profil Card */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-14 h-14 rounded-full bg-[#b38867]/20 text-[#b38867] font-bold text-xl flex items-center justify-center border border-[#b38867]/30 shrink-0">
                  {selectedMentee.mentee?.name ? selectedMentee.mentee.name.charAt(0).toUpperCase() : "M"}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{selectedMentee.mentee?.name}</h3>
                  <p className="text-xs text-gray-500">{selectedMentee.mentee?.email}</p>
                  {selectedMentee.mentee?.phone && (
                    <p className="text-xs text-gray-600 font-mono mt-0.5">{selectedMentee.mentee.phone}</p>
                  )}
                </div>
              </div>

              {/* Bio & Minat Belajar */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tentang Mentee</h4>
                <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
                  {selectedMentee.mentee?.bio || "Mentee belum menambahkan bio profil."}
                </p>
              </div>

              {/* Minat Pembelajaran (Learning Activities) */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Minat Bidang Keahlian
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMentee.mentee?.learning_activities?.length > 0 ? (
                    selectedMentee.mentee.learning_activities.map((act) => (
                      <span
                        key={act.id}
                        className="px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 rounded-lg"
                      >
                        {act.title}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">Belum memilih aktivitas minat</span>
                  )}
                </div>
              </div>

              {/* Detail Paket & Masa Bimbingan */}
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Paket Langganan:</span>
                  <span className="font-bold text-amber-900">{selectedMentee.subscription_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Durasi & Status:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedMentee.duration_months} Bulan ({selectedMentee.status === "active" ? "Aktif" : "Selesai"})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Masa Bimbingan:</span>
                  <span className="font-mono text-gray-700">
                    {selectedMentee.started_at} s/d {selectedMentee.ended_at}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-amber-200/60">
                  <span className="text-gray-600 font-medium">Sisa Waktu Aktif:</span>
                  <span className="font-bold text-emerald-700">
                    {selectedMentee.remaining_days} Hari Lagi
                  </span>
                </div>
              </div>

              {/* Catatan Evaluasi Terakhir */}
              {selectedMentee.stats?.latest_report_note && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Catatan Perkembangan Terakhir
                  </h4>
                  <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900">
                    <p className="font-semibold text-[11px] text-emerald-700 mb-1">
                      {selectedMentee.stats.latest_report_date
                        ? new Date(selectedMentee.stats.latest_report_date).toLocaleDateString("id-ID", {
                            day: "numeric", month: "short", year: "numeric"
                          })
                        : "Evaluasi"}
                    </p>
                    <p className="italic leading-relaxed">{selectedMentee.stats.latest_report_note}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
              {selectedMentee.mentee?.phone ? (
                <a
                  href={buildWaLink(selectedMentee.mentee)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <MessageCircle size={14} />
                  <span>Chat WhatsApp Mentee</span>
                </a>
              ) : (
                <span className="text-xs text-gray-400">Nomor WA belum tersedia</span>
              )}

              <button
                onClick={() => setSelectedMentee(null)}
                className="px-4 py-2 text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOfMentees;