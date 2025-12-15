import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Helper untuk get CSRF cookie
export const getCsrfCookie = async () => {
  try {
    // GUNAKAN INSTANCE YANG SAMA untuk share cookies
    await api.get("/csrf-cookie", {
      baseURL: "http://localhost:8000/sanctum",
    });
    console.log("✅ CSRF cookie obtained");
  } catch (error) {
    console.error("❌ Failed to get CSRF cookie:", error);
    throw error;
  }
};

// Interceptor untuk attach XSRF token dari cookie
api.interceptors.request.use(
  (config) => {
    // Ambil XSRF-TOKEN dari cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (token) {
      // Decode URI component karena Laravel encode cookie
      config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
      console.log("🔐 XSRF Token attached:", token.substring(0, 20) + "...");
    } else {
      console.warn("⚠️ No XSRF token found in cookies");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle 419 error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 419 && !originalRequest._retry) {
      console.log("🔄 Retrying with fresh CSRF token...");
      originalRequest._retry = true;

      await getCsrfCookie();
      
      // Tunggu sebentar untuk cookie siap
      await new Promise(resolve => setTimeout(resolve, 100));

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;