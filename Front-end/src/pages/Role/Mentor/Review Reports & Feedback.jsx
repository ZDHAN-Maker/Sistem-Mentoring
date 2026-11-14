import React, { useState, useEffect } from "react";
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
  Trash2
} from "lucide-react";

export default function ReviewReportsAndFeedback() {
  const [activeTab, setActiveTab] = useState("submissions"); // 'submissions' | 'progress_reports'
  const [submissions, setSubmissions] = useState([]);
  const [reports, setReports] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

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
    note: "",
  });

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

  // Handler Buka Modal Review
  const openReviewModal = (submission) => {
    setSelectedSub(submission);
    setReviewForm({
      grade: submission.grade || "",
      feedback: submission.feedback || "",
      status: submission.status === "completed" ? "completed" : "reviewed",
    });
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.grade || !reviewForm.feedback.trim()) {
      setFeedback({ type: "error", message: "Nilai dan feedback wajib diisi." });
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
      note: "",
    });
    setShowReportModal(true);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportForm.pairing_id || !reportForm.note.trim()) {
      setFeedback({ type: "error", message: "Pilih mentee dan isi catatan evaluasi perkembangan." });
      return;
    }

    try {
      await api.post("/progress-reports", reportForm);
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
          <h1 className="text-2xl font-bold text-gray-800">Review Mentee & Feedback</h1>
          <p className="text-gray-500 text-sm mt-1">
            Berikan nilai dan ulasan pada tugas mentee, serta susun laporan evaluasi berkala.
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
      <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
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

      {/* Tab Content: Submissions */}
      {activeTab === "submissions" && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
              <RefreshCw className="animate-spin text-[#b38867] mr-3" size={24} />
              <span>Memuat data pengumpulan tugas...</span>
            </div>
          ) : submissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submissions.map((sub) => {
                const isReviewed = sub.status === "reviewed" || sub.status === "completed";
                return (
                  <div
                    key={sub.id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                            isReviewed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isReviewed ? "Sudah Dinilai" : "Menunggu Review"}
                        </span>
                        {sub.grade !== null && (
                          <div className="flex items-center gap-1 font-bold text-sm text-[#7B5E4A]">
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
                        <p className="text-gray-600 line-clamp-2">
                          <strong>Catatan Mentee:</strong> {sub.notes || "Tidak ada catatan."}
                        </p>
                        {sub.submission_url && (
                          <a
                            href={sub.submission_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <ExternalLink size={13} /> Buka Tautan Tugas
                          </a>
                        )}
                      </div>

                      {sub.feedback && (
                        <div className="mt-3 p-3 bg-amber-50/60 rounded-xl text-xs text-amber-900 border border-amber-100">
                          <strong>Feedback Mentor:</strong> {sub.feedback}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">
                        {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString("id-ID") : ""}
                      </span>
                      <button
                        onClick={() => openReviewModal(sub)}
                        className="px-4 py-2 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-semibold rounded-xl transition shadow-sm"
                      >
                        {isReviewed ? "Ubah Nilai & Feedback" : "Beri Nilai & Review"}
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
                      <span className="font-mono">Report #{rep.id}</span>
                      <span>
                        {rep.report_date
                          ? new Date(rep.report_date).toLocaleDateString("id-ID", {
                              day: "numeric", month: "short", year: "numeric"
                            })
                          : ""}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-base">
                      Mentee: {rep.pairing?.mentee?.name || "Mentee Bimbingan"}
                    </h3>

                    <div className="mt-3 p-3.5 bg-gray-50 rounded-xl text-xs text-gray-700 leading-relaxed border border-gray-100 whitespace-pre-wrap">
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

      {/* Modal Review Submission */}
      {showReviewModal && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Nilai & Review Tugas Mentee</h2>
              <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4">
              <div className="p-3 bg-gray-50 rounded-xl text-xs">
                <p className="font-bold text-gray-800">{selectedSub.task?.title || "Tugas"}</p>
                <p className="text-gray-500 mt-0.5">Mentee: {selectedSub.mentee?.name}</p>
                {selectedSub.submission_url && (
                  <a
                    href={selectedSub.submission_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 font-semibold mt-2"
                  >
                    <ExternalLink size={12} /> Buka Hasil Tugas Mentee
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
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none resize-none"
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
                  Simpan Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Create Progress Report */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Buat Evaluasi Perkembangan</h2>
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
                      {m.mentee?.name} ({m.mentee?.email})
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
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none resize-none"
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
