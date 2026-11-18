# 🎓 Aeterna Mentoring Platform

<p align="center">
  <img src="Front-end/public/assets/Logo%20Sistem%20Mentoring.png" alt="Aeterna Logo" width="110" />
</p>

<p align="center">
  <b>Sistem Platform Mentoring, Konsultasi & E-Learning Terpadu Berstandar Industri</b><br />
  Akselerasi karier digital melalui bimbingan intensif 1-on-1 bersama praktisi industri, kurikulum berbasis proyek riil, notifikasi real-time, dan sertifikasi digital terverifikasi.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 12" />
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/PHP-%3E%3D8.2-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP 8.2" />
  <img src="https://img.shields.io/badge/OAuth_2.0-Google_SSO-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google OAuth" />
  <img src="https://img.shields.io/badge/Web_Push-VAPID-FF6B6B?style=for-the-badge&logo=pwa&logoColor=white" alt="Web Push VAPID" />
</p>

---

## 📌 Tentang Proyek

**Aeterna Mentoring Platform** adalah ekosistem pembelajaran digital *full-stack* modern yang menjembatani **Mentee** (peserta bimbingan/mahasiswa) dengan para **Mentor** profesional (praktisi industri) di bawah pengawasan **Admin** terpusat. 

Platform ini dirancang siap pakai (*enterprise-ready*) dengan arsitektur SPA (*Single Page Application*) berbasis React 18 dan RESTful API performa tinggi berbasis Laravel 12.

---

## ✨ Fitur-Fitur Unggulan

### 1. 🛡️ Multi-Role Authentication & Google OAuth 2.0 (SSO)
- **Multi-Role RBAC:** Pemisahan hak akses ketat antara **Admin**, **Mentor**, dan **Mentee** menggunakan token Sanctum & session cookie.
- **Google Single Sign-On (SSO):**
  - Alur otentikasi Google Cloud OAuth 2.0 resmi menggunakan `laravel/socialite`.
  - Terintegrasi langsung di form Login dan Registrasi.
  - **Interactive Developer Simulator:** Menyediakan modal simulasi akun Google (`GoogleAccountChooser.jsx`) jika kredensial Google belum disetel atau saat pengujian offline, sehingga alur otentikasi tetap dapat diuji 100% tanpa konfigurasi eksternal.
- **1-Click Demo Login:** Akses instan untuk pengujian role Admin, Mentor, dan Mentee dengan sekali klik.

### 2. 💬 Direct Messaging & Chat Multi-Kontak Terpadu
- **Antarmuka Percakapan 2-Kolom Modern:** Sidebar daftar kontak dengan badge pesan belum dibaca (*unread count*), filter tab, dan panel pesan aktif.
- **Konsultasi Mentor-Mentee:** Mentee dapat langsung memilih mentor pembimbing dan berdiskusi seputar materi, tugas, maupun karier.
- **Multi-Role Chat Hub:** Mentor dapat memantau seluruh mentee aktif dalam satu dashboard komunikasi terpusat.
- **Fitur Chat Pintar:** Format tanggal/waktu ramah pengguna, penanda waktu bubble chat, auto-scroll ke pesan terbaru, dan input pesan responsif.

### 3. 🔔 Web Push Notifications Terintegrasi (VAPID)
- **Notifikasi Latar Belakang (Background Push):** Menggunakan Service Worker browser (`/sw.js`) dan library `minishlink/web-push` di backend.
- **8 Trigger Event Otomatis:**
  1. Penugasan tugas baru dari Mentor.
  2. Pengumpulan tugas oleh Mentee.
  3. Hasil review & feedback dari Mentor.
  4. Publikasi modul/materi baru.
  5. Pengingat jadwal sesi live mentoring.
  6. Pesan obrolan masuk (*Direct Message*).
  7. Pengumuman sistem/broadcast dari Admin.
  8. Pembaruan status paket langganan.
- **VAPID Key Pair Ready:** Konfigurasi aman menggunakan standar RFC 8292.

### 4. 📜 Generator Sertifikat Digital SKKNI & Verifikasi Publik
- **Sertifikat Kelulusan Resmi:** Desain elegan siap cetak (*print-ready*) dengan nomor seri unik sertifikat, tanggal kelulusan, dan standar unit kompetensi SKKNI.
- **Public Certificate Verification:** Halaman verifikasi publik di rute `/verify-certificate/:code` lengkap dengan QR Code / Barcode yang dapat dipindai oleh perusahaan/rekruiter untuk memvalidasi keaslian sertifikat secara instan.

