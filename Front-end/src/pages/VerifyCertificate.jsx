import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../axiosInstance";
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Calendar, 
  User, 
  BookOpen, 
  Check, 
  ArrowLeft,
  Sparkles,
  ExternalLink
} from "lucide-react";

export default function VerifyCertificate() {
  const { code } = useParams();
  const [inputCode, setInputCode] = useState(code || "");
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleVerify = async (queryCode) => {
    const target = (queryCode || inputCode || "").trim();
    if (!target) return;

    setLoading(true);
    setErrorMessage("");
    setSearched(true);

    try {
      const res = await api.get(`/public/verify-certificate/${encodeURIComponent(target)}`);
      if (res.data?.verified) {
        setCertData(res.data.data);
      } else {
        setCertData(null);
        setErrorMessage(res.data?.message || "Sertifikat tidak ditemukan.");
      }
    } catch (err) {
      setCertData(null);
      setErrorMessage(
        err.response?.data?.message || 
        "Nomor sertifikat tidak ditemukan atau belum terdaftar dalam pangkalan data verifikasi resmi Aeterna."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      setInputCode(code);
      handleVerify(code);
    }
  }, [code]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-slate-50 to-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            to="/program"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Beranda</span>
          </Link>
          <span className="text-xs text-slate-400 font-medium">
            Sistem Verifikasi Publik Aeterna
          </span>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-2xs">
            <ShieldCheck size={14} />
            <span>Pangkalan Data Sertifikasi Resmi SKKNI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Verifikasi Keaslian Sertifikat Digital
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-medium">
            Masukkan nomor registrasi sertifikat digital untuk memvalidasi identitas pemilik, unit kompetensi yang dikuasai, dan legalitas akreditasi SKKNI.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Contoh: CERT-SKKNI-2026-AET-89412"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#b38867] focus:ring-2 focus:ring-[#b38867]/20 font-mono transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-[#b38867] hover:bg-[#a27355] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Verifikasi Sekarang</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Code Suggestion */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400">
            <span>Contoh Nomor Registrasi Tersedia:</span>
            <button
              type="button"
              onClick={() => {
                setInputCode("CERT-SKKNI-2026-AET-89412");
                handleVerify("CERT-SKKNI-2026-AET-89412");
              }}
              className="font-mono text-[#b38867] hover:underline font-bold"
            >
              CERT-SKKNI-2026-AET-89412
            </button>
          </div>
        </div>

        {/* Verification Result Card */}
        {searched && (
          <div className="animate-in fade-in duration-300">
            {certData ? (
              <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-emerald-500/40 relative overflow-hidden space-y-6">
                
                {/* Verified Ribbon Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 block">
                        Status Verifikasi: Sah & Resmi
                      </span>
                      <p className="text-xs text-emerald-700 font-medium">
                        Sertifikat terdaftar sah dalam pangkalan data Aeterna Mentoring Academy.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-900 bg-white/80 px-3 py-1 rounded-lg border border-emerald-200">
                    VERIFIED • SKKNI
                  </span>
                </div>

                {/* Details Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Left Column: Holder Info */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Nama Penerima Sertifikat
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                        {certData.recipient_name}
                      </h2>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-600">
                        <BookOpen size={14} className="text-[#b38867]" />
                        <span>Program: <strong>{certData.title}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Award size={14} className="text-[#b38867]" />
                        <span>Keminatan / Track: <strong>{certData.program_track}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={14} className="text-[#b38867]" />
                        <span>Tanggal Terbit: <strong>{certData.issue_date}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <User size={14} className="text-[#b38867]" />
                        <span>Mentor Penguji: <strong>{certData.mentor_name}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Accreditation & Grade */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Predikat Kelulusan
                      </span>
                      <span className="text-base font-extrabold text-[#7B5E4A] block mt-0.5">
                        {certData.grade}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Dasar Acuan Standar
                      </span>
                      <span className="text-xs text-slate-700 font-medium block mt-0.5">
                        {certData.skkni_reference}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Unit Kompetensi Teruji
                      </span>
                      <ul className="space-y-1">
                        {certData.competencies?.map((c, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                            <Check size={12} className="text-emerald-600 mt-0.5 shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>

                {/* Issuer Guarantee */}
                <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
                  <span>Diterbitkan resmi oleh <strong>PT Aeterna Solusi Digital</strong></span>
                  <span className="font-mono text-[11px] text-slate-600">ID: {certData.certificate_code}</span>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-rose-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
                  <XCircle size={26} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Sertifikat Tidak Ditemukan</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  {errorMessage || "Nomor sertifikat yang Anda masukkan tidak valid atau belum terdaftar dalam sistem verifikasi kami."}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
