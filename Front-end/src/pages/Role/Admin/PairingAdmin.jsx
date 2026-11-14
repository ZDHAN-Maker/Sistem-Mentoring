import React, { useState, useEffect } from "react";
import api from "../../../axiosInstance";
import { 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  Calendar,
  X,
  UserCheck
} from "lucide-react";

const PairingAdmin = () => {
  const [pairings, setPairings] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    mentor_id: "",
    mentee_id: "",
    notes: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pairRes, mentorRes, menteeRes] = await Promise.all([
        api.get("/pairings"),
        api.get("/mentors"),
        api.get("/mentees")
      ]);
      setPairings(pairRes.data.data || []);
      setMentors(mentorRes.data || []);
      setMentees(menteeRes.data || []);
    } catch (err) {
      console.error("Gagal memuat data pairing:", err);
      setFeedback({ type: "error", message: "Gagal memuat data dari server." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePairing = async (e) => {
    e.preventDefault();
    if (!formData.mentor_id || !formData.mentee_id) {
      setFeedback({ type: "error", message: "Silakan pilih Mentor dan Mentee." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await api.post("/pairings", formData);
      setFeedback({ 
        type: "success", 
        message: res.data.message || "Pairing berhasil dibentuk!" 
      });
      setFormData({ mentor_id: "", mentee_id: "", notes: "" });
      setShowModal(false);
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Gagal membuat pairing.";
      setFeedback({ type: "error", message: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompletePairing = async (pairingId) => {
    if (!window.confirm("Apakah Anda yakin ingin mengakhiri sesi mentoring pairing ini?")) {
      return;
    }

    try {
      const res = await api.patch(`/pairings/${pairingId}/complete`);
      setFeedback({ 
        type: "success", 
        message: res.data.message || "Sesi mentoring berhasil diselesaikan." 
      });
      fetchData();
    } catch (err) {
      setFeedback({ 
        type: "error", 
        message: err.response?.data?.message || "Gagal mengakhiri pairing." 
      });
    }
  };

  const filteredPairings = pairings.filter((p) => {
    const term = searchTerm.toLowerCase();
    const mentorName = p.mentor?.name?.toLowerCase() || "";
    const menteeName = p.mentee?.name?.toLowerCase() || "";
    return mentorName.includes(term) || menteeName.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Pairing Mentor & Mentee</h1>
          <p className="text-gray-500 text-sm mt-1">
            Jodohkan mentee dengan mentor yang tepat untuk memulai sesi pembelajaran.
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
            onClick={() => {
              setFeedback(null);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-sm font-semibold rounded-xl shadow-sm transition"
          >
            <UserPlus size={18} />
            Buat Pairing Baru
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

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama mentor atau mentee..."
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

      {/* Tabel Pairing */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center text-gray-500">
            <RefreshCw className="animate-spin text-[#b38867] mr-3" size={20} />
            <span>Memuat data pairing...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                <tr>
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Mentor</th>
                  <th className="py-4 px-6">Mentee</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Periode</th>
                  <th className="py-4 px-6">Catatan</th>
                  <th className="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPairings.length > 0 ? (
                  filteredPairings.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-4 px-6 font-mono text-xs text-gray-400">#{p.id}</td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-800">{p.mentor?.name || "Mentor #" + p.mentor_id}</div>
                        <div className="text-xs text-gray-500">{p.mentor?.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-800">{p.mentee?.name || "Mentee #" + p.mentee_id}</div>
                        <div className="text-xs text-gray-500">{p.mentee?.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            p.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {p.status === "active" ? "Aktif" : "Selesai"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-500">
                        <div>Mulai: {p.started_at ? new Date(p.started_at).toLocaleDateString("id-ID") : "-"}</div>
                        {p.ended_at && <div>Selesai: {new Date(p.ended_at).toLocaleDateString("id-ID")}</div>}
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-600 max-w-xs truncate">
                        {p.notes || "-"}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {p.status === "active" ? (
                          <button
                            onClick={() => handleCompletePairing(p.id)}
                            className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition"
                          >
                            Akhiri Sesi
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">Telah Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-400">
                      {searchTerm ? "Tidak ditemukan pairing yang cocok dengan pencarian." : "Belum ada pasangan mentoring terdaftar."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form Tambah Pairing */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Buat Pasangan Mentoring</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePairing} className="p-6 space-y-4">
              {/* Pilih Mentor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Pilih Mentor <span className="text-red-500">*</span>
                </label>
                <select
                  name="mentor_id"
                  value={formData.mentor_id}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] focus:border-[#b38867] outline-none"
                >
                  <option value="">-- Pilih Mentor --</option>
                  {mentors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.email})
                    </option>
                  ))}
                </select>
                {mentors.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">Belum ada user dengan role Mentor terdaftar.</p>
                )}
              </div>

              {/* Pilih Mentee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Pilih Mentee <span className="text-red-500">*</span>
                </label>
                <select
                  name="mentee_id"
                  value={formData.mentee_id}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] focus:border-[#b38867] outline-none"
                >
                  <option value="">-- Pilih Mentee --</option>
                  {mentees.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.email})
                    </option>
                  ))}
                </select>
                {mentees.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">Belum ada user dengan role Mentee terdaftar.</p>
                )}
              </div>

              {/* Catatan / Keterangan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Misal: Batch 1 - Fokus Pengembangan Frontend Web..."
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] focus:border-[#b38867] outline-none resize-none"
                />
              </div>

              {/* Action Buttons */}
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
                  {submitting ? "Memproses..." : "Pasangkan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PairingAdmin;
