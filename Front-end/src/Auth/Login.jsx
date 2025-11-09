import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../axiosInstance";
import { useAuth } from "../context/useAuth";
import Header from "../components/Header";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Email dan password wajib diisi!");
      return;
    }

    try {
      // 1️⃣ Ambil CSRF cookie agar Laravel mengenali sesi
      await api.get("/sanctum/csrf-cookie");

      // 2️⃣ Kirim request login
      const loginResponse = await api.post(
        "/login",
        { email, password, remember: rememberMe },
        { withCredentials: true }
      );

      // 3️⃣ Cek apakah berhasil login
      if (![200, 204].includes(loginResponse.status)) {
        throw new Error(`Login gagal (${loginResponse.status})`);
      }

      // 4️⃣ Ambil user yang sedang login
      const userResponse = await api.get("/api/users");
      const user = userResponse?.data?.user;
      const role = user?.role;

      if (!user || !role) {
        throw new Error("Gagal mendapatkan data user dari server.");
      }

      // 5️⃣ Simpan ke Auth Context
      setAuthData({ isAuthenticated: true, role, user });

      // 6️⃣ Redirect berdasarkan role
      switch (role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "mentor":
          navigate("/mentor-dashboard");
          break;
        case "mentee":
          navigate("/mentee-dashboard");
          break;
        default:
          setErrorMessage("Role tidak dikenali!");
      }

    } catch (error) {
      console.error("Login Error:", error);

      // Ambil pesan error dari response Laravel jika ada
      const msg =
        error?.response?.data?.message ||
        (error?.response?.status === 419
          ? "CSRF token mismatch. Coba refresh halaman dan login ulang."
          : error?.message || "Terjadi kesalahan saat login.");

      setErrorMessage(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="grow flex items-center justify-center py-14 bg-gray-50">
        <div className="w-full max-w-lg px-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_6px_24px_rgba(0,0,0,0.06)] p-8 md:p-10">
            <h2 className="text-2xl font-bold text-center mb-2">Masuk</h2>

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
                  placeholder="Email"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
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
                  {showPassword ? "Sembunyikan" : "Lihat"}
                </button>
              </div>

              {/* Remember me */}
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

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-[#b38867] text-white font-semibold rounded-lg hover:bg-[#a27355]"
              >
                Masuk
              </button>

              <div className="flex items-center my-6">
                <div className="grow border-t border-gray-200"></div>
                <span className="mx-3 text-gray-400 text-sm">atau</span>
                <div className="grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg flex items-center justify-center gap-3 font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                <img
                  src="/assets/google.png"
                  alt="Google Logo"
                  className="w-7 h-7 object-contain"
                />
                <span className="text-base">Masuk Dengan Google</span>
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Belum punya akun?{" "}
              <a href="/register" className="text-[#b38867] hover:underline">
                Daftar Sekarang
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
