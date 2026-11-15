import React, { useState, useEffect, useMemo } from "react";
import api from "../../../axiosInstance";
import PlanBadgeIcon from "../../../components/PlanBadgeIcon";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  X, 
  Users, 
  Clock, 
  Search, 
  Filter, 
  CheckSquare, 
  Square, 
  Send, 
  UserCheck, 
  Sparkles, 
  ChevronRight,
  BookOpen
} from "lucide-react";

export default function GiveTask() {
  const [tasks, setTasks] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'published' | 'draft'
  const [menteeFilter, setMenteeFilter] = useState("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Target Mode: 'all' (Semua Mentee) | 'custom' (Pilih Beberapa Mentee) | 'single' (Satu Mentee)
  const [targetMode, setTargetMode] = useState("all");
  const [selectedPairingIds, setSelectedPairingIds] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    type: "file",
    status: "published" // 'published' | 'draft'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [taskRes, menteeRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/my-mentees")
      ]);

      setTasks(taskRes.data?.data || []);
      setMentees(menteeRes.data?.data || []);
    } catch (err) {
      console.error("Gagal mengambil data tugas/mentee:", err);
      setFeedback({ type: "error", message: "Gagal memuat data tugas." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Buka Modal Buat Tugas Baru
  const openCreateModal = () => {
    setEditingTask(null);
    setTargetMode("all");
    // Default pilih semua pairing ID mentee yang tersedia
    const allIds = mentees.map((m) => m.pairing_id);
    setSelectedPairingIds(allIds);

    setFormData({
      title: "",
      description: "",
      due_date: "",
      type: "file",
      status: "published"
    });
    setShowModal(true);
  };

  // Buka Modal Edit Tugas
  const openEditModal = (task) => {
    setEditingTask(task);
    setTargetMode("single");
    setSelectedPairingIds([task.pairing_id]);

    setFormData({
      title: task.title,
      description: task.description || "",
      due_date: task.due_date ? task.due_date.substring(0, 10) : "",
      type: task.type || "file",
      status: task.status || "published"
    });
    setShowModal(true);
  };

  // Toggle checklist pairing id
  const handleTogglePairing = (pairingId) => {
    if (selectedPairingIds.includes(pairingId)) {
      setSelectedPairingIds(selectedPairingIds.filter((id) => id !== pairingId));
    } else {
      setSelectedPairingIds([...selectedPairingIds, pairingId]);
    }
  };

  // Pilih Semua Mentee
  const handleSelectAllMentees = () => {
    const allIds = mentees.map((m) => m.pairing_id);
    setSelectedPairingIds(allIds);
  };

  // Kosongkan Pilihan
  const handleDeselectAllMentees = () => {
    setSelectedPairingIds([]);
  };

  // Submit Penugasan
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setFeedback({ type: "error", message: "Judul tugas wajib diisi." });
      return;
    }

    if (selectedPairingIds.length === 0) {
      setFeedback({ type: "error", message: "Pilih minimal satu mentee untuk ditugaskan." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      if (editingTask) {
        // Edit tugas tunggal
        await api.put(`/tasks/${editingTask.id}`, {
          pairing_id: selectedPairingIds[0],
          ...formData
        });
        setFeedback({ type: "success", message: "Tugas berhasil diperbarui!" });
      } else {
        // Buat tugas (bisa satu atau banyak mentee sekaligus)
        const payload = {
          pairing_ids: selectedPairingIds,
          ...formData
        };

        const res = await api.post("/tasks", payload);
        const count = selectedPairingIds.length;
        setFeedback({ 
          type: "success", 
          message: count > 1
            ? `Berhasil! Tugas "${formData.title}" telah dibagikan sekaligus kepada ${count} mentee bimbingan.`
            : `Berhasil! Tugas "${formData.title}" telah ditugaskan ke mentee.`
        });
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menyimpan tugas.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Yakin ingin menghapus tugas "${task.title}"?`)) return;

    try {
      await api.delete(`/tasks/${task.id}`);
      setFeedback({ type: "success", message: `Tugas "${task.title}" berhasil dihapus.` });
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (err) {
      setFeedback({ 
        type: "error", 
        message: err.response?.data?.message || "Gagal menghapus tugas." 
      });
    }
  };

  // Filter Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const menteeName = task.pairing?.mentee?.name || "";
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        menteeName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : task.status === statusFilter;

      const matchesMentee =
        menteeFilter === "all" ? true : String(task.pairing_id) === String(menteeFilter);

      return matchesSearch && matchesStatus && matchesMentee;
    });
  }, [tasks, searchQuery, statusFilter, menteeFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen & Pembagian Tugas Mentee</h1>
          <p className="text-gray-500 text-sm mt-1">
            Bagikan materi tugas, studi kasus, atau latihan secara langsung ke satu mentee atau sekaligus ke beberapa mentee bimbingan.
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
            <span>Beri Tugas Baru</span>
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

      {/* KPI Cards Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Tugas Terbit</p>
            <p className="text-2xl font-extrabold text-gray-800 mt-1">{tasks.length}</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <FileText size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Diterbitkan</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">
              {tasks.filter((t) => t.status === "published").length}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mentee Bimbingan</p>
            <p className="text-2xl font-extrabold text-[#b38867] mt-1">{mentees.length}</p>
          </div>
          <div className="p-3 bg-amber-50 text-[#b38867] rounded-xl">
            <Users size={20} />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari judul tugas atau nama mentee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Filter Berdasarkan Mentee */}
          <select
            value={menteeFilter}
            onChange={(e) => setMenteeFilter(e.target.value)}
            className="p-2 text-xs border border-gray-200 rounded-xl bg-white text-gray-700 outline-none focus:ring-1 focus:ring-[#b38867]"
          >
            <option value="all">Semua Mentee ({tasks.length})</option>
            {mentees.map((m) => (
              <option key={m.pairing_id} value={m.pairing_id}>
                Mentee: {m.mentee?.name}
              </option>
            ))}
          </select>

          {/* Filter Status */}
          <div className="inline-flex p-1 bg-gray-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === "all" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setStatusFilter("published")}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === "published" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Diterbitkan
            </button>
            <button
              onClick={() => setStatusFilter("draft")}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === "draft" ? "bg-white text-amber-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Draft
            </button>
          </div>
        </div>
      </div>

      {/* Grid Daftar Tugas */}
      {loading ? (
        <div className="p-16 flex items-center justify-center text-gray-500 bg-white rounded-2xl border border-gray-200">
          <RefreshCw className="animate-spin text-[#b38867] mr-3" size={24} />
          <span>Memuat data tugas...</span>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => {
            const isPublished = task.status === "published";
            const isOverdue = task.due_date && new Date(task.due_date) < new Date();

            return (
              <div
                key={task.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isPublished
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-amber-100 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {isPublished ? "Diterbitkan" : "Draft"}
                    </span>
                    <span className="text-xs font-mono text-gray-400">ID #{task.id}</span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base line-clamp-2">{task.title}</h3>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                    {task.description || "Tidak ada instruksi khusus."}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs">
                    {/* Info Mentee Penerima Tugas */}
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-7 h-7 rounded-full bg-[#b38867]/20 text-[#b38867] font-bold text-xs flex items-center justify-center shrink-0">
                        {task.pairing?.mentee?.name ? task.pairing.mentee.name.charAt(0) : "M"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-800 text-xs truncate">
                          {task.pairing?.mentee?.name || "Mentee"}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">{task.pairing?.mentee?.email}</p>
                      </div>
                    </div>

                    {/* Info Tenggat Waktu */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={13} className={isOverdue ? "text-rose-500" : "text-[#b38867]"} />
                        <span>Tenggat:</span>
                      </span>
                      <span className={`font-semibold ${isOverdue ? "text-rose-600 font-bold" : "text-gray-800"}`}>
                        {task.due_date ? new Date(task.due_date).toLocaleDateString("id-ID", {
                          day: "numeric", month: "short", year: "numeric"
                        }) : "Fleksibel"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(task)}
                    className="p-2 text-gray-600 hover:text-[#b38867] hover:bg-amber-50 rounded-xl transition"
                    title="Ubah Rincian Tugas"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(task)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Hapus Tugas"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-2xl border border-gray-200 text-gray-400">
          <FileText size={40} className="mx-auto mb-3 text-gray-300" />
          <h3 className="text-base font-bold text-gray-700">
            {searchQuery ? "Tidak Ditemukan Tugas yang Cocok" : "Belum Ada Tugas yang Diberikan"}
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `Tidak ada tugas dengan kata kunci "${searchQuery}". Coba kata kunci lain.`
              : "Berikan latihan, studi kasus, atau tugas proyek kepada mentee secara individual atau sekaligus ke beberapa mentee."}
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-semibold rounded-xl transition"
          >
            + Buat Tugas Pertama
          </button>
        </div>
      )}

      {/* Modal Form Tambah/Edit Tugas dengan Pilihan Group / Multi-Select Mentee */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-gray-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-50/50 to-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#b38867]/20 text-[#b38867] rounded-xl">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-800">
                    {editingTask ? "Ubah Tugas Mentoring" : "Beri Tugas Baru ke Mentee"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {editingTask 
                      ? `Mengubah rincian tugas ID #${editingTask.id}` 
                      : "Pilih satu mentee atau langsung bagikan sekaligus ke banyak mentee"}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* BAGIAN TARGET PENERIMA TUGAS (GROUP / MULTI-SELECT MENTEE) */}
              {!editingTask ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Users size={14} className="text-[#b38867]" />
                      <span>Target Penerima Tugas</span>
                      <span className="text-red-500">*</span>
                    </label>

                    {/* Tombol Pilih Semua / Kosongkan */}
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={handleSelectAllMentees}
                        className="text-[#b38867] hover:underline font-semibold"
                      >
                        Pilih Semua ({mentees.length})
                      </button>
                      <span className="text-gray-300">•</span>
                      <button
                        type="button"
                        onClick={handleDeselectAllMentees}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        Hapus Pilihan
                      </button>
                    </div>
                  </div>

                  {/* Checklist Card Mentee */}
                  <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 rounded-xl p-2.5 bg-gray-50/50">
                    {mentees.length > 0 ? (
                      mentees.map((m) => {
                        const isSelected = selectedPairingIds.includes(m.pairing_id);
                        return (
                          <div
                            key={m.pairing_id}
                            onClick={() => handleTogglePairing(m.pairing_id)}
                            className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? "bg-amber-50/70 border-amber-300 shadow-2xs"
                                : "bg-white border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`p-1 rounded-md transition ${isSelected ? "text-[#b38867]" : "text-gray-400"}`}>
                                {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                              </div>

                              <div className="w-7 h-7 rounded-full bg-[#b38867]/20 text-[#b38867] font-bold text-xs flex items-center justify-center shrink-0">
                                {m.mentee?.name ? m.mentee.name.charAt(0) : "M"}
                              </div>

                              <div className="min-w-0">
                                <p className="font-bold text-gray-800 text-xs truncate">
                                  {m.mentee?.name || "Mentee"}
                                </p>
                                <p className="text-[11px] text-gray-400 truncate">{m.mentee?.email}</p>
                              </div>
                            </div>

                            <div className="shrink-0 text-right">
                              <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md border border-gray-200">
                                {m.subscription_name}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-amber-700 p-2 text-center">
                        Belum ada mentee bimbingan aktif.
                      </p>
                    )}
                  </div>

                  {/* Keterangan Counter Mentee Terpilih */}
                  <div className="flex items-center justify-between text-xs bg-amber-50 text-amber-900 p-2.5 rounded-xl border border-amber-200 font-medium">
                    <span className="flex items-center gap-1.5">
                      <UserCheck size={14} className="text-[#b38867]" />
                      <span>Mentee yang akan menerima tugas ini:</span>
                    </span>
                    <span className="font-bold bg-white px-2 py-0.5 rounded-md border border-amber-300">
                      {selectedPairingIds.length} dari {mentees.length} Mentee
                    </span>
                  </div>
                </div>
              ) : (
                /* Jika Sedang Edit Tugas: Tampilkan Mentee Pemilik */
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-gray-800">Target Mentee:</p>
                  <p className="text-gray-600">
                    {editingTask.pairing?.mentee?.name} ({editingTask.pairing?.mentee?.email})
                  </p>
                </div>
              )}

              {/* Judul Tugas */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Judul Tugas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Latihan Pembuatan Wireframe & User Flow"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                />
              </div>

              {/* Deskripsi & Instruksi */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Instruksi & Rincian Tugas
                </label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan petunjuk pengerjaan, format pengumpulan (link figma / github / file dokumen), serta kriteria penilaian..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Due Date & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tenggat Waktu (Deadline)
                  </label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Status Publikasi
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                  >
                    <option value="published">Langsung Terbitkan</option>
                    <option value="draft">Simpan sebagai Draft</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
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
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#b38867] hover:bg-[#a27355] rounded-xl transition disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  <Send size={13} />
                  <span>
                    {submitting 
                      ? "Menyimpan..." 
                      : editingTask 
                      ? "Simpan Perubahan" 
                      : `Bagikan Tugas (${selectedPairingIds.length} Mentee)`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}