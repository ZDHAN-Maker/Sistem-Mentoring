// src/axiosInstance.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api'; // Ganti dengan URL API Laravel

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Menambahkan interceptor untuk menyertakan token di setiap request
api.interceptors.request.use((config) => {
  // Mengambil token dari localStorage
  const token = localStorage.getItem("token");
  if (token) {
    // Jika token ada, tambahkan ke header Authorization
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  // Menangani error request jika ada
  return Promise.reject(error);
});

export { api };
