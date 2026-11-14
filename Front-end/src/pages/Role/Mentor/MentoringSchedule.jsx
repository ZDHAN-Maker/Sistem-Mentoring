import React, { useState, useEffect, useMemo } from "react";
import api from "../../../axiosInstance";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Copy,
  Check,
  FileText,
  UserCheck,
  UserX,
  ExternalLink,
  Filter,
  CheckSquare
} from "lucide-react";

export default function MentoringSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [copiedLink, setCopiedLink] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'planned' | 'ongoing' | 'completed'

  // Kalender Navigation State
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal Create Schedule State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    pairing_id: "",
    title: "",
    description: "",
    location: "Online Video Call",
    meeting_link: "",
    start_time: "",
    end_time: "",
  });

  // Modal Complete Session & Session Notes State
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completingSchedule, setCompletingSchedule] = useState(null);
  const [completeForm, setCompleteForm] = useState({
    attendance_status: "attended",
    session_notes: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schRes, menteeRes] = await Promise.all([
        api.get("/schedules"),
        api.get("/my-mentees")
      ]);

      setSchedules(schRes.data?.data || schRes.data || []);
      setMentees(menteeRes.data?.data || []);
    } catch (err) {
      console.error("Gagal mengambil jadwal:", err);
      setFeedback({ type: "error", message: "Gagal memuat jadwal bimbingan." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    const startStr = now.toISOString().slice(0, 16);

    const end = new Date(now);
    end.setHours(end.getHours() + 1);
    const endStr = end.toISOString().slice(0, 16);

    setFormData({
      pairing_id: mentees.length > 0 ? mentees[0].pairing_id : "",
      title: "",
      description: "",
      location: "Online Video Call",
      meeting_link: "https://meet.google.com/new",
      start_time: startStr,
      end_time: endStr,
    });
    setShowModal(true);
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    if (!formData.pairing_id || !formData.title || !formData.start_time || !formData.end_time) {
      setFeedback({ type: "error", message: "Lengkapi semua data jadwal yang wajib diisi." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      await api.post("/schedules", formData);
      setFeedback({ type: "success", message: "Jadwal bimbingan berhasil dibuat!" });
      setShowModal(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal membuat jadwal bimbingan.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  // Buka Modal Selesaikan Sesi
  const openCompleteModal = (schedule) => {
    setCompletingSchedule(schedule);
    setCompleteForm({
      attendance_status: schedule.attendance_status || "attended",
      session_notes: schedule.session_notes || "",
    });
    setShowCompleteModal(true);
  };

  // Simpan Selesai Sesi & Notulensi
  const handleSaveCompletion = async (e) => {
    e.preventDefault();
    if (!completingSchedule) return;

    setSubmitting(true);
    try {
      await api.patch(`/schedules/${completingSchedule.id}/status`, {
        status: "completed",
        attendance_status: completeForm.attendance_status,
        session_notes: completeForm.session_notes,
      });

      setFeedback({ 
        type: "success", 
        message: `Sesi "${completingSchedule.title}" berhasil diselesaikan dan catatan pertemuan tersimpan!` 
      });
      setShowCompleteModal(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal memperbarui status sesi bimbingan.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (scheduleId, newStatus) => {
    try {
      await api.patch(`/schedules/${scheduleId}/status`, { status: newStatus });
      setFeedback({ type: "success", message: `Status jadwal diubah menjadi ${newStatus}.` });
      fetchData();
    } catch (err) {
      setFeedback({ type: "error", message: "Gagal memperbarui status jadwal." });
    }
  };

  const handleDeleteSchedule = async (schedule) => {
    if (!window.confirm(`Hapus jadwal "${schedule.title}"?`)) return;

    try {
      await api.delete(`/schedules/${schedule.id}`);
      setFeedback({ type: "success", message: "Jadwal berhasil dihapus." });
      setSchedules((prev) => prev.filter((s) => s.id !== schedule.id));
    } catch (err) {
      setFeedback({ type: "error", message: "Gagal menghapus jadwal." });
    }
  };

  // Salin Link Meeting
  const handleCopyLink = (link, id) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Format WA Pengingat Jadwal
  const sendWaReminder = (sch) => {
    const mentee = sch.pairing?.mentee;
    if (!mentee?.phone) {
      alert("Nomor telepon mentee belum terisi di profil.");
      return;
    }

    let phone = mentee.phone.replace(/[^0-9]/g, "");
    if (phone.startsWith("0")) phone = "62" + phone.slice(1);

    const dateStr = sch.start_time
      ? new Date(sch.start_time).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        })
      : "hari ini";

    const timeStr = sch.start_time
      ? new Date(sch.start_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      : "";

    const msg = encodeURIComponent(
      `Halo ${mentee.name || "Mentee"}, mengingatkan sesi mentoring kita:\n\n*Topik:* ${sch.title}\n*Waktu:* ${dateStr}, pukul ${timeStr} WIB\n*Link Meeting:* ${sch.meeting_link || "Akan diinfokan segera"}\n\nSilakan bersiap sebelum waktu sesi dimulai. Sampai jumpa!`
    );

    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  // Navigasi Bulan
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthYearLabel = currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    if (statusFilter === "all") return schedules;
    if (statusFilter === "planned") return schedules.filter((s) => s.status === "planned" || s.status === "scheduled");
    if (statusFilter === "ongoing") return schedules.filter((s) => s.status === "ongoing");
    if (statusFilter === "completed") return schedules.filter((s) => s.status === "completed");
    if (statusFilter === "cancelled") return schedules.filter((s) => s.status === "cancelled" || s.status === "canceled");
    return schedules;
  }, [schedules, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Jadwal Bimbingan Mentoring</h1>
          <p className="text-gray-500 text-sm mt-1">
            Atur agenda bimbingan online/offline, kirim pengingat WhatsApp, dan catat notulensi sesi bimbingan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-[#b38867]" : ""} />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-sm font-semibold rounded-xl shadow-sm transition"
          >
            <Plus size={18} />
            Buat Jadwal Baru
          </button>
        </div>
      </div>

      {/* Alert Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Grid: Kalender Navigasi & Daftar Jadwal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kalender Ringkas */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 capitalize text-sm">{monthYearLabel}</h3>
              <div className="flex items-center gap-1">
                <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-400 mb-2">
              <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();
                return (
                  <div
                    key={i}
                    className={`h-8 flex items-center justify-center rounded-lg transition ${
                      isToday ? "bg-[#b38867] text-white font-bold" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1.5">
            <p className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b38867]"></span> Hari Ini
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Total Jadwal: {schedules.length}
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Sesi Selesai: {schedules.filter(s => s.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Kolom Daftar Agenda Jadwal */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header & Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800">Daftar Agenda Pertemuan</h2>
            <div className="inline-flex p-1 bg-gray-100 rounded-xl text-xs font-medium">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === "all" ? "bg-white text-gray-900 font-bold shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Semua ({schedules.length})
              </button>
              <button
                onClick={() => setStatusFilter("planned")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === "planned" ? "bg-white text-blue-700 font-bold shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Mendatang ({schedules.filter((s) => s.status === "planned" || s.status === "scheduled").length})
              </button>
              <button
                onClick={() => setStatusFilter("completed")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === "completed" ? "bg-white text-emerald-700 font-bold shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Selesai ({schedules.filter((s) => s.status === "completed").length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
              <RefreshCw className="animate-spin text-[#b38867] mr-3" size={20} />
              <span>Memuat agenda bimbingan...</span>
            </div>
          ) : filteredSchedules.length > 0 ? (
            <div className="space-y-4">
              {filteredSchedules.map((sch) => {
                const isCompleted = sch.status === "completed";
                const isOngoing = sch.status === "ongoing";
                const mentee = sch.pairing?.mentee;

                return (
                  <div
                    key={sch.id}
                    className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between ${
                      isCompleted ? "border-emerald-100 bg-emerald-50/10" : "border-gray-200"
                    }`}
                  >
                    <div>
                      {/* Top Bar Card */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                              isCompleted
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : isOngoing
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : sch.status === "cancelled" || sch.status === "canceled"
                                ? "bg-rose-100 text-rose-700 border border-rose-200"
                                : "bg-amber-100 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {sch.status === "planned" ? "Dijadwalkan" : sch.status === "completed" ? "Selesai" : sch.status}
                          </span>
                          <span className="text-xs font-mono text-gray-400">ID #{sch.id}</span>
                        </div>

                        {/* Nama Mentee Tag */}
                        {mentee?.name && (
                          <span className="text-xs font-semibold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#b38867]"></span>
                            Mentee: {mentee.name}
                          </span>
                        )}
                      </div>

                      {/* Judul & Deskripsi */}
                      <h3 className="font-bold text-gray-900 text-base">{sch.title}</h3>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {sch.description || "Tidak ada rincian agenda."}
                      </p>

                      {/* Info Waktu & Meeting */}
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                          <Clock size={13} className="text-[#b38867]" />
                          <span>
                            {sch.start_time
                              ? new Date(sch.start_time).toLocaleString("id-ID", {
                                  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                                })
                              : "-"}
                            {" s/d "}
                            {sch.end_time
                              ? new Date(sch.end_time).toLocaleTimeString("id-ID", {
                                  hour: "2-digit", minute: "2-digit"
                                })
                              : "-"}
                          </span>
                        </div>

                        {sch.meeting_link && (
                          <div className="flex items-center gap-1.5">
                            <a
                              href={sch.meeting_link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg border border-blue-200 font-semibold transition"
                            >
                              <Video size={13} />
                              <span>Masuk Room Meeting</span>
                              <ExternalLink size={11} />
                            </a>
                            <button
                              onClick={() => handleCopyLink(sch.meeting_link, sch.id)}
                              title="Salin Link Meeting"
                              className="p-1 text-gray-400 hover:text-gray-700"
                            >
                              {copiedLink === sch.id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                            </button>
                          </div>
                        )}

                        {sch.location && sch.location !== "Online Video Call" && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <MapPin size={13} />
                            <span>{sch.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Catatan Sesi & Notulensi Jika Selesai */}
                      {isCompleted && (
                        <div className="mt-4 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                              <FileText size={13} className="text-emerald-700" />
                              Notulensi & Catatan Sesi Mentoring:
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-emerald-100 text-emerald-800">
                              {sch.attendance_status === "absent" ? "Mentee Absen" : "Mentee Hadir"}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed italic">
                            {sch.session_notes || "Belum ada catatan notulensi untuk sesi ini."}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 mt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Tombol Kirim Pengingat WhatsApp ke Mentee */}
                        {!isCompleted && (
                          <button
                            onClick={() => sendWaReminder(sch)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 rounded-xl transition shadow-2xs"
                            title="Kirim pesan pengingat jadwal langsung ke WA Mentee"
                          >
                            <MessageCircle size={13} />
                            <span>Kirim Pengingat WA</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Mulai Sesi */}
                        {(sch.status === "planned" || sch.status === "scheduled") && (
                          <button
                            onClick={() => handleUpdateStatus(sch.id, "ongoing")}
                            className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 rounded-xl transition"
                          >
                            Mulai Sesi
                          </button>
                        )}

                        {/* Selesaikan Sesi & Tulis Notulensi */}
                        {(sch.status === "planned" || sch.status === "ongoing" || sch.status === "scheduled") && (
                          <button
                            onClick={() => openCompleteModal(sch)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-[#b38867] hover:bg-[#a27355] text-white rounded-xl transition shadow-sm"
                          >
                            <CheckSquare size={13} />
                            <span>Selesaikan Sesi</span>
                          </button>
                        )}

                        {/* Edit Catatan jika sudah selesai */}
                        {isCompleted && (
                          <button
                            onClick={() => openCompleteModal(sch)}
                            className="px-2.5 py-1 text-xs font-semibold bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-xl transition"
                          >
                            Edit Notulensi
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteSchedule(sch)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus Jadwal"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 text-gray-400">
              <CalendarIcon size={36} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-semibold text-gray-600">Tidak ada jadwal bimbingan.</p>
              <button
                onClick={openCreateModal}
                className="mt-3 text-xs font-semibold text-[#b38867] hover:underline"
              >
                + Buat Jadwal Pertemuan Baru
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Tambah Jadwal Baru */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Buat Jadwal Bimbingan Baru</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Pilih Mentee Bimbingan <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.pairing_id}
                  onChange={(e) => setFormData({ ...formData, pairing_id: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                >
                  <option value="">-- Pilih Mentee --</option>
                  {mentees.map((m) => (
                    <option key={m.pairing_id} value={m.pairing_id}>
                      {m.mentee?.name} ({m.mentee?.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Topik / Judul Pertemuan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Review Progres UI Figma & Sesi QnA"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Waktu Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full p-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Waktu Selesai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full p-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Link Meeting (Google Meet / Zoom URL)
                </label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  value={formData.meeting_link}
                  onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Catatan / Deskripsi Agenda
                </label>
                <textarea
                  rows={3}
                  placeholder="Persiapan sebelum sesi: siapkan pertanyaan dan link repo/figma..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#b38867] hover:bg-[#a27355] rounded-xl transition disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Jadwal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Selesaikan Sesi & Tulis Notulensi */}
      {showCompleteModal && completingSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <CheckSquare size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-800">Selesaikan Sesi Bimbingan</h2>
                  <p className="text-xs text-gray-400">ID Pertemuan #{completingSchedule.id}</p>
                </div>
              </div>
              <button onClick={() => setShowCompleteModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCompletion} className="p-6 space-y-4">
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs space-y-1">
                <p className="font-bold text-gray-800">{completingSchedule.title}</p>
                <p className="text-gray-500">
                  Mentee: {completingSchedule.pairing?.mentee?.name || "Mentee"}
                </p>
              </div>

              {/* Status Kehadiran Mentee */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Kehadiran Mentee
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer text-xs font-semibold transition ${
                      completeForm.attendance_status === "attended"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="attendance"
                      value="attended"
                      checked={completeForm.attendance_status === "attended"}
                      onChange={() => setCompleteForm({ ...completeForm, attendance_status: "attended" })}
                      className="text-[#b38867]"
                    />
                    <UserCheck size={16} className="text-emerald-600" />
                    <span>Mentee Hadir</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer text-xs font-semibold transition ${
                      completeForm.attendance_status === "absent"
                        ? "bg-rose-50 border-rose-300 text-rose-800"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="attendance"
                      value="absent"
                      checked={completeForm.attendance_status === "absent"}
                      onChange={() => setCompleteForm({ ...completeForm, attendance_status: "absent" })}
                      className="text-[#b38867]"
                    />
                    <UserX size={16} className="text-rose-600" />
                    <span>Mentee Tidak Hadir / Izin</span>
                  </label>
                </div>
              </div>

              {/* Catatan Sesi / Notulensi */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Catatan Pertemuan & Notulensi Sesi <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan pokok bahasan hari ini, kemajuan mentee, materi yang telah dipelajari, serta PR / penugasan untuk sesi berikutnya..."
                  value={completeForm.session_notes}
                  onChange={(e) => setCompleteForm({ ...completeForm, session_notes: e.target.value })}
                  className="w-full p-3 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none leading-relaxed resize-none"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Catatan ini akan tersimpan di riwayat bimbingan mentee untuk bahan evaluasi bersama.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCompleteModal(false)}
                  className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <CheckSquare size={14} />
                  <span>{submitting ? "Menyimpan..." : "Tandai Selesai & Simpan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}