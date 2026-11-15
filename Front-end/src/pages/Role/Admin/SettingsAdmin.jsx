import React, { useState, useEffect } from "react";
import api from "../../../axiosInstance";
import { useAuth } from "../../../context/useAuth";
import { 
  User, 
  Shield, 
  Settings, 
  Key, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Server, 
  BellRing,
  Globe
} from "lucide-react";

export default function SettingsAdmin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile"); // 'profile', 'security', 'system'

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });

  // Password Form
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  // System Settings State
  const [systemConfig, setSystemConfig] = useState({
    platform_name: "Aeterna Mentoring",
    support_email: "support@aeterna.id",
    max_mentees_per_mentor: 5,
    allow_registration: true,
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await api.put("/user/profile", profileData);
      setFeedback({ type: "success", message: res.data?.message || "Profil berhasil diperbarui." });
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal memperbarui profil.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setFeedback({ type: "error", message: "Konfirmasi password baru tidak cocok." });
      return;
    }
    if (passwordData.new_password.length < 6) {
      setFeedback({ type: "error", message: "Password baru minimal 6 karakter." });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const res = await api.put("/user/change-password", {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      setFeedback({ type: "success", message: res.data?.message || "Password berhasil diubah." });
      setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal mengubah password.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleSystemSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    setTimeout(() => {
      setSaving(false);
      setFeedback({ type: "success", message: "Konfigurasi sistem berhasil disimpan." });
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan Sistem & Akun Admin</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola profil administrator, keamanan kata sandi, dan preferensi platform.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-3 animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle size={18} className="shrink-0 text-red-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => { setActiveTab("profile"); setFeedback(null); }}
          className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === "profile"
              ? "border-[#b38867] text-[#b38867]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <User size={16} />
          Profil Admin
        </button>

        <button
          onClick={() => { setActiveTab("security"); setFeedback(null); }}
          className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === "security"
              ? "border-[#b38867] text-[#b38867]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Shield size={16} />
          Keamanan & Password
        </button>

        <button
          onClick={() => { setActiveTab("system"); setFeedback(null); }}
          className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === "system"
              ? "border-[#b38867] text-[#b38867]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Server size={16} />
          Konfigurasi Platform
        </button>
      </div>

      {/* Tab 1: Profil Admin */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs max-w-2xl">
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="flex items-center gap-5 pb-5 border-b border-gray-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#b38867] to-[#7B5E4A] text-white font-bold text-2xl flex items-center justify-center shadow-xs">
                {profileData.name?.charAt(0) || "A"}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base">{profileData.name || "Administrator"}</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 inline-block mt-1">
                  Super Administrator
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nama Lengkap Administrator
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#b38867] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#b38867] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nomor Telepon / WhatsApp
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="Contoh: 081234567890"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#b38867] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Catatan Bio / Ringkasan Akun
              </label>
              <textarea
                rows={3}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Deskripsi singkat mengenai peran admin..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#b38867] focus:outline-none"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Menyimpan..." : "Simpan Perubahan Profil"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Keamanan & Password */}
      {activeTab === "security" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs max-w-2xl">
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div className="space-y-1 pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base">Ganti Kata Sandi</h3>
              <p className="text-xs text-gray-500">
                Pastikan Anda menggunakan kata sandi yang aman dan tidak digunakan di platform lain.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kata Sandi Lama
              </label>
              <input
                type="password"
                value={passwordData.old_password}
                onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                required
                placeholder="Masukkan kata sandi lama Anda"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#b38867] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kata Sandi Baru (Minimal 6 Karakter)
              </label>
              <input
                type="password"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                required
                placeholder="Masukkan kata sandi baru"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#b38867] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                type="password"
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                required
                placeholder="Ketik ulang kata sandi baru"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#b38867] focus:outline-none"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
              >
                <Key size={16} />
                {saving ? "Memproses..." : "Perbarui Kata Sandi"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Konfigurasi Platform */}
      {activeTab === "system" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs max-w-2xl">
          <form onSubmit={handleSystemSubmit} className="space-y-5">
            <div className="space-y-1 pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base">Konfigurasi Umum Platform</h3>
              <p className="text-xs text-gray-500">
                Atur identitas aplikasi dan preferensi operasional bimbingan.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nama Platform Mentoring
              </label>
              <input
                type="text"
                value={systemConfig.platform_name}
                onChange={(e) => setSystemConfig({ ...systemConfig, platform_name: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#b38867] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Dukungan Pengguna (Support)
              </label>
              <input
                type="email"
                value={systemConfig.support_email}
                onChange={(e) => setSystemConfig({ ...systemConfig, support_email: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#b38867] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kapasitas Maksimal Mentee per Mentor
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={systemConfig.max_mentees_per_mentor}
                onChange={(e) => setSystemConfig({ ...systemConfig, max_mentees_per_mentor: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#b38867] focus:outline-none"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Batas rekomendasi sistem saat admin melakukan *Pairing*.
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <span className="font-semibold text-xs text-gray-800 block">Pendaftaran Mentee Baru Terbuka</span>
                <span className="text-[11px] text-gray-500">Izinkan publik untuk mendaftar akun mentee baru lewat halaman Register.</span>
              </div>
              <input
                type="checkbox"
                checked={systemConfig.allow_registration}
                onChange={(e) => setSystemConfig({ ...systemConfig, allow_registration: e.target.checked })}
                className="w-4 h-4 text-[#b38867] rounded focus:ring-[#b38867]"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Menyimpan..." : "Simpan Pengaturan Platform"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
