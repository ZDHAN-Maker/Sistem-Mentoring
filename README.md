# 🚀 Sistem Mentoring App

Aplikasi **Sistem Mentoring** berbasis web dengan arsitektur **Decoupled** (Front-end dan Back-end terpisah).  
Menggunakan **React (Vite)** di sisi Client dan **Laravel** sebagai REST API di sisi Server.

---

## 🛠️ Tech Stack

### **Front-end (Client Side)**
- ⚛️ **React 18 (Vite)**
- 🎨 **Tailwind CSS v4** (via `@tailwindcss/vite`)
- 🖼 **Icons:** Lucide React, Heroicons, React Icons
- 🔗 **HTTP Client:** Axios
- 🔐 **Auth/State:** JS Cookie, React Router DOM
- 📅 **UI Component:** React Calendar

### **Back-end (Server Side)**
- 🐘 **Laravel 11/12**
- 🗄 **MySQL**
- ⚡ **Build Tool:** Vite (Laravel Vite Plugin)

---

## ⚙️ Prasyarat

Pastikan perangkat sudah menginstal:
- **PHP >= 8.2**
- **Node.js & npm**
- **Composer**
- **MySQL** (XAMPP, Laragon, atau native)

---

# 🚀 Instalasi & Menjalankan Aplikasi

---

# 1️⃣ Back-end Setup (Laravel)

### 1. Masuk ke direktori backend

cd back-end


# Install dependencies

 - composer install

---
#  Konfigurasi Environment

- DB_CONNECTION=mysql
- DB_HOST=127.0.0.1
- DB_PORT=3306
- DB_DATABASE=back_end_sistem_mentoring
- DB_USERNAME=root
- DB_PASSWORD=

---

# Migrasi & Seed database

- php artisan migrate
- php artisan db:seed

---
# Buat storage link

php artisan storage:link

---

# Jalankan server backend

- php artisan serve --host=localhost

- API Endpoint: http://localhost:8000

---
# 2️⃣ Front-end Setup (React Vite)

---

# Masuk ke direktori front-end

cd front-end

---

# Install dependencies

npm install

---

# Jalankan server development

- npm run dev

- URL Frontend: http://localhost:5173


---

# Akun User

- 'name' => 'Admin User',
  'email' => 'admin@example.com',
  'password' => Hash::make('password'),
  'role' => 'admin',

- 'name' => 'Mentor User',
  'email' => 'mentor@example.com',
  'password' => Hash::make('password'),
  'role' => 'mentor',

- 'name' => 'Mentee User',
  'email' => 'mentee@example.com',
  'password' => Hash::make('password'),
  'role' => 'mentee',
