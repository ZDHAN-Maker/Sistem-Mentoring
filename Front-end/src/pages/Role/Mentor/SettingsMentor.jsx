import React, { useState, useEffect } from "react";
import api from "../../../axiosInstance";
import { useAuth } from "../../../context/useAuth";
import { 
  User, 
  Shield, 
  Sparkles, 
  Key, 
  Video, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Bell, 
  BookOpen,
  Link as LinkIcon
} from "lucide-react";

export default function SettingsMentor() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile"); // 'profile', 'expertises', 'security', 'notifications'

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    meeting_url: localStorage.getItem("mentor_default_meet") || "",
  });

  // Password Form
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Expertises State
  const [availableExpertises, setAvailableExpertises] = useState([]);
  const [selectedExpertiseIds, setSelectedExpertiseIds] = useState([]);

  // Notifications preferences
  const [notifPrefs, setNotifPrefs] = useState({
    email_on_submission: true,
    email_on_schedule: true,
    inapp_sound: true,
  });

  const [loading, setLoading] = useState(false);
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
    fetchExpertises();
  }, [user]);

  const fetchExpertises = async () => {
    setLoading(true);
    try {
      const [availRes, myRes] = await Promise.all([
        api.get("/learning-activities").catch(() => ({ data: { data: [] } })),
        api.get("/mentor/expertises").catch(() => ({ data: { data: [] } }))
      ]);

      const available = availRes.data?.data || availRes.data || [];
      const myExpertises = myRes.data?.data || myRes.data || [];

      setAvailableExpertises(available);
      setSelectedExpertiseIds(myExpertises.map((e) => e.id));
    } catch (err) {
      console.error("Gagal mengambil data keahlian:", err);
    } finally {
      setLoading(false);
    }
  };

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

      if (profileData.meeting_url) {
        localStorage.setItem("mentor_default_meet", profileData.meeting_url);
      }

      setFeedback({ type: "success", message: res.data?.message || "Profil mentor berhasil diperbarui." });
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal memperbarui profil mentor.";
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

  const handleExpertiseToggle = (id) => {
    setSelectedExpertiseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveExpertises = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      await api.post("/mentor/expertises", {
        learning_activity_ids: selectedExpertiseIds,
      });
      setFeedback({ type: "success", message: "Bidang keahlian bimbingan berhasil disimpan!" });
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menyimpan keahlian.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan Mentor</h1>
        <p className="text-gray-500 text-sm mt-1">
          Atur profil pembimbing, bidang spesialisasi mentoring, kata sandi, dan preferensi notifikasi.
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
          Profil Mentor
        </button>

        <button
          onClick={() => { setActiveTab("expertises"); setFeedback(null); }}
          className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === "expertises"
              ? "border-[#b38867] text-[#b38867]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Sparkles size={16} />
          Bidang Keahlian ({selectedExpertiseIds.length})
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

      {/* Tab 1: Profil Mentor */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs max-w-2xl">
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="flex items-center gap-5 pb-5 border-b border-gray-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#b38867] to-[#7B5E4A] text-white font-bold text-2xl flex items-center justify-center shadow-xs">
                {profileData.name?.charAt(0) || "M"}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base">{profileData.name || "Mentor"}</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-[#7B5E4A] border border-amber-200 inline-block mt-1">
                  Mentor Profesional
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nama Lengkap Mentor
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
                Email Akun
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
                Nomor WhatsApp / HP (Untuk Koordinasi Bimbingan & Pairing)
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
                Bio & Pengalaman Profesional
              </label>
              <textarea
                rows={4}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Ceritakan latar belakang industri, keahlian, dan metodologi bimbingan Anda..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#b38867] focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tautan Meeting Default (Google Meet / Zoom Permanen)
              </label>
              <div className="relative">
                <Video size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={profileData.meeting_url}
                  onChange={(e) => setProfileData({ ...profileData, meeting_url: e.target.value })}
                  placeholder="https://meet.google.com/xxx-yyyy-zzz"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#b38867] focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">
                Tautan ini mempermudah pembuatan jadwal bimbingan sesi tatap muka online secara konsisten.
              </span>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Menyimpan..." : "Simpan Profil Mentor"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Bidang Keahlian */}
      {activeTab === "expertises" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
          <div className="space-y-1 pb-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-base">Bidang Spesialisasi & Kurikulum</h3>
            <p className="text-xs text-gray-500">
              Pilih topik pembelajaran yang Anda kuasai. Informasi ini akan dicocokkan oleh sistem saat memasangkan mentee baru.
            </p>
          </div>

          {availableExpertises.length === 0 ? (
            <p className="text-xs text-gray-400 py-4">Belum ada topik keahlian tersedia di master data.</p>
          ) : (
            <div className="space-y-2.5">
              {availableExpertises.map((exp) => {
                const checked = selectedExpertiseIds.includes(exp.id);
                return (
                  <div
                    key={exp.id}
                    onClick={() => handleExpertiseToggle(exp.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      checked
                        ? "bg-amber-50/60 border-amber-300 shadow-xs"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className={checked ? "text-[#b38867]" : "text-gray-400"} />
                        <h4 className="font-bold text-xs sm:text-sm text-gray-800">{exp.title}</h4>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {exp.description || "Topik pembelajaran praktis."}
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="mt-1 w-4 h-4 text-[#b38867] rounded focus:ring-[#b38867] pointer-events-none"
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleSaveExpertises}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Menyimpan..." : "Simpan Pilihan Keahlian"}
            </button>
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
                Gunakan kata sandi yang kuat untuk melindungi akun mentor Anda.
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
            <h3 className="font-bold text-gray-800 text-base">Preferensi Notifikasi Bimbingan</h3>
            <p className="text-xs text-gray-500">
              Pilih peringatan aktivitas yang ingin Anda terima secara langsung.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <span className="font-semibold text-xs text-gray-800 block">Notifikasi Pengumpulan Tugas Mentee</span>
                <span className="text-[11px] text-gray-500">Kirim notifikasi setiap kali mentee mengumpulkan jawaban tugas baru.</span>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.email_on_submission}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, email_on_submission: e.target.checked })}
                className="w-4 h-4 text-[#b38867] rounded focus:ring-[#b38867]"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <span className="font-semibold text-xs text-gray-800 block">Peringatan Jadwal Mentoring Terdekat</span>
                <span className="text-[11px] text-gray-500">Dapatkan pengingat 1 jam sebelum sesi bimbingan dimulai.</span>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.email_on_schedule}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, email_on_schedule: e.target.checked })}
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
