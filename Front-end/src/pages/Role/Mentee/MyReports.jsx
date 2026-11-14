import React, { useState, useEffect } from "react";
import api from "../../../axiosInstance";
import { 
  FileText, 
  Calendar, 
  UserCheck, 
  RefreshCw, 
  AlertCircle, 
  Award,
  ChevronRight,
  Eye,
  X
} from "lucide-react";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/progress-reports");
      setReports(res.data?.data || []);
    } catch (err) {
      console.error("Gagal memuat laporan perkembangan:", err);
      setError("Gagal memuat laporan perkembangan Anda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Perkembangan Saya</h1>
          <p className="text-gray-500 text-sm mt-1">
            Evaluasi berkala dan catatan perkembangan yang ditulis oleh mentor pembimbing Anda.
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white p-6 rounded-2xl border border-gray-100 h-28"></div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
            <FileText className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">Belum ada laporan perkembangan</h3>
          <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
            Mentor Anda akan merilis evaluasi berkala setelah beberapa sesi bimbingan atau tugas selesai.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-purple-200 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">
                      Laporan Evaluasi #{report.id}
                    </h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                      <Calendar size={12} />
                      Tanggal Evaluasi:{" "}
                      {new Date(report.report_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    Pembimbing: <strong className="text-gray-700">{report.mentor?.name || report.pairing?.mentor?.name || "Mentor"}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold transition"
                  >
                    <Eye size={14} />
                    Lihat Lengkap
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-600 block mb-1">
                  Catatan & Evaluasi Mentor:
                </span>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100/80 whitespace-pre-wrap">
                  {report.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail Laporan */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-800 text-lg">
                  Detail Laporan Perkembangan
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl">
                <div>
                  <span className="text-gray-400 block mb-0.5">Tanggal Laporan</span>
                  <span className="font-semibold text-gray-700">
                    {new Date(selectedReport.report_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Mentor Penilai</span>
                  <span className="font-semibold text-gray-700">
                    {selectedReport.mentor?.name || selectedReport.pairing?.mentor?.name || "Mentor"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-gray-500 font-semibold block mb-1">Catatan Evaluasi Mendalam:</span>
                <p className="text-sm text-gray-800 bg-purple-50/50 border border-purple-100 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
                  {selectedReport.note}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
