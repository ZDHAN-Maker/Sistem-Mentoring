import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Menghapus token dari localStorage dan mengarahkan pengguna ke halaman login
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Logo di kiri */}
      <div className="flex items-center gap-4">
        <img
          src="/assets/Logo Sistem Mentoring.png"
          alt="Logo"
          className="w-10 h-10 object-contain"
        />
        <h1 className="text-2xl font-semibold">Sistem Mentoring</h1>
      </div>

      {/* Pengguna dan Logout */}
      <div className="flex items-center gap-4">
        <button className="text-gray-600">
          <i className="fas fa-bell"></i> {/* Icon notifikasi */}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-gray-800 font-medium">Nama Pengguna</span>
          <div className="w-10 h-10 bg-[#b38867] rounded-full"></div> {/* Avatar */}
        </div>
        <button
          className="text-red-500 font-semibold"
          onClick={handleLogout}  // Tombol logout
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
