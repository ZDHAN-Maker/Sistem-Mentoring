import React, { useState, useEffect, useMemo } from "react";
import api from "../../../axiosInstance";
import { 
  CheckSquare, 
  FileText, 
  Star, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ExternalLink,
  Plus,
  MessageSquare,
  Award,
  Trash2,
  Filter,
  Sparkles,
  TrendingUp,
  User,
  Clock,
  Send
} from "lucide-react";

export default function ReviewReportsAndFeedback() {
  const [activeTab, setActiveTab] = useState("submissions"); // 'submissions' | 'progress_reports'
  const [submissions, setSubmissions] = useState([]);
  const [reports, setReports] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Submissions filter
  const [submissionFilter, setSubmissionFilter] = useState("all"); // 'all' | 'pending' | 'reviewed'

  // Modal Review Submission State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    grade: "",
    feedback: "",
    status: "reviewed",
  });

  // Modal Create Progress Report State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    pairing_id: "",
    report_date: new Date().toISOString().slice(0, 10),
    comprehension_level: "Sangat Baik",
    activeness: "Aktif",
    task_quality: "Memuaskan",
    note: "",
    recommendation: "",
  });

  // Template feedback siap pakai
  const feedbackPresets = [
    "Pemahaman konsep sudah sangat baik, eksekusi rapi dan tepat waktu!",
    "Pekerjaan bagus! Perhatikan kerapihan format kode dan penamaan variabel.",
    "Konsep dasar sudah dikuasai, namun implementasi fungsi masih perlu dioptimalkan.",
    "Perlu perbaikan pada penanganan error dan validasi kasus uji (edge cases).",
    "Sangat memuaskan! Telah melampaui ekspektasi kriteria tugas bimbingan."
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subRes, repRes, menteeRes] = await Promise.all([
        api.get("/submissions"),
        api.get("/progress-reports"),
        api.get("/my-mentees"),
      ]);

      setSubmissions(subRes.data?.data || subRes.data || []);
      setReports(repRes.data?.data || repRes.data || []);
      setMentees(menteeRes.data?.data || []);
    } catch (err) {
      console.error("Gagal mengambil data review:", err);
      setFeedback({ type: "error", message: "Gagal memuat data evaluasi." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter Submissions
  const filteredSubmissions = useMemo(() => {
    if (submissionFilter === "all") return submissions;
    if (submissionFilter === "pending") {
      return submissions.filter((s) => s.status === "submitted" || s.status === "pending" || !s.grade);
    }
    if (submissionFilter === "reviewed") {
      return submissions.filter((s) => s.status === "reviewed" || s.status === "completed" || s.grade !== null);
    }
    return submissions;
  }, [submissions, submissionFilter]);

  // Handler Buka Modal Review
  const openReviewModal = (submission) => {
    setSelectedSub(submission);
    setReviewForm({
      grade: submission.grade !== null && submission.grade !== undefined ? submission.grade : "",
      feedback: submission.feedback || "",
      status: submission.status === "completed" ? "completed" : "reviewed",
    });
    setShowReviewModal(true);
  };

  const handleApplyPreset = (presetText) => {
    setReviewForm((prev) => ({
      ...prev,
      feedback: prev.feedback ? `${prev.feedback} ${presetText}` : presetText
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewForm.grade === "" || !reviewForm.feedback.trim()) {
      setFeedback({ type: "error", message: "Nilai dan ulasan feedback wajib diisi." });
      return;
    }

    try {
      await api.patch(`/submissions/${selectedSub.id}/review`, {
        grade: Number(reviewForm.grade),
        feedback: reviewForm.feedback,
        status: reviewForm.status,
      });

      setFeedback({ type: "success", message: "Penilaian & feedback tugas berhasil disimpan!" });
      setShowReviewModal(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menyimpan review tugas.";
      setFeedback({ type: "error", message: msg });
    }
  };

  // Handler Buka Modal Buat Report
  const openReportModal = () => {
    setReportForm({
      pairing_id: mentees.length > 0 ? mentees[0].pairing_id : "",
      report_date: new Date().toISOString().slice(0, 10),
      comprehension_level: "Sangat Baik",
      activeness: "Aktif",
      task_quality: "Memuaskan",
      note: "",
      recommendation: "",
    });
    setShowReportModal(true);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportForm.pairing_id || !reportForm.note.trim()) {
      setFeedback({ type: "error", message: "Pilih mentee dan isi catatan evaluasi perkembangan minimal 10 karakter." });
      return;
    }

    // Gabungkan aspek evaluasi ke note terstruktur
    const formattedNote = `[Aspek Bimbingan: Pemahaman: ${reportForm.comprehension_level} | Keaktifan: ${reportForm.activeness} | Kualitas Tugas: ${reportForm.task_quality}]\n\n${reportForm.note.trim()}${
      reportForm.recommendation ? `\n\n📌 Rekomendasi Mentor: ${reportForm.recommendation.trim()}` : ""
    }`;

    try {
      await api.post("/progress-reports", {
        pairing_id: Number(reportForm.pairing_id),
        report_date: reportForm.report_date,
        note: formattedNote,
      });

      setFeedback({ type: "success", message: "Laporan perkembangan mentee berhasil disimpan!" });
      setShowReportModal(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menyimpan laporan perkembangan.";
      setFeedback({ type: "error", message: msg });
    }
  };

  const handleDeleteReport = async (report) => {
    if (!window.confirm("Yakin ingin menghapus laporan perkembangan ini?")) return;

    try {
      await api.delete(`/progress-reports/${report.id}`);
      setFeedback({ type: "success", message: "Laporan berhasil dihapus." });
      setReports((prev) => prev.filter((r) => r.id !== report.id));
    } catch (err) {
      setFeedback({ type: "error", message: "Gagal menghapus laporan." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Review Tugas & Evaluasi Mentee</h1>
          <p className="text-gray-500 text-sm mt-1">
            Berikan nilai dan ulasan pada tugas mentee, gunakan preset feedback cepat, serta susun laporan perkembangan berkala.
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
          {activeTab === "progress_reports" && (
            <button
              onClick={openReportModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-sm font-semibold rounded-xl shadow-sm transition"
            >
              <Plus size={18} />
              Buat Evaluasi Baru
            </button>
          )}
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

      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
              activeTab === "submissions"
                ? "bg-[#b38867] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <CheckSquare size={16} />
            <span>Pengumpulan Tugas Mentee ({submissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("progress_reports")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
              activeTab === "progress_reports"
                ? "bg-[#b38867] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FileText size={16} />
            <span>Laporan Perkembangan ({reports.length})</span>
          </button>
        </div>

        {/* Filter status untuk tab Submissions */}
        {activeTab === "submissions" && (
          <div className="inline-flex p-1 bg-gray-100 rounded-xl text-xs font-medium">
            <button
              onClick={() => setSubmissionFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition ${
                submissionFilter === "all" ? "bg-white text-gray-900 font-bold shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Semua ({submissions.length})
            </button>
            <button
              onClick={() => setSubmissionFilter("pending")}
              className={`px-3 py-1.5 rounded-lg transition ${
                submissionFilter === "pending" ? "bg-white text-rose-700 font-bold shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Perlu Review ({submissions.filter((s) => s.status === "submitted" || !s.grade).length})
            </button>
            <button
              onClick={() => setSubmissionFilter("reviewed")}
              className={`px-3 py-1.5 rounded-lg transition ${
                submissionFilter === "reviewed" ? "bg-white text-emerald-700 font-bold shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sudah Dinilai ({submissions.filter((s) => s.status === "reviewed" || s.status === "completed" || s.grade !== null).length})
            </button>
          </div>
        )}
      </div>

      {/* Tab Content: Submissions */}
      {activeTab === "submissions" && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
              <RefreshCw className="animate-spin text-[#b38867] mr-3" size={24} />
              <span>Memuat data pengumpulan tugas...</span>
            </div>
          ) : filteredSubmissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubmissions.map((sub) => {
                const isReviewed = sub.status === "reviewed" || sub.status === "completed" || (sub.grade !== null && sub.grade !== undefined);
                return (
                  <div
                    key={sub.id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                            isReviewed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700 font-bold animate-pulse"
                          }`}
                        >
                          {isReviewed ? "Sudah Dinilai" : "Perlu Review Segera"}
                        </span>
                        {sub.grade !== null && sub.grade !== undefined && (
                          <div className="flex items-center gap-1 font-bold text-sm text-[#7B5E4A] bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                            <Award size={15} className="text-[#b38867]" />
                            <span>Nilai: {sub.grade}/100</span>
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-gray-900 text-base">
                        {sub.task?.title || "Tugas #" + sub.task_id}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Dikumpulkan oleh: <strong className="text-gray-800">{sub.mentee?.name || "Mentee"}</strong>
                      </p>

                      <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs space-y-2 border border-gray-100">
                        <p className="text-gray-600 line-clamp-3">
                          <strong>Catatan/Jawaban Mentee:</strong> {sub.answer || sub.notes || "Tidak ada catatan pengumpulan."}
                        </p>
                        {sub.file_path && (
                          <a
                            href={sub.file_path.startsWith("http") ? sub.file_path : `/storage/${sub.file_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1 font-semibold pt-1"
                          >
                            <ExternalLink size={13} /> Buka Berkas Tugas Mentee
                          </a>
                        )}
                      </div>

                      {sub.feedback && (
                        <div className="mt-3 p-3 bg-amber-50/70 rounded-xl text-xs text-amber-900 border border-amber-200/70">
                          <strong className="block text-amber-950 mb-0.5">Feedback Mentor:</strong>
                          <p className="italic leading-relaxed">{sub.feedback}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">
                        {sub.created_at ? new Date(sub.created_at).toLocaleDateString("id-ID", {
                          day: "numeric", month: "short", year: "numeric"
                        }) : ""}
                      </span>
                      <button
                        onClick={() => openReviewModal(sub)}
                        className="px-4 py-2 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-semibold rounded-xl transition shadow-sm flex items-center gap-1.5"
                      >
                        <Award size={14} />
                        <span>{isReviewed ? "Ubah Nilai & Feedback" : "Beri Nilai & Review"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center bg-white rounded-2xl border border-gray-200 text-gray-400">
              <CheckSquare size={40} className="mx-auto mb-3 text-gray-300" />
              <h3 className="text-base font-bold text-gray-700">Belum Ada Pengumpulan Tugas</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Ketika mentee menyelesaikan dan mengumpulkan tugas bimbingan, kiriman tugas akan otomatis muncul di sini untuk Anda evaluasi.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Progress Reports */}
      {activeTab === "progress_reports" && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
              <RefreshCw className="animate-spin text-[#b38867] mr-3" size={24} />
              <span>Memuat laporan evaluasi...</span>
            </div>
          ) : reports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
                      <span className="font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                        Report #{rep.id}
                      </span>
                      <span className="font-medium text-gray-600">
                        {rep.report_date
                          ? new Date(rep.report_date).toLocaleDateString("id-ID", {
                              day: "numeric", month: "short", year: "numeric"
                            })
                          : ""}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#b38867]/20 text-[#b38867] font-bold text-xs flex items-center justify-center">
                        {rep.pairing?.mentee?.name ? rep.pairing.mentee.name.charAt(0) : "M"}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">
                          {rep.pairing?.mentee?.name || "Mentee Bimbingan"}
                        </h3>
                        <p className="text-[11px] text-gray-400">{rep.pairing?.subscription_name || "Paket Bimbingan"}</p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-gray-50 rounded-xl text-xs text-gray-700 leading-relaxed border border-gray-100 whitespace-pre-wrap">
                      {rep.note || rep.notes || "Tidak ada catatan evaluasi."}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-end">
                    <button
                      onClick={() => handleDeleteReport(rep)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                      title="Hapus Laporan"
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
              <h3 className="text-base font-bold text-gray-700">Belum Ada Laporan Evaluasi Berkala</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Susun evaluasi kemajuan mentee secara berkala agar perkembangan mereka dapat terpantau dengan baik.
              </p>
              <button
                onClick={openReportModal}
                className="mt-4 px-4 py-2 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-semibold rounded-xl transition"
              >
                + Buat Laporan Perkembangan Pertama
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Review Submission & Grading */}
      {showReviewModal && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-800 rounded-xl">
                  <Award size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-800">Nilai & Review Tugas Mentee</h2>
                  <p className="text-xs text-gray-400">ID Pengumpulan #{selectedSub.id}</p>
                </div>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4">
              <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1 border border-gray-100">
                <p className="font-bold text-gray-800 text-sm">{selectedSub.task?.title || "Tugas"}</p>
                <p className="text-gray-500">Mentee: {selectedSub.mentee?.name}</p>
                {selectedSub.answer && (
                  <p className="text-gray-600 mt-2 bg-white p-2.5 rounded-lg border border-gray-200 italic">
                    "{selectedSub.answer}"
                  </p>
                )}
                {selectedSub.file_path && (
                  <a
                    href={selectedSub.file_path.startsWith("http") ? selectedSub.file_path : `/storage/${selectedSub.file_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 font-semibold pt-1"
                  >
                    <ExternalLink size={12} /> Buka Berkas Tugas Mentee
                  </a>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nilai Angka (0 - 100) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  placeholder="Contoh: 85"
                  value={reviewForm.grade}
                  onChange={(e) => setReviewForm({ ...reviewForm, grade: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                />
              </div>

              {/* Template Feedback Cepat */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <Sparkles size={13} className="text-amber-600" />
                    Pilihan Preset Feedback Cepat
                  </label>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {feedbackPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="text-[11px] text-left px-2.5 py-1 bg-amber-50/70 hover:bg-amber-100 text-amber-900 border border-amber-200/70 rounded-lg transition"
                    >
                      + {preset.length > 40 ? preset.slice(0, 40) + "..." : preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ulasan / Catatan Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Berikan apresiasi dan catatan perbaikan teknikal yang konstruktif..."
                  value={reviewForm.feedback}
                  onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Status Penilaian</label>
                <select
                  value={reviewForm.status}
                  onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                >
                  <option value="reviewed">Telah Direview (Reviewed)</option>
                  <option value="completed">Selesai & Lulus (Completed)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#b38867] hover:bg-[#a27355] rounded-xl transition shadow-sm"
                >
                  Simpan Penilaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Create Progress Report */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#b38867]/20 text-[#b38867] rounded-xl">
                  <FileText size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-800">Buat Evaluasi Perkembangan Mentee</h2>
                  <p className="text-xs text-gray-400">Laporan resmi bimbingan berkala</p>
                </div>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Pilih Mentee Bimbingan <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={reportForm.pairing_id}
                  onChange={(e) => setReportForm({ ...reportForm, pairing_id: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                >
                  <option value="">-- Pilih Mentee --</option>
                  {mentees.map((m) => (
                    <option key={m.pairing_id} value={m.pairing_id}>
                      {m.mentee?.name} ({m.mentee?.email}) - {m.subscription_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tanggal Laporan <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={reportForm.report_date}
                  onChange={(e) => setReportForm({ ...reportForm, report_date: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                />
              </div>

              {/* Rubrik Aspek Penilaian */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Indikator Penilaian Berkala
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">Pemahaman</label>
                    <select
                      value={reportForm.comprehension_level}
                      onChange={(e) => setReportForm({ ...reportForm, comprehension_level: e.target.value })}
                      className="w-full p-2 text-xs border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="Sangat Baik">Sangat Baik</option>
                      <option value="Baik">Baik</option>
                      <option value="Cukup">Cukup</option>
                      <option value="Perlu Bimbingan">Perlu Bimbingan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">Keaktifan</label>
                    <select
                      value={reportForm.activeness}
                      onChange={(e) => setReportForm({ ...reportForm, activeness: e.target.value })}
                      className="w-full p-2 text-xs border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="Sangat Aktif">Sangat Aktif</option>
                      <option value="Aktif">Aktif</option>
                      <option value="Pasif">Pasif</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">Kualitas Tugas</label>
                    <select
                      value={reportForm.task_quality}
                      onChange={(e) => setReportForm({ ...reportForm, task_quality: e.target.value })}
                      className="w-full p-2 text-xs border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="Istimewa">Istimewa</option>
                      <option value="Memuaskan">Memuaskan</option>
                      <option value="Standar">Standar</option>
                      <option value="Perlu Revisi">Perlu Revisi</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Catatan Evaluasi Perkembangan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan kemajuan mentee, materi yang telah dikuasai, sikap belajar, dan poin yang masih perlu diperbaiki..."
                  value={reportForm.note}
                  onChange={(e) => setReportForm({ ...reportForm, note: e.target.value })}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Rekomendasi Langkah Selanjutnya (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: Perbanyak latihan styling Tailwind, lanjutkan bab integrasi API..."
                  value={reportForm.recommendation}
                  onChange={(e) => setReportForm({ ...reportForm, recommendation: e.target.value })}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#b38867] hover:bg-[#a27355] rounded-xl transition shadow-sm"
                >
                  Simpan Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}