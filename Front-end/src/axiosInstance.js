// src/axiosInstance.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api'; // Ganti dengan URL API Laravel

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mengatur token JWT ke header jika sudah login
const setAuthHeader = (token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export { api, setAuthHeader };