### 5. 📊 Ekspor Laporan Komprehensif (Excel & PDF Resmi)
- **Komponen Ekspor Modular (`ExportButton.jsx` & `exportReport.js`):**
  - **Ekspor Excel (.xlsx):** Menggunakan SheetJS (`xlsx`) dengan auto-width kolom terhitung dinamis, header styling, dan sanitasi data.
  - **Ekspor PDF Resmi (.pdf):** Menggunakan `jspdf` dan `jspdf-autotable` dengan format surat resmi, kop Aeterna Mentoring Platform, metadata waktu generasi, status badge berwarna, tabel data rapi, serta nomor halaman otomatis.
- **Tersedia di Seluruh Dashboard:**
  - **Admin:** Ekspor laporan progres seluruh mentee & aktivitas mentor.
  - **Mentor:** Ekspor rekapitulasi penilaian tugas dan umpan balik (*feedback*).
  - **Mentee:** Ekspor portofolio progres belajar pribadi.

### 6. 📚 Manajemen Pembelajaran & Program Bimbingan
- **Katalog Program Live Mentoring (`/program`):** Silabus interaktif, detail pertemuan 1-on-1, profil spesialisasi mentor, dan level kompetensi.
- **E-Learning 24/7 On-Demand (`/e-learning`):** Modul kursus video mandiri, materi unduhan, dan pelacakan progres per modul.
- **Paket Langganan Fleksibel (`/langganan`):** Pilihan paket berjenjang (*Starter*, *Pro*, *Enterprise*) dengan matriks komparasi fitur lengkap.
- **Enterprise Global Footer:** Informasi kontak resmi, lisensi, legalitas, serta tautan cepat ke seluruh ekosistem platform.

---

## 🛠️ Tech Stack

| Kategori | Teknologi | Deskripsi / Penggunaan |
| :--- | :--- | :--- |
| **Backend Framework** | **Laravel 12.x** | RESTful API, Routing, Controllers, Middlewares |
| **Bahasa Backend** | **PHP >= 8.2** | Engine runtime backend utama |
| **Autentikasi & SSO** | **Laravel Sanctum** & **Socialite** | Token SPA API & Google OAuth 2.0 authentication |
| **Web Push Engine** | **minishlink/web-push** | Push notification generator berbasis standar VAPID |
| **Database** | **PostgreSQL / MySQL** | Penyimpanan data relasional terstruktur |
| **Frontend Framework** | **React 18.x** | Library komponen UI reaktif berbasis SPA |
| **Build Tool & Bundler** | **Vite 7.x** | Hot-Module-Replacement (HMR) & optimasi build |
| **Styling & Icons** | **Tailwind CSS v4** & **Lucide React** | Modern utility-first styling dan ikon SVG profesional |
| **Dokumen & Ekspor** | **SheetJS (xlsx)** & **jspdf + autotable** | Generator spreadsheet Excel dan PDF dokumen resmi |
| **HTTP Client** | **Axios** | Komunikasi API dengan interseptor Bearer token otomatis |

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### Prasyarat Sistem
Pastikan perangkat Anda telah terpasang:
- **PHP** >= 8.2 & **Composer**
- **Node.js** >= 18.x & **npm**
- **Database Server** (PostgreSQL disarankan, atau MySQL)
- **Git**

---

### 1. Clone Repository

```bash
git clone https://github.com/ZDHAN-Maker/Sistem-Mentoring.git
cd Sistem-Mentoring
```

---

### 2. Setup Back-End (Laravel API)

1. **Masuk ke direktori backend:**
   ```bash
   cd Back-end
   ```

2. **Pasang dependensi PHP:**
   ```bash
   composer install
   ```

3. **Salin file environment `.env`:**
   ```bash
   cp .env.example .env
   ```

4. **Konfigurasi Database di file `.env`:**
   ```env
   APP_NAME="Aeterna Mentoring"
   APP_ENV=local
   APP_KEY=
   APP_DEBUG=true
   APP_URL=http://localhost:8000
   FRONTEND_URL=http://localhost:5173

   DB_CONNECTION=pgsql # atau mysql
   DB_HOST=127.0.0.1
   DB_PORT=5432        # atau 3306 untuk MySQL
   DB_DATABASE=sistem_mentoring
   DB_USERNAME=postgres
   DB_PASSWORD=your_database_password
   ```

5. **(Opsional) Konfigurasi Google OAuth 2.0 & VAPID Web Push:**
   Tambahkan ke dalam `.env` backend jika ingin menggunakan akun Google Cloud asli:
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

   VAPID_PUBLIC_KEY=your-vapid-public-key
   VAPID_PRIVATE_KEY=your-vapid-private-key
   VAPID_SUBJECT=mailto:admin@aeterna.id
   ```
   *(Jika dibiarkan kosong, sistem secara otomatis beralih ke mode simulator interaktif tanpa error)*.

6. **Generate Application Key & buat symbolic link storage:**
   ```bash
   php artisan key:generate
   php artisan storage:link
   ```

7. **Jalankan migrasi database beserta data seeder default:**
   ```bash
   php artisan migrate:fresh --seed
   ```

8. **Jalankan server backend:**
   ```bash
   php artisan serve
   ```
   > 🌐 Backend API akan aktif di: **`http://localhost:8000`**

---

### 3. Setup Front-End (React + Vite)

1. **Buka terminal baru dan masuk ke direktori frontend:**
   ```bash
   cd Front-end
   ```

2. **Pasang dependensi Node.js:**
   ```bash
   npm install
   ```

3. **Pastikan konfigurasi `.env` frontend sudah benar:**
   Buat/periksa file `Front-end/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Jalankan development server frontend:**
   ```bash
   npm run dev
   ```
   > 🌐 Frontend aplikasi akan aktif di: **`http://localhost:5173`**

---

## 🔑 Akun Demo Pengujian (Default Seeders)

Setelah menjalankan `php artisan migrate:fresh --seed`, seluruh akun peran telah siap digunakan:

| Peran (Role) | Email Pengujian | Password | Akses Dashboard Utama |
| :--- | :--- | :--- | :--- |
| 🛡️ **Admin** | `admin@example.com` | `password` | `/admin-dashboard` |
| 👨‍🏫 **Mentor** | `mentor@example.com` | `password` | `/mentor-dashboard` |
| 🎓 **Mentee** | `mentee@example.com` | `password` | `/mentee-dashboard` |

> 💡 **Tips Pengujian:** Pada halaman `/login`, Anda juga dapat menekan tombol **"Quick Demo Login"** untuk langsung masuk sebagai Admin, Mentor, atau Mentee tanpa mengetik kredensial secara manual.

---

## 📂 Struktur Direktori Proyek

```text
Sistem-Mentoring/
├── Back-end/                          # Laravel 12 API Application
│   ├── app/
│   │   ├── Http/Controllers/          # GoogleAuthController, TaskController, ChatController, dsb.
│   │   ├── Models/                    # User, Task, Submission, Program, Certificate, dsb.
│   │   └── Services/                  # NotificationService, ExportService
│   ├── config/                        # services.php (OAuth & Third-Party), sanctum.php
│   ├── database/
│   │   ├── migrations/                # Skema database & tabel OAuth Google
│   │   └── seeders/                   # Seeder data pengguna demo & katalog
│   ├── routes/                        # api.php, web.php
│   └── .env.example                   # Template variabel lingkungan
│
├── Front-end/                         # React 18 + Vite Frontend Application
│   ├── public/
│   │   ├── assets/                    # Logo platform, ikon, & branding
│   │   └── sw.js                      # Service Worker untuk Web Push Notifications
│   ├── src/
│   │   ├── Auth/                      # Login.jsx, Register.jsx
│   │   ├── components/                # Header, Footer, ExportButton, GoogleAccountChooser, PrivateRoute
│   │   ├── context/                   # AuthProvider, NotificationContext, CartContext
│   │   ├── pages/
│   │   │   ├── Admin/                 # ProgressReportAdmin, UserManagement, SubscriptionControl
│   │   │   ├── Mentor/                # MentorDashboard, ReviewReports, ScheduleMentoring
│   │   │   ├── Mentee/                # MenteeDashboard, MyReports, ProgramCatalog, ELearning
│   │   │   ├── Auth/GoogleCallback.jsx# Handler OAuth Callback
│   │   │   └── Certificate/           # VerifyCertificate.jsx, DigitalCertificateView.jsx
│   │   ├── utils/                     # exportReport.js (Excel & PDF engine)
│   │   └── axiosInstance.js           # Konfigurasi Axios & Bearer Token
│   └── package.json
│
└── README.md                          # Dokumentasi resmi proyek
```

---

## 🔒 Kebijakan Keamanan & Kontribusi

- **Sanctum Token & CSRF Protection:** Seluruh rute API privat dilindungi oleh middleware `auth:sanctum`.
- **Sanitasi Data Input:** Mencegah celah XSS dan SQL Injection melalui Form Request Validation Laravel dan escaping React JSX.
- **Role Verification:** Guard otorisasi berlapis di tingkat frontend (`PrivateRoute.jsx`) dan backend controller policy.

---

## 📝 Lisensi

Proyek ini dikembangkan dan dikelola oleh **Dan** ([@ZDHAN-Maker](https://github.com/ZDHAN-Maker)) sebagai sistem terpadu bimbingan digital dan percepatan karier profesional berstandar industri. Seluruh hak cipta dilindungi undang-undang.
