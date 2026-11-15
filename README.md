# 🎓 Aeterna Mentoring Platform

<p align="center">
  <img src="Front-end/public/assets/Logo%20Sistem%20Mentoring.png" alt="Aeterna Logo" width="100" />
</p>

<p align="center">
  <b>Sistem Platform Mentoring & E-Learning Terpadu Berstandar Industri</b><br />
  Akselerasi karier digital melalui bimbingan intensif 1-on-1 bersama praktisi industri dan kurikulum berbasis proyek.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 12" />
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/PHP-%3E%3D8.2-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP 8.2" />
</p>

---

## 📌 Tentang Proyek

**Aeterna Mentoring Platform** adalah ekosistem pembelajaran digital *full-stack* yang menghubungkan **Mentee** (peserta belajar) dengan para **Mentor** profesional (praktisi industri). Sistem ini dilengkapi dengan manajemen materi pembelajaran, sesi live mentoring 1-on-1, penugasan proyek riil, evaluasi sertifikasi berstandar SKKNI, serta portal administrasi terpusat.

### ✨ Fitur Utama

- **🛡️ Multi-Role Authentication & Authorization (Sanctum SPA):**
  - **Admin:** Manajemen pengguna, verifikasi materi, kontrol paket langganan, dan laporan sistem.
  - **Mentor:** Manajemen materi & video kursus, penjadwalan sesi bimbingan, review & penilaian tugas mentee.
  - **Mentee:** Eksplorasi katalog program & e-learning, berlangganan paket, booking sesi mentoring, pengumpulan tugas proyek.
- **📚 Katalog Program & E-Learning Terstruktur:**
  - Halaman **Program Mentoring** (`/program`): Silabus live bimbingan 1-on-1, profil mentor, dan level kompetensi.
  - Halaman **E-Learning 24/7** (`/e-learning`): Modul video self-paced, kuis interaktif, dan sertifikat digital.
  - Halaman **Paket Langganan** (`/langganan`): Pilihan paket fleksibel (Starter, Pro, Enterprise).
- **🎨 Modern Enterprise UI/UX:**
  - Desain antarmuka modern dengan skema warna elegan (`#b38867` / `#7B5E4A`).
  - Halaman Login & Register dengan konsep *Centered Enterprise Card*, proteksi autofill browser, Google SSO, dan tombol akses cepat *Demo 1-Click*.
  - Header navigasi *glassmorphic sticky* yang responsif di seluruh perangkat.

---

## 🛠️ Tech Stack

| Bagian | Teknologi |
| :--- | :--- |
| **Backend** | Laravel 12, PHP >= 8.2, Laravel Sanctum, PostgreSQL / MySQL |
| **Frontend** | React 18, Vite 7, Tailwind CSS v4, Lucide React, Axios, React Router DOM v6 |
| **Authentication** | SPA Cookie-based Session & CSRF Protection |

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

Pastikan perangkat Anda telah terpasang:
- **PHP** >= 8.2 & **Composer**
- **Node.js** >= 18.x & **npm**
- **Database Server** (PostgreSQL atau MySQL)
- **Git**

### 1. Clone Repository

```bash
git clone https://github.com/ZDHAN-Maker/Sistem-Mentoring.git
cd Sistem-Mentoring
```

---

### 2. Setup Back-End (Laravel API)

1. Masuk ke direktori backend:
   ```bash
   cd Back-end
   ```

2. Pasang dependensi PHP:
   ```bash
   composer install
   ```

3. Salin file environment:
   ```bash
   cp .env.example .env
   ```

4. Buka file `.env` dan sesuaikan koneksi database Anda:
   ```env
   APP_URL=http://localhost:8000
   FRONTEND_URL=http://localhost:5173

   DB_CONNECTION=pgsql # atau mysql
   DB_HOST=127.0.0.1
   DB_PORT=5432        # atau 3306 untuk MySQL
   DB_DATABASE=sistem_mentoring
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   ```

5. Generate Application Key & buat symbolic link storage:
   ```bash
   php artisan key:generate
   php artisan storage:link
   ```

6. Jalankan migrasi database beserta data seeder bawaan:
   ```bash
   php artisan migrate:fresh --seed
   ```

7. Jalankan development server backend:
   ```bash
   php artisan serve
   ```
   > 🌐 Backend API akan berjalan di: `http://localhost:8000`

---

### 3. Setup Front-End (React + Vite)

1. Buka terminal baru dan masuk ke direktori frontend:
   ```bash
   cd Front-end
   ```

2. Pasang dependensi Node.js:
   ```bash
   npm install
   ```

3. Jalankan development server frontend:
   ```bash
   npm run dev
   ```
   > 🌐 Frontend aplikasi akan berjalan di: `http://localhost:5173`

---

## 🔑 Akun Demo Pengujian (Default Seeders)

Setelah menjalankan `php artisan migrate:fresh --seed`, Anda dapat langsung login menggunakan akun demo berikut:

| Peran (Role) | Email | Kata Sandi (Password) | Dashboard |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password` | `/admin-dashboard` |
| **Mentor** | `mentor@example.com` | `password` | `/mentor-dashboard` |
| **Mentee** | `mentee@example.com` | `password` | `/mentee-dashboard` |

*(Tersedia juga tombol 1-Click Demo Login langsung pada halaman `/login`)*.

---

## 📂 Struktur Direktori Proyek

```text
Sistem-Mentoring/
├── Back-end/                  # Laravel 12 API Application
│   ├── app/                   # Controllers, Models, Services, Policies
│   ├── database/              # Migrations, Seeders, Factories
│   ├── routes/                # api.php, web.php
│   └── .env.example           # Environment template
│
├── Front-end/                 # React 18 + Vite Frontend Application
│   ├── public/                # Static assets & images
│   ├── src/
│   │   ├── Auth/              # Login.jsx, Register.jsx
│   │   ├── components/        # Header.jsx, PrivateRoute.jsx, dsb.
│   │   ├── context/           # AuthContext, CartContext
│   │   ├── pages/             # Program, E-Learning, Langganan, Role Dashboards
│   │   └── axiosInstance.js   # Konfigurasi Axios & CSRF handling
│   └── package.json
│
└── README.md                  # Dokumentasi proyek
```

---

## 📝 Lisensi

Proyek ini dikembangkan untuk kebutuhan platform mentoring dan akselerasi karier digital. Seluruh hak cipta dilindungi.
