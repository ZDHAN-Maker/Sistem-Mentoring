import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../axiosInstance';
import { Bell, LogOut, CheckCheck, Clock, ArrowRight, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifs = async () => {
    try {
      const res = await api.get('/notifications?per_page=6');
      setNotifications(res.data?.data || []);
      setUnreadCount(res.data?.meta?.unread_count || 0);
    } catch (err) {
      // Quiet fail if not authenticated yet
    }
  };

  useEffect(() => {
    fetchNotifs();
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifs, 60000);
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
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async (e) => {
    e?.stopPropagation();
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
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

  return (
    <header className="bg-white shadow-xs border-b border-gray-100 px-6 sm:px-8 py-4 flex justify-between items-center relative z-40">
      {/* Brand title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Aeterna Mentoring</h1>
      </div>

      {/* User profile & actions */}
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Notifikasi Bell dengan Popover Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 text-gray-500 hover:text-[#b38867] hover:bg-amber-50 rounded-xl transition relative cursor-pointer"
            title="Notifikasi & Pengumuman"
            aria-label="Notifikasi"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full px-1 flex items-center justify-center shadow-xs animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Floating Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
              {/* Dropdown Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-800">Notifikasi</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                      {unreadCount} baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] font-semibold text-[#b38867] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck size={13} />
                    <span>Tandai Semua Dibaca</span>
                  </button>
                )}
              </div>

              {/* List Notifikasi */}
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                      className={`p-3.5 hover:bg-gray-50 transition cursor-pointer flex items-start gap-3 ${
                        !n.is_read ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        !n.is_read ? 'bg-[#b38867]' : 'bg-transparent'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className={`text-xs truncate ${!n.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                            {n.title}
                          </h4>
                          <span className="text-[10px] text-gray-400 shrink-0">
                            {formatTimeAgo(n.created_at)}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400 text-xs">
                    <Bell size={24} className="mx-auto mb-1.5 text-gray-300" />
                    <span>Tidak ada notifikasi baru</span>
                  </div>
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
                <Link
                  to={`/${role}-dashboard/announcements`}
                  onClick={() => setShowDropdown(false)}
                  className="text-xs font-semibold text-[#b38867] hover:underline inline-flex items-center gap-1"
                >
                  <span>Buka Semua Pengumuman</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="text-right">
            <span className="text-gray-800 font-semibold text-sm block leading-none">
              {user?.name || 'User'}
            </span>
            <span className="text-xs text-gray-400 capitalize mt-1 block">
              {role || 'Pengguna'}
            </span>
          </div>
          <div className="w-9 h-9 bg-gradient-to-tr from-[#b38867] to-[#7B5E4A] text-white flex items-center justify-center font-bold text-sm rounded-xl shadow-xs">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>

        {/* Tombol Logout */}
        <button
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition cursor-pointer"
          onClick={handleLogout}
          title="Keluar dari akun"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
