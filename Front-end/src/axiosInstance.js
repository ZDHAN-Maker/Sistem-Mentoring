import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Ambil token dari cookie dan tambahkan ke header
export const getCsrfCookie = async () => {
  try {
    await api.get("/sanctum/csrf-cookie");

    // Ambil token dari cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (token) {
      api.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(token);
      console.log("✅ CSRF cookie & header diset");
    } else {
      console.warn("⚠️ Tidak menemukan XSRF-TOKEN di cookie");
    }
  } catch (err) {
    console.error("❌ Gagal mendapatkan CSRF cookie:", err);
    throw err;
  }
};

export const sanctumLogout = async () => {
  try {
    await api.post("/logout");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export { api };
