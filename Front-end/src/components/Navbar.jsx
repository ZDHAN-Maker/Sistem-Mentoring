import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; // pastikan hook ini tersedia

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ambil fungsi logout dari context

  const handleLogout = async () => {
    await logout(); // logout via Sanctum
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Logo kiri */}
      <div className="flex items-center gap-4">
        <img
          src="/assets/Logo Sistem Mentoring.png"
          alt="Logo"
          className="w-10 h-10 object-contain"
        />
        <h1 className="text-2xl font-semibold">Aeterna</h1>
      </div>

      {/* Pengguna dan Logout */}
      <div className="flex items-center gap-4">
        <button className="text-gray-600">
          <i className="fas fa-bell"></i>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-gray-800 font-medium">
            {user?.name || 'Nama Pengguna'}
          </span>
          <div className="w-10 h-10 bg-[#b38867] rounded-full"></div>
        </div>
        <button
          className="text-red-500 font-semibold"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
