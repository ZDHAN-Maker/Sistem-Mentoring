import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../axiosInstance";
import { 
  UserCheck, 
  Mail, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  MessageSquare, 
  RefreshCw, 
  AlertCircle,
  Clock,
  Sparkles
} from "lucide-react";

export default function MyMentor() {
  const [pairing, setPairing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMentor = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/my-mentor");
      setPairing(res.data?.data || null);
    } catch (err) {
      console.error("Gagal memuat data mentor:", err);
      setError("Gagal memuat profil mentor pembimbing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentor();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16 text-gray-500">
        <RefreshCw className="animate-spin text-[#b38867] mr-3" size={24} />
        <span className="font-medium">Memuat data mentor...</span>
      </div>
    );
  }

  const mentor = pairing?.mentor;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mentor Pembimbing Saya</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kenali mentor profesional yang mendampingi dan mengevaluasi perjalanan belajar Anda.
          </p>
        </div>

        <button
          onClick={fetchMentor}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {!mentor ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 p-8">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#b38867]">
            <UserCheck className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Belum Memiliki Mentor</h3>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
            Anda belum dipasangkan dengan mentor. Admin sistem akan segera memasangkan Anda dengan mentor yang sesuai dengan program belajar yang Anda pilih.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#b38867] to-[#7B5E4A] text-white flex items-center justify-center font-bold text-3xl shadow-md border-2 border-white">
                {mentor.name?.charAt(0) || "M"}
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">{mentor.name}</h2>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                    {pairing.status === "active" ? "Aktif Membimbing" : pairing.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-2">
                  <Mail size={14} />
                  {mentor.email}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed pt-1">
                  {mentor.bio || "Mentor profesional berdedikasi tinggi untuk membimbing mentee dalam menguasai keahlian industri."}
                </p>
              </div>
            </div>

            {/* Expertises / Learning Activities */}
            <div className="pt-6 border-t border-gray-100 space-y-3">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Sparkles size={16} className="text-[#b38867]" />
                Keahlian & Bidang Mentoring
              </h3>
              {mentor.learning_activities?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mentor.learning_activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60"
                    >
                      <h4 className="font-semibold text-xs text-gray-800">{act.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                        {act.description || "Topik pembelajaran intensif"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Belum ada keahlian terdaftar.</p>
              )}
            </div>

            {/* Direct Contact Button */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
              <a
                href={`mailto:${mentor.email}?subject=Konsultasi%20Program%20Mentoring`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                <Mail size={14} />
                Kirim Email Konsultasi
              </a>
              <Link
                to="/mentee-dashboard/schedule"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
              >
                <Calendar size={14} />
                Lihat Jadwal Bimbingan
              </Link>
            </div>
          </div>

          {/* Pairing Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                Informasi Program Pairing
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5">Tanggal Mulai Bimbingan:</span>
                  <span className="font-semibold text-gray-700">
                    {pairing.started_at ? new Date(pairing.started_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    }) : "-"}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5">Batch / Catatan Program:</span>
                  <p className="font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    {pairing.notes || "Program Bimbingan Intensif"}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <Link
                  to="/mentee-dashboard/tasks"
                  className="w-full text-center py-2 px-3 text-xs font-semibold rounded-xl bg-amber-50 text-[#7B5E4A] hover:bg-amber-100 transition"
                >
                  Tugas dari Mentor
                </Link>
                <Link
                  to="/mentee-dashboard/reports"
                  className="w-full text-center py-2 px-3 text-xs font-semibold rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
                >
                  Laporan Perkembangan
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
