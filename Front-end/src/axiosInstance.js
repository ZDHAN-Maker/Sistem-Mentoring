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

// Ambil token dari cookie dan tambahkan ke header
export const getCsrfCookie = async () => {
  await api.get('/sanctum/csrf-cookie');

  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  if (token) {
    api.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(token);
  }
};

// Logout user dari Sanctum
export const sanctumLogout = async () => {
  await api.post('/logout');
};

export { api };
