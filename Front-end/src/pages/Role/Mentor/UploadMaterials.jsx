import React, { useState, useEffect, useMemo } from "react";
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
  ExternalLink,
  Play,
  Eye,
  Users,
  User,
  CheckSquare,
  Square,
  Search,
  Filter,
  Sparkles,
  Download,
  Calendar,
  ArrowRight,
  Globe,
  Radio,
  FileCheck,
  Maximize2
} from "lucide-react";

export default function UploadMaterials() {
  const [materials, setMaterials] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // 'all' | 'video' | 'pdf' | 'link'
  const [targetFilter, setTargetFilter] = useState("all"); // 'all' | 'general' | 'specific'

  // Modal Upload Materi State
  const [showModal, setShowModal] = useState(false);
  const [targetMode, setTargetMode] = useState("all"); // 'all' (Semua Mentee) | 'custom' (Multi Mentee) | 'single' (1 Mentee)
  const [selectedPairingId, setSelectedPairingId] = useState("");
  const [selectedPairingIds, setSelectedPairingIds] = useState([]);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "video", // 'video' | 'pdf' | 'link'
    external_url: "",
    status: "published",
    file: null,
  });

  // Modal In-App Preview (File PDF / Video / YouTube Player)
  const [previewMaterial, setPreviewMaterial] = useState(null);

  // Ambil Data Materi & Daftar Mentee
  const fetchData = async () => {
    setLoading(true);
    try {
      const [matRes, menteeRes] = await Promise.all([
        api.get("/materials"),
        api.get("/my-mentees")
      ]);
      setMaterials(matRes.data?.data || matRes.data || []);
      setMentees(menteeRes.data?.data || []);
    } catch (err) {
      console.error("Gagal mengambil data materi/mentee:", err);
      setFeedback({ type: "error", message: "Gagal memuat daftar materi pembelajaran." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Cleanup object URL preview saat component unmount atau form direset
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  // Helper Ekstraksi Embed YouTube
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1` : null;
  };

  // Helper Path File Backend
  const getBackendFileUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `http://localhost:8000/${cleanPath.startsWith("storage/") ? cleanPath : `storage/${cleanPath}`}`;
  };

  // Buka Modal Tambah Materi
  const openCreateModal = () => {
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }

    setTargetMode("all");
    setSelectedPairingId(mentees.length > 0 ? mentees[0].pairing_id : "");
    setSelectedPairingIds(mentees.map((m) => m.pairing_id));

    setFormData({
      title: "",
      description: "",
      type: "video",
      external_url: "",
      status: "published",
      file: null,
    });
    setShowModal(true);
  };

  // Handler Pilih File
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFormData((prev) => ({ ...prev, file: selected }));

      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }

      if (formData.type === "video" || selected.type.startsWith("video/")) {
        setFilePreviewUrl(URL.createObjectURL(selected));
      } else {
        setFilePreviewUrl(null);
      }
    }
  };

  // Handler Toggle Checklist Mentee (Multi Target)
  const handleTogglePairing = (pairingId) => {
    setSelectedPairingIds((prev) =>
      prev.includes(pairingId)
        ? prev.filter((id) => id !== pairingId)
        : [...prev, pairingId]
    );
  };

  const handleSelectAllMentees = () => {
    setSelectedPairingIds(mentees.map((m) => m.pairing_id));
  };

  const handleDeselectAllMentees = () => {
    setSelectedPairingIds([]);
  };

  // Submit Materi Baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFeedback({ type: "error", message: "Judul materi wajib diisi." });
      return;
    }

    // Validasi input file vs URL
    if (formData.type === "link" && !formData.external_url.trim()) {
      setFeedback({ type: "error", message: "Tautan URL wajib diisi untuk materi tipe Tautan." });
      return;
    }

    if (formData.type === "pdf" && !formData.file && !formData.external_url.trim()) {
      setFeedback({ type: "error", message: "Silakan unggah dokumen PDF materi." });
      return;
    }

    if (formData.type === "video" && !formData.file && !formData.external_url.trim()) {
      setFeedback({ type: "error", message: "Silakan unggah berkas video (MP4) atau masukkan tautan video (YouTube)." });
      return;
    }

    // Validasi Target Mentee
    if (targetMode === "single" && !selectedPairingId) {
      setFeedback({ type: "error", message: "Pilih mentee penerima materi." });
      return;
    }

    if (targetMode === "custom" && selectedPairingIds.length === 0) {
      setFeedback({ type: "error", message: "Pilih setidaknya 1 mentee untuk dibagikan materi." });
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

      if (formData.external_url.trim()) {
        data.append("external_url", formData.external_url.trim());
      }
      if (formData.file) {
        data.append("file", formData.file);
      }

      // Atur Target Pembagian
      if (targetMode === "all") {
        data.append("is_general", "1");
      } else if (targetMode === "single") {
        data.append("pairing_id", selectedPairingId);
      } else if (targetMode === "custom") {
        selectedPairingIds.forEach((id) => {
          data.append("pairing_ids[]", id);
        });
      }

      const res = await api.post("/materials", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const successMsg = res.data?.message || "Materi berhasil diunggah dan dibagikan!";
      setFeedback({ type: "success", message: successMsg });
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Gagal mengunggah materi:", err);
      const msg = err.response?.data?.message || "Gagal mengunggah materi. Silakan periksa kembali berkas Anda.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  // Hapus Materi
  const handleDelete = async (mat) => {
    if (!window.confirm(`Yakin ingin menghapus materi "${mat.title}"?`)) return;

    try {
      await api.delete(`/materials/${mat.id}`);
      setFeedback({ type: "success", message: `Materi "${mat.title}" berhasil dihapus.` });
      setMaterials((prev) => prev.filter((m) => m.id !== mat.id));
      if (previewMaterial?.id === mat.id) {
        setPreviewMaterial(null);
      }
    } catch (err) {
      setFeedback({ type: "error", message: "Gagal menghapus materi." });
    }
  };

  // Statistik Ringkasan Materi
  const stats = useMemo(() => {
    const total = materials.length;
    const videoCount = materials.filter((m) => m.type === "video").length;
    const pdfCount = materials.filter((m) => m.type === "pdf").length;
    const linkCount = materials.filter((m) => m.type === "link").length;
    const generalCount = materials.filter((m) => !m.pairing_id).length;
    const specificCount = total - generalCount;

    return { total, videoCount, pdfCount, linkCount, generalCount, specificCount };
  }, [materials]);

  // Filter Materi yang Ditampilkan
  const filteredMaterials = useMemo(() => {
    return materials.filter((mat) => {
      // Filter Pencarian
      const matchSearch =
        mat.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mat.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mat.pairing?.mentee?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter Tipe
      const matchType = typeFilter === "all" || mat.type === typeFilter;

      // Filter Target
      let matchTarget = true;
      if (targetFilter === "general") matchTarget = !mat.pairing_id;
      if (targetFilter === "specific") matchTarget = Boolean(mat.pairing_id);

      return matchSearch && matchType && matchTarget;
    });
  }, [materials, searchTerm, typeFilter, targetFilter]);

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Materi Pembelajaran</h1>
          <p className="text-gray-500 text-sm mt-1">
            Unggah modul PDF, video tutorial, atau tautan referensi belajar. Dapat dibagikan ke seluruh mentee atau mentee tertentu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-sm"
            title="Muat Ulang Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-[#b38867]" : ""} />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-sm font-semibold rounded-xl shadow-sm transition"
          >
            <Plus size={18} />
            <span>Upload Materi Baru</span>
          </button>
        </div>
      </div>

      {/* Alert Feedback Pesan */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between shadow-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="font-medium">{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* KPI Cards Ringkasan */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-[#b38867] rounded-xl">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Materi</p>
            <p className="text-xl font-bold text-gray-800">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Video size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Video Pembelajaran</p>
            <p className="text-xl font-bold text-gray-800">{stats.videoCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Modul PDF</p>
            <p className="text-xl font-bold text-gray-800">{stats.pdfCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Materi Umum / Khusus</p>
            <p className="text-sm font-bold text-gray-800">
              {stats.generalCount} Umum <span className="text-gray-400 font-normal">/</span> {stats.specificCount} Khusus
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Toolbar Pencarian */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Input Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari judul materi atau mentee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#b38867] focus:ring-1 focus:ring-[#b38867]"
          />
        </div>

        {/* Filter Tipe & Target */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Tipe Filter Buttons */}
          <div className="inline-flex p-1 bg-gray-100 rounded-xl text-xs font-semibold">
            {[
              { id: "all", label: "Semua Tipe" },
              { id: "video", label: "Video" },
              { id: "pdf", label: "PDF" },
              { id: "link", label: "Tautan" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setTypeFilter(btn.id)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  typeFilter === btn.id
                    ? "bg-white text-gray-900 shadow-2xs font-bold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Target Filter Buttons */}
          <div className="inline-flex p-1 bg-gray-100 rounded-xl text-xs font-semibold">
            {[
              { id: "all", label: "Semua Target" },
              { id: "general", label: "Umum" },
              { id: "specific", label: "Spesifik" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setTargetFilter(btn.id)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  targetFilter === btn.id
                    ? "bg-[#b38867] text-white shadow-2xs font-bold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Kartu Materi */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-gray-500 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <RefreshCw className="animate-spin text-[#b38867] mb-3" size={28} />
          <span className="text-sm font-medium">Memuat data materi pembelajaran...</span>
        </div>
      ) : filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((mat) => {
            const isVideo = mat.type === "video";
            const isPdf = mat.type === "pdf";
            const isLink = mat.type === "link";
            const isGeneral = !mat.pairing_id;
            const mentee = mat.pairing?.mentee;
            const ytEmbed = getYouTubeEmbedUrl(mat.external_url);

            return (
              <div
                key={mat.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Media Preview Header Banner */}
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 aspect-video w-full flex items-center justify-center overflow-hidden">
                  {/* Tipe Video: Tampilkan Preview Play atau Video Poster */}
                  {isVideo && (
                    <div 
                      onClick={() => setPreviewMaterial(mat)}
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer group/preview bg-slate-900 relative"
                    >
                      {ytEmbed ? (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover/preview:scale-110 transition">
                            <Play size={24} className="fill-white ml-0.5" />
                          </div>
                          <span className="absolute bottom-3 text-[11px] text-white/90 bg-black/60 px-2 py-0.5 rounded">
                            YouTube Video
                          </span>
                        </div>
                      ) : mat.file_path ? (
                        <div className="absolute inset-0 bg-indigo-950/70 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-[#b38867] text-white flex items-center justify-center shadow-lg group-hover/preview:scale-110 transition">
                            <Play size={24} className="fill-white ml-0.5" />
                          </div>
                          <span className="absolute bottom-3 text-[11px] text-white/90 bg-black/60 px-2 py-0.5 rounded flex items-center gap-1">
                            <Video size={12} /> Video MP4 Tersimpan
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-white/80">
                          <Play size={32} />
                          <span className="text-xs mt-1">Klik untuk Putar Video</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tipe Dokumen PDF */}
                  {isPdf && (
                    <div 
                      onClick={() => setPreviewMaterial(mat)}
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-gradient-to-br from-rose-900/90 to-slate-900 group/preview"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center justify-center shadow-lg group-hover/preview:scale-110 transition">
                        <FileText size={28} />
                      </div>
                      <span className="mt-2 text-xs font-semibold text-white/90 flex items-center gap-1.5">
                        <Eye size={13} /> Baca Dokumen PDF
                      </span>
                    </div>
                  )}

                  {/* Tipe Link Eksternal */}
                  {isLink && (
                    <div 
                      onClick={() => {
                        if (mat.external_url) window.open(mat.external_url, "_blank");
                      }}
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-gradient-to-br from-sky-900/90 to-slate-900 group/preview p-4 text-center"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center justify-center shadow-lg group-hover/preview:scale-110 transition mb-2">
                        <LinkIcon size={26} />
                      </div>
                      <span className="text-xs font-bold text-white line-clamp-1 truncate max-w-[85%]">
                        {mat.external_url || "Tautan Eksternal"}
                      </span>
                      <span className="text-[10px] text-sky-300 mt-1 flex items-center gap-1">
                        Buka di Tab Baru <ExternalLink size={10} />
                      </span>
                    </div>
                  )}

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                        isVideo
                          ? "bg-indigo-600/90 text-white"
                          : isPdf
                          ? "bg-rose-600/90 text-white"
                          : "bg-sky-600/90 text-white"
                      }`}
                    >
                      {mat.type}
                    </span>

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 text-white/90 backdrop-blur-md">
                      {mat.status || "published"}
                    </span>
                  </div>
                </div>

                {/* Card Body Information */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Target Mentee Indicator */}
                    <div className="mb-2.5">
                      {isGeneral ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                          <Globe size={13} className="text-emerald-600" />
                          <span>Semua Mentee (Materi Umum)</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                          <User size={13} className="text-[#b38867]" />
                          <span>Mentee: <strong>{mentee?.name || "Spesifik"}</strong></span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-gray-900 text-base line-clamp-2 hover:text-[#b38867] transition">
                      {mat.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                      {mat.description || "Tidak ada deskripsi detail untuk materi ini."}
                    </p>
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => setPreviewMaterial(mat)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b38867] hover:text-[#a27355] bg-amber-50/80 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition"
                    >
                      <Eye size={14} />
                      <span>Lihat Preview</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {mat.external_url && (
                        <a
                          href={mat.external_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Buka Tautan Asli"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(mat)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Hapus Materi"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-2xl border border-gray-200 shadow-xs text-gray-400">
          <BookOpen size={44} className="mx-auto mb-3 text-gray-300" />
          <h3 className="text-base font-bold text-gray-700">Tidak Ada Materi yang Ditemukan</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchTerm || typeFilter !== "all" || targetFilter !== "all"
              ? "Coba sesuaikan kata kunci pencarian atau ubah filter tipe dan target."
              : "Unggah materi bimbingan seperti video rekaman, modul PDF, atau materi referensi untuk mentee Anda."}
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-semibold rounded-xl transition shadow-sm"
          >
            + Upload Materi Baru
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL IN-APP PREVIEW PLAYER & VIEWER (VIDEO / PDF / TAUTAN)      */}
      {/* ============================================================== */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <span
                  className={`p-2.5 rounded-xl ${
                    previewMaterial.type === "video"
                      ? "bg-indigo-100 text-indigo-700"
                      : previewMaterial.type === "pdf"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-sky-100 text-sky-700"
                  }`}
                >
                  {previewMaterial.type === "video" ? (
                    <Video size={20} />
                  ) : previewMaterial.type === "pdf" ? (
                    <FileText size={20} />
                  ) : (
                    <LinkIcon size={20} />
                  )}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-gray-200 text-gray-700">
                      {previewMaterial.type}
                    </span>
                    {!previewMaterial.pairing_id ? (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <Globe size={10} /> Semua Mentee
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                        <User size={10} /> {previewMaterial.pairing?.mentee?.name || "Mentee"}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-gray-900 truncate mt-0.5">
                    {previewMaterial.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {previewMaterial.file_path && (
                  <a
                    href={getBackendFileUrl(previewMaterial.file_path)}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-2xs"
                  >
                    <Download size={14} />
                    <span>Unduh File</span>
                  </a>
                )}
                {previewMaterial.external_url && (
                  <a
                    href={previewMaterial.external_url}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition shadow-2xs"
                  >
                    <ExternalLink size={14} />
                    <span>Buka Sumber</span>
                  </a>
                )}
                <button
                  onClick={() => setPreviewMaterial(null)}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-xl transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body Preview Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/5">
              {/* Preview Video */}
              {previewMaterial.type === "video" && (
                <div className="w-full flex flex-col items-center justify-center">
                  {getYouTubeEmbedUrl(previewMaterial.external_url) ? (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-300 bg-black">
                      <iframe
                        src={getYouTubeEmbedUrl(previewMaterial.external_url)}
                        title={previewMaterial.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : previewMaterial.file_path ? (
                    <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-300 bg-black">
                      <video
                        controls
                        playsInline
                        autoPlay
                        className="w-full max-h-[500px] object-contain mx-auto"
                        src={getBackendFileUrl(previewMaterial.file_path)}
                      >
                        Browser Anda tidak mendukung tag video HTML5.
                      </video>
                    </div>
                  ) : (
                    <div className="p-10 text-center bg-white rounded-2xl border border-gray-200 w-full">
                      <Video size={48} className="mx-auto text-indigo-400 mb-2" />
                      <p className="text-sm font-bold text-gray-700">Tautan Video: {previewMaterial.external_url}</p>
                      <a
                        href={previewMaterial.external_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
                      >
                        <ExternalLink size={14} /> Buka Video di Tab Baru
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Preview Dokumen PDF */}
              {previewMaterial.type === "pdf" && (
                <div className="w-full flex flex-col items-center">
                  {previewMaterial.file_path ? (
                    <div className="w-full h-[540px] rounded-2xl overflow-hidden shadow-md border border-gray-300 bg-white">
                      <iframe
                        src={`${getBackendFileUrl(previewMaterial.file_path)}#toolbar=1&navpanes=0`}
                        title={previewMaterial.title}
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    <div className="p-10 text-center bg-white rounded-2xl border border-gray-200 w-full">
                      <FileText size={48} className="mx-auto text-rose-500 mb-2" />
                      <p className="text-sm font-bold text-gray-800">Dokumen PDF Tersimpan Eksternal</p>
                      <a
                        href={previewMaterial.external_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition"
                      >
                        <ExternalLink size={14} /> Buka PDF di Tab Baru
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Preview Tautan Link */}
              {previewMaterial.type === "link" && (
                <div className="w-full">
                  {getYouTubeEmbedUrl(previewMaterial.external_url) ? (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-300 bg-black">
                      <iframe
                        src={getYouTubeEmbedUrl(previewMaterial.external_url)}
                        title={previewMaterial.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 shadow-sm max-w-lg mx-auto">
                      <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3">
                        <LinkIcon size={32} />
                      </div>
                      <h3 className="text-base font-bold text-gray-800">Tautan Referensi Belajar</h3>
                      <p className="text-xs text-gray-500 mt-1 break-all bg-gray-50 p-3 rounded-xl border border-gray-200 my-4 font-mono">
                        {previewMaterial.external_url}
                      </p>
                      <a
                        href={previewMaterial.external_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-bold rounded-xl transition shadow-sm"
                      >
                        <ExternalLink size={15} /> Buka Tautan Sekarang
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Rincian Deskripsi Materi di Bawah Preview */}
              {previewMaterial.description && (
                <div className="mt-5 p-4 bg-white rounded-2xl border border-gray-200 text-xs">
                  <h4 className="font-bold text-gray-800 mb-1">Deskripsi & Poin Pembelajaran:</h4>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {previewMaterial.description}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
              <span className="text-xs text-gray-400">
                Diupload pada: {new Date(previewMaterial.created_at).toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </span>
              <button
                onClick={() => setPreviewMaterial(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL UPLOAD MATERI (DENGAN TARGET MENTEE & PREVIEW LANGSUNG)   */}
      {/* ============================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-gray-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
            {/* Modal Title */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#b38867]/15 text-[#b38867] rounded-xl">
                  <Upload size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Upload Materi Mentoring</h2>
                  <p className="text-xs text-gray-500">
                    Bagikan materi untuk 1 mentee, beberapa mentee tertentu, atau seluruh mentee.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Judul Materi */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Judul Materi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Modul 02 - State Management & REST API Integration"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                />
              </div>

              {/* Pemilihan Tipe Materi */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Tipe Format Materi <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "video", label: "Video Tutorial", icon: Video, color: "text-indigo-600" },
                    { id: "pdf", label: "Dokumen PDF", icon: FileText, color: "text-rose-600" },
                    { id: "link", label: "Tautan URL", icon: LinkIcon, color: "text-sky-600" },
                  ].map((t) => {
                    const Icon = t.icon;
                    const active = formData.type === t.id;
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => {
                          setFormData({ ...formData, type: t.id, file: null });
                          if (filePreviewUrl) {
                            URL.revokeObjectURL(filePreviewUrl);
                            setFilePreviewUrl(null);
                          }
                        }}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition ${
                          active
                            ? "bg-[#b38867] text-white border-[#b38867] shadow-xs"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon size={18} className={active ? "text-white" : t.color} />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TARGET PEMBAGIAN MENTEE (USER REQUEST: BISA DIBAGIKAN ANTAR MENTEE ATAU 1 MENTEE) */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Users size={14} className="text-[#b38867]" />
                  <span>Target Pembagian Materi</span>
                  <span className="text-red-500">*</span>
                </label>

                {/* 3 Opsi Target Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetMode("all")}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition text-left ${
                      targetMode === "all"
                        ? "bg-amber-50/80 border-[#b38867] text-[#b38867] font-bold shadow-2xs"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Globe size={16} className={targetMode === "all" ? "text-[#b38867]" : "text-gray-400"} />
                    <div>
                      <p>Semua Mentee</p>
                      <p className="text-[10px] font-normal text-gray-400">Materi umum publik</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetMode("custom")}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition text-left ${
                      targetMode === "custom"
                        ? "bg-amber-50/80 border-[#b38867] text-[#b38867] font-bold shadow-2xs"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Users size={16} className={targetMode === "custom" ? "text-[#b38867]" : "text-gray-400"} />
                    <div>
                      <p>Beberapa Mentee</p>
                      <p className="text-[10px] font-normal text-gray-400">Pilih via checklist</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetMode("single")}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition text-left ${
                      targetMode === "single"
                        ? "bg-amber-50/80 border-[#b38867] text-[#b38867] font-bold shadow-2xs"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <User size={16} className={targetMode === "single" ? "text-[#b38867]" : "text-gray-400"} />
                    <div>
                      <p>1 Mentee Khusus</p>
                      <p className="text-[10px] font-normal text-gray-400">Materi privat 1-on-1</p>
                    </div>
                  </button>
                </div>

                {/* Tampilan Konfigurasi Sesuai Mode Terpilih */}
                {targetMode === "all" && (
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <Globe size={16} className="text-emerald-600 shrink-0" />
                    <span>
                      Materi ini akan ditandai sebagai <strong>Materi Umum</strong> dan otomatis dapat diakses oleh seluruh mentee bimbingan Anda.
                    </span>
                  </div>
                )}

                {targetMode === "single" && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Pilih Mentee Penerima Materi
                    </label>
                    <select
                      value={selectedPairingId}
                      onChange={(e) => setSelectedPairingId(e.target.value)}
                      className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none bg-white font-medium"
                    >
                      {mentees.map((m) => (
                        <option key={m.pairing_id} value={m.pairing_id}>
                          {m.mentee?.name || "Mentee"} ({m.mentee?.email}) - {m.subscription_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {targetMode === "custom" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-700">Daftar Mentee:</span>
                      <div className="flex items-center gap-2">
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

                    <div className="max-h-40 overflow-y-auto space-y-1.5 border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                      {mentees.length > 0 ? (
                        mentees.map((m) => {
                          const isChecked = selectedPairingIds.includes(m.pairing_id);
                          return (
                            <div
                              key={m.pairing_id}
                              onClick={() => handleTogglePairing(m.pairing_id)}
                              className={`p-2 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2.5 ${
                                isChecked
                                  ? "bg-amber-50/80 border-amber-300"
                                  : "bg-white border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className={`p-0.5 rounded ${isChecked ? "text-[#b38867]" : "text-gray-400"}`}>
                                  {isChecked ? <CheckSquare size={16} /> : <Square size={16} />}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-gray-800 text-xs truncate">
                                    {m.mentee?.name || "Mentee"}
                                  </p>
                                  <p className="text-[10px] text-gray-400 truncate">{m.mentee?.email}</p>
                                </div>
                              </div>
                              <span className="text-[9px] font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200 shrink-0">
                                {m.subscription_name}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-gray-400 p-2 text-center">Belum ada mentee bimbingan.</p>
                      )}
                    </div>

                    <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center justify-between font-medium">
                      <span>Materi akan dibagikan ke:</span>
                      <strong className="bg-white px-2 py-0.5 rounded border border-amber-300">
                        {selectedPairingIds.length} dari {mentees.length} Mentee
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              {/* INPUT FILE & URL SESUAI TIPE */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                {/* Tipe Video: Bisa Upload MP4 atau Tautan YouTube */}
                {formData.type === "video" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Unggah File Video (MP4 / WebM, Maks. 50MB)
                      </label>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/avi"
                        onChange={handleFileChange}
                        className="w-full p-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-[10px] text-gray-400 font-bold uppercase">atau gunakan tautan</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Tautan Video YouTube / Loom
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={formData.external_url}
                        onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                        className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none font-mono"
                      />
                    </div>

                    {/* LIVE PREVIEW SEBELUM UPLOAD */}
                    {filePreviewUrl && (
                      <div className="p-3 bg-black/95 rounded-xl border border-gray-700">
                        <p className="text-[10px] font-bold text-gray-300 mb-1.5 flex items-center gap-1">
                          <Eye size={12} className="text-[#b38867]" /> Live Preview Video Lokal:
                        </p>
                        <video
                          controls
                          playsInline
                          src={filePreviewUrl}
                          className="w-full max-h-44 rounded-lg bg-black object-contain"
                        />
                      </div>
                    )}

                    {formData.external_url && getYouTubeEmbedUrl(formData.external_url) && (
                      <div className="p-3 bg-black/95 rounded-xl border border-gray-700">
                        <p className="text-[10px] font-bold text-gray-300 mb-1.5 flex items-center gap-1">
                          <Eye size={12} className="text-rose-500" /> Live Preview YouTube Video:
                        </p>
                        <div className="aspect-video w-full rounded-lg overflow-hidden">
                          <iframe
                            src={getYouTubeEmbedUrl(formData.external_url)}
                            title="YouTube Preview"
                            className="w-full h-full border-0"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tipe Dokumen PDF */}
                {formData.type === "pdf" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Pilih Berkas Dokumen PDF <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="w-full p-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                      />
                    </div>

                    {formData.file && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileText size={18} className="text-rose-600" />
                          <div>
                            <p className="font-bold text-gray-800">{formData.file.name}</p>
                            <p className="text-[10px] text-gray-500">
                              Ukuran: {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                          Siap Diunggah
                        </span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Tautan Google Drive / Cloud Alternatif (Opsional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/file/d/..."
                        value={formData.external_url}
                        onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                        className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Tipe Link Eksternal */}
                {formData.type === "link" && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Tautan URL Materi (Figma / Notion / GitHub / Web) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://figma.com/@guideline atau https://notion.so/..."
                      value={formData.external_url}
                      onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                      className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none font-mono"
                    />

                    {formData.external_url && getYouTubeEmbedUrl(formData.external_url) && (
                      <div className="p-3 bg-black/95 rounded-xl border border-gray-700 mt-2">
                        <p className="text-[10px] font-bold text-gray-300 mb-1.5 flex items-center gap-1">
                          <Eye size={12} className="text-rose-500" /> Live Preview YouTube Video:
                        </p>
                        <div className="aspect-video w-full rounded-lg overflow-hidden">
                          <iframe
                            src={getYouTubeEmbedUrl(formData.external_url)}
                            title="YouTube Preview"
                            className="w-full h-full border-0"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Deskripsi Materi */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Deskripsi & Instruksi Materi
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan ringkasan materi atau petunjuk bagaimana mentee sebaiknya mempelajari materi ini..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Tombol Simpan & Batal */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#b38867] hover:bg-[#a27355] rounded-xl transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <RefreshCw size={14} className="animate-spin" />}
                  <span>{submitting ? "Mengunggah Materi..." : "Simpan & Bagikan Materi"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
