import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* === Kiri: Logo + Search === */}
        <div className="flex items-center gap-4">
          <Link to="/program" className="flex items-center gap-2.5">
            <img
              src="/assets/Logo Sistem Mentoring.png"
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-gray-800 text-base hidden sm:inline tracking-tight">
              Aeterna
            </span>
          </Link>
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Cari Modul & Program..."
              className="w-64 h-9 pl-9 pr-3 rounded-xl border border-gray-200 text-xs placeholder-gray-400 focus:ring-2 focus:ring-[#b38867] focus:outline-none transition"
            />
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* === Tengah: Menu Navigasi === */}
        <nav className="flex items-center gap-6 text-sm font-semibold text-gray-600">
          <Link
            to="/program"
            className={`transition-colors ${
              currentPath === '/program' ? 'text-[#b38867] font-bold' : 'hover:text-[#b38867]'
            }`}
          >
            Program
          </Link>
          <Link
            to="/langganan"
            className={`transition-colors ${
              currentPath === '/langganan' ? 'text-[#b38867] font-bold' : 'hover:text-[#b38867]'
            }`}
          >
            Langganan
          </Link>
          <Link
            to="/e-learning"
            className={`transition-colors ${
              currentPath === '/e-learning' ? 'text-[#b38867] font-bold' : 'hover:text-[#b38867]'
            }`}
          >
            E-Learning
          </Link>
        </nav>

        {/* === Kanan: Tombol Auth === */}
        <div className="flex gap-2.5">
          <Link
            to="/register"
            className="px-4 h-9 inline-flex items-center justify-center rounded-xl border border-[#b38867] text-[#b38867] text-xs font-semibold hover:bg-amber-50 transition"
          >
            Daftar
          </Link>
          <Link
            to="/login"
            className="px-4 h-9 inline-flex items-center justify-center rounded-xl bg-[#b38867] text-white text-xs font-semibold hover:bg-[#a27355] shadow-xs transition"
          >
            Masuk
          </Link>
        </div>
      </div>
    </header>
  );
}
