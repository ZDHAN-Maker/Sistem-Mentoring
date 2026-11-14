import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  PlayCircle, 
  Clock, 
  BookOpen, 
  Award, 
  Star, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Layers,
  GraduationCap,
  X,
  FileText,
  Lock,
  ChevronRight
} from 'lucide-react';

const ELEARNING_COURSES = [
  {
    id: 1,
    title: "Mastering Figma: From Zero to Design System Hero",
    category: "UI/UX Design",
    level: "Beginner",
    duration: "6 Jam • 18 Video Modul",
    rating: 4.9,
    studentsCount: 3420,
    instructor: {
      name: "Angela Putri",
      role: "Lead Product Designer at Tokopedia",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    coverImage: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80",
    description: "Kuasai teknik Auto-Layout, Variabel, Komponen varian, hingga membangun Design System berskala enterprise di Figma.",
    modules: [
      { title: "Modul 1: Antarmuka & Fondasi Figma", lessons: ["Pengenalan Workspace & Tools Utama", "Frame vs Group: Kapan Harus Digunakan", "Praktik: Mendesain Wireframe Pertama"] },
      { title: "Modul 2: Auto-Layout Mendalam", lessons: ["Prinsip Resizing (Fixed, Hug, Fill)", "Padding, Spacing, dan Min-Max Width", "Praktik: Responsive Card Component"] },
      { title: "Modul 3: Components & Variables", lessons: ["Master Component & Instances", "Component Properties & Variants", "Design Tokens & Variables (Warna, Spacing)"] },
      { title: "Modul 4: Prototyping & Handoff", lessons: ["Interactive Smart Animate", "Dev Mode & Figma-to-Code Handoff", "Final Project: SaaS Dashboard UI"] }
    ],
    features: ["Akses Seumur Hidup", "File Project Figma Latihan", "Sertifikat Kelulusan", "Forum Diskusi"]
  },
  {
    id: 2,
    title: "Modern React & Next.js: Full-Stack Web App Development",
    category: "Web Development",
    level: "Intermediate",
    duration: "10 Jam • 26 Video Modul",
    rating: 4.95,
    studentsCount: 4890,
    instructor: {
      name: "Rudi Hartono",
      role: "Senior Fullstack Engineer at Gojek",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    description: "Bangun aplikasi modern dengan Server Actions, App Router, Tailwind CSS, Prisma ORM, dan autentikasi terpusat.",
    modules: [
      { title: "Modul 1: Dasar React Modern & Hooks", lessons: ["useState, useEffect & Custom Hooks", "State Management Efisien", "Integrasi Tailwind CSS v4"] },
      { title: "Modul 2: Next.js App Router Architecture", lessons: ["Server Components vs Client Components", "Dynamic Routing & Nested Layouts", "Data Fetching & Caching Strategy"] },
      { title: "Modul 3: Database & Auth Backend", lessons: ["Database Modeling dengan Prisma ORM", "Autentikasi Aman dengan Auth.js / JWT", "Server Actions & Validasi Form"] },
      { title: "Modul 4: Deployment & Optimasi", lessons: ["SEO Optimization & Metadata", "Deploy ke Vercel dengan Production Database", "Final Project: E-Commerce Store"] }
    ],
    features: ["Source Code GitHub Lengkap", "Review Kode Mentor", "Sertifikat Resmi", "Latihan Mandiri"]
  },
  {
    id: 3,
    title: "RESTful API Engineering dengan Laravel 11 & Clean Architecture",
    category: "Web Development",
    level: "Intermediate",
    duration: "8 Jam • 22 Video Modul",
    rating: 4.88,
    studentsCount: 2950,
    instructor: {
      name: "Budi Santoso",
      role: "Backend Architect at Bukalapak",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    description: "Pelajari Service Layer, Form Requests, Sanctum Token Auth, Event & Listeners, serta automated testing dengan Pest.",
    modules: [
      { title: "Modul 1: Arsitektur REST API & Laravel Setup", lessons: ["Struktur Folder & API Routing", "Resource & JSON Response Standar", "Database Migration & Seeders"] },
      { title: "Modul 2: Business Logic Layer", lessons: ["Memisahkan Controller & Service Layer", "Repository Pattern & Dependency Injection", "Custom Form Request Validation"] },
      { title: "Modul 3: Security & Performance", lessons: ["Token Authentication dengan Sanctum", "Role-Based Access Control (RBAC)", "Optimasi Query Eager Loading"] },
      { title: "Modul 4: Events, Queue & Testing", lessons: ["Event & Notification Background Jobs", "Automated Testing dengan Pest PHP", "Dokumentasi API dengan Swagger"] }
    ],
    features: ["Dokumentasi Postman Collection", "Contoh Boilerplate Siap Pakai", "Sertifikat Kelulusan"]
  },
  {
    id: 4,
    title: "Data Analysis & Business Intelligence with Python & Tableau",
    category: "Data Science",
    level: "Beginner",
    duration: "7.5 Jam • 20 Video Modul",
    rating: 4.85,
    studentsCount: 2180,
    instructor: {
      name: "Siti Rahma",
      role: "Senior Data Analyst at Traveloka",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    description: "Ubah data mentah menjadi insight bisnis yang bernilai menggunakan Pandas, NumPy, Visualisasi Seaborn, dan Dashboard Tableau.",
    modules: [
      { title: "Modul 1: Python untuk Analisis Data", lessons: ["Dasar Python & Jupyter Notebook", "Manipulasi Dataframe dengan Pandas", "Data Cleaning & Menangani Missing Values"] },
      { title: "Modul 2: Exploratory Data Analysis (EDA)", lessons: ["Analisis Statistik Deskriptif", "Visualisasi Data dengan Matplotlib & Seaborn", "Mendeteksi Outlier & Pola Korelasi"] },
      { title: "Modul 3: Business Dashboard dengan Tableau", lessons: ["Koneksi Dataset & Data Modeling", "Membuat Chart Dinamis & Filter Interaktif", "Menyusun Storyboard Presentasi"] },
      { title: "Modul 4: Proyek Nyata Analisis Penjualan", lessons: ["Case Study: E-Commerce Sales Performance", "Rekomendasi Strategis Berbasis Data", "Final Project Portfolio"] }
    ],
    features: ["Dataset Riil Industri", "Template Dashboard Tableau", "Sertifikat Resmi"]
  },
  {
    id: 5,
    title: "Mobile App Development with Flutter: Android & iOS Cross-Platform",
    category: "Mobile App",
    level: "Intermediate",
    duration: "9 Jam • 24 Video Modul",
    rating: 4.92,
    studentsCount: 1870,
    instructor: {
      name: "Dimas Pratama",
      role: "Mobile Tech Lead at DANA",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
    },
    coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
    description: "Bangun aplikasi mobile native performa tinggi untuk Android & iOS dalam satu codebase menggunakan Flutter dan Bloc State Management.",
    modules: [
      { title: "Modul 1: Fondasi Dart & Flutter Widget", lessons: ["Dart OOP & Asynchronous Programming", "Stateless vs Stateful Widgets", "Tata Letak Layout & Responsive UI"] },
      { title: "Modul 2: State Management dengan Bloc", lessons: ["Konsep Event, State & Stream", "Implementasi Bloc & Cubit Pattern", "Manajemen Global State yang Rapi"] },
      { title: "Modul 3: Integrasi API & Local Storage", lessons: ["HTTP Request dengan Dio", "Offline Caching dengan Hive / SQLite", "Handling Error & Loading State"] },
      { title: "Modul 4: Build & Release App Store", lessons: ["Push Notification dengan Firebase", "Build APK & App Bundle untuk Play Store", "Final Project: Food Delivery App"] }
    ],
    features: ["Aplikasi Siap Deploy", "Aset Desain & Ilustrasi Gratis", "Sertifikat Kelulusan"]
  },
  {
    id: 6,
    title: "Cloud Infrastructure & CI/CD Pipeline with Docker & AWS",
    category: "DevOps & Cloud",
    level: "Advanced",
    duration: "8.5 Jam • 19 Video Modul",
    rating: 4.89,
    studentsCount: 1650,
    instructor: {
      name: "Fajar Nugraha",
      role: "DevOps Engineer at Blibli",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
    },
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    description: "Kontainerisasi aplikasi dengan Docker, orkestrasi cloud di AWS EC2 & S3, serta otomatisasi pipeline GitHub Actions.",
    modules: [
      { title: "Modul 1: Dockerisasi Aplikasi", lessons: ["Prinsip Container vs Virtual Machine", "Menulis Dockerfile Multi-Stage Build", "Docker Compose untuk Multi-Container Setup"] },
      { title: "Modul 2: Automasi CI/CD dengan GitHub Actions", lessons: ["Automated Testing Pipeline", "Build & Push Docker Image ke Registry", "Automated Zero-Downtime Deployment"] },
      { title: "Modul 3: Cloud AWS Fundamentals", lessons: ["Setup AWS EC2 & VPC Security Groups", "Database Management dengan AWS RDS", "Static Asset Storage di AWS S3"] },
      { title: "Modul 4: Monitoring & Server Hardening", lessons: ["Setup Nginx Reverse Proxy & SSL Let's Encrypt", "Server Monitoring & Logging", "Final Project: Enterprise Deployment"] }
    ],
    features: ["Script Deployment Siap Pakai", "Praktik Infrastruktur Nyata", "Sertifikat Resmi"]
  }
];

const CATEGORIES = [
  "Semua Kategori",
  "Web Development",
  "UI/UX Design",
  "Data Science",
  "Mobile App",
  "DevOps & Cloud"
];

export default function ELearning() {
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const filteredCourses = useMemo(() => {
    return ELEARNING_COURSES.filter(course => {
      const matchCat = selectedCategory === "Semua Kategori" || course.category === selectedCategory;
      const matchSearch = searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#b38867]/15 via-[#b38867]/5 to-transparent pt-12 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#b38867]/15 text-[#7B5E4A] text-xs font-semibold tracking-wide">
            <Sparkles size={14} />
            Platform Pembelajaran Mandiri & E-Learning Interaktif
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight max-w-3xl mx-auto leading-tight">
            Belajar Keterampilan Digital Terbaik dengan Modul Video Terstruktur
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Akses materi pembelajaran mandiri yang dirancang oleh praktisi terkemuka. Belajar kapan saja, di mana saja, dan dapatkan sertifikat kelulusan berstandar industri.
          </p>

          {/* Search bar inside Hero */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative flex items-center bg-white rounded-2xl shadow-md border border-gray-200 p-1.5">
              <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari topik modul, misalnya: React, Figma, Laravel, Python..."
                className="w-full px-3 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1.5 text-gray-400 hover:text-gray-600 mr-2"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
            <div className="p-4 bg-white/80 backdrop-blur-xs rounded-2xl border border-gray-200/80 shadow-xs">
              <span className="block text-2xl font-black text-[#b38867]">50+</span>
              <span className="text-xs text-gray-500 font-medium">Modul Kursus Online</span>
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-xs rounded-2xl border border-gray-200/80 shadow-xs">
              <span className="block text-2xl font-black text-[#b38867]">16.000+</span>
              <span className="text-xs text-gray-500 font-medium">Siswa Terdaftar</span>
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-xs rounded-2xl border border-gray-200/80 shadow-xs">
              <span className="block text-2xl font-black text-[#b38867]">4.9 / 5</span>
              <span className="text-xs text-gray-500 font-medium">Rating Kepuasan</span>
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-xs rounded-2xl border border-gray-200/80 shadow-xs">
              <span className="block text-2xl font-black text-[#b38867]">24/7</span>
              <span className="text-xs text-gray-500 font-medium">Akses Mandiri Selamanya</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Category Filters & Courses */}
      <section className="max-w-6xl mx-auto px-6 pb-20 space-y-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-start md:justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#b38867] text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Menampilkan <strong>{filteredCourses.length}</strong> modul kursus E-Learning</span>
          {searchQuery && (
            <span>Hasil pencarian untuk: "<em>{searchQuery}</em>"</span>
          )}
        </div>

        {/* Grid of Courses */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 p-8">
            <BookOpen className="w-12 h-12 text-[#b38867] mx-auto opacity-50 mb-3" />
            <h3 className="text-base font-bold text-gray-800">Modul Tidak Ditemukan</h3>
            <p className="text-gray-500 text-xs mt-1 max-w-sm mx-auto">
              Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Cover */}
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5">
                      <Clock size={12} />
                      {course.duration}
                    </span>

                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-amber-500 text-white text-[11px] font-bold">
                      {course.level}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-semibold bg-[#b38867]/80 backdrop-blur-xs px-2 py-0.5 rounded">
                        {course.category}
                      </span>
                      <div className="flex items-center gap-1 font-bold text-amber-300">
                        <Star size={13} fill="currentColor" />
                        <span>{course.rating}</span>
                        <span className="text-white/80 font-normal">({course.studentsCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-[#b38867] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Instructor Info */}
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">
                          {course.instructor.name}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">
                          {course.instructor.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 border-t border-gray-100/80 flex items-center gap-2.5 mt-2">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="flex-1 py-2.5 px-3 text-xs font-semibold rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition text-center"
                  >
                    Lihat Silabus
                  </button>
                  <Link
                    to="/langganan"
                    className="py-2.5 px-4 text-xs font-semibold rounded-xl bg-[#b38867] hover:bg-[#a27355] text-white shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <PlayCircle size={14} />
                    Mulai Belajar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feature Highlights Section */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm space-y-8 mt-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Kenapa Memilih E-Learning Aeterna?</h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Dirancang untuk memaksimalkan efektivitas belajar mandiri dengan dukungan materi berkualitas industri.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100/80 space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-amber-100 text-[#b38867]">
                <Clock size={20} />
              </div>
              <h4 className="font-bold text-sm text-gray-800">Fleksibel 24/7</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tonton video kapan saja dan ulangi modul tersulit tanpa batasan waktu akses.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100/80 space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-blue-100 text-blue-600">
                <Layers size={20} />
              </div>
              <h4 className="font-bold text-sm text-gray-800">Studi Kasus Riil</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Setiap materi dilengkapi proyek latihan nyata yang bisa langsung dijadikan portofolio.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-emerald-100 text-emerald-600">
                <Award size={20} />
              </div>
              <h4 className="font-bold text-sm text-gray-800">Sertifikat Resmi</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Dapatkan sertifikat kelulusan digital yang dapat diverifikasi dan ditambahkan ke LinkedIn.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100/80 space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-purple-100 text-purple-600">
                <Users size={20} />
              </div>
              <h4 className="font-bold text-sm text-gray-800">Komunitas & Mentor</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tergabung dalam forum tanya jawab bersama mentor dan sesama mentee pembelajar.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-[#b38867] to-[#7B5E4A] rounded-3xl p-8 sm:p-12 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">
              Ingin Buka Akses ke Seluruh Modul Kursus?
            </h3>
            <p className="text-sm text-white/90 leading-relaxed">
              Berlangganan paket Aeterna Mentoring untuk mendapatkan akses tak terbatas ke semua video kursus, materi file, serta bimbingan langsung dari mentor.
            </p>
          </div>

          <Link
            to="/langganan"
            className="px-6 py-3.5 bg-white text-[#7B5E4A] font-bold text-sm rounded-xl hover:bg-amber-50 shadow-md transition whitespace-nowrap inline-flex items-center gap-2"
          >
            Lihat Paket Langganan
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Modal Silabus Modul Course */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4 bg-gray-50/70">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#b38867]/15 text-[#7B5E4A] uppercase">
                  {selectedCourse.category} • {selectedCourse.level}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                  {selectedCourse.title}
                </h3>
                <p className="text-xs text-gray-500">
                  Instruktur: <strong className="text-gray-700">{selectedCourse.instructor.name}</strong> ({selectedCourse.instructor.role})
                </p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-200/50 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-2">Tentang Modul Ini</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>

              {/* Kurikulum / Silabus Breakdown */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <BookOpen size={16} className="text-[#b38867]" />
                  Silabus & Rencana Pembelajaran ({selectedCourse.duration})
                </h4>

                <div className="space-y-2.5">
                  {selectedCourse.modules.map((mod, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-2xl p-4 bg-white shadow-xs space-y-2"
                    >
                      <h5 className="font-bold text-xs text-gray-800 flex items-center justify-between">
                        <span>{mod.title}</span>
                        <span className="text-[11px] font-normal text-gray-400">
                          {mod.lessons.length} Pelajaran
                        </span>
                      </h5>

                      <ul className="space-y-1.5 pt-1">
                        {mod.lessons.map((lesson, lIdx) => (
                          <li
                            key={lIdx}
                            className="flex items-center gap-2 text-xs text-gray-600"
                          >
                            <PlayCircle size={14} className="text-[#b38867] shrink-0" />
                            <span>{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fasilitas */}
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-2">Fasilitas yang Didapatkan:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  {selectedCourse.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-800"
              >
                Tutup
              </button>
              <Link
                to="/langganan"
                className="px-5 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5"
              >
                <PlayCircle size={15} />
                Mulai Belajar Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
