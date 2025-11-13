import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Ambil CSRF token dari cookie Sanctum
export const getCsrfCookie = async () => {
  try {
    await api.get('/sanctum/csrf-cookie');
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    if (token) {
      api.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
  } catch (error) {
    console.error('Gagal mengambil CSRF cookie:', error);
  }
};

// Logout user (hapus session Sanctum)
export const sanctumLogout = async () => {
  try {
    await api.post('/logout');
    console.info('Berhasil logout dari Sanctum');
  } catch (error) {
    console.error('Gagal logout dari Sanctum:', error);
  }
};

// Cek session user aktif
export const checkUserSession = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch {
    return null;
  }
};

// Interceptor: jika 401 (unauthenticated), langsung logout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('⚠️ Session habis, user akan logout otomatis.');
      localStorage.clear(); // hapus data lokal
    }
    return Promise.reject(error);
  }
);

export { api };
