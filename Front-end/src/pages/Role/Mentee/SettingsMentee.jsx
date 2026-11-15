import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../axiosInstance";
import { useAuth } from "../../../context/useAuth";
import { 
  User, 
  Shield, 
  CreditCard, 
  Key, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Bell, 
  GraduationCap,
  Sparkles,
  ExternalLink
} from "lucide-react";

export default function SettingsMentee() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile"); // 'profile', 'subscription', 'security', 'notifications'

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    institution: localStorage.getItem("mentee_institution") || "Universitas Indonesia",
  });

  // Password Form
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Career focus / interest
  const [selectedInterests, setSelectedInterests] = useState(
    JSON.parse(localStorage.getItem("mentee_interests") || '["UI/UX Design", "Full-Stack Web Development"]')
  );

  // Notification Preferences
  const [notifPrefs, setNotifPrefs] = useState({
    on_new_task: true,
    on_grade_released: true,
    on_schedule_reminder: true,
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
      }));
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await api.put("/user/profile", {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        bio: profileData.bio,
      });

      if (profileData.institution) {
        localStorage.setItem("mentee_institution", profileData.institution);
      }

      setFeedback({ type: "success", message: res.data?.message || "Profil mentee berhasil diperbarui." });
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal memperbarui profil mentee.";
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

  const toggleInterest = (interest) => {
    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(updated);
    localStorage.setItem("mentee_interests", JSON.stringify(updated));
  };

  const INTEREST_OPTIONS = [
    "UI/UX Design",
    "Full-Stack Web Development",
    "Frontend Engineering (React/Next.js)",
    "Backend Engineering (Laravel/Node.js)",
    "Data Science & Analytics",
    "Mobile App Development (Flutter)"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan Mentee</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola profil belajar, paket langganan aktif, keamanan kata sandi, dan preferensi notifikasi Anda.
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

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6 overflow-x-auto pb-px">
        <button
          onClick={() => { setActiveTab("profile"); setFeedback(null); }}
          className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === "profile"
              ? "border-[#b38867] text-[#b38867]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <User size={16} />
          Profil Saya
        </button>

        <button
          onClick={() => { setActiveTab("subscription"); setFeedback(null); }}
          className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === "subscription"
              ? "border-[#b38867] text-[#b38867]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <CreditCard size={16} />
          Langganan & Minat Karir
        </button>

        <button
          onClick={() => { setActiveTab("security"); setFeedback(null); }}
          className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === "security"
              ? "border-[#b38867] text-[#b38867]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Shield size={16} />
          Keamanan & Password
        </button>

        <button
          onClick={() => { setActiveTab("notifications"); setFeedback(null); }}
          className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === "notifications"
              ? "border-[#b38867] text-[#b38867]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Bell size={16} />
          Notifikasi
        </button>
      </div>

      {/* Tab 1: Profil Mentee */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs max-w-2xl">
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="flex items-center gap-5 pb-5 border-b border-gray-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#b38867] to-[#7B5E4A] text-white font-bold text-2xl flex items-center justify-center shadow-xs">
                {profileData.name?.charAt(0) || "M"}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base">{profileData.name || "Mentee"}</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mt-1">
                  Mentee Aktif
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nama Lengkap Anda
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
                Nomor WhatsApp / HP (Untuk Dihubungi Mentor & Admin)
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="Contoh: 085712345678"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#b38867] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Institusi / Kampus / Sekolah
              </label>
              <input
                type="text"
                value={profileData.institution}
                onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })}
                placeholder="Nama kampus atau instansi Anda..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#b38867] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tentang Saya & Target Karir
              </label>
              <textarea
                rows={3}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Ceritakan target karir impian dan motivasi belajar Anda..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#b38867] focus:outline-none leading-relaxed"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Menyimpan..." : "Simpan Profil Saya"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Langganan & Minat Karir */}
      {activeTab === "subscription" && (
        <div className="space-y-6 max-w-2xl">
          {/* Subscription Status Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                <CreditCard size={18} className="text-indigo-600" />
                Status Paket Langganan
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Active Member
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Anda saat ini memiliki akses penuh ke sesi bimbingan 1-on-1 dengan mentor, tugas praktis berbobot industri, dan seluruh materi e-learning.
            </p>

            <div className="pt-2">
              <Link
                to="/langganan"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                Upgrade / Perpanjang Paket Langganan
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>

          {/* Career Focus / Interest */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="space-y-1 pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                <Sparkles size={18} className="text-[#b38867]" />
                Fokus Minat Karir Digital
              </h3>
              <p className="text-xs text-gray-500">
                Pilih topik bidang yang ingin Anda fokuskan agar kurikulum dan mentor bimbingan dapat disesuaikan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {INTEREST_OPTIONS.map((opt, idx) => {
                const isSelected = selectedInterests.includes(opt);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleInterest(opt)}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-amber-50 text-[#7B5E4A] border-amber-300 font-semibold"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle2 size={16} className="text-[#b38867] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Keamanan */}
      {activeTab === "security" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs max-w-2xl">
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div className="space-y-1 pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base">Ganti Kata Sandi</h3>
              <p className="text-xs text-gray-500">
                Amankan akun mentee Anda dengan kata sandi baru secara berkala.
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

      {/* Tab 4: Preferensi Notifikasi */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs max-w-2xl space-y-5">
          <div className="space-y-1 pb-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-base">Preferensi Notifikasi Mentee</h3>
            <p className="text-xs text-gray-500">
              Pilih pemberitahuan aktivitas belajar yang ingin Anda dapatkan.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <span className="font-semibold text-xs text-gray-800 block">Pemberitahuan Tugas Baru</span>
                <span className="text-[11px] text-gray-500">Dapatkan notifikasi segera saat mentor menerbitkan tugas atau latihan baru.</span>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.on_new_task}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, on_new_task: e.target.checked })}
                className="w-4 h-4 text-[#b38867] rounded focus:ring-[#b38867]"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <span className="font-semibold text-xs text-gray-800 block">Penilaian & Feedback Tugas</span>
                <span className="text-[11px] text-gray-500">Dapatkan pemberitahuan saat mentor telah memeriksa dan menilai tugas Anda.</span>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.on_grade_released}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, on_grade_released: e.target.checked })}
                className="w-4 h-4 text-[#b38867] rounded focus:ring-[#b38867]"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <span className="font-semibold text-xs text-gray-800 block">Pengingat Jadwal Mentoring</span>
                <span className="text-[11px] text-gray-500">Pengingat otomatis sesi bimbingan 1-on-1 dengan mentor pembimbing.</span>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.on_schedule_reminder}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, on_schedule_reminder: e.target.checked })}
                className="w-4 h-4 text-[#b38867] rounded focus:ring-[#b38867]"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={() => setFeedback({ type: "success", message: "Preferensi notifikasi berhasil disimpan." })}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition"
            >
              <Save size={16} />
              Simpan Preferensi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
