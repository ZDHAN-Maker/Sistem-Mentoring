import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../axiosInstance';
import { 
  Bell, 
  LogOut, 
  CheckCheck, 
  Clock, 
  ArrowRight, 
  X, 
  Trash2, 
  RefreshCw, 
  FileText, 
  Calendar, 
  Award, 
  TrendingUp, 
  Megaphone, 
  CheckCircle2, 
  ExternalLink,
  Inbox,
  Info
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tabFilter, setTabFilter] = useState('all'); // 'all' | 'unread'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  
  // Real-time toast state
  const [liveToast, setLiveToast] = useState(null);
  const lastFetchedIdRef = useRef(null);
  const dropdownRef = useRef(null);

  const fetchNotifs = async (silent = true) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await api.get('/notifications?per_page=10');
      const items = res.data?.data || [];
      const count = res.data?.meta?.unread_count || 0;

      // Cek apakah ada notifikasi baru untuk memicu Toast realtime
      if (lastFetchedIdRef.current && items.length > 0) {
        const newest = items[0];
        if (newest.id !== lastFetchedIdRef.current && !newest.is_read) {
          setLiveToast(newest);
          // Auto close toast after 6 seconds
          setTimeout(() => setLiveToast(null), 6000);
        }
      }

      if (items.length > 0) {
        lastFetchedIdRef.current = items[0].id;
      }

      setNotifications(items);
      setUnreadCount(count);
    } catch (err) {
      // Ignore if not authenticated yet
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifs(true);
    // Polling setiap 30 detik untuk memperbarui notifikasi real-time
    const interval = setInterval(() => fetchNotifs(true), 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleMarkAsRead = async (id, e) => {
    e?.stopPropagation();
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Gagal menandai notifikasi:", err);
    }
  };

  const handleMarkAllAsRead = async (e) => {
    e?.stopPropagation();
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Gagal menandai semua notifikasi:", err);
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e?.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (selectedNotification?.id === id) {
        setSelectedNotification(null);
      }
    } catch (err) {
      console.error("Gagal menghapus notifikasi:", err);
    }
  };

  // Smart Deep Linking Navigation berdasarkan tipe notifikasi dan role pengguna
  const handleNotificationClick = (notif) => {
    if (!notif.is_read) {
      handleMarkAsRead(notif.id);
    }

    const type = notif.type || '';
    const userRole = role?.toLowerCase() || '';

    if (type.includes('task')) {
      if (userRole === 'mentee') navigate('/mentee-dashboard/my-tasks');
      else if (userRole === 'mentor') navigate('/mentor-dashboard/give-task');
    } else if (type.includes('schedule')) {
      if (userRole === 'mentee') navigate('/mentee-dashboard/tutoring-schedule');
      else if (userRole === 'mentor') navigate('/mentor-dashboard/mentoring-schedule');
      else if (userRole === 'admin') navigate('/admin-dashboard/tutoring-schedule');
    } else if (type.includes('submission')) {
      if (userRole === 'mentee') navigate('/mentee-dashboard/my-reports');
      else if (userRole === 'mentor') navigate('/mentor-dashboard/review-reports');
    } else if (type.includes('progress') || type.includes('report')) {
      if (userRole === 'mentee') navigate('/mentee-dashboard/my-reports');
      else if (userRole === 'admin') navigate('/admin-dashboard/progress-report');
    } else if (type.includes('announcement') || type.includes('broadcast')) {
      navigate(`/${userRole}-dashboard/announcements`);
    } else {
      // Default: Buka modal rincian notifikasi
      setSelectedNotification(notif);
    }

    setShowDropdown(false);
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMin = Math.floor((now - date) / (1000 * 60));
    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} mnt lalu`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const getNotificationIconBadge = (type) => {
    switch (type) {
      case 'new_task':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#b38867] border border-amber-200 flex items-center justify-center shrink-0">
            <FileText size={15} />
          </div>
        );
      case 'schedule_created':
      case 'schedule_updated':
        return (
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shrink-0">
            <Calendar size={15} />
          </div>
        );
      case 'submission_submitted':
        return (
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
            <Inbox size={15} />
          </div>
        );
      case 'submission_reviewed':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
            <Award size={15} />
          </div>
        );
      case 'progress_report_created':
        return (
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
            <TrendingUp size={15} />
          </div>
        );
      case 'broadcast':
      case 'announcement':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
            <Megaphone size={15} />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center shrink-0">
            <Bell size={15} />
          </div>
        );
    }
  };

  const displayedNotifications = tabFilter === 'unread' 
    ? notifications.filter(n => !n.is_read) 
    : notifications;

  return (
    <>
      <header className="bg-white shadow-2xs border-b border-slate-200/80 px-6 sm:px-8 py-3.5 flex justify-between items-center relative z-40">
        
        {/* Brand Title / Platform Context */}
        <div className="flex items-center gap-3">
          <Link to="/program" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-[#b38867]/30 flex items-center justify-center p-1 group-hover:scale-105 transition">
              <img
                src="/assets/Logo Sistem Mentoring.png"
                alt="Aeterna Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-base tracking-tight group-hover:text-[#b38867] transition">
                Aeterna Mentoring
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#b38867]/15 text-[#7B5E4A] uppercase tracking-wider ml-1.5 hidden sm:inline">
                {role || 'Portal'}
              </span>
            </div>
          </Link>
        </div>

        {/* User profile & actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* ============================================================== */}
          {/* NOTIFIKASI BELL DENGAN POPOVER INTERAKTIF                       */}
          {/* ============================================================== */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className={`p-2 rounded-xl transition relative cursor-pointer ${
                showDropdown 
                  ? 'bg-amber-50 text-[#b38867] border border-amber-200' 
                  : 'text-slate-600 hover:text-[#b38867] hover:bg-slate-100'
              }`}
              title="Notifikasi & Pengumuman Sistem"
              aria-label="Notifikasi"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full px-1 flex items-center justify-center shadow-xs animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Floating Dropdown Popover */}
            {showDropdown && (
              <div className="absolute right-0 mt-2.5 w-84 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
                
                {/* Popover Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/70">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-slate-900">Notifikasi</h3>
                      {unreadCount > 0 ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                          {unreadCount} baru
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                          Semua terbaca
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => fetchNotifs(false)}
                        className={`p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition ${
                          isRefreshing ? 'animate-spin text-[#b38867]' : ''
                        }`}
                        title="Segarkan notifikasi"
                      >
                        <RefreshCw size={13} />
                      </button>

                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-[11px] font-bold text-[#b38867] hover:underline flex items-center gap-1 px-1.5 py-1 rounded hover:bg-amber-50 cursor-pointer"
                          title="Tandai semua telah dibaca"
                        >
                          <CheckCheck size={13} />
                          <span>Baca Semua</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter Tabs: Semua vs Belum Dibaca */}
                  <div className="flex items-center gap-1 mt-3 p-0.5 bg-slate-200/70 rounded-xl text-xs">
                    <button
                      onClick={() => setTabFilter('all')}
                      className={`flex-1 py-1 rounded-lg font-bold text-center transition ${
                        tabFilter === 'all'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Semua ({notifications.length})
                    </button>
                    <button
                      onClick={() => setTabFilter('unread')}
                      className={`flex-1 py-1 rounded-lg font-bold text-center transition ${
                        tabFilter === 'unread'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Belum Dibaca ({unreadCount})
                    </button>
                  </div>
                </div>

                {/* List Notifikasi */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {displayedNotifications.length > 0 ? (
                    displayedNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 group relative ${
                          !n.is_read ? 'bg-amber-50/30' : ''
                        }`}
                      >
                        {/* Icon Badge Berdasarkan Tipe Notifikasi */}
                        {getNotificationIconBadge(n.type)}

                        {/* Konten Notifikasi */}
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex items-baseline justify-between gap-2">
                            <h4 className={`text-xs truncate ${!n.is_read ? 'font-black text-slate-900' : 'font-semibold text-slate-700'}`}>
                              {n.title}
                            </h4>
                          </div>
                          
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed font-medium">
                            {n.message}
                          </p>

                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock size={10} />
                              <span>{formatTimeAgo(n.created_at)}</span>
                            </span>
                            {!n.is_read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#b38867]"></span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons (Muncul saat hover di baris notifikasi) */}
                        <div className="absolute right-2.5 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          {!n.is_read && (
                            <button
                              onClick={(e) => handleMarkAsRead(n.id, e)}
                              className="p-1 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                              title="Tandai telah dibaca"
                            >
                              <CheckCircle2 size={13} />
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDeleteNotification(n.id, e)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Hapus notifikasi"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      <Bell size={26} className="mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold text-slate-600">Tidak ada notifikasi</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {tabFilter === 'unread' ? 'Semua notifikasi sudah Anda baca.' : 'Belum ada notifikasi atau pengumuman baru.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Dropdown Footer */}
                <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs px-4">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Auto-update 30s
                  </span>
                  <Link
                    to={`/${role}-dashboard/announcements`}
                    onClick={() => setShowDropdown(false)}
                    className="font-bold text-[#b38867] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Pusat Pengumuman</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Info Avatar */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <span className="text-slate-800 font-bold text-xs block leading-none truncate max-w-[120px]">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] text-slate-400 capitalize mt-1 block">
                {role || 'Pengguna'}
              </span>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-[#b38867] to-[#7B5E4A] text-white flex items-center justify-center font-bold text-xs sm:text-sm rounded-xl shadow-2xs">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>

          {/* Tombol Logout */}
          <button
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition cursor-pointer"
            onClick={handleLogout}
            title="Keluar dari akun"
          >
            <LogOut size={14} />
            <span className="hidden md:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* FLOATING REAL-TIME TOAST NOTIFICATION                          */}
      {/* ============================================================== */}
      {liveToast && (
        <div className="fixed top-20 right-5 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-amber-200 p-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#b38867] border border-amber-200 flex items-center justify-center shrink-0">
              <Bell size={18} className="animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#b38867]">
                  Notifikasi Baru
                </span>
                <button
                  onClick={() => setLiveToast(null)}
                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                >
                  <X size={14} />
                </button>
              </div>
              <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                {liveToast.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                {liveToast.message}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    handleNotificationClick(liveToast);
                    setLiveToast(null);
                  }}
                  className="text-[11px] font-bold text-white bg-[#b38867] hover:bg-[#a27355] px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1"
                >
                  <span>Buka Sekarang</span>
                  <ArrowRight size={11} />
                </button>
                <button
                  onClick={() => {
                    handleMarkAsRead(liveToast.id);
                    setLiveToast(null);
                  }}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 px-2 py-1"
                >
                  Tandai Dibaca
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL RINCIAN NOTIFIKASI                                       */}
      {/* ============================================================== */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                {getNotificationIconBadge(selectedNotification.type)}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {selectedNotification.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {formatTimeAgo(selectedNotification.created_at)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-wrap max-h-60 overflow-y-auto">
              {selectedNotification.message}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={(e) => handleDeleteNotification(selectedNotification.id, e)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
              >
                <Trash2 size={13} />
                <span>Hapus Notifikasi</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Tutup
                </button>
                <button
                  onClick={() => handleNotificationClick(selectedNotification)}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#b38867] hover:bg-[#a27355] rounded-xl transition flex items-center gap-1 shadow-xs"
                >
                  <span>Buka Halaman Terkait</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
