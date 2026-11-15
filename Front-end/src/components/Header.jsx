import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Menu, 
  X, 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  LogIn, 
  UserPlus
} from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.toLowerCase();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const isAuthPage = currentPath === '/login' || currentPath === '/register';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/program?search=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Program Mentoring', path: '/program', icon: GraduationCap },
    { name: 'Paket Langganan', path: '/langganan', icon: CreditCard },
    { name: 'E-Learning 24/7', path: '/e-learning', icon: BookOpen },
  ];

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        
        {/* === Sisi Kiri: Brand Logo === */}
        <div className="flex items-center gap-6 shrink-0">
          <Link to="/program" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-50/80 border border-[#b38867]/30 flex items-center justify-center p-1.5 shadow-2xs group-hover:scale-105 transition">
              <img
                src="/assets/Logo Sistem Mentoring.png"
                alt="Logo Aeterna"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight group-hover:text-[#b38867] transition">
                  Aeterna
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#b38867]/15 text-[#7B5E4A] uppercase tracking-wider">
                  Academy
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-none hidden sm:block">
                Sistem Mentoring & Pelatihan Industri
              </p>
            </div>
          </Link>
        </div>

        {/* === Sisi Tengah: Navigasi Utama === */}
        <nav className="hidden md:flex items-center gap-1.5 shrink-0">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#b38867]/10 text-[#7B5E4A]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#b38867]' : 'text-slate-400'} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* === Sisi Kanan: Search (khusus non-auth) & Action Buttons === */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Search Bar: Hanya ditampilkan di halaman publik umum pada layar sangat lebar agar tidak menabrak nav */}
          {!isAuthPage && (
            <form 
              onSubmit={handleSearchSubmit} 
              className="relative hidden xl:flex items-center"
            >
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari program..."
                className="w-44 2xl:w-56 h-9 pl-8 pr-8 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#b38867] focus:border-[#b38867] outline-none transition font-medium"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-slate-400 bg-slate-200/70 px-1 py-0.5 rounded border border-slate-300">
                ↵
              </span>
            </form>
          )}

          {/* Contextual Auth Actions */}
          {isAuthPage ? (
            <div className="flex items-center gap-3">
              {currentPath === '/login' ? (
                <>
                  <span className="hidden sm:inline text-xs text-slate-500 font-medium">
                    Belum punya akun?
                  </span>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#b38867] hover:bg-[#a27355] text-white shadow-xs transition inline-flex items-center gap-1.5"
                  >
                    <UserPlus size={15} />
                    <span>Daftar Sekarang</span>
                  </Link>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline text-xs text-slate-500 font-medium">
                    Sudah memiliki akun?
                  </span>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 hover:bg-slate-50 text-slate-800 shadow-xs transition inline-flex items-center gap-1.5"
                  >
                    <LogIn size={15} />
                    <span>Masuk</span>
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#b38867] hover:bg-[#a27355] text-white shadow-xs transition"
              >
                Daftar Akun
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 md:hidden transition"
            title="Menu Navigasi"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* === Mobile Drawer Dropdown Menu === */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-4 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari program, modul, mentor..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#b38867] outline-none"
            />
          </form>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#b38867]/10 text-[#7B5E4A]'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-[#b38867]' : 'text-slate-400'} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#b38867] rounded-xl hover:bg-[#a27355]"
            >
              Daftar Akun
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
