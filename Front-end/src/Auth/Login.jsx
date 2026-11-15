import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  AlertCircle
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    if (!email || !password) {
      setErrorMessage("Email dan password wajib diisi!");
      setIsLoading(false);
      return;
    }

    try {
      const { role: userRole } = await login(email, password, rememberMe);

      const redirectPaths = {
        admin: "/admin-dashboard",
        mentor: "/mentor-dashboard",
        mentee: "/mentee-dashboard",
      };

      navigate(redirectPaths[userRole] || "/");
    } catch (error) {
      let msg = "Terjadi kesalahan saat login.";

      if (error.response?.status === 401) msg = "Email atau kata sandi tidak sesuai.";
      else if (error.response?.status === 419) msg = "Sesi telah berakhir. Silakan muat ulang halaman.";
      else if (error.response?.status === 422)
        msg = error.response.data.message || "Data yang dimasukkan tidak valid.";
      else if (error.request) msg = "Tidak dapat terhubung ke server backend.";

      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword("password");
    setErrorMessage("");
  };

  const handleGoogleLogin = () => {
    alert("Login SSO Google saat ini sedang dalam proses konfigurasi OAuth 2.0. Silakan gunakan akun demo atau email terdaftar.");
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] sm:min-h-[calc(100vh-5rem)] bg-gradient-to-b from-stone-50 via-slate-50 to-stone-100 flex items-center justify-center p-4 sm:p-6 lg:p-10">
      
      {/* Centered Modern Enterprise Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-stone-900/5 border border-stone-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* ============================================================== */}
        {/* 1. SISI KIRI: BRAND SHOWCASE (DESKTOP)                         */}
        {/* ============================================================== */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#1E1713] via-[#2A201A] to-[#140F0C] text-white p-8 lg:p-10 flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
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

          {/* Center Showcase Message */}
          <div className="relative z-10 space-y-5 my-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-semibold">
              <Sparkles size={13} className="text-[#b38867]" />
              <span>Akselerasi Karier Profesional</span>
            </div>

            <h2 className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Bimbingan Intensif Bersama Praktisi Industri Terbaik
            </h2>

            <p className="text-stone-300 text-xs xl:text-sm leading-relaxed font-medium">
              Akses sesi mentoring tatap muka 1-on-1, penugasan portofolio nyata, dan materi e-learning terstandarisasi untuk mengakselerasi kompetensi digital Anda.
            </p>

            {/* Testimonial Widget */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 mt-4 shadow-sm">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
                <span className="text-[11px] font-bold text-stone-200 ml-1.5">4.9/5 Rating</span>
              </div>
              <p className="italic text-xs text-stone-200 font-medium leading-relaxed">
                "Bimbingan 1-on-1 di Aeterna sangat aplikatif dan terstruktur, membantu saya memahami arsitektur software enterprise secara mendalam."
              </p>
              <div className="flex items-center justify-between text-[11px] text-stone-300 pt-1 border-t border-white/10">
                <span className="font-semibold text-white">Reza Aditya</span>
                <span className="text-amber-300 font-medium">Frontend Engineer • Alumni</span>
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
        {/* 2. SISI KANAN: FORMULIR LOGIN ENTERPRISE                       */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto space-y-5">
            
            {/* Form Title & Greeting */}
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-[#7B5E4A] text-[11px] font-bold border border-amber-200 mb-1">
                <Sparkles size={11} className="text-[#b38867]" />
                <span>Portal Masuk Pengguna</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Masuk ke Akun Anda
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Silakan masukkan email dan kata sandi Anda untuk melanjutkan.
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 font-medium animate-in fade-in duration-150">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Google SSO Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition shadow-2xs"
            >
              <img src="/assets/google.png" alt="Google" className="w-4 h-4 object-contain" />
              <span>Masuk dengan Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-medium">
                  atau masuk dengan email
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Field Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700">
                  Alamat Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#b38867] focus:ring-2 focus:ring-[#b38867]/20 font-medium transition disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* Field Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                    Kata Sandi <span className="text-red-500">*</span>
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Silakan hubungi administrator di support@aeterna.id untuk mereset kata sandi akun Anda.");
                    }}
                    className="text-xs font-medium text-[#b38867] hover:underline"
                  >
                    Lupa Kata Sandi?
                  </a>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#b38867] focus:ring-2 focus:ring-[#b38867]/20 font-medium transition disabled:bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition p-1"
                    title={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#b38867] focus:ring-[#b38867] cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 text-xs text-slate-600 font-medium cursor-pointer">
                  Ingat saya di perangkat ini
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#b38867] hover:bg-[#a27355] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Akun</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Login Tabs */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Akun Uji Coba Cepat (Demo):</span>
                <span className="text-[11px] font-mono text-slate-400">pass: password</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount("mentor@example.com")}
                  className="py-1.5 px-2 rounded-lg border border-slate-200 hover:border-[#b38867]/60 bg-slate-50 hover:bg-amber-50/40 text-slate-600 hover:text-[#7B5E4A] text-xs font-semibold transition text-center"
                >
                  Mentor
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount("mentee@example.com")}
                  className="py-1.5 px-2 rounded-lg border border-slate-200 hover:border-[#b38867]/60 bg-slate-50 hover:bg-amber-50/40 text-slate-600 hover:text-[#7B5E4A] text-xs font-semibold transition text-center"
                >
                  Mentee
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount("admin@example.com")}
                  className="py-1.5 px-2 rounded-lg border border-slate-200 hover:border-[#b38867]/60 bg-slate-50 hover:bg-amber-50/40 text-slate-600 hover:text-[#7B5E4A] text-xs font-semibold transition text-center"
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Bottom Register Switch */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-500 font-medium">
                Belum memiliki akun Aeterna?{" "}
                <Link to="/register" className="font-bold text-[#b38867] hover:underline">
                  Daftar Akun Baru Sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
