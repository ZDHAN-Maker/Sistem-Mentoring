// src/axiosInstance.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api'; // Ganti dengan URL API Laravel

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Tambahkan ini untuk memastikan cookie dikirim
});

// Menggunakan interceptor untuk memastikan semua request menggunakan cookie
api.interceptors.request.use((config) => {
  // Dengan menggunakan cookie HttpOnly, kita tidak perlu menambahkan token ke header
  return config;
}, (error) => {
  return Promise.reject(error);
});

export { api };
