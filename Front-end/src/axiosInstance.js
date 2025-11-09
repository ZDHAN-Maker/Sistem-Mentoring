import axios from "axios";

// Axios instance khusus untuk Laravel Sanctum (session-based)
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Fungsi helper untuk memastikan CSRF cookie aktif
export const getCsrfCookie = async () => {
  try {
    const response = await api.get("http://localhost:8000/sanctum/csrf-cookie", {
      withCredentials: true,
    });
    console.log("✅ CSRF cookie obtained:", response.status);
    return response;
  } catch (error) {
    console.error("❌ Failed to get CSRF cookie:", error);
    throw error;
  }
};

// (Optional) Logout helper – panggil API logout backend
export const sanctumLogout = async () => {
  try {
    await api.post("/logout");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export { api };
