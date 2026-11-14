import React, { useState, useEffect } from "react";
import api from "../../../axiosInstance";
import { 
  BookOpen, 
  Upload, 
  Plus, 
  Trash2, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  X,
  ExternalLink
} from "lucide-react";

export default function UploadMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "link", // 'video' | 'pdf' | 'link'
    external_url: "",
    status: "published",
    file: null,
  });

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await api.get("/materials");
      setMaterials(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Gagal mengambil materi:", err);
      setFeedback({ type: "error", message: "Gagal memuat daftar materi." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const openCreateModal = () => {
    setFormData({
      title: "",
      description: "",
      type: "link",
      external_url: "",
      status: "published",
      file: null,
    });
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFeedback({ type: "error", message: "Judul materi wajib diisi." });
      return;
    }

    if (formData.type === "link" && !formData.external_url.trim()) {
      setFeedback({ type: "error", message: "Tautan URL wajib diisi untuk tipe Link." });
      return;
    }

    if ((formData.type === "pdf" || formData.type === "video") && !formData.file) {
      setFeedback({ type: "error", message: "File wajib dipilih untuk tipe PDF atau Video." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description || "");
      data.append("type", formData.type);
      data.append("status", formData.status);

      if (formData.type === "link") {
        data.append("external_url", formData.external_url);
      } else if (formData.file) {
        data.append("file", formData.file);
      }

      await api.post("/materials", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setFeedback({ type: "success", message: "Materi berhasil diunggah dan disimpan!" });
      setShowModal(false);
      fetchMaterials();
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal mengunggah materi.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (mat) => {
    if (!window.confirm(`Yakin ingin menghapus materi "${mat.title}"?`)) return;

    try {
      await api.delete(`/materials/${mat.id}`);
      setFeedback({ type: "success", message: "Materi berhasil dihapus." });
      setMaterials((prev) => prev.filter((m) => m.id !== mat.id));
    } catch (err) {
      setFeedback({ type: "error", message: "Gagal menghapus materi." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Materi Pembelajaran</h1>
          <p className="text-gray-500 text-sm mt-1">
            Unggah modul PDF, video rekaman bimbingan, atau tautan referensi belajar untuk mentee Anda.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMaterials}
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
            Upload Materi Baru
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

      {/* Grid Materi */}
      {loading ? (
        <div className="p-16 flex items-center justify-center text-gray-500 bg-white rounded-2xl border border-gray-200">
          <RefreshCw className="animate-spin text-[#b38867] mr-3" size={24} />
          <span>Memuat data materi...</span>
        </div>
      ) : materials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 rounded-xl bg-amber-50 text-[#b38867]">
                    {mat.type === "video" ? <Video size={20} /> : mat.type === "pdf" ? <FileText size={20} /> : <LinkIcon size={20} />}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 capitalize">
                    {mat.status || "published"}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-base">{mat.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-3 leading-relaxed">
                  {mat.description || "Tidak ada rincian deskripsi materi."}
                </p>

                {mat.external_url && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <a
                      href={mat.external_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold truncate"
                    >
                      <ExternalLink size={13} /> {mat.external_url}
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span>Tipe: <strong className="text-gray-700 uppercase">{mat.type}</strong></span>
                <button
                  onClick={() => handleDelete(mat)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Hapus Materi"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-2xl border border-gray-200 text-gray-400">
          <BookOpen size={40} className="mx-auto mb-3 text-gray-300" />
          <h3 className="text-base font-bold text-gray-700">Belum Ada Materi yang Diunggah</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Bagikan modul pembelajaran, slide presentasi, atau link tutorial untuk mendukung proses belajar mentee.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-semibold rounded-xl transition"
          >
            + Upload Materi Pertama
          </button>
        </div>
      )}

      {/* Modal Upload Materi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Upload Materi Mentoring</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Judul Materi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Modul 01 - Pengantar Arsitektur RESTful API"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tipe Materi</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "link", label: "Tautan URL", icon: LinkIcon },
                    { id: "pdf", label: "Dokumen PDF", icon: FileText },
                    { id: "video", label: "File Video", icon: Video },
                  ].map((t) => {
                    const Icon = t.icon;
                    const active = formData.type === t.id;
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setFormData({ ...formData, type: t.id })}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                          active
                            ? "bg-[#b38867] text-white border-[#b38867]"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Icon size={14} />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {formData.type === "link" ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tautan / URL Materi (YouTube / Drive / Figma) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://youtube.com/watch?v=xxx atau https://drive.google.com/..."
                    value={formData.external_url}
                    onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Pilih File ({formData.type.toUpperCase()}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    required
                    accept={formData.type === "pdf" ? ".pdf" : "video/*"}
                    onChange={handleFileChange}
                    className="w-full p-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi Materi</label>
                <textarea
                  rows={3}
                  placeholder="Ringkasan poin-poin yang dipelajari pada materi ini..."
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
                  {submitting ? "Mengunggah..." : "Simpan Materi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
