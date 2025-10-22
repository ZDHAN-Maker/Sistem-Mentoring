// src/components/Register.jsx
import React, { useState } from 'react';
import { api } from '../axiosInstance'; // Import Axios instance

const Register = ({ setAuth }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/register', { name, email, password });
      localStorage.setItem('token', response.data.token); // Simpan token di localStorage
      setAuth(true);
      window.location.href = '/dashboard'; // Redirect ke halaman dashboard setelah registrasi
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Registration failed! Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img
            src="/path-to-your-logo.png" // Pastikan mengganti path logo yang sesuai
            alt="Logo"
            className="w-24 h-24"
          />
        </div>
        <h2 className="text-3xl font-bold text-center mb-4">Daftar Akun Mentoring</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
              placeholder="Nama Lengkap"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
              placeholder="Alamat Email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
              placeholder="Password Baru"
              required
            />
          </div>
          {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-brown-500 text-white font-semibold rounded-lg hover:bg-brown-600"
          >
            Daftar
          </button>
        </form>

        <div className="flex justify-center items-center mt-6">
          <button className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 flex justify-center items-center">
            <img src="/path-to-google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
            Daftar Dengan Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Sudah Punya Akun?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Masuk Sekarang
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
