import React, { useEffect, useState } from "react";
import api from "../../../axiosInstance";
import { 
  CheckCircle2, 
  Clock, 
  Upload, 
  FileText, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Award,
  MessageSquare,
  Paperclip,
  Send,
  X
} from "lucide-react";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'pending', 'submitted', 'reviewed'

  // Modal State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [answer, setAnswer] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [taskRes, subRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/submissions")
      ]);
      setTasks(taskRes.data?.data || []);
      setSubmissions(subRes.data?.data || []);
    } catch (err) {
      console.error("Gagal memuat tugas & submission:", err);
      setError("Gagal memuat daftar tugas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Map submissions by task_id
  const submissionMap = React.useMemo(() => {
    const map = {};
    submissions.forEach(sub => {
      map[sub.task_id] = sub;
    });
    return map;
  }, [submissions]);

  // Open modal for a task
  const handleOpenSubmit = (task) => {
    const existing = submissionMap[task.id];
    setSelectedTask(task);
    setAnswer(existing?.answer || "");
    setFile(null);
    setFeedbackMsg(null);
    setShowSubmitModal(true);
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!answer.trim() && !file) {
      setFeedbackMsg({ type: "error", message: "Masukkan jawaban / tautan pengerjaan atau unggah berkas." });
      return;
    }

    setSubmitting(true);
    setFeedbackMsg(null);

    const formData = new FormData();
    formData.append("task_id", selectedTask.id);
    if (answer.trim()) formData.append("answer", answer);
    if (file) formData.append("file", file);

    try {
      await api.post("/submissions", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFeedbackMsg({ type: "success", message: "Tugas berhasil dikumpulkan!" });
      setTimeout(() => {
        setShowSubmitModal(false);
        fetchData();
      }, 1200);
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal mengumpulkan tugas.";
      setFeedbackMsg({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const sub = submissionMap[t.id];
    if (activeTab === "pending") return !sub;
    if (activeTab === "submitted") return sub && sub.status === "submitted";
    if (activeTab === "reviewed") return sub && (sub.status === "reviewed" || sub.status === "completed");
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tugas Saya</h1>
          <p className="text-gray-500 text-sm mt-1">
            Daftar tugas yang diberikan oleh mentor untuk mengasah keterampilan praktis Anda.
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

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === "all"
              ? "border-[#b38867] text-[#b38867]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Semua Tugas ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === "pending"
              ? "border-[#b38867] text-[#b38867]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Perlu Dikerjakan ({tasks.filter(t => !submissionMap[t.id]).length})
        </button>
        <button
          onClick={() => setActiveTab("submitted")}
          className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === "submitted"
              ? "border-[#b38867] text-[#b38867]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Menunggu Review ({tasks.filter(t => submissionMap[t.id]?.status === "submitted").length})
        </button>
        <button
          onClick={() => setActiveTab("reviewed")}
          className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === "reviewed"
              ? "border-[#b38867] text-[#b38867]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Sudah Dinilai ({tasks.filter(t => submissionMap[t.id]?.status === "reviewed" || submissionMap[t.id]?.status === "completed").length})
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Task Cards */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white p-6 rounded-2xl border border-gray-100 h-32"></div>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#b38867]">
            <CheckCircle2 className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">Tidak ada tugas pada kategori ini</h3>
          <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
            Semua tugas yang telah Anda kumpulkan atau baru diberikan mentor akan ditampilkan di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map(task => {
            const sub = submissionMap[task.id];
            const isReviewed = sub && (sub.status === "reviewed" || sub.status === "completed");
            const isSubmitted = sub && sub.status === "submitted";

            return (
              <div
                key={task.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-gray-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase bg-gray-100 text-gray-600">
                        {task.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {task.description || "Tidak ada deskripsi detail untuk tugas ini."}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isReviewed ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Award size={14} />
                        Dinilai ({Number(sub.grade).toFixed(0)}/100)
                      </span>
                    ) : isSubmitted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock size={14} />
                        Menunggu Penilaian
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertCircle size={14} />
                        Belum Dikerjakan
                      </span>
                    )}
                  </div>
                </div>

                {/* Due Date & Mentor */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                  {task.due_date && (
                    <span className="flex items-center gap-1.5 font-medium text-rose-600">
                      <Clock size={14} />
                      Tenggat: {new Date(task.due_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </span>
                  )}
                  {task.pairing?.mentor && (
                    <span>
                      Mentor: <strong className="text-gray-700">{task.pairing.mentor.name}</strong>
                    </span>
                  )}
                </div>

                {/* Submission & Feedback Section if available */}
                {sub && (
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between font-semibold text-gray-700">
                      <span className="flex items-center gap-1.5">
                        <Send size={14} className="text-[#b38867]" />
                        Jawaban Anda:
                      </span>
                      <span className="text-gray-400 font-normal">
                        Dikumpulkan pada {new Date(sub.created_at).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}
                      </span>
                    </div>
                    {sub.answer && (
                      <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200 whitespace-pre-wrap font-mono text-[11px]">
                        {sub.answer}
                      </p>
                    )}
                    {sub.file_path && (
                      <a
                        href={`http://localhost:8000/storage/${sub.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-indigo-600 hover:underline font-medium"
                      >
                        <Paperclip size={14} />
                        Lampiran Berkas yang Dikumpulkan
                      </a>
                    )}

                    {/* Feedback from Mentor */}
                    {isReviewed && (
                      <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5">
                        <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                          <MessageSquare size={14} />
                          Feedback dari Mentor:
                        </div>
                        <p className="text-gray-800 bg-emerald-50/60 border border-emerald-200/70 p-3 rounded-lg leading-relaxed">
                          {sub.feedback || "Kerja bagus!"}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleOpenSubmit(task)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-semibold rounded-xl shadow-xs transition"
                  >
                    <Upload size={14} />
                    {sub ? "Kumpulkan Ulang / Perbarui Jawaban" : "Kerjakan & Kumpulkan Tugas"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Submit Task */}
      {showSubmitModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Pengumpulan Tugas</h3>
                <p className="text-xs text-gray-500">{selectedTask.title}</p>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {feedbackMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  feedbackMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>{feedbackMsg.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmitWork} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Jawaban / Tautan Tugas (URL GitHub, Figma, Google Drive, dsb.)
                </label>
                <textarea
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Tuliskan jawaban atau sertakan link tugas Anda..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#b38867] focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Unggah Berkas Pendukung (Opsional: PDF, ZIP, Gambar, Maks. 10MB)
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0] || null)}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#b38867]/10 file:text-[#b38867] hover:file:bg-[#b38867]/20 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#b38867] hover:bg-[#a27355] rounded-xl transition disabled:opacity-50"
                >
                  <Send size={14} />
                  {submitting ? "Mengirim..." : "Kirim Tugas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
