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

// Ambil CSRF cookie (TANPA parsing manual)
export const getCsrfCookie = async () => {
  try {
    await api.get("/sanctum/csrf-cookie");
    console.log("CSRF cookie loaded");
  } catch (error) {
    console.error("Gagal mengambil CSRF cookie:", error);
  }
};

// Cek session user
export const checkUserSession = async () => {
  try {
    const response = await api.get("/api/user");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("User tidak terautentikasi");
      return null;
    }
    console.error("Error checking user session:", error);
    throw error;
  }
};

// Logout
export const sanctumLogout = async () => {
  try {
    await api.post("/logout");
  } catch (error) {
    console.error("Gagal logout:", error.response?.data || error.message);
    throw error;
  }
};

// Interceptor: 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Server mengembalikan 401 (unauthenticated).");
    }
    return Promise.reject(error);
  }
);

export { api };
