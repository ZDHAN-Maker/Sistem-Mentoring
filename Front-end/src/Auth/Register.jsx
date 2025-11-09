import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../axiosInstance'; // sudah withCredentials: true
import { useAuth } from '../context/useAuth';
import Header from '../components/Header';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setAuthData } = useAuth(); // ubah: pakai setter dari context auth

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setErrorMessage('Password dan konfirmasi password tidak cocok.');
      return;
    }

    try {
      // 🔹 Kirim request ke backend Laravel
      const response = await api.post(
        '/register',
        {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
          role: 'mentee', // role default
        },
        { withCredentials: true } // penting agar cookie HttpOnly dikirim & disimpan
      );

      // Ambil data user dari response
      const user = response.data.user;
      const role = user?.role || 'mentee';

      // Simpan di context agar state global tahu user sudah login
      setAuthData({ isAuthenticated: true, user, role });

      // 🔹 Langsung arahkan ke dashboard (karena user sudah otomatis login setelah register)
      if (role === 'admin') navigate('/admin-dashboard');
      else if (role === 'mentor') navigate('/mentor-dashboard');
      else navigate('/mentee-dashboard');

    } catch (error) {
      console.error('Error register:', error);
      setErrorMessage(
        error.response?.data?.message || 'Pendaftaran gagal! Silakan coba lagi.'
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="grow flex items-center justify-center py-14 bg-gray-50">
        <div className="w-full max-w-lg px-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_6px_24px_rgba(0,0,0,0.06)] p-8 md:p-10">
            <h2 className="text-2xl font-bold text-center mb-2">
              Daftar Akun Baru
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Nama */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Lengkap
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#b38867]"
                  placeholder="Nama Lengkap"
                  required
                />
              </div>

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

              {/* Password */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#b38867]"
                  placeholder="Password"
                  required
                />
              </div>

              {/* Konfirmasi Password */}
              <div className="mb-4">
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Konfirmasi Password
                </label>
                <input
                  id="password_confirmation"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#b38867]"
                  placeholder="Konfirmasi Password"
                  required
                />
              </div>

              {errorMessage && (
                <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-[#b38867] text-white font-semibold rounded-lg hover:bg-[#a27355]"
              >
                Daftar
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Sudah punya akun?{' '}
              <a href="/login" className="text-[#b38867] hover:underline">
                Masuk Sekarang
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
