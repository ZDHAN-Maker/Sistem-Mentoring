import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import api from "../../../axiosInstance";
import { 
  GraduationCap, 
  UserCheck, 
  Award, 
  BookOpen, 
  Calendar, 
  ShieldCheck, 
  CreditCard, 
  RefreshCw, 
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles
} from "lucide-react";

export default function StudentPortalMentee() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [mentorData, setMentorData] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPortalData = async () => {
    setLoading(true);
    try {
      const [dashRes, mentorRes, subRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/my-mentor").catch(() => ({ data: { data: null } })),
        api.get("/submissions").catch(() => ({ data: { data: [] } }))
      ]);

      setStats(dashRes.data?.cards || {});
      setMentorData(mentorRes.data?.data || null);
      setSubmissions(subRes.data?.data || []);
    } catch (err) {
      console.error("Gagal memuat portal siswa:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16 text-gray-500">
        <RefreshCw className="animate-spin text-[#b38867] mr-3" size={24} />
        <span className="font-medium">Memuat Portal Siswa...</span>
      </div>
    );
  }

  // Calculate average grade
  const gradedSubmissions = submissions.filter(s => s.grade !== null);
  const avgGrade = gradedSubmissions.length > 0
    ? (gradedSubmissions.reduce((acc, curr) => acc + Number(curr.grade), 0) / gradedSubmissions.length).toFixed(1)
    : "N/A";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Portal</h1>
          <p className="text-gray-500 text-sm mt-1">
            Ringkasan status akademik, rekam jejak bimbingan, dan paket keanggotaan Anda.
          </p>
        </div>

        <button
          onClick={fetchPortalData}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#b38867] to-[#7B5E4A] text-white flex items-center justify-center font-bold text-3xl shadow">
            {user?.name?.charAt(0) || "M"}
          </div>

          <div className="space-y-2 flex-1 text-center md:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-center sm:self-auto">
                Akun Aktif (Mentee)
              </span>
            </div>

            <p className="text-xs text-gray-600 max-w-xl">
              Terdaftar sebagai peserta bimbingan intensif platform Sistem Mentoring Aeterna.
            </p>
          </div>
        </div>
      </div>

      {/* Academic Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Rata-rata Nilai</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-emerald-600">{avgGrade}</span>
            <Award className="w-6 h-6 text-emerald-500" />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">{gradedSubmissions.length} tugas dinilai</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Kemajuan Materi</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-[#b38867]">{stats?.progress_belajar_persen ?? 0}%</span>
            <BookOpen className="w-6 h-6 text-[#b38867]" />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">{stats?.materi_selesai ?? 0} modul selesai</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Tugas Dikumpulkan</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-amber-600">{submissions.length}</span>
            <CheckCircle2 className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">{stats?.tugas_aktif ?? 0} tugas aktif</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Laporan Mentor</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-purple-600">{stats?.progress_report ?? 0}</span>
            <GraduationCap className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Evaluasi berkala</p>
        </div>
      </div>

      {/* 2-Column Info: Mentorship status & Membership plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mentorship Status */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
            <UserCheck size={18} className="text-[#b38867]" />
            Status Bimbingan Terkini
          </h3>

          {mentorData?.mentor ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="text-gray-400 block text-[11px]">Mentor Pembimbing:</span>
                <span className="font-bold text-gray-800 text-sm">{mentorData.mentor.name}</span>
                <p className="text-gray-500">{mentorData.mentor.email}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="text-gray-400 block text-[11px]">Catatan Batch Program:</span>
                <p className="font-medium text-gray-700">{mentorData.notes || "Mentoring Intensif Karir"}</p>
              </div>

              <div className="pt-2 flex gap-2">
                <Link
                  to="/mentee-dashboard/mentor"
                  className="w-full text-center py-2 text-xs font-semibold text-[#7B5E4A] bg-amber-50 hover:bg-amber-100 rounded-xl transition"
                >
                  Lihat Profil Lengkap Mentor &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500">Belum dipasangkan dengan mentor aktif.</p>
          )}
        </div>

        {/* Subscription Plan Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
              <CreditCard size={18} className="text-indigo-600" />
              Paket Langganan Mentoring
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Active Member
            </span>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Akses tak terbatas ke seluruh materi pembelajaran, review tugas langsung dari praktisi industri, dan sesi konsultasi intensif 1-on-1.
          </p>

          <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100/70 text-xs space-y-1">
            <span className="font-semibold text-indigo-900">Perlu sesi mentoring tambahan atau ganti mentor?</span>
            <p className="text-indigo-700 text-[11px]">
              Tingkatkan paket langganan Anda untuk mendapatkan kuota sesi lebih banyak dan fleksibilitas jadwal.
            </p>
          </div>

          <div className="pt-2 flex gap-2">
            <Link
              to="/langganan"
              className="w-full text-center py-2.5 text-xs font-semibold text-white bg-[#b38867] hover:bg-[#a27355] rounded-xl shadow-xs transition"
            >
              Lihat Pilihan Paket Langganan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
