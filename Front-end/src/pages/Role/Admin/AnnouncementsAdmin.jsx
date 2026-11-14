import React, { useState, useEffect } from "react";
import api from "../../../axiosInstance";
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Info,
  ExternalLink,
  PlusCircle,
  Megaphone,
  X,
  Send,
  Users,
  ShieldAlert,
  Calendar,
  Sparkles
} from "lucide-react";

export default function AnnouncementsAdmin() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Broadcast Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    target_role: "all"
  });

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const url = filterUnread ? "/notifications?unread_only=1" : "/notifications";
      const res = await api.get(url);
      setNotifications(res.data?.data || []);
      setUnreadCount(res.data?.meta?.unread_count || 0);
    } catch (err) {
      console.error("Gagal mengambil notifikasi:", err);
      setError("Gagal memuat notifikasi & pengumuman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filterUnread]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Gagal menandai notifikasi:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      setSuccess("Semua notifikasi ditandai sebagai telah dibaca.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Gagal menandai semua notifikasi:", err);
      setError("Gagal memperbarui status notifikasi.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Gagal menghapus notifikasi:", err);
    }
  };

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) {
      setError("Judul dan pesan pengumuman wajib diisi.");
      return;
    }

    setBroadcasting(true);
    setError("");
    try {
      const res = await api.post("/notifications/broadcast", broadcastForm);
      setSuccess(res.data?.message || "Pengumuman berhasil disiarkan.");
      setBroadcastForm({ title: "", message: "", target_role: "all" });
      setShowBroadcastModal(false);
      fetchNotifications();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyiarkan pengumuman.");
    } finally {
      setBroadcasting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pusat Notifikasi & Pengumuman</h1>
          <p className="text-gray-500 text-sm mt-1">
            Pantau pemberitahuan sistem, aktivitas bimbingan, dan siarkan pengumuman penting ke seluruh pengguna.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition"
          >
            <Megaphone size={16} />
            Siarkan Pengumuman
          </button>
          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="p-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-xs"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-[#b38867]" : ""} />
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="font-bold text-red-500 hover:text-red-700">×</button>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess("")} className="font-bold text-emerald-600 hover:text-emerald-800">×</button>
        </div>
      )}

      {/* Filter Tabs & Quick Actions */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterUnread(false)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
              !filterUnread
                ? "bg-[#b38867] text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Semua Notifikasi ({notifications.length})
          </button>
          <button
            onClick={() => setFilterUnread(true)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 ${
              filterUnread
                ? "bg-[#b38867] text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>Belum Dibaca</span>
            {unreadCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filterUnread ? "bg-white text-[#b38867]" : "bg-red-500 text-white"
              }`}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#b38867] hover:underline"
          >
            <CheckCheck size={16} />
            Tandai Semua Telah Dibaca
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-400 text-sm">
            <RefreshCw className="animate-spin text-[#b38867] mx-auto mb-2" size={24} />
            <span>Memuat daftar notifikasi...</span>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition flex items-start justify-between gap-4 ${
                !n.is_read
                  ? "bg-white border-[#b38867]/40 shadow-xs ring-1 ring-[#b38867]/15"
                  : "bg-gray-50/70 border-gray-200"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${
                  !n.is_read ? "bg-[#b38867]/15 text-[#b38867]" : "bg-gray-200 text-gray-500"
                }`}>
                  <Bell size={20} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-sm ${!n.is_read ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>
                      {n.title}
                    </h3>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[#b38867] animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
                    {n.message}
                  </p>
                  <div className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-1">
                    <Clock size={12} />
                    <span>{formatDate(n.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!n.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    title="Tandai sudah dibaca"
                    className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                  >
                    <CheckCheck size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n.id)}
                  title="Hapus notifikasi"
                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-400">
            <Bell size={36} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-medium">Tidak ada notifikasi yang ditemukan.</p>
          </div>
        )}
      </div>

      {/* MODAL SIARKAN PENGUMUMAN */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#b38867]/15 text-[#b38867] flex items-center justify-center font-bold">
                  <Megaphone size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Siarkan Pengumuman</h3>
                  <p className="text-xs text-gray-500">Kirim notifikasi massal ke mentor atau mentee.</p>
                </div>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleBroadcastSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Sasaran Penerima
                </label>
                <select
                  value={broadcastForm.target_role}
                  onChange={(e) => setBroadcastForm(prev => ({ ...prev, target_role: e.target.value }))}
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#b38867]"
                >
                  <option value="all">Semua Pengguna (Mentor & Mentee)</option>
                  <option value="Mentor">Khusus Mentor</option>
                  <option value="Mentee">Khusus Mentee</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Judul Pengumuman <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Pemeliharaan Server / Webinar Khusus..."
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#b38867]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Isi Pesan Pengumuman <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan detail pengumuman yang ingin disampaikan..."
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#b38867] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={broadcasting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#b38867] hover:bg-[#a27355] rounded-xl shadow-xs transition disabled:opacity-50"
                >
                  {broadcasting ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Menyiarkan...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Kirim Pengumuman</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
