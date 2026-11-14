import React, { useState, useEffect } from "react";
import api from "../../../axiosInstance";
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
  Clock
} from "lucide-react";

export default function GiveTask() {
  const [tasks, setTasks] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    pairing_id: "",
    title: "",
    description: "",
    due_date: "",
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

  const openCreateModal = () => {
    setEditingTask(null);
    setFormData({
      pairing_id: mentees.length > 0 ? mentees[0].pairing_id : "",
      title: "",
      description: "",
      due_date: "",
      status: "published"
    });
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      pairing_id: task.pairing_id,
      title: task.title,
      description: task.description || "",
      due_date: task.due_date ? task.due_date.substring(0, 10) : "",
      status: task.status || "published"
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pairing_id || !formData.title.trim()) {
      setFeedback({ type: "error", message: "Pilih mentee dan isi judul tugas." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, formData);
        setFeedback({ type: "success", message: "Tugas berhasil diperbarui!" });
      } else {
        await api.post("/tasks", formData);
        setFeedback({ type: "success", message: "Tugas baru berhasil diberikan kepada mentee!" });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen & Pemberian Tugas</h1>
          <p className="text-gray-500 text-sm mt-1">
            Buat tugas bimbingan, tetapkan tenggat waktu, dan pantau pengumpulan dari mentee Anda.
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
            Beri Tugas Baru
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

      {/* Grid Tugas */}
      {loading ? (
        <div className="p-16 flex items-center justify-center text-gray-500 bg-white rounded-2xl border border-gray-200">
          <RefreshCw className="animate-spin text-[#b38867] mr-3" size={24} />
          <span>Memuat data tugas...</span>
        </div>
      ) : tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      task.status === "published"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {task.status === "published" ? "Diterbitkan" : "Draft"}
                  </span>
                  <span className="text-xs font-mono text-gray-400">ID #{task.id}</span>
                </div>

                <h3 className="font-bold text-gray-900 text-base line-clamp-2">{task.title}</h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                  {task.description || "Tidak ada rincian deskripsi tugas."}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-[#b38867]" />
                    <span>Mentee: <strong className="text-gray-800">{task.pairing?.mentee?.name || "Mentee"}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-rose-500" />
                    <span>
                      Tenggat:{" "}
                      <strong className="text-gray-800">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString("id-ID") : "Tidak ditentukan"}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(task)}
                  className="p-2 text-gray-600 hover:text-[#b38867] hover:bg-[#b38867]/10 rounded-xl transition"
                  title="Ubah Tugas"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(task)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                  title="Hapus Tugas"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-2xl border border-gray-200 text-gray-400">
          <FileText size={40} className="mx-auto mb-3 text-gray-300" />
          <h3 className="text-base font-bold text-gray-700">Belum Ada Tugas yang Diberikan</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Berikan latihan, studi kasus, atau tugas proyek kepada mentee untuk memantau pemahaman mereka.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-semibold rounded-xl transition"
          >
            + Buat Tugas Pertama
          </button>
        </div>
      )}

      {/* Modal Form Tambah/Edit Tugas */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                {editingTask ? "Ubah Tugas Mentoring" : "Beri Tugas Baru ke Mentee"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Pilih Mentee / Pairing */}
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
                {mentees.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">Anda belum memiliki mentee bimbingan aktif.</p>
                )}
              </div>

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

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Instruksi & Rincian Tugas
                </label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan petunjuk pengerjaan, format pengumpulan (link figma / github / dokumen), dan kriteria penilaian..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none resize-none"
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
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Status Publikasi
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
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
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#b38867] hover:bg-[#a27355] rounded-xl transition disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Tugas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
