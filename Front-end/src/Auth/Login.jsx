import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../axiosInstance";
import { useAuth } from "../context/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Email dan password wajib diisi!");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Format email tidak valid!");
      return;
    }

    try {
      const response = await api.post("/login", { email, password });

      const token = response.data.token || response.data.access_token;
      const role = response.data.user?.role || response.data.role;

      if (!token || !role) {
        throw new Error("Token atau role tidak ditemukan dalam response API");
      }

      login(token, role);

      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "mentor") {
        navigate("/mentor-dashboard");
      } else if (role === "mentee") {
        navigate("/mentee-dashboard");
      }
    } catch (error) {
      console.error("Error login:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Login gagal! Periksa kredensial Anda."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar sederhana */}
      <header className="flex items-center justify-between px-10 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src="/assets/Logo Sistem Mentoring.png"
            alt="Logo"
            className="w-10 h-10"
          />
          <input
            type="text"
            placeholder="Cari Program"
            className="border border-gray-300 rounded-md px-3 py-1 text-sm w-64"
          />
        </div>

        <nav className="flex items-center gap-8 text-sm font-medium text-gray-700">
          <a href="#" className="hover:text-[#b38867]">
            Program
          </a>
          <a href="#" className="hover:text-[#b38867]">
            Langganan
          </a>
          <a href="#" className="hover:text-[#b38867]">
            E-Learning
          </a>
        </nav>

        <div className="flex gap-4">
          <a
            href="/register"
            className="px-4 py-2 border border-[#b38867] rounded-md text-[#b38867] hover:bg-[#b38867] hover:text-white transition"
          >
            Daftar
          </a>
          <a
            href="/login"
            className="px-4 py-2 bg-[#b38867] text-white rounded-md hover:bg-[#a27355] transition"
          >
            Masuk
          </a>
        </div>
      </header>

      {/* Form Login */}
      <main className="flex-grow flex justify-center items-center">
        <div className="w-full max-w-md bg-white p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Masuk ke Akun Mentoring</h2>
          <p className="text-center text-gray-500 mb-6">
            Silakan masukkan kredensial Anda
          </p>

          <form onSubmit={handleSubmit}>
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
                placeholder="Alamat Email"
                required
              />
            </div>

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
              <a href="#" className="text-sm text-[#b38867] hover:underline">
                Lupa Password?
              </a>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 mt-2 bg-[#b38867] text-white font-semibold rounded-lg hover:bg-[#a27355]"
            >
              Masuk
            </button>

            {/* Garis pemisah */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-3 text-gray-400 text-sm">atau</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 flex items-center justify-center"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                alt="Google Logo"
                className="inline-block w-5 mr-3"
              />
              Masuk Dengan Google
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Belum punya akun?{" "}
            <a href="/register" className="text-[#b38867] hover:underline">
              Daftar Sekarang
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
