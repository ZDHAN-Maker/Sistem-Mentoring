import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">

      {/* Logo kiri */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold">Aeterna Mentoring</h1>
      </div>

      {/* Pengguna dan Logout */}
      <div className="flex items-center gap-4">
        <button className="text-gray-600">
          <i className="fas fa-bell"></i>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-gray-800 font-medium">
            {user?.username || user?.name || 'User'}
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
