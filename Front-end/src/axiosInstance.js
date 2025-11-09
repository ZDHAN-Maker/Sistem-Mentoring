import axios from "axios";

// Gunakan baseURL yang konsisten
const api = axios.create({
  baseURL: "http://localhost:8000/api", // ubah ke localhost
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Fungsi untuk mendapatkan CSRF cookie dengan error handling
export const getCsrfCookie = async () => {
  try {
    const response = await api.get("/sanctum/csrf-cookie");
    console.log("CSRF Cookie obtained:", response);
    return response;
  } catch (error) {
    console.error("Failed to get CSRF cookie:", error);
    throw error;
  }
};

export { api };