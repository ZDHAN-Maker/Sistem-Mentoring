// src/pages/Auth/GoogleCallback.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../../axiosInstance";
import { useAuth } from "../../context/useAuth";
import { AlertCircle, RefreshCw, ArrowRight } from "lucide-react";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleGoogleAuth = async () => {
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError("Otorisasi Google dibatalkan atau ditolak.");
        setLoading(false);
        return;
      }

      if (!code) {
        setError("Kode otorisasi Google tidak ditemukan dalam tautan.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.post("/auth/google/callback", { code });
        const { token, user, roles } = res.data;

        if (token && user) {
          const loggedIn = loginWithToken(token, user, roles);
          navigate(`/${loggedIn.role}-dashboard`, { replace: true });
        } else {
          setError("Gagal memproses data otentikasi akun.");
        }
      } catch (err) {
        console.error("Google Auth Callback Error:", err);
        setError(
          err.response?.data?.message ||
          "Terjadi kesalahan saat memverifikasi akun Google Anda. Silakan coba kembali."
        );
      } finally {
        setLoading(false);
      }
    };

    handleGoogleAuth();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 text-center space-y-5">
        
        {/* Google Logo */}
        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto shadow-xs border border-slate-200/80">
          <svg className="w-8 h-8" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        </div>

        {loading ? (
          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Memverifikasi Akun Google...
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Mohon tunggu sejenak, kami sedang menyiapkan sesi belajar dan akun Aeterna Anda.
            </p>
            <div className="flex items-center justify-center pt-2">
              <RefreshCw className="animate-spin text-[#b38867]" size={22} />
            </div>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
              <AlertCircle size={14} />
              <span>Gagal Autentikasi</span>
            </div>
            <p className="text-xs text-rose-600 bg-rose-50/70 p-3 rounded-2xl border border-rose-200 leading-relaxed">
              {error}
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
            >
              <span>Kembali ke Halaman Login</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
