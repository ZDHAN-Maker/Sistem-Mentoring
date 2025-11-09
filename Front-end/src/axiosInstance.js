// src/axiosInstance.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // Tempat yang bagus untuk menambahkan token atau log
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { api };
