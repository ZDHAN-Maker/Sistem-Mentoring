import React, { useState, useEffect } from "react";
import api from "../../../axiosInstance";
import { 
  FileText, 
  Search, 
  RefreshCw, 
  Calendar, 
  User, 
  MessageSquare, 
  CheckCircle2, 
  X 
} from "lucide-react";

const ProgressReportAdmin = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/progress-reports");
      setReports(res.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil laporan perkembangan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter((r) => {
    const term = searchTerm.toLowerCase();
    const mentorName = r.mentor?.name?.toLowerCase() || r.pairing?.mentor?.name?.toLowerCase() || "";
    const menteeName = r.pairing?.mentee?.name?.toLowerCase() || "";
    const notes = r.notes?.toLowerCase() || "";
    return mentorName.includes(term) || menteeName.includes(term) || notes.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Perkembangan Mentoring</h1>
          <p className="text-gray-500 text-sm mt-1">
            Pantau seluruh laporan evaluasi, kemajuan mentee, dan feedback yang diberikan oleh mentor.
          </p>
        </div>
        <button
          onClick={fetchReports}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 text-sm font-medium transition self-start sm:self-auto"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama mentor, mentee, atau catatan laporan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm outline-none text-gray-700 placeholder-gray-400"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} className="text-xs text-gray-400 hover:text-gray-600">
            Reset
          </button>
        )}
      </div>

      {/* Tabel Laporan */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center text-gray-500">
            <RefreshCw className="animate-spin text-[#b38867] mr-3" size={20} />
            <span>Memuat laporan perkembangan...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                <tr>
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Tanggal Laporan</th>
                  <th className="py-4 px-6">Mentor</th>
                  <th className="py-4 px-6">Mentee</th>
                  <th className="py-4 px-6">Ringkasan Evaluasi</th>
                  <th className="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReports.length > 0 ? (
                  filteredReports.map((r) => {
                    const mentorName = r.mentor?.name || r.pairing?.mentor?.name || "Mentor";
                    const menteeName = r.pairing?.mentee?.name || "Mentee";
                    return (
                      <tr key={r.id} className="hover:bg-gray-50/70 transition">
                        <td className="py-4 px-6 font-mono text-xs text-gray-400">#{r.id}</td>
                        <td className="py-4 px-6 text-xs text-gray-600">
                          {r.report_date ? new Date(r.report_date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          }) : "-"}
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-800">{mentorName}</td>
                        <td className="py-4 px-6 font-medium text-gray-800">{menteeName}</td>
                        <td className="py-4 px-6 text-xs text-gray-600 max-w-sm truncate">
                          {r.notes || r.feedback || "Tidak ada catatan terlampir."}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => setSelectedReport(r)}
                            className="px-3 py-1.5 text-xs font-medium text-[#b38867] bg-[#b38867]/10 hover:bg-[#b38867]/20 rounded-lg transition"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">
                      <FileText size={32} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Belum ada laporan perkembangan yang dibuat oleh mentor.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detail Laporan */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Detail Laporan Perkembangan</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Mentor Pembuat</p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {selectedReport.mentor?.name || selectedReport.pairing?.mentor?.name || "-"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedReport.mentor?.email || selectedReport.pairing?.mentor?.email || ""}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Mentee</p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {selectedReport.pairing?.mentee?.name || "-"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedReport.pairing?.mentee?.email || ""}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Tanggal Laporan</p>
                <p className="text-gray-700 font-medium mt-1">
                  {selectedReport.report_date ? new Date(selectedReport.report_date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  }) : "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Catatan / Evaluasi Perkembangan</p>
                <div className="mt-1 p-3.5 bg-gray-50 rounded-xl text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">
                  {selectedReport.notes || "Tidak ada catatan evaluasi."}
                </div>
              </div>

              {selectedReport.feedback && (
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Feedback untuk Mentee</p>
                  <div className="mt-1 p-3.5 bg-amber-50/50 rounded-xl text-amber-900 leading-relaxed whitespace-pre-wrap border border-amber-100">
                    {selectedReport.feedback}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressReportAdmin;
