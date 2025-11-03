import React, { useState } from 'react';
import { api } from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate(); // Hook untuk navigasi

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setAuth(true);
      navigate('/dashboard'); // Mengarahkan ke halaman dashboard setelah login berhasil
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login gagal! Periksa kredensial Anda.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <img
            src="/assets/Logo Sistem Mentoring.png"  // Menampilkan logo dari folder public/assets
            alt="Logo"
            className="w-24 h-24"
          />
        </div>
        <h2 className="text-3xl font-bold text-center mb-6">Masuk</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
              placeholder="Password"
              required
            />
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 text-blue-500"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">Ingat Saya</label>
          </div>
          {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-brown-500 text-white font-semibold rounded-lg hover:bg-brown-600"
          >
            Masuk
          </button>
        </form>

        <div className="flex justify-between mt-4">
          <a href="#" className="text-sm text-blue-500 hover:underline">Lupa Password?</a>
        </div>

        <div className="flex items-center justify-center mt-4">
          <button className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 flex justify-center items-center">
            <img src="/path-to-google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
            Masuk
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Belum Punya Akun?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Daftar Sekarang
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
