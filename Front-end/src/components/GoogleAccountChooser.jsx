// src/components/GoogleAccountChooser.jsx
import React, { useState } from "react";
import { X, Sparkles, UserPlus, AlertCircle, Check } from "lucide-react";
import api from "../axiosInstance";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function GoogleAccountChooser({ isOpen, onClose }) {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [customRole, setCustomRole] = useState("Mentee");

  if (!isOpen) return null;

  const defaultAccounts = [
    {
      name: "Budi Pratama",
      email: "budi.mentee@gmail.com",
      role: "Mentee",
      roleBadge: "Akun Mentee",
      avatarBg: "bg-blue-600",
      avatarInitial: "B",
    },
    {
      name: "Sarah Jessica",
      email: "sarah.mentor@gmail.com",
      role: "Mentor",
      roleBadge: "Akun Mentor",
      avatarBg: "bg-amber-600",
      avatarInitial: "S",
    },
    {
      name: "Rian Ramadhan",
      email: "rian.google@gmail.com",
      role: "Mentee",
      roleBadge: "Siswa Baru",
      avatarBg: "bg-emerald-600",
      avatarInitial: "R",
    },
  ];

  const handleSelectAccount = async (account) => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/google/simulate", {
        email: account.email,
        name: account.name,
        role: account.role || "Mentee",
      });

      if (res.data?.token) {
        const { user, roles, token } = res.data;
        const loggedIn = loginWithToken(token, user, roles);
        onClose();
        navigate(`/${loggedIn.role}-dashboard`);
      } else {
        setError("Gagal mendapatkan token autentikasi Google.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal masuk menggunakan akun Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) {
      setError("Email akun Google wajib diisi.");
      return;
    }
    handleSelectAccount({
      name: customName.trim() || customEmail.split("@")[0],
      email: customEmail.trim(),
      role: customRole,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google Header */}
        <div className="p-6 border-b border-slate-100 bg-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
            title="Tutup"
          >
            <X size={18} />
          </button>

          {/* Official Google G Logo */}
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
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
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Google Single Sign-On
            </span>
          </div>

          <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
            Pilih akun Google Anda
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Untuk melanjutkan masuk atau mendaftar ke <span className="font-semibold text-slate-800">Aeterna Mentoring</span>.
          </p>

          {/* Info Banner Mode Simulator */}
          <div className="mt-3.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2 text-xs text-amber-800">
            <Sparkles size={14} className="text-[#b38867] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <span className="font-bold">Mode Pengujian Aktif:</span> Kredensial OAuth di <code className="bg-amber-100 px-1 rounded">.env</code> belum diisi. Anda dapat langsung memilih akun demo di bawah atau menambahkan profil kustom untuk menguji alur login Google.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Account Selector List */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-80 divide-y divide-slate-100">
          {defaultAccounts.map((acc, idx) => (
            <button
              key={idx}
              type="button"
              disabled={loading}
              onClick={() => handleSelectAccount(acc)}
              className="w-full py-3 px-3.5 text-left rounded-2xl hover:bg-slate-50 flex items-center justify-between gap-3 transition cursor-pointer group disabled:opacity-50"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-full ${acc.avatarBg} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition`}>
                  {acc.avatarInitial}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-slate-900 truncate">
                      {acc.name}
                    </span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      {acc.roleBadge}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 truncate block">
                    {acc.email}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#b38867] opacity-0 group-hover:opacity-100 transition shrink-0">
                Masuk →
              </span>
            </button>
          ))}

          {/* Opsi Tambah Akun Kustom */}
          <div className="pt-2">
            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="w-full py-2.5 px-3.5 text-left rounded-2xl hover:bg-slate-50 flex items-center gap-3 text-slate-600 hover:text-slate-900 transition cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-dashed border-slate-300 text-slate-500 flex items-center justify-center shrink-0">
                  <UserPlus size={16} />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-800 block">
                    Gunakan Akun Google Lainnya
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Masukkan email Google baru untuk simulasi pendaftaran
                  </span>
                </div>
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 mt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Input Akun Google Simulasi
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(false)}
                    className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    Batal
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Contoh: Rian Pratama"
                    className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#b38867]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Alamat Gmail
                  </label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="nama@gmail.com"
                    required
                    className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#b38867]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Daftar Sebagai Peran (Role)
                  </label>
                  <select
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#b38867]"
                  >
                    <option value="Mentee">Mentee (Peserta Bimbingan)</option>
                    <option value="Mentor">Mentor (Tenaga Ahli)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading || !customEmail.trim()}
                  className="w-full py-2 bg-[#b38867] hover:bg-[#a27355] text-white rounded-xl text-xs font-bold shadow-2xs transition disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Memproses..." : "Masuk dengan Akun Ini"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Aeterna Mentoring Security</span>
          <span>Privasi & Ketentuan Layanan</span>
        </div>
      </div>
    </div>
  );
}
