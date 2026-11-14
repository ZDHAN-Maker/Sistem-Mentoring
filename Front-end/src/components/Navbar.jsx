import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Bell, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleBellClick = () => {
    if (role) {
      navigate(`/${role}-dashboard/announcements`);
    }
  };

  return (
    <header className="bg-white shadow-xs border-b border-gray-100 px-8 py-4 flex justify-between items-center">
      {/* Brand title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Aeterna Mentoring</h1>
      </div>

      {/* User profile & actions */}
      <div className="flex items-center gap-5">
        <button 
          onClick={handleBellClick}
          className="p-2 text-gray-500 hover:text-[#b38867] hover:bg-amber-50 rounded-xl transition"
          title="Notifikasi & Pengumuman"
        >
          <Bell size={20} />
        </button>

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

        <button
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition"
          onClick={handleLogout}
          title="Keluar dari akun"
        >
          <LogOut size={14} />
          Keluar
        </button>
      </div>
    </header>
  );
};

export default Navbar;
