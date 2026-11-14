import React, { useState, useEffect } from "react";
import api from "../../../axiosInstance";
import { 
  BookOpen, 
  Video, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Circle, 
  RefreshCw, 
  AlertCircle,
  Clock,
  Download,
  Search,
  Filter
} from "lucide-react";

export default function LearningActivities() {
  const [materials, setMaterials] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [matRes, progRes] = await Promise.all([
        api.get("/materials"),
        api.get("/material-progress").catch(() => ({ data: { data: [] } }))
      ]);

      setMaterials(matRes.data?.data || matRes.data || []);
      setProgressList(progRes.data?.data || []);
    } catch (err) {
      console.error("Gagal mengambil materi pembelajaran:", err);
      setError("Gagal memuat materi pembelajaran.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Map progress by material_id
  const progressMap = React.useMemo(() => {
    const map = {};
    progressList.forEach(p => {
      map[p.material_id] = p;
    });
    return map;
  }, [progressList]);

  // Toggle completion
  const handleToggleComplete = async (material) => {
    const current = progressMap[material.id];
    const isCompleted = !(current && current.is_completed);

    setUpdatingId(material.id);
    try {
      await api.post("/material-progress", {
        material_id: material.id,
        progress_percentage: isCompleted ? 100 : 0,
        is_completed: isCompleted
      });

      // Update local state
      setProgressList(prev => {
        const filtered = prev.filter(p => p.material_id !== material.id);
        return [...filtered, {
          material_id: material.id,
          progress_percentage: isCompleted ? 100 : 0,
          is_completed: isCompleted
        }];
      });
    } catch (err) {
      console.error("Gagal memperbarui status materi:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredMaterials = materials.filter(m => {
    const matchType = selectedType === "all" || m.type === selectedType;
    const matchSearch = searchQuery === "" || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchSearch;
  });

  const completedCount = materials.filter(m => progressMap[m.id]?.is_completed).length;
  const progressPct = materials.length > 0 ? Math.round((completedCount / materials.length) * 100) : 0;

  const getTypeIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="w-5 h-5 text-rose-500" />;
      case "pdf":
        return <FileText className="w-5 h-5 text-indigo-500" />;
      case "link":
      default:
        return <ExternalLink className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Materi & Aktivitas Pembelajaran</h1>
          <p className="text-gray-500 text-sm mt-1">
            Pelajari modul, video, dan panduan belajar yang disediakan mentor untuk Anda.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Progress Bar Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Kemajuan Belajar Anda
            </span>
            <h3 className="text-xl font-bold text-gray-800 mt-0.5">
              {completedCount} dari {materials.length} Materi Diselesaikan
            </h3>
          </div>
          <span className="text-2xl font-black text-[#b38867]">
            {progressPct}%
          </span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#b38867] to-[#7B5E4A] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
          {["all", "video", "pdf", "link"].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                selectedType === type
                  ? "bg-[#b38867] text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {type === "all" ? "Semua Tipe" : type.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi pembelajaran..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b38867] focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Material Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse bg-white p-6 rounded-2xl border border-gray-100 h-36"></div>
          ))}
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#b38867]">
            <BookOpen className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">Belum ada materi pembelajaran</h3>
          <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
            Materi yang diunggah oleh mentor Anda akan otomatis tampil di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map(m => {
            const isCompleted = progressMap[m.id]?.is_completed;
            return (
              <div
                key={m.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                  isCompleted ? "border-emerald-200 bg-emerald-50/10" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 shrink-0">
                      {getTypeIcon(m.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                          {m.type}
                        </span>
                        {m.duration && (
                          <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Clock size={12} />
                            {m.duration} Menit
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-gray-800 text-base mt-1 line-clamp-1">
                        {m.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {m.description || "Tidak ada deskripsi materi."}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleComplete(m)}
                    disabled={updatingId === m.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      isCompleted
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        Selesai Dipelajari
                      </>
                    ) : (
                      <>
                        <Circle size={14} />
                        Tandai Selesai
                      </>
                    )}
                  </button>

                  {m.external_url ? (
                    <a
                      href={m.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#b38867] hover:bg-[#a27355] text-white transition"
                    >
                      Buka Tautan
                      <ExternalLink size={12} />
                    </a>
                  ) : m.file_path ? (
                    <a
                      href={`http://localhost:8000/storage/${m.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#b38867] hover:bg-[#a27355] text-white transition"
                    >
                      <Download size={12} />
                      Unduh Berkas
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
