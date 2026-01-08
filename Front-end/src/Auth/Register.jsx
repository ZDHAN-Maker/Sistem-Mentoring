import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getCsrfCookie } from '../axiosInstance';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== passwordConfirmation) {
      setErrorMessage('Password dan konfirmasi password tidak cocok.');
      return;
    }

    try {
      await getCsrfCookie();

      await api.post(
        '/register',
        { name, email, password, role: 'mentee' },
        { withCredentials: true }
      );

      alert('Pendaftaran berhasil! Silakan login.');
      navigate('/login');
    } catch (error) {
      const msg = error?.response?.data?.message || 'Pendaftaran gagal! Silakan coba lagi.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f3ebe4] to-white py-16 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-[#e4d9cd] shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-10">

        {/* Judul */}
        <h2 className="text-3xl font-extrabold text-center text-[#5a4635] mb-2">
          Daftar Akun Baru
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Bergabung dan mulai perjalanan belajar Anda
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b38867] outline-none transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Lengkap"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b38867] outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b38867] outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#b38867]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b38867] outline-none transition"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Konfirmasi Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#b38867]"
              >
                {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}

          {/* Tombol Daftar */}
          <button
            type="submit"
            className="w-full py-3 bg-[#b38867] text-white font-semibold rounded-lg 
            shadow-md hover:bg-[#a27355] hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            Daftar Sekarang
          </button>
        </form>

        {/* Link ke Login */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Sudah punya akun?{" "}
          <a
            href="/login"
            className="text-[#b38867] font-medium hover:underline"
          >
            Masuk Sekarang
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
