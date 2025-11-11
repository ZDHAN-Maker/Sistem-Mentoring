import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // ubah sesuai backend kamu
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Ambil token dari cookie dan tambahkan ke header
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

// Logout user dari Sanctum
export const sanctumLogout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Gagal logout dari Sanctum:', error);
  }
};

// ✅ Tambahan: interceptor untuk cek session otomatis
// Jika backend merespon 401 (unauthenticated), bisa otomatis logout atau refresh session
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session kadaluarsa. Mencoba refresh session...');
      try {
        // Coba ambil CSRF baru dan cek ulang user
        await getCsrfCookie();
        await api.get('/user'); // kalau sukses berarti session masih valid
        return Promise.resolve(); // biar tidak logout
      } catch  {
        console.error('Session benar-benar berakhir, harus login ulang.');
      }
    }
    return Promise.reject(error);
  }
);

// ✅ Tambahan: fungsi untuk cek apakah user masih login setelah refresh
export const checkUserSession = async () => {
  try {
    const response = await api.get('/user');
    return response.data; // kembalikan data user jika masih login
  } catch {
    return null; // tidak login
  }
};

export { api };
