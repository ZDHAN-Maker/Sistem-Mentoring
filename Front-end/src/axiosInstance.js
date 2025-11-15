// File: axiosInstance.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  }
});

export const getCsrfCookie = async () => {
  try {
    await api.get("/sanctum/csrf-cookie", {
      baseURL: "http://localhost:8000",
    });
    console.log("✅ CSRF cookie obtained");
    
    // ✅ Debug: Log semua cookies setelah CSRF
    console.log("🍪 All cookies:", document.cookie);
    
  } catch (error) {
    console.error("❌ Failed to get CSRF cookie:", error);
    throw error;
  }
};

export const sanctumLogout = () => api.post("/logout");

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const cookies = document.cookie.split('; ');
    const xsrfCookie = cookies.find(row => row.startsWith('XSRF-TOKEN='));
    
    if (xsrfCookie) {
      const token = decodeURIComponent(xsrfCookie.split('=')[1]);
      config.headers['X-XSRF-TOKEN'] = token;
    }
    
    console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    
    // ✅ Debug: Log cookies setelah setiap response
    if (response.config.url.includes('login')) {
      console.log("🍪 Cookies after login:", document.cookie);
    }
    
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    
    if (status === 401) {
      console.warn("⚠️ 401 Unauthorized");
    }
    
    if (status === 419) {
      console.warn("⚠️ 419 CSRF Token Mismatch - Retrying...");
      try {
        await getCsrfCookie();
        return api.request(error.config);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }
    
    return Promise.reject(error);
  }
);

export { api };