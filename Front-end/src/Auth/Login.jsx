import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    if (!email || !password) {
      setErrorMessage("Email dan password wajib diisi!");
      setIsLoading(false);
      return;
    }

    try {
      const loggedUser = await login(email, password, rememberMe);

      // Validasi role user
      if (!loggedUser || !loggedUser.role) {
        setErrorMessage("Data user tidak valid. Silakan hubungi admin.");
        setIsLoading(false);
        return;
      }

      const redirectPaths = {
        admin: "/admin-dashboard",
        mentor: "/mentor-dashboard",
        mentee: "/mentee-dashboard",
      };

      const targetPath = redirectPaths[loggedUser.role];

      // Jika role tidak dikenali, redirect ke halaman default atau error
      if (!targetPath) {
        setErrorMessage(
          `Role "${loggedUser.role}" tidak dikenali. Silakan hubungi admin.`
        );
        setIsLoading(false);
        return;
      }

      navigate(targetPath);
    } catch (error) {
      console.log("Login error:", error);

      let msg = "Terjadi kesalahan saat login.";

      if (error.response) {
        const status = error.response.status;

        if (status === 401) msg = "Email atau password salah.";
        else if (status === 419) msg = "Session expired. Coba lagi.";
        else if (status === 422)
          msg = error.response.data.message || "Data tidak valid.";
      } else if (error.request) {
        msg = "Tidak dapat terhubung ke server.";
      }

      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#b38867] focus:border-[#b38867] outline-none transition"
                  placeholder="Email"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div className="mb-4 relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#b38867] focus:border-[#b38867] outline-none transition pr-12"
                  placeholder="Password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-sm text-gray-500 hover:text-[#b38867] transition"
                  disabled={isLoading}
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
                    className="h-4 w-4 mr-2 text-[#b38867] focus:ring-[#b38867]"
                    disabled={isLoading}
                  />
                  Remember Me
                </label>
                <a
                  href="/lupa-password"
                  className="text-sm text-[#b38867] hover:underline transition"
                >
                  Lupa Password?
                </a>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm text-center">
                    {errorMessage}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 mt-2 font-semibold rounded-lg transition ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed text-gray-200"
                    : "bg-[#b38867] hover:bg-[#a27355] text-white"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </div>
                ) : (
                  "Masuk"
                )}
              </button>

              <div className="flex items-center my-6">
                <div className="grow border-t border-gray-200"></div>
                <span className="mx-3 text-gray-400 text-sm">atau</span>
                <div className="grow border-t border-gray-200"></div>
              </div>

            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Belum punya akun?{" "}
              <a
                href="/register"
                className="text-[#b38867] hover:underline transition font-medium"
              >
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
