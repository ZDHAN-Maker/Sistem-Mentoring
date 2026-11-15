import React, { useState, useEffect } from "react";
import api from "../../../axiosInstance";
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  Calendar, 
  FileText, 
  Award, 
  Clock 
} from "lucide-react";

export default function AnnouncementsMentee() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const url = filterUnread ? "/notifications?unread_only=1" : "/notifications";
      const res = await api.get(url);
      setNotifications(res.data?.data || []);
      setUnreadCount(res.data?.meta?.unread_count || 0);
    } catch (err) {
      console.error("Error fetching notifications:", err);
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
    } catch (err) {
      console.error("Gagal menandai semua dibaca:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus notifikasi ini?")) return;
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Gagal menghapus notifikasi:", err);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case "new_task":
        return <FileText className="w-5 h-5 text-amber-500" />;
      case "schedule_created":
      case "schedule_updated":
        return <Calendar className="w-5 h-5 text-indigo-500" />;
      case "submission_reviewed":
        return <Award className="w-5 h-5 text-emerald-500" />;
      default:
        return <Bell className="w-5 h-5 text-[#b38867]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">Notifikasi & Pengumuman</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500 text-white">
                {unreadCount} Baru
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Pemberitahuan terkini seputar tugas baru, jadwal mentoring, serta evaluasi mentor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Tandai Semua Dibaca
            </button>
          )}
          <button
            onClick={fetchNotifications}
            className="p-2 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
            title="Muat Ulang"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setFilterUnread(false)}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            !filterUnread
              ? "border-[#b38867] text-[#b38867]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Semua ({notifications.length})
        </button>
        <button
          onClick={() => setFilterUnread(true)}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            filterUnread
              ? "border-[#b38867] text-[#b38867]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Belum Dibaca ({unreadCount})
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Notification List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white p-5 rounded-xl border border-gray-100 h-24"></div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#b38867]">
            <Bell className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">
            {filterUnread ? "Tidak ada notifikasi baru yang belum dibaca" : "Belum ada notifikasi"}
          </h3>
          <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
            Notifikasi baru tentang jadwal atau penilaian tugas akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 flex items-start gap-4 ${
                !item.is_read
                  ? "bg-amber-50/40 border-amber-200 shadow-sm"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 shrink-0">
                {getIconForType(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`text-sm font-semibold ${!item.is_read ? "text-gray-900" : "text-gray-700"}`}>
                    {item.title}
                  </h4>
                  {!item.is_read && (
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  )}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed break-words">
                  {item.message}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(item.created_at).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!item.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Tandai Sudah Dibaca"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus Notifikasi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
