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
  await api.get("/csrf-cookie", {
    baseURL: "http://localhost:8000/sanctum",
  });
};

// Interceptor untuk attach XSRF token dari cookie
api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (token) {
      config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor untuk handle 419 error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;

      await getCsrfCookie();
      await new Promise((resolve) => setTimeout(resolve, 100));

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);
export default api;