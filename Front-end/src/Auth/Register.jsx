import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, getCsrfCookie } from '../axiosInstance';
import GoogleAccountChooser from '../components/GoogleAccountChooser';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Lengkapi semua data pendaftaran yang wajib diisi.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Kata sandi minimal harus terdiri dari 8 karakter.');
      return;
    }

    if (password !== passwordConfirmation) {
      setErrorMessage('Kata sandi dan konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Anda harus menyetujui Syarat dan Ketentuan Layanan.');
      return;
    }

    setIsLoading(true);

    try {
      await getCsrfCookie();

      await api.post(
        '/register',
        {
          name: name.trim(),
          email: email.trim(),
          password,
          password_confirmation: passwordConfirmation,
          role: 'mentee',
        },
        { withCredentials: true }
      );

      setSuccessMessage('Pendaftaran berhasil! Mengalihkan ke halaman login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      console.error('Error register:', error);
      const msg =
        error?.response?.data?.message ||
        'Pendaftaran gagal! Silakan periksa kembali data Anda.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    try {
      const res = await api.get('/auth/google/redirect');
      if (res.data?.configured && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setShowGoogleChooser(true);
      }
    } catch (err) {
      console.error(err);
      setShowGoogleChooser(true);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] sm:min-h-[calc(100vh-5rem)] bg-gradient-to-b from-stone-50 via-slate-50 to-stone-100 flex items-center justify-center p-4 sm:p-6 lg:p-10">
      
      {/* Centered Modern Enterprise Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-stone-900/5 border border-stone-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* ============================================================== */}
        {/* 1. SISI KIRI: BRAND SHOWCASE (DESKTOP)                         */}
        {/* ============================================================== */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#1E1713] via-[#2A201A] to-[#140F0C] text-white p-8 lg:p-10 flex-col justify-between relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#b38867]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Brand */}
          <div className="relative z-10">
            <Link to="/program" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition">
                <img
                  src="/assets/Logo Sistem Mentoring.png"
                  alt="Aeterna"
                  className="w-full h-full object-contain brightness-110"
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-base tracking-tight">
                    Aeterna Mentoring
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#b38867]/40 text-amber-300 uppercase tracking-wider">
                    Academy
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 font-medium">
                  Enterprise Learning Ecosystem
                </p>
              </div>
            </Link>
          </div>

          {/* Center Showcase Content */}
          <div className="relative z-10 space-y-5 my-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-semibold">
              <GraduationCap size={14} className="text-[#b38867]" />
              <span>Komunitas Belajar Terpadu</span>
            </div>

            <h2 className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Mulai Perjalanan Belajar & Akselerasi Karier Anda
            </h2>

            <p className="text-stone-300 text-xs xl:text-sm leading-relaxed font-medium">
              Bergabunglah bersama ribuan talenta digital lainnya dan dapatkan bimbingan intensif langsung dari para mentor praktisi industri top.
            </p>

            {/* Metrics Widget */}
            <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div>
                <p className="text-base xl:text-lg font-black text-white">15K+</p>
                <p className="text-[10px] text-stone-300 font-medium">Alumni Aktif</p>
              </div>
              <div className="border-x border-white/15">
                <p className="text-base xl:text-lg font-black text-amber-300">100+</p>
                <p className="text-[10px] text-stone-300 font-medium">Senior Mentor</p>
              </div>
              <div>
                <p className="text-base xl:text-lg font-black text-emerald-400">98%</p>
                <p className="text-[10px] text-stone-300 font-medium">Kepuasan</p>
              </div>
            </div>

            {/* Value checklist */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2.5 text-xs text-stone-200">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Bimbingan 1-on-1 dengan Senior Engineer & Lead Designer</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-200">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Kurikulum terstruktur berbasis proyek industri nyata</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-200">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Sertifikat kompetensi digital resmi berstandar SKKNI</span>
              </div>
            </div>
          </div>

          {/* Footer Sisi Kiri */}
          <div className="relative z-10 flex items-center justify-between text-xs text-stone-400 pt-3 border-t border-white/10">
            <span className="flex items-center gap-1.5 text-stone-300">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Standar Industri & SKKNI</span>
            </span>
            <span>© 2026 Aeterna Inc.</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. SISI KANAN: FORMULIR REGISTRASI                             */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto space-y-4">
            
            {/* Form Title & Greeting */}
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-[#7B5E4A] text-[11px] font-bold border border-amber-200 mb-1">
                <Sparkles size={11} className="text-[#b38867]" />
                <span>Registrasi Akun Baru</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Buat Akun Mentee
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Daftar sekarang untuk mulai memilih program pembelajaran dan mentor Anda.
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 font-medium animate-in fade-in duration-150">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 font-medium animate-in fade-in duration-150">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Google SSO Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition shadow-2xs cursor-pointer disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <div className="w-4 h-4 border-2 border-[#b38867]/30 border-t-[#b38867] rounded-full animate-spin" />
              ) : (
                <img src="/assets/google.png" alt="Google" className="w-4 h-4 object-contain" />
              )}
              <span>{isGoogleLoading ? "Menghubungkan ke Google..." : "Daftar dengan Google"}</span>
            </button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-medium">
                  atau daftar dengan email
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Field Nama Lengkap */}
              <div className="space-y-1">
                <label htmlFor="name" className="block text-xs font-semibold text-slate-700">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Lengkap Anda"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#b38867] focus:ring-2 focus:ring-[#b38867]/20 font-medium transition disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* Field Email */}
              <div className="space-y-1">
                <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700">
                  Alamat Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#b38867] focus:ring-2 focus:ring-[#b38867]/20 font-medium transition disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* Password & Confirm Password (Grid 2 kolom di tablet/desktop untuk menghemat vertikal) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Field Password */}
                <div className="space-y-1">
                  <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-700">
                    Kata Sandi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 karakter"
                      required
                      disabled={isLoading}
                      className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#b38867] focus:ring-2 focus:ring-[#b38867]/20 font-medium transition disabled:bg-slate-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition p-0.5"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Field Konfirmasi Password */}
                <div className="space-y-1">
                  <label htmlFor="reg-confirm-password" className="block text-xs font-semibold text-slate-700">
                    Konfirmasi Kata Sandi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      id="reg-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      placeholder="Ulangi kata sandi"
                      required
                      disabled={isLoading}
                      className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#b38867] focus:ring-2 focus:ring-[#b38867]/20 font-medium transition disabled:bg-slate-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex="-1"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition p-0.5"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Syarat & Ketentuan Checkbox */}
              <div className="flex items-start pt-1">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#b38867] focus:ring-[#b38867] cursor-pointer"
                />
                <label htmlFor="agree-terms" className="ml-2 text-xs text-slate-600 font-medium leading-relaxed cursor-pointer">
                  Saya menyetujui{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Ketentuan Layanan: Dengan mendaftar, Anda menyetujui kebijakan privasi dan etika belajar Aeterna Mentoring.");
                    }}
                    className="text-[#b38867] font-semibold hover:underline"
                  >
                    Syarat & Ketentuan
                  </a>{' '}
                  serta Kebijakan Privasi Aeterna.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#b38867] hover:bg-[#a27355] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mendaftarkan Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Akun Mentee</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Login Switch */}
            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium">
                Sudah memiliki akun Aeterna?{' '}
                <Link to="/login" className="font-bold text-[#b38867] hover:underline">
                  Masuk ke Akun Anda
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Google Account Chooser Modal (Simulator Mode) */}
      <GoogleAccountChooser
        isOpen={showGoogleChooser}
        onClose={() => setShowGoogleChooser(false)}
      />
    </div>
  );
}
