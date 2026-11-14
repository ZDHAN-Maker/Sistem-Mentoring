import React, { useState, useEffect } from "react";
import api from "../../../axiosInstance";
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  X,
  UserCheck
} from "lucide-react";

const LearningActivities = () => {
  const [activities, setActivities] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });

  // Modal Sync Mentor Expertise
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState("");
  const [selectedActivityIds, setSelectedActivityIds] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [actRes, mentorRes] = await Promise.all([
        api.get("/learning-activities"),
        api.get("/mentors")
      ]);
      setActivities(actRes.data.data || []);
      setMentors(mentorRes.data || []);
    } catch (err) {
      console.error("Gagal mengambil data keahlian:", err);
      setFeedback({ type: "error", message: "Gagal memuat master bidang keahlian." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ title: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({ title: item.title, description: item.description || "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFeedback({ type: "error", message: "Judul keahlian wajib diisi." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      if (editingItem) {
        await api.put(`/learning-activities/${editingItem.id}`, formData);
        setFeedback({ type: "success", message: "Bidang keahlian berhasil diperbarui." });
      } else {
        await api.post("/learning-activities", formData);
        setFeedback({ type: "success", message: "Bidang keahlian baru berhasil ditambahkan." });
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menyimpan bidang keahlian.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus keahlian "${title}"?`)) return;

    try {
      await api.delete(`/learning-activities/${id}`);
      setFeedback({ type: "success", message: `Keahlian "${title}" berhasil dihapus.` });
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setFeedback({ 
        type: "error", 
        message: err.response?.data?.message || "Gagal menghapus bidang keahlian." 
      });
    }
  };

  // Handler buka modal penetapan keahlian ke mentor
  const openAssignMentorModal = (mentor) => {
    setSelectedMentorId(mentor.id);
    const existingIds = mentor.learning_activities?.map((a) => a.id) || [];
    setSelectedActivityIds(existingIds);
    setShowMentorModal(true);
  };

  const handleSyncMentorActivities = async (e) => {
    e.preventDefault();
    if (!selectedMentorId) return;

    setSubmitting(true);
    try {
      await api.post(`/mentors/${selectedMentorId}/learning-activities`, {
        learning_activity_ids: selectedActivityIds
      });
      setFeedback({ type: "success", message: "Keahlian mentor berhasil disinkronkan!" });
      setShowMentorModal(false);
      fetchData();
    } catch (err) {
      setFeedback({ 
        type: "error", 
        message: err.response?.data?.message || "Gagal menyinkronkan keahlian mentor." 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Master Data Bidang Keahlian</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola kurikulum dan keahlian mentoring (Learning Activities) untuk para mentor dan mentee.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-sm font-semibold rounded-xl shadow-sm transition"
          >
            <Plus size={18} />
            Tambah Keahlian
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

      {/* Grid Kartu Keahlian */}
      {loading ? (
        <div className="p-12 flex items-center justify-center text-gray-500 bg-white rounded-2xl border border-gray-200">
          <RefreshCw className="animate-spin text-[#b38867] mr-3" size={20} />
          <span>Memuat bidang keahlian...</span>
        </div>
      ) : activities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activities.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-[#b38867]/10 text-[#b38867] rounded-xl">
                    <BookOpen size={20} />
                  </div>
                  <span className="text-xs font-mono text-gray-400">ID #{item.id}</span>
                </div>
                <h3 className="font-bold text-gray-800 text-base">{item.title}</h3>
                <p className="text-gray-500 text-xs mt-1.5 line-clamp-3 leading-relaxed">
                  {item.description || "Tidak ada deskripsi rinci untuk keahlian ini."}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID") : ""}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-gray-500 hover:text-[#b38867] hover:bg-[#b38867]/10 rounded-lg transition"
                    title="Ubah"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 text-gray-400">
          <BookOpen size={36} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Belum ada bidang keahlian terdaftar.</p>
          <button
            onClick={openCreateModal}
            className="mt-3 text-xs font-semibold text-[#b38867] hover:underline"
          >
            + Tambah Bidang Keahlian Pertama
          </button>
        </div>
      )}

      {/* Seksi Penetapan Keahlian Mentor */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mt-8">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Penetapan Keahlian Mentor</h2>
        <p className="text-xs text-gray-500 mb-4">
          Hubungkan bidang keahlian di atas dengan Mentor terdaftar di sistem.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mentors.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-gray-800 text-sm">{m.name}</p>
                <p className="text-xs text-gray-400">{m.email}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {m.learning_activities?.length > 0 ? (
                    m.learning_activities.map((a) => (
                      <span key={a.id} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded-full">
                        {a.title}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-gray-400 italic">Belum ada keahlian dipilih</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => openAssignMentorModal(m)}
                className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 transition"
              >
                Atur Keahlian
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Tambah/Edit Keahlian */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                {editingItem ? "Ubah Bidang Keahlian" : "Tambah Bidang Keahlian"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Keahlian / Topik <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Full-Stack Web Development"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] focus:border-[#b38867] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={4}
                  placeholder="Jelaskan ruang lingkup materi pembelajaran dan keahlian ini..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] focus:border-[#b38867] outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#b38867] hover:bg-[#a27355] rounded-xl transition disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Keahlian"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Sinkronisasi Keahlian Mentor */}
      {showMentorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Pilih Keahlian untuk Mentor</h2>
              <button onClick={() => setShowMentorModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSyncMentorActivities} className="p-6 space-y-4">
              <p className="text-xs text-gray-500">
                Centang bidang keahlian yang dikuasai oleh mentor ini:
              </p>

              <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-200 rounded-xl p-3">
                {activities.map((act) => {
                  const checked = selectedActivityIds.includes(act.id);
                  return (
                    <label
                      key={act.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedActivityIds([...selectedActivityIds, act.id]);
                          } else {
                            setSelectedActivityIds(selectedActivityIds.filter((id) => id !== act.id));
                          }
                        }}
                        className="rounded text-[#b38867] focus:ring-[#b38867] h-4 w-4"
                      />
                      <span className="font-medium text-gray-700">{act.title}</span>
                    </label>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowMentorModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#b38867] hover:bg-[#a27355] rounded-xl transition disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningActivities;
