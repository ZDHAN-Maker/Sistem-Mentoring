import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

export const getCsrfCookie = () => api.get("/sanctum/csrf-cookie");

export const sanctumLogout = () => api.post("/logout");

api.interceptors.request.use((config) => {
  const token = Cookies.get("XSRF-TOKEN");
  if (token) config.headers["X-XSRF-TOKEN"] = token;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401)
      console.warn("401 Unauthorized - session expired.");
    if (error.response?.status === 419)
      console.warn("419 CSRF invalid - ambil ulang CSRF.");
    return Promise.reject(error);
  }
);

export { api };
