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
  } catch (error) {
    console.error("❌ Failed to get CSRF cookie:", error);
    throw error;
  }
};

export const sanctumLogout = () => api.post("/logout");

// ✅ Helper untuk get auth flag dari localStorage
const GET_AUTH_FLAG = () => {
  try {
    return localStorage.getItem('auth_session') === 'true';
  } catch {
    return false;
  }
};

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Add CSRF token
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
    
    // ✅ Set auth flag setelah login berhasil
    if (response.config.url.includes('login') && response.status === 200) {
      localStorage.setItem('auth_session', 'true');
      localStorage.setItem('auth_timestamp', Date.now().toString());
      console.log("🔐 Auth session stored");
    }
    
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    
    // ✅ Clear auth flag jika unauthorized
    if (status === 401) {
      console.warn("⚠️ 401 Unauthorized - clearing auth session");
      localStorage.removeItem('auth_session');
      localStorage.removeItem('auth_timestamp');
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