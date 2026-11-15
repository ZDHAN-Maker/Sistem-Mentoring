import React, { useState, useEffect } from "react";
import api from "../../../axiosInstance";
import { 
  Award, 
  ShieldCheck, 
  ExternalLink, 
  Printer, 
  CheckCircle2, 
  Copy, 
  Calendar, 
  Sparkles, 
  FileText, 
  Download, 
  X,
  Search,
  Check
} from "lucide-react";
import { Link } from "react-router-dom";

export default function MyCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await api.get("/certificates");
      setCertificates(res.data?.data || []);
    } catch (err) {
      console.error("Gagal memuat sertifikat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleCopyLink = (code) => {
    const url = `${window.location.origin}/verify-certificate/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
            <ShieldCheck size={13} />
            <span>Terstandarisasi SKKNI & Industri</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sertifikat Kompetensi Digital
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Daftar sertifikat kelulusan program dan modul mentoring yang telah diverifikasi resmi dengan nomor registrasi unik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/verify-certificate"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-white shadow-2xs transition"
          >
            <Search size={14} />
            <span>Portal Verifikasi Publik</span>
          </Link>
        </div>
      </div>

      {/* Certificate Cards Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-3 border-[#b38867] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold">Memuat sertifikat digital Anda...</p>
        </div>
      ) : certificates.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b38867] to-amber-500" />

              <div className="space-y-4">
                {/* Header Card */}
                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#b38867] border border-amber-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                      <Award size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        {cert.program_track}
                      </span>
                      <h2 className="text-base font-extrabold text-slate-900 leading-snug">
                        {cert.title}
                      </h2>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 flex items-center gap-1">
                    <CheckCircle2 size={11} /> Aktif
                  </span>
                </div>

                {/* Info Metadata */}
                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Nomor Registrasi:</span>
                    <span className="font-mono font-bold text-slate-800 tracking-wide text-[11px]">
                      {cert.certificate_code}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Standar Acuan:</span>
                    <span className="font-semibold text-slate-700 text-right text-[11px] truncate max-w-[200px]" title={cert.skkni_reference}>
                      {cert.skkni_reference}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Predikat Kelulusan:</span>
                    <span className="font-extrabold text-[#7B5E4A] bg-amber-100/60 px-2 py-0.5 rounded text-[11px]">
                      {cert.grade}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Tanggal Terbit:</span>
                    <span className="font-medium text-slate-700">
                      {new Date(cert.issue_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Unit Kompetensi Ringkas */}
                {cert.competencies && cert.competencies.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Unit Kompetensi Teruji:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.competencies.slice(0, 3).map((comp, idx) => (
                        <span key={idx} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200">
                          ✓ {comp}
                        </span>
                      ))}
                      {cert.competencies.length > 3 && (
                        <span className="text-[11px] px-2 py-1 rounded-lg bg-slate-50 text-slate-400 font-medium">
                          +{cert.competencies.length - 3} lainnya
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="flex-1 py-2.5 px-4 bg-[#b38867] hover:bg-[#a27355] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Award size={14} />
                  <span>Lihat & Cetak Sertifikat</span>
                </button>

                <button
                  onClick={() => handleCopyLink(cert.certificate_code)}
                  className="p-2.5 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                  title="Salin Tautan Verifikasi Publik"
                >
                  {copiedCode === cert.certificate_code ? (
                    <Check size={16} className="text-emerald-600" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>

                <Link
                  to={`/verify-certificate/${cert.certificate_code}`}
                  target="_blank"
                  className="p-2.5 text-[#b38867] hover:text-[#7B5E4A] border border-[#b38867]/30 bg-amber-50/50 rounded-xl hover:bg-amber-50 transition"
                  title="Buka Halaman Verifikasi"
                >
                  <ExternalLink size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Award size={40} className="mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">Belum Ada Sertifikat Diterbitkan</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Selesaikan seluruh tugas proyek modul mentoring dan dapatkan nilai kelulusan dari mentor Anda untuk memperoleh sertifikat kompetensi SKKNI.
          </p>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL FULL DIGITAL CERTIFICATE PREVIEW & PRINTABLE VIEW        */}
      {/* ============================================================== */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            
            {/* Modal Controls Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-700">Pratinjau Sertifikat Resmi</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  <Printer size={14} />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* ============================================================== */}
            {/* OFFICIAL CERTIFICATE PAPER LAYOUT (PRINTABLE REGION)           */}
            {/* ============================================================== */}
            <div 
              id="printable-certificate"
              className="relative p-8 sm:p-12 rounded-2xl bg-[#FCFAF7] border-8 border-double border-[#b38867]/40 shadow-inner overflow-hidden text-center space-y-6"
            >
              {/* Ornamental Guilloche Border Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#b38867]/5 rounded-full blur-2xl pointer-events-none" />

              {/* Certificate Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2.5">
                  <img
                    src="/assets/Logo Sistem Mentoring.png"
                    alt="Logo Aeterna"
                    className="w-12 h-12 object-contain"
                  />
                  <div className="text-left">
                    <span className="font-black text-xl text-slate-900 tracking-tight block">
                      Aeterna Academy
                    </span>
                    <span className="text-[10px] text-stone-500 font-semibold tracking-wider uppercase block">
                      Lembaga Pelatihan & Mentoring Terakreditasi
                    </span>
                  </div>
                </div>

                <div className="pt-3">
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#7B5E4A] block">
                    SERTIFIKAT KOMPETENSI PROFESIONAL DIGITAL
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 block mt-0.5">
                    No. Registrasi: {selectedCert.certificate_code}
                  </span>
                </div>
              </div>

              {/* Recipient Announcement */}
              <div className="space-y-1">
                <p className="text-xs text-stone-500 italic">Sertifikat ini dengan bangga dianugerahkan kepada:</p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight border-b-2 border-[#b38867]/30 pb-2 inline-block px-8">
                  {selectedCert.mentee?.name || "Peserta Mentoring"}
                </h3>
              </div>

              {/* Achievement Statement */}
              <div className="max-w-2xl mx-auto space-y-2">
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                  Telah menyelesaikan dengan predikat kelulusan <strong className="text-[#7B5E4A] font-extrabold">"{selectedCert.grade}"</strong> pada program pembelajaran intensif berbasis proyek riil:
                </p>
                <h4 className="text-lg sm:text-xl font-black text-slate-900">
                  {selectedCert.title}
                </h4>
                <p className="text-xs text-stone-500 font-medium">
                  Sesuai dengan Kerangka Standar: <em>{selectedCert.skkni_reference}</em>
                </p>
              </div>

              {/* Competencies Box */}
              {selectedCert.competencies && (
                <div className="max-w-xl mx-auto p-4 rounded-xl bg-white/80 border border-stone-200/80 text-left text-xs space-y-1.5">
                  <p className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                    Daftar Unit Kompetensi Terverifikasi:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-stone-600 font-medium">
                    {selectedCert.competencies.map((c, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Signatures & Seal */}
              <div className="pt-6 border-t border-[#b38867]/20 flex items-center justify-between max-w-2xl mx-auto text-xs text-stone-600">
                <div className="text-center space-y-1">
                  <div className="font-serif italic font-bold text-slate-800 text-sm">
                    {selectedCert.mentor?.name || "Lead Instructor"}
                  </div>
                  <div className="w-28 border-b border-stone-400 mx-auto"></div>
                  <p className="text-[10px] text-stone-500 font-bold uppercase">Senior Mentor & Instruktur</p>
                </div>

                {/* Golden Badge Stamp */}
                <div className="w-18 h-18 rounded-full border-4 border-double border-[#b38867] bg-amber-50/80 flex flex-col items-center justify-center p-1 text-center shadow-xs">
                  <ShieldCheck size={20} className="text-[#b38867]" />
                  <span className="text-[8px] font-black uppercase text-[#7B5E4A] leading-tight mt-0.5">
                    SKKNI VERIFIED
                  </span>
                </div>

                <div className="text-center space-y-1">
                  <div className="font-serif italic font-bold text-slate-800 text-sm">
                    Dr. H. Wibowo, M.Kom.
                  </div>
                  <div className="w-28 border-b border-stone-400 mx-auto"></div>
                  <p className="text-[10px] text-stone-500 font-bold uppercase">Direktur Akademik Aeterna</p>
                </div>
              </div>

              {/* Certificate Verification Footer */}
              <div className="pt-2 text-[10px] text-stone-400 font-mono">
                Dapat diverifikasi keasliannya di: {window.location.origin}/verify-certificate/{selectedCert.certificate_code}
              </div>
            </div>

            {/* Modal Bottom Close */}
            <div className="flex items-center justify-end gap-3 pt-2 print:hidden">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
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
