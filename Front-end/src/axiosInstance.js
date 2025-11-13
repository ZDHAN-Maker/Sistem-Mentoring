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

// Ambil CSRF token dari cookie Sanctum
export const getCsrfCookie = async () => {
  try {
    await api.get("/sanctum/csrf-cookie");
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (token) {
      api.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(token);
    }
  } catch (error) {
    console.error("Gagal mengambil CSRF cookie:", error);
  }
};

// Logout user (hapus session Sanctum)
export const sanctumLogout = async () => {
  try {
    await api.post("/logout", {}, { withCredentials: true });
  } catch (error) {
    console.error(
      "Gagal logout dari Sanctum:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Cek session user aktif
export const checkUserSession = async () => {
  try {
    const response = await api.get('/user', { withCredentials: true });
    return response.data; // bisa null atau user object
  } catch (error) {
    // Jika 401 => tidak terautentikasi
    if (error.response?.status === 401) {
      return null;
    }
    // untuk error lain, lempar agar caller tahu
    throw error;
  }
};

// Interceptor: jika 401 (unauthenticated), langsung logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Server mengembalikan 401 (unauthenticated).');
    }
    return Promise.reject(error);
  }
);
export { api };
