import React, { useState } from "react";
import { api } from "../axiosInstance";

const Register = ({ setAuth }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState(""); // Menambahkan state untuk password konfirmasi
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi untuk memastikan password dan konfirmasi password sama
    if (password !== passwordConfirmation) {
      setErrorMessage("Password dan konfirmasi password tidak cocok.");
      return;
    }

    try {
      // Mengirim data dengan password dan password_confirmation
      const response = await api.post("/register", { name, email, password, password_confirmation: passwordConfirmation });
      
      // Menyimpan token ke localStorage dan melakukan redirect ke dashboard
      localStorage.setItem("token", response.data.token);
      setAuth(true);
      window.location.href = "/dashboard"; // Redirect ke halaman dashboard
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Pendaftaran gagal! Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full bg-white p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="/assets/Logo Sistem Mentoring.png" // Pastikan path logo sudah benar
            alt="Logo"
            className="w-10 h-10"
          />
          <span className="text-xl ml-2 font-semibold">Sistem Mentoring</span>
        </div>
        <div>
          <a href="/login" className="text-sm text-gray-700 hover:text-blue-600">
            Masuk
          </a>
        </div>
      </div>

      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-6">Daftar Akun Mentoring</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Nama Lengkap
              </label>
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
              <label className="block text-sm font-semibold text-gray-700">
                Email
              </label>
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
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
                placeholder="Password Baru"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Konfirmasi Password
              </label>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
                placeholder="Konfirmasi Password"
                required
              />
            </div>

            {errorMessage && (
              <p className="text-red-500 text-xs">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-[#b38867] text-white font-semibold rounded-lg hover:bg-[#a27355]"
            >
              Daftar
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Sudah Punya Akun?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Masuk Sekarang
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
