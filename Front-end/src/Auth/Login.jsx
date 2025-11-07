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
    <main className="grow flex items-center justify-center py-14 bg-gray-50">
      {/* Card wrapper */}
      <div className="w-full max-w-lg px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_6px_24px_rgba(0,0,0,0.06)] p-8 md:p-10">
          <h2 className="text-2xl font-bold text-center mb-2">
            Masuk ke Akun Mentoring
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Silakan masukkan kredensial Anda
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#b38867]"
                placeholder="Alamat Email"
                required
              />
            </div>

            {/* Password + toggle */}
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
                Ingat Saya
              </label>
              <a href="#" className="text-sm text-[#b38867] hover:underline">Lupa Password?</a>
            </div>

            {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}

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

            {/* Tombol Google konsisten */}
            <button
              type="button"
              className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-3 
                     font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              <img src="/assets/google.png" alt="Google Logo" className="w-5 h-5" />
              <span>Daftar dengan Google</span>
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Belum punya akun?{' '}
            <a href="/register" className="text-[#b38867] hover:underline">Daftar Sekarang</a>
          </p>
        </div>
      </div>
    </main>

  );
};

export default Login;
