import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../axiosInstance';
import { useAuth } from '../context/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Email dan password wajib diisi!');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Format email tidak valid!');
      return;
    }

    try {
      const response = await api.post('/login', { email, password });

      console.log('Response login:', response.data);

      const token = response.data.token || response.data.access_token;
      const role = response.data.user?.role || response.data.role;

      if (!token || !role) {
        throw new Error('Token atau role tidak ditemukan dalam response API');
      }

      login(token, role);

      if (role === 'admin') navigate('/admin-dashboard');
      else if (role === 'mentor') navigate('/mentor-dashboard');
      else if (role === 'mentee') navigate('/mentee-dashboard');
      else setErrorMessage('Role tidak dikenali!');
    } catch (error) {
      console.error('Error login:', error);
      setErrorMessage(
        error.response?.data?.message || 'Login gagal! Periksa kredensial Anda.'
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo + Search */}
          <div className="flex items-center gap-4">
            <img
              src="/assets/Logo Sistem Mentoring.png"
              alt="Logo Sistem Mentoring"
              className="w-10 h-10 object-contain"
            />
            <div className="relative">
              <input
                type="text"
                placeholder="Cari Program"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#b38867] w-64"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="gray"
                className="absolute left-3 top-2.5 w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 1110.6-10.6 7.5 7.5 0 01-10.6 10.6z"
                />
              </svg>
            </div>
          </div>

          {/* Menu Navigasi */}
          <nav className="flex items-center gap-8 text-sm font-medium text-gray-700">
            <a href="/program" className="hover:text-[#b38867]">
              Program
            </a>
            <a href="/langganan" className="hover:text-[#b38867]">
              Langganan
            </a>
            <a href="/elearning" className="hover:text-[#b38867]">
              E-Learning
            </a>
          </nav>

          {/* Tombol Aksi */}
          <div className="flex items-center gap-3">
            <a
              href="/register"
              className="px-5 py-2 border border-[#b38867] text-[#b38867] rounded-lg text-sm font-semibold hover:bg-[#b38867] hover:text-white transition"
            >
              Daftar
            </a>
            <a
              href="/login"
              className="px-5 py-2 bg-[#b38867] text-white rounded-lg text-sm font-semibold hover:bg-[#a27355] transition"
            >
              Masuk
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="grow flex items-center justify-center py-14 bg-gray-50">
        <div className="w-full max-w-lg px-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_6px_24px_rgba(0,0,0,0.06)] p-8 md:p-10">
            <h2 className="text-2xl font-bold text-center mb-2">Masuk</h2>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#b38867]"
                  placeholder="Email"
                  required
                />
              </div>

              {/* Password + toggle */}
              <div className="mb-4 relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#b38867]"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-sm text-gray-500 hover:text-[#b38867]"
                >
                  {showPassword ? 'Sembunyikan' : 'Lihat'}
                </button>
              </div>

              {/* Remember + Lupa */}
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 mr-2 text-[#b38867]"
                  />
                  Remember Me
                </label>
                <a href="#" className="text-sm text-[#b38867] hover:underline">
                  Lupa Password?
                </a>
              </div>

              {errorMessage && (
                <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
              )}

              {/* Tombol utama */}
              <button
                type="submit"
                className="w-full py-3 mt-2 bg-[#b38867] text-white font-semibold rounded-lg hover:bg-[#a27355]"
              >
                Masuk
              </button>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="grow border-t border-gray-200"></div>
                <span className="mx-3 text-gray-400 text-sm">atau</span>
                <div className="grow border-t border-gray-200"></div>
              </div>

              {/* Tombol Google */}
              <button
                type="button"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg flex items-center justify-center gap-3 
             font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                <img
                  src="/assets/google.png"
                  alt="Google Logo"
                  className="w-7 h-7 object-contain"
                />
                <span className="text-base">Daftar Dengan Google</span>
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Sudah Punya Akun?{' '}
              <a href="/register" className="text-[#b38867] hover:underline">
                Masuk Sekarang
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
