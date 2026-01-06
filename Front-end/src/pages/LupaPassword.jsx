import { useState } from "react";
import useLupaPassword from "../hooks/useLupaPassword";

export default function LupaPassword({ token, email }) {
  const { password, setPassword, confirmPassword, setConfirmPassword, loading, message, handleSubmit } =
    useLupaPassword(token, email);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#8A6B4F]">Reset Password</h2>

        {message && <p className="mb-4 text-center text-green-600">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password Baru */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password Baru"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b38867]"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-sm text-[#b38867]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Sembunyikan" : "Lihat"}
            </button>
          </div>

          {/* Konfirmasi Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Konfirmasi Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b38867]"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-sm text-[#b38867]"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? "Sembunyikan" : "Lihat"}
            </button>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#b38867] hover:bg-[#a3775c]"
            }`}
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
