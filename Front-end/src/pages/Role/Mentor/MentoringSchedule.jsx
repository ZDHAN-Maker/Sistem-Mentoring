import React, { useState, useEffect } from "react";
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
  ChevronRight
} from "lucide-react";

export default function MentoringSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Kalender Navigation State
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal State
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
    // Generate default waktu mulai (1 jam dari sekarang)
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

  // Navigasi Bulan
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthYearLabel = currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Jadwal Bimbingan Mentoring</h1>
          <p className="text-gray-500 text-sm mt-1">
            Atur agenda bimbingan tatap muka online / offline bersama mentee Anda.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
            title="Refresh Data"
          >
            <RefreshCw size={18} />
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
                <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600">
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

          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
            <p className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b38867]"></span> Hari Ini
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Total Jadwal: {schedules.length}
            </p>
          </div>
        </div>

        {/* Kolom Daftar Agenda Jadwal */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-gray-800">Daftar Agenda Pertemuan</h2>

          {loading ? (
            <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
              <RefreshCw className="animate-spin text-[#b38867] mr-3" size={20} />
              <span>Memuat agenda bimbingan...</span>
            </div>
          ) : schedules.length > 0 ? (
            <div className="space-y-4">
              {schedules.map((sch) => {
                const isCompleted = sch.status === "completed";
                const isCancelled = sch.status === "cancelled";
                return (
                  <div
                    key={sch.id}
                    className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between ${
                      isCompleted ? "border-gray-200 opacity-80" : "border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                              sch.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : sch.status === "ongoing"
                                ? "bg-blue-100 text-blue-700"
                                : sch.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {sch.status}
                          </span>
                          <span className="text-xs font-mono text-gray-400">ID #{sch.id}</span>
                        </div>

                        <h3 className="font-bold text-gray-900 text-base">{sch.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{sch.description || "Tidak ada rincian agenda."}</p>

                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-[#b38867]" />
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
                            <div className="flex items-center gap-1.5 text-blue-600">
                              <Video size={14} />
                              <a href={sch.meeting_link} target="_blank" rel="noreferrer" className="hover:underline font-semibold">
                                Link Pertemuan Video
                              </a>
                            </div>
                          )}

                          {sch.location && (
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <MapPin size={14} />
                              <span>{sch.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Status & Delete */}
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        {sch.status === "planned" && (
                          <button
                            onClick={() => handleUpdateStatus(sch.id, "ongoing")}
                            className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                          >
                            Mulai Sesi
                          </button>
                        )}
                        {sch.status === "ongoing" && (
                          <button
                            onClick={() => handleUpdateStatus(sch.id, "completed")}
                            className="px-2.5 py-1 text-xs font-semibold bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
                          >
                            Selesaikan
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
              <p className="text-sm">Belum ada agenda bimbingan yang dibuat.</p>
              <button
                onClick={openCreateModal}
                className="mt-3 text-xs font-semibold text-[#b38867] hover:underline"
              >
                + Buat Jadwal Pertemuan Pertama
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Tambah Jadwal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
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
    </div>
  );
}
