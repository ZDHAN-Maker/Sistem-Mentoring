import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Star, 
  Clock, 
  Calendar, 
  Users, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Sparkles,
  SlidersHorizontal,
  X,
  GraduationCap,
  Building2,
  ShieldCheck,
  FileDown,
  LayoutGrid,
  ListFilter,
  CheckCheck,
  Terminal,
  Compass,
  BadgeCheck,
  Download,
  Briefcase,
  PlayCircle,
  Eye,
  Check
} from 'lucide-react';

// ============================================================================
// DATA KATALOG RESMI PROGRAM MENTORING INTENSIF (EDISI 2026/2027)
// ============================================================================
const OFFICIAL_PROGRAM_CATALOG = [
  {
    id: 1,
    code: "PROG-UIUX-01",
    title: "UI/UX Design: Dari Riset Pengguna hingga Enterprise Design System",
    category: "UI/UX Design",
    level: "Beginner to Intermediate",
    skkniCode: "SKKNI Desain Digital Level 5",
    duration: "4 Minggu • 8 Sesi Mentoring 1-on-1",
    rating: 4.93,
    reviewsCount: 184,
    enrolledCount: 1420,
    accreditation: "Terstandarisasi Industri",
    targetAudience: "Career Switcher, Junior UI/UX Designer, Product Manager, Frontend Developer",
    mentor: {
      name: "Angela Putri",
      role: "Lead Product Designer at Tokopedia",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      company: "Tokopedia / GoTo Group"
    },
    coverImage: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 350.000",
    price: "Rp 199.000",
    description: "Pelatihan intensif 1-on-1 merancang produk digital berstandar global: riset pengguna mendalam, wireframing di Figma, penyusunan Design Tokens, usability testing, dan portofolio siap review HR.",
    learningOutcomes: [
      "Menguasai metodologi Double Diamond & Framework User Research praktis",
      "Membangun Wireframe, High-Fidelity UI, dan Design System di Figma",
      "Melakukan Usability Testing (UT) dan iterasi desain berbasis metrik pengguna",
      "Menyusun Case Study Portofolio terstandarisasi yang siap dipresentasikan ke HR"
    ],
    tools: ["Figma Enterprise", "Miro", "Notion", "Maze Testing", "Zeplin"],
    syllabus: [
      {
        week: "Minggu 01",
        title: "Fondasi UX Research & Problem Discovery",
        topics: [
          "Mendefinisikan Problem Statement & Empathy Mapping",
          "Teknik Wawancara Pengguna & Pembuatan User Persona",
          "Praktik: Menyusun User Journey Map & HMW Framework"
        ]
      },
      {
        week: "Minggu 02",
        title: "Information Architecture & Wireframing",
        topics: [
          "Card Sorting & Navigasi Arsitektur Informasi",
          "Low-Fidelity Wireframing & Layout Grid Structure",
          "Praktik: Merancang Alur Registrasi & Checkout Interaktif"
        ]
      },
      {
        week: "Minggu 03",
        title: "Modern UI, Auto-Layout & Design System",
        topics: [
          "Auto-Layout Dinamis, Component Properties & Variants",
          "Color Palette, Typography Scale & Semantic Tokens",
          "Praktik: Membangun Multi-Platform UI Kit Konsisten"
        ]
      },
      {
        week: "Minggu 04",
        title: "Usability Testing, Portofolio & Career Handoff",
        topics: [
          "Prototyping Lanjutan dengan Smart Animate",
          "Conducting Usability Testing & Analisis SUS Score",
          "Final Presentation: Review Portofolio 1-on-1 dengan Mentor"
        ]
      }
    ],
    features: [
      "8x Sesi Bimbingan Privat 1-on-1 (Google Meet)",
      "Review Portofolio & CV Khusus Bidang Desain Produk",
      "Sertifikat Kompetensi Resmi dengan QR Code Verifikasi",
      "Akses Komunitas UI/UX Eksklusif & Info Loker Mitra"
    ]
  },
  {
    id: 2,
    code: "PROG-FSW-02",
    title: "Full-Stack Web Engineering: Next.js, React, Laravel & RESTful API",
    category: "Web Development",
    level: "Intermediate",
    skkniCode: "SKKNI Rekayasa Perangkat Lunak Level 6",
    duration: "6 Minggu • 12 Sesi Mentoring 1-on-1",
    rating: 4.96,
    reviewsCount: 260,
    enrolledCount: 2180,
    accreditation: "Terstandarisasi Industri",
    targetAudience: "Frontend/Backend Dev, Mahasiswa IT Tingkat Akhir, Junior Software Engineer",
    mentor: {
      name: "Rudi Hartono",
      role: "Senior Fullstack Engineer at Gojek",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      company: "Gojek / GoTo Financial"
    },
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 450.000",
    price: "Rp 249.000",
    description: "Bangun aplikasi web skala korporat dari nol menggunakan React/Next.js modern, arsitektur Clean Code di Laravel 11, sistem otentikasi Sanctum, integrasi payment gateway, dan deployment cloud.",
    learningOutcomes: [
      "Membangun arsitektur SPA & SSR berkinerja tinggi dengan React & Next.js",
      "Merancang backend REST API berstandar Clean Architecture di Laravel",
      "Mengimplementasikan otentikasi aman berbasis Token Sanctum & RBAC",
      "Deploy aplikasi produksi ke cloud server dengan CI/CD Pipeline otomatis"
    ],
    tools: ["React.js", "Next.js", "Laravel 11", "Tailwind CSS", "MySQL", "Postman", "Git"],
    syllabus: [
      {
        week: "Minggu 01 - 02",
        title: "Arsitektur Frontend Modern: React & Next.js",
        topics: [
          "Setup Ekosistem Modern, TypeScript & Tailwind CSS",
          "State Management Efisien & Custom Hooks",
          "Routing Next.js App Router & Server Components"
        ]
      },
      {
        week: "Minggu 03 - 04",
        title: "Backend API Engineering dengan Laravel 11",
        topics: [
          "Database Modeling, Migrations, Seeders & Eloquent ORM",
          "Pemisahan Controller, Service Layer & Form Request",
          "Autentikasi Sanctum, Middleware Guards & Rate Limiting"
        ]
      },
      {
        week: "Minggu 05 - 06",
        title: "Integrasi API, Testing & Deployment Cloud",
        topics: [
          "Sinkronisasi State Frontend-Backend dengan Axios/TanStack",
          "Automated Testing Endpoint dengan Pest PHP",
          "Deployment VPS Linux, Nginx Reverse Proxy & SSL"
        ]
      }
    ],
    features: [
      "12x Sesi Live Coding & Bimbingan 1-on-1",
      "Code Review Baris demi Baris pada Repositori GitHub",
      "Sertifikat Kompetensi Fullstack Engineer Terverifikasi",
      "Proyek Nyata Siap Ditampilkan di CV & Portofolio"
    ]
  },
  {
    id: 3,
    code: "PROG-DATA-03",
    title: "Data Science & Practical Machine Learning: Analisis Skala Industri",
    category: "Data Science & AI",
    level: "Beginner to Intermediate",
    skkniCode: "SKKNI Sains Data Terapan Level 5",
    duration: "5 Minggu • 10 Sesi Mentoring 1-on-1",
    rating: 4.89,
    reviewsCount: 195,
    enrolledCount: 1340,
    accreditation: "Terstandarisasi Industri",
    targetAudience: "Data Enthusiast, Business Analyst, Statistician, Tech Professional",
    mentor: {
      name: "David Pratama",
      role: "Staff Data Scientist at Traveloka",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      company: "Traveloka Indonesia"
    },
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 390.000",
    price: "Rp 219.000",
    description: "Kuasai Python untuk Data Wrangling, visualisasi insight bisnis dengan Tableau/Seaborn, pemodelan Machine Learning (Supervised & Unsupervised), serta deployment model prediktif.",
    learningOutcomes: [
      "Menguasai manipulasi data tabular kompleks dengan Pandas & NumPy",
      "Menganalisis pola data bisnis melalui Exploratory Data Analysis (EDA)",
      "Membangun model prediksi Machine Learning (Regresi, Klasifikasi, Klasterisasi)",
      "Menyajikan dashboard visual interaktif untuk rekomendasi bisnis level eksekutif"
    ],
    tools: ["Python", "Pandas", "Scikit-Learn", "Tableau", "Jupyter", "SQL"],
    syllabus: [
      {
        week: "Minggu 01 - 02",
        title: "Fondasi Python, SQL & Data Wrangling",
        topics: [
          "Ekstraksi Data Multi-Format & Query SQL Tingkat Lanjut",
          "Data Cleaning: Penanganan Missing Values & Outlier",
          "Exploratory Data Analysis (EDA) dengan Seaborn"
        ]
      },
      {
        week: "Minggu 03 - 04",
        title: "Machine Learning Modeling & Evaluasi",
        topics: [
          "Feature Engineering & Normalisasi Data",
          "Supervised Learning: Regresi Linier, Logistic & Random Forest",
          "Unsupervised Learning: K-Means Clustering & PCA"
        ]
      },
      {
        week: "Minggu 05",
        title: "Business Dashboard & Capstone Presentation",
        topics: [
          "Visualisasi Interaktif Eksekutif dengan Tableau",
          "Deployment Model Prediktif Sederhana dengan Streamlit",
          "Final Capstone Review: Studi Kasus Churn Nasabah FinTech"
        ]
      }
    ],
    features: [
      "10x Sesi Mentoring Privat 1-on-1",
      "Dataset Riil Transaksi Industri (Anonymized)",
      "Sertifikat Kompetensi Sains Data Resmi",
      "Bimbingan Persiapan Teknis Interview Data"
    ]
  },
  {
    id: 4,
    code: "PROG-FE-04",
    title: "Advanced Frontend Engineering: React, Next.js & TypeScript",
    category: "Web Development",
    level: "Advanced",
    skkniCode: "SKKNI Arsitektur Antarmuka Web Level 6",
    duration: "4 Minggu • 8 Sesi Mentoring 1-on-1",
    rating: 4.94,
    reviewsCount: 118,
    enrolledCount: 960,
    accreditation: "Terstandarisasi Industri",
    targetAudience: "Frontend Developer, Mid Software Engineer, Web Specialist",
    mentor: {
      name: "Fajar Nugraha",
      role: "Frontend Architect at Shopee",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      company: "Shopee / Sea Group"
    },
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 380.000",
    price: "Rp 229.000",
    description: "Pendalaman arsitektur web modern skala enterprise: generic TypeScript, optimasi Core Web Vitals, server components, dynamic code splitting, dan automated UI testing.",
    learningOutcomes: [
      "Menulis kode modular dengan TypeScript Generic & Utility Types",
      "Mencapai skor Google Core Web Vitals (LCP, FID, CLS) di atas 95%",
      "Menyusun automated integration testing dengan Vitest & React Testing Library",
      "Mendesain arsitektur Micro-Frontend berskala jutaan pengguna harian"
    ],
    tools: ["React 19", "Next.js 15", "TypeScript", "Tailwind CSS", "Vitest", "Lighthouse"],
    syllabus: [
      {
        week: "Minggu 01",
        title: "Enterprise TypeScript & Advanced Design Patterns",
        topics: [
          "Type Narrowing, Discriminated Unions & Generics",
          "Custom Hooks Architecture & Compound Component Pattern",
          "State Management dengan Zustand & TanStack Query"
        ]
      },
      {
        week: "Minggu 02",
        title: "Next.js Server Components & Data Flow",
        topics: [
          "Pemisahan Server Components vs Client Boundaries",
          "Streaming SSR dengan Suspense & Parallel Routes",
          "Optimasi Gambar, Font & Bundle Size Analyzer"
        ]
      },
      {
        week: "Minggu 03",
        title: "Automated Testing & Code Quality Assurance",
        topics: [
          "Unit & Integration Testing dengan Vitest",
          "Testing Asinkron & Mock Service Worker (MSW)",
          "E2E Testing Sederhana dengan Playwright"
        ]
      },
      {
        week: "Minggu 04",
        title: "Performance Audit, CI/CD & Final Architecture Review",
        topics: [
          "Diagnostik Core Web Vitals & Memory Leak",
          "Automasi Linting, Formatting & GitHub Actions CI",
          "Review Portofolio Kode Siap Tech Interview Senior Dev"
        ]
      }
    ],
    features: [
      "8x Sesi Bimbingan Arsitektur Kode 1-on-1",
      "Code Review Kualitas Produksi Tingkat Senior",
      "Sertifikat Kompetensi Frontend Architect Resmi",
      "Boilerplate Next.js TypeScript Enterprise Ready"
    ]
  },
  {
    id: 5,
    code: "PROG-MOB-05",
    title: "Mobile App Development: Flutter & Clean Architecture",
    category: "Mobile Apps",
    level: "Intermediate",
    skkniCode: "SKKNI Pemrograman Aplikasi Bergerak Level 5",
    duration: "5 Minggu • 10 Sesi Mentoring 1-on-1",
    rating: 4.88,
    reviewsCount: 132,
    enrolledCount: 1100,
    accreditation: "Terstandarisasi Industri",
    targetAudience: "Mobile Developer, Flutter Enthusiast, Android/iOS Developer",
    mentor: {
      name: "Rian Setiawan",
      role: "Mobile Lead at Bukalapak",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      company: "Bukalapak Enterprise"
    },
    coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 370.000",
    price: "Rp 209.000",
    description: "Bangun aplikasi mobile native performa tinggi untuk Android & iOS dalam satu codebase menggunakan Flutter, arsitektur BLoC, integrasi REST API, penyimpanan lokal, dan publish Google Play.",
    learningOutcomes: [
      "Menerapkan Clean Architecture (Data, Domain, Presentation Layer) di Flutter",
      "Mengelola State Global aplikasi menggunakan BLoC & Cubit Pattern",
      "Mengimplementasikan offline-first caching dengan Hive dan SQLite",
      "Melakukan packaging APK & App Bundle untuk rilis ke Google Play Store"
    ],
    tools: ["Flutter", "Dart", "BLoC Pattern", "Dio", "Hive DB", "Firebase"],
    syllabus: [
      {
        week: "Minggu 01 - 02",
        title: "Fondasi Dart & Desain Antarmuka Responsif",
        topics: [
          "Dart OOP, Asynchronous Futures & Streams",
          "Custom Widgets, Tata Letak Responsif & Animasi Halus",
          "Navigasi Rute GoRouter & Deep Linking"
        ]
      },
      {
        week: "Minggu 03 - 04",
        title: "Clean Architecture & State Management BLoC",
        topics: [
          "Prinsip Separation of Concerns pada Mobile Apps",
          "Integrasi REST API dengan Dio & Error Interceptor",
          "Offline Storage Caching & Sinkronisasi Data"
        ]
      },
      {
        week: "Minggu 05",
        title: "Firebase Services, Keamanan & Rilis Store",
        topics: [
          "Firebase Authentication & Push Notifications",
          "Keamanan Aplikasi & Obfuscation Kode Produksi",
          "Final Capstone Review: Rilis Aplikasi ke Store"
        ]
      }
    ],
    features: [
      "10x Sesi Bimbingan Privat 1-on-1",
      "Panduan Step-by-Step Publish ke Play Store",
      "Sertifikat Kompetensi Mobile Developer Resmi",
      "Source Code Aplikasi E-Commerce / Delivery Lengkap"
    ]
  },
  {
    id: 6,
    code: "PROG-BE-06",
    title: "Backend Architecture & Microservices: Go, Docker & Kafka",
    category: "Backend Engineering",
    level: "Advanced",
    skkniCode: "SKKNI Arsitektur Sistem Komputasi Level 6",
    duration: "6 Minggu • 12 Sesi Mentoring 1-on-1",
    rating: 4.95,
    reviewsCount: 104,
    enrolledCount: 890,
    accreditation: "Terstandarisasi Industri",
    targetAudience: "Backend Engineer, Systems Engineer, DevOps, Software Architect",
    mentor: {
      name: "Haryanto Santoso",
      role: "Principal Backend Engineer at DANA",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      company: "DANA Indonesia"
    },
    coverImage: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 499.000",
    price: "Rp 279.000",
    description: "Kuasai ekosistem backend performa tinggi: konkurensi di Go (Golang), gRPC, event-driven architecture dengan Apache Kafka, database sharding & caching Redis, serta containerisasi Docker.",
    learningOutcomes: [
      "Memanfaatkan Goroutines & Channels untuk pemrosesan concurrent ribuan RPS",
      "Merancang komunikasi antar service menggunakan gRPC & Protocol Buffers",
      "Mengimplementasikan Event-Driven Architecture dengan Message Broker Kafka",
      "Menyusun database indexing, pooling, dan distributed transaction pattern"
    ],
    tools: ["Go (Golang)", "Docker", "Apache Kafka", "gRPC", "PostgreSQL", "Redis"],
    syllabus: [
      {
        week: "Minggu 01 - 02",
        title: "Konkurensi Go & Struktur Layanan Berkinerja Tinggi",
        topics: [
          "Goroutines, Channels, Mutex & Race Condition Prevention",
          "Context Package untuk Timeout & Request Cancellation",
          "Standard Project Layout Golang untuk Microservice"
        ]
      },
      {
        week: "Minggu 03 - 04",
        title: "gRPC Communication & Database Optimization",
        topics: [
          "Definisi Schema Protobuf & Code Generation",
          "Database Indexing Strategy, Query Plan & Pooling",
          "Distributed Caching dengan Redis & Eviction Policy"
        ]
      },
      {
        week: "Minggu 05 - 06",
        title: "Event-Driven Kafka & Distributed Systems",
        topics: [
          "Producer, Consumer Group & Partitioning di Kafka",
          "Idempotency, Dead Letter Queue & Retry Mechanism",
          "Tracing Terdistribusi dengan Jaeger & Final Review"
        ]
      }
    ],
    features: [
      "12x Sesi Mentoring Arsitektur Skala Besar 1-on-1",
      "Simulasi Kasus Transaksi Finansial Ribuan RPS",
      "Sertifikat Kompetensi Backend Architect Resmi",
      "Simulasi Wawancara Arsitektur Sistem (System Design)"
    ]
  }
];

// ============================================================================
// DATA KATEGORI BIDANG PROGRAM
// ============================================================================
const TRACK_CATEGORIES = [
  "Semua Bidang",
  "UI/UX Design",
  "Web Development",
  "Data Science & AI",
  "Mobile Apps",
  "Backend Engineering"
];

// ============================================================================
// LOGO & PERUSAHAAN MITRA TERKEMUKA (TRUSTED BY)
// ============================================================================
const TRUSTED_COMPANIES = [
  { name: "Telkom Indonesia", industry: "Telekomunikasi & Digital BUMN" },
  { name: "Bank Central Asia (BCA)", industry: "Perbankan Swasta Terbesar" },
  { name: "Bank Mandiri", industry: "Jasa Keuangan & BUMN" },
  { name: "GoTo (Gojek & Tokopedia)", industry: "Ekosistem Teknologi Unicorn" },
  { name: "Astra International", industry: "Konglomerasi Industri Otomotif" },
  { name: "Pertamina", industry: "Energi & Sumber Daya Nasional" },
  { name: "Traveloka", industry: "Platform Perjalanan & Lifestyle" },
  { name: "Shopee Indonesia", industry: "E-Commerce & Digital Marketplace" },
  { name: "DANA Indonesia", industry: "Fintech & Dompet Digital" },
  { name: "Unilever Indonesia", industry: "Fast Moving Consumer Goods" },
  { name: "Bukalapak", industry: "Solusi Retail & E-Commerce" },
  { name: "Blibli / GDP Venture", industry: "Omnichannel Commerce Ecosystem" }
];

export default function Program() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Bidang");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [sortBy, setSortBy] = useState("popular"); // 'popular' | 'rating' | 'price'
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  // Filter & Urutkan Program
  const filteredPrograms = useMemo(() => {
    return OFFICIAL_PROGRAM_CATALOG.filter((p) => {
      const matchSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.targetAudience.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCat = selectedCategory === "Semua Bidang" || p.category === selectedCategory;
      const matchLevel = selectedLevel === "all" || p.level.toLowerCase().includes(selectedLevel.toLowerCase());

      return matchSearch && matchCat && matchLevel;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price") {
        const pA = parseInt(a.price.replace(/[^0-9]/g, "")) || 0;
        const pB = parseInt(b.price.replace(/[^0-9]/g, "")) || 0;
        return pA - pB;
      }
      return b.reviewsCount - a.reviewsCount; // popular
    });
  }, [searchTerm, selectedCategory, selectedLevel, sortBy]);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 antialiased selection:bg-[#b38867]/20 selection:text-[#7B5E4A]">
      
      {/* ============================================================== */}
      {/* 1. STRIP AKREDITASI & META DOKUMEN RESMI (TOP ACCREDITATION)   */}
      {/* ============================================================== */}
      <div className="bg-slate-900 text-slate-300 text-[11px] border-b border-slate-800 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider text-[10px] border border-amber-500/30">
              Katalog Resmi
            </span>
            <span className="text-slate-400">
              Katalog Program Mentoring & Akselerasi Karier Talenta Digital • <strong>Edisi 2026/2027</strong>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-slate-400 hidden sm:inline flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-400 inline" /> Standar Kompetensi SKKNI & Review Portofolio Industri
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button 
              onClick={() => setDownloadModalOpen(true)}
              className="text-amber-300 hover:text-white font-semibold flex items-center gap-1 transition"
            >
              <FileDown size={13} />
              <span>Unduh Brosur Program (PDF)</span>
            </button>
            <span className="text-slate-700">|</span>
            <button 
              onClick={() => setConsultModalOpen(true)}
              className="text-slate-300 hover:text-white font-semibold flex items-center gap-1 transition"
            >
              <Building2 size={13} />
              <span>Program Korporasi (B2B)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. HERO SECTION DENGAN UKURAN LAYAR PENUH & FONT ENTERPRISE    */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#b38867]/12 via-[#b38867]/5 to-transparent pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-gray-200/70">
        {/* Dekorasi Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#b38867_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-5">
            {/* Badge Enterprise Category */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#b38867]/30 text-[#7B5E4A] text-xs font-bold tracking-wide shadow-2xs">
              <Sparkles size={14} className="text-[#b38867]" />
              <span>Official 1-on-1 Mentorship & Career Acceleration Catalog</span>
            </div>

            {/* Headline Utama: Font Elegan, Tajam, Proporsional */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.18] sm:leading-[1.16]">
              Akselerasi Karier Digital Bersama <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b38867] to-[#7B5E4A]">
                Mentor Praktisi Terkemuka
              </span>
            </h1>

            {/* Sub-headline Deskriptif Resmi */}
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed font-medium">
              Bimbingan intensif 1-on-1 dengan silabus berbasis studi kasus industri nyata. Dapatkan review kode baris demi baris, perbaikan portofolio, dan sertifikat kompetensi resmi terverifikasi.
            </p>

            {/* Search Input Bar Terintegrasi */}
            <div className="max-w-2xl mx-auto pt-4">
              <div className="relative flex items-center bg-white rounded-2xl shadow-md border border-gray-200 p-2 transition focus-within:border-[#b38867] focus-within:ring-2 focus-within:ring-[#b38867]/20">
                <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari program, topik keahlian (misal: UI/UX, Fullstack, Machine Learning, Go)..."
                  className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-gray-400 bg-transparent outline-none font-medium"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="p-1.5 text-gray-400 hover:text-gray-600 mr-2 transition"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  type="button"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-bold rounded-xl transition shadow-2xs shrink-0"
                >
                  <Search size={14} />
                  <span>Cari Program</span>
                </button>
              </div>

              {/* Tag Populer */}
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500 flex-wrap">
                <span className="font-semibold text-slate-600">Pilihan Utama:</span>
                {["UI/UX Design System", "Fullstack React & Laravel", "Data Science AI", "Backend Go Microservices", "Flutter Mobile"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="px-2.5 py-0.5 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-[#b38867] border border-gray-200 text-[11px] font-semibold transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Metrics Bar Enterprise */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto pt-8">
              <div className="p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-gray-200 shadow-2xs text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#b38867]">100+</span>
                  <Users size={20} className="text-[#b38867]/60" />
                </div>
                <p className="text-xs font-bold text-slate-800">Senior Mentor Praktisi</p>
                <p className="text-[11px] text-slate-500">Dari Tech Unicorn & Korporasi</p>
              </div>

              <div className="p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-gray-200 shadow-2xs text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#b38867]">4.94 / 5</span>
                  <Star size={20} className="text-[#b38867]/60" />
                </div>
                <p className="text-xs font-bold text-slate-800">Rata-rata Rating Mentee</p>
                <p className="text-[11px] text-slate-500">Dari ribuan sesi bimbingan 1-on-1</p>
              </div>

              <div className="p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-gray-200 shadow-2xs text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#b38867]">95.8%</span>
                  <Award size={20} className="text-[#b38867]/60" />
                </div>
                <p className="text-xs font-bold text-slate-800">Kelulusan & Portofolio</p>
                <p className="text-[11px] text-slate-500">Peserta menyelesaikan final capstone</p>
              </div>

              <div className="p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-gray-200 shadow-2xs text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#b38867]">150+</span>
                  <Building2 size={20} className="text-[#b38867]/60" />
                </div>
                <p className="text-xs font-bold text-slate-800">Perusahaan Mitra Perekrut</p>
                <p className="text-[11px] text-slate-500">Koneksi jaringan karier industri</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SECTION "TRUSTED BY" PERUSAHAAN TERKEMUKA (USER REQUEST)     */}
      {/* ============================================================== */}
      <section className="bg-white border-b border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#b38867] bg-[#b38867]/10 px-3 py-1 rounded-full border border-[#b38867]/20">
              Rekam Jejak & Kredibilitas
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Dipercaya oleh Lebih dari 150+ Perusahaan Terkemuka di Indonesia
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Mentor kami berasal dari praktisi aktif di perusahaan teknologi unicorn, perbankan, dan BUMN terdepan.
            </p>
          </div>

          {/* Grid Logo Perusahaan Resmi */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 pt-4">
            {TRUSTED_COMPANIES.map((company, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-gray-50/70 hover:bg-amber-50/50 border border-gray-200/80 hover:border-amber-300 rounded-2xl transition duration-200 flex flex-col justify-center items-center text-center group cursor-default"
              >
                <div className="w-8 h-8 rounded-xl bg-white text-slate-700 group-hover:text-[#b38867] flex items-center justify-center font-black text-xs border border-gray-200 shadow-2xs mb-2 transition">
                  {company.name.charAt(0)}
                </div>
                <h4 className="font-bold text-xs text-slate-800 group-hover:text-[#b38867] transition line-clamp-1">
                  {company.name}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {company.industry}
                </p>
              </div>
            ))}
          </div>

          {/* Banner Standar Kualitas Bimbingan */}
          <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                <ShieldCheck size={24} />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">Garansi Bimbingan 1-on-1 Berkualitas Tinggi</h4>
                <p className="text-xs text-slate-400">Jadwal fleksibel yang disepakati langsung antara Anda dan mentor via kalender interaktif.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button 
                onClick={() => setConsultModalOpen(true)}
                className="px-4 py-2 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-bold rounded-xl transition shadow-2xs whitespace-nowrap"
              >
                Konsultasikan Pilihan Program
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. KATALOG UTAMA: FILTER TRACK, LEVEL, VIEW MODE & SEARCH       */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        
        {/* Header Bagian Katalog */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#b38867]">
                Katalog Program Resmi
              </span>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs text-slate-500 font-medium">Kurikulum Praktisi Industri 2026/2027</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Daftar Program Mentoring & Kurikulum Spesialisasi
            </h2>
          </div>

          {/* Quick Actions: View Mode Toggle & PDF Download */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <div className="inline-flex p-1 bg-gray-200/80 rounded-xl text-xs font-bold">
              <button
                onClick={() => setViewMode("grid")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Tampilan Kartu Katalog"
              >
                <LayoutGrid size={14} />
                <span>Kartu</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  viewMode === "table"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Tampilan Matriks Tabel Resmi"
              >
                <ListFilter size={14} />
                <span>Tabel Resmi</span>
              </button>
            </div>

            <button
              onClick={() => setDownloadModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 shadow-2xs transition"
            >
              <FileDown size={14} className="text-[#b38867]" />
              <span className="hidden sm:inline">Unduh Brosur PDF</span>
            </button>
          </div>
        </div>

        {/* Filter Navigation: Track Pills */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {TRACK_CATEGORIES.map((track) => (
              <button
                key={track}
                onClick={() => setSelectedCategory(track)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategory === track
                    ? "bg-[#b38867] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-gray-200 hover:bg-gray-50 hover:text-slate-900"
                }`}
              >
                {track}
              </button>
            ))}
          </div>

          {/* Filter Sub-Bar: Level, Sorting, & Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <SlidersHorizontal size={13} className="text-[#b38867]" /> Tingkat:
              </span>
              {["all", "beginner", "intermediate", "advanced"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg uppercase tracking-wider text-[10px] font-bold transition ${
                    selectedLevel === lvl
                      ? "bg-slate-900 text-white"
                      : "bg-white border border-gray-200 text-slate-600 hover:bg-gray-100"
                  }`}
                >
                  {lvl === "all" ? "Semua Level" : lvl}
                </button>
              ))}

              <span className="text-gray-300 hidden md:inline">|</span>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium outline-none focus:border-[#b38867]"
                >
                  <option value="popular">Paling Populer</option>
                  <option value="rating">Rating Tertinggi</option>
                  <option value="price">Biaya Terendah</option>
                </select>
              </div>
            </div>

            <div>
              Menampilkan <strong>{filteredPrograms.length}</strong> program bimbingan resmi
              {searchTerm && (
                <span> untuk pencarian "<em>{searchTerm}</em>"</span>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAMPILAN 1: GRID MODE (KARTU PROGRAM RESMI)                    */}
        {/* ============================================================== */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPrograms.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Cover Banner */}
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

                    {/* Top Badges: Kode Dokumen & Level */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-300 text-[11px] font-mono font-bold tracking-wider border border-white/10">
                        {item.code}
                      </span>

                      <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-bold uppercase tracking-wider">
                        {item.level}
                      </span>
                    </div>

                    {/* Bottom Metadata di Cover */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-bold text-[11px] bg-[#b38867]/90 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1 font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                        <Star size={12} fill="currentColor" />
                        <span>{item.rating}</span>
                        <span className="text-white/70 font-normal text-[10px]">({item.reviewsCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content Program */}
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1">
                        <Clock size={12} className="text-[#b38867]" />
                        <span>{item.duration}</span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-snug group-hover:text-[#b38867] transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-2 font-medium">
                        {item.description}
                      </p>
                    </div>

                    {/* Target Peserta */}
                    <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-100 text-xs space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Peserta:</p>
                      <p className="text-[11px] font-semibold text-slate-700 line-clamp-1">{item.targetAudience}</p>
                    </div>

                    {/* Mentor Profile */}
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <img
                        src={item.mentor.avatar}
                        alt={item.mentor.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.mentor.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{item.mentor.role}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions & Pricing */}
                <div className="p-6 pt-0 border-t border-gray-100/80 mt-4">
                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 line-through block">
                        {item.originalPrice}
                      </span>
                      <span className="text-lg font-black text-[#7B5E4A]">
                        {item.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedProgram(item)}
                        className="py-2 px-3 text-xs font-bold rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 border border-gray-200 transition"
                      >
                        Silabus
                      </button>
                      <Link
                        to="/register"
                        className="py-2 px-4 text-xs font-bold rounded-xl bg-[#b38867] hover:bg-[#a27355] text-white shadow-2xs transition inline-flex items-center gap-1"
                      >
                        <span>Daftar</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAMPILAN 2: TABLE MODE (MATRIKS DOKUMEN RESMI PERUSAHAAN)      */}
        {/* ============================================================== */}
        {viewMode === "table" && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-900 text-white uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-4 px-4">Kode Program</th>
                    <th className="py-4 px-4 min-w-[280px]">Nama Program & Spesialisasi</th>
                    <th className="py-4 px-4">Bidang</th>
                    <th className="py-4 px-4">Tingkat</th>
                    <th className="py-4 px-4">Durasi Sesi</th>
                    <th className="py-4 px-4 min-w-[180px]">Mentor Pembimbing</th>
                    <th className="py-4 px-4">Investasi</th>
                    <th className="py-4 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPrograms.map((p) => (
                    <tr key={p.id} className="hover:bg-amber-50/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#b38867]">
                        {p.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 text-xs">{p.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{p.targetAudience}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-slate-700 font-semibold text-[11px]">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold uppercase text-[10px] text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                          {p.level}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {p.duration}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{p.mentor.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{p.mentor.role}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#7B5E4A]">{p.price}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedProgram(p)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-slate-800 rounded-lg text-xs font-semibold transition"
                          >
                            Silabus
                          </button>
                          <Link
                            to="/register"
                            className="px-3 py-1.5 bg-[#b38867] hover:bg-[#a27355] text-white rounded-lg text-xs font-bold transition shadow-2xs"
                          >
                            Daftar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* State Jika Hasil Kosong */}
        {filteredPrograms.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 p-8">
            <BookOpen className="w-14 h-14 text-[#b38867] mx-auto opacity-50 mb-3" />
            <h3 className="text-lg font-bold text-slate-900">Program Tidak Ditemukan</h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
              Tidak ada program mentoring yang cocok dengan filter pencarian Anda. Silakan reset filter atau coba kata kunci lain.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Semua Bidang");
                setSelectedLevel("all");
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-white bg-[#b38867] rounded-xl hover:bg-[#a27355] transition shadow-2xs"
            >
              Reset Filter Pencarian
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* 5. SECTION SOLUSI PELATIHAN PERUSAHAAN (B2B CORPORATE)        */}
        {/* ============================================================== */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-8 mt-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Layanan Korporasi & In-House Mentorship
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Tingkatkan Kapabilitas Tim Internal Melalui Custom Corporate Mentorship
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Program pendampingan privat untuk tim engineering, product, dan data perusahaan Anda. Kurikulum disesuaikan dengan arsitektur teknologi internal, sprint review, dan evaluasi performa kerja.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => setConsultModalOpen(true)}
                className="px-6 py-3.5 bg-[#b38867] hover:bg-[#a27355] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition inline-flex items-center justify-center gap-2"
              >
                <Building2 size={16} />
                <span>Konsultasi Kebutuhan Tim</span>
              </button>
              <button
                onClick={() => setDownloadModalOpen(true)}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition inline-flex items-center justify-center gap-2"
              >
                <FileDown size={16} />
                <span>Unduh Proposal B2B</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-700/60">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="p-2 w-fit rounded-lg bg-amber-400/20 text-amber-300">
                <Compass size={18} />
              </div>
              <h4 className="font-bold text-xs text-white">Studi Kasus Internal</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">Materi bimbingan disesuaikan dengan tantangan nyata codebase perusahaan Anda.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="p-2 w-fit rounded-lg bg-emerald-400/20 text-emerald-300">
                <Users size={18} />
              </div>
              <h4 className="font-bold text-xs text-white">Dedicated Tech Lead</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">Didampingi langsung oleh Principal Engineer berpengalaman dari tech unicorn.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="p-2 w-fit rounded-lg bg-blue-400/20 text-blue-300">
                <BadgeCheck size={18} />
              </div>
              <h4 className="font-bold text-xs text-white">Skill Assessment Report</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">Laporan diagnostik kemampuan teknis karyawan sebelum dan sesudah program.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="p-2 w-fit rounded-lg bg-purple-400/20 text-purple-300">
                <Award size={18} />
              </div>
              <h4 className="font-bold text-xs text-white">Sertifikasi Terverifikasi</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">Sertifikat resmi berstandar industri dengan nomor seri yang dapat diverifikasi.</p>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 6. FAQ RESMI SEPUTAR PROGRAM MENTORING                        */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-2xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Pertanyaan Umum Seputar Program Mentoring
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Informasi lengkap terkait mekanisme bimbingan, pemilihan mentor, dan sertifikasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto text-xs">
            <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
              <h4 className="font-bold text-slate-900">Bagaimana mekanisme sesi bimbingan 1-on-1 dilakukan?</h4>
              <p className="text-slate-600 leading-relaxed">
                Sesi dilakukan secara online melalui Google Meet dengan jadwal fleksibel yang disepakati bersama mentor melalui fitur Kalender Terintegrasi di dashboard.
              </p>
            </div>

            <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
              <h4 className="font-bold text-slate-900">Apakah saya bisa memilih mentor sendiri?</h4>
              <p className="text-slate-600 leading-relaxed">
                Ya, Anda dapat meninjau profil lengkap, rekam jejak industri, dan spesialisasi mentor sebelum memulai proses pairing bimbingan.
              </p>
            </div>

            <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
              <h4 className="font-bold text-slate-900">Bagaimana bentuk portofolio yang akan dihasilkan?</h4>
              <p className="text-slate-600 leading-relaxed">
                Setiap peserta akan menyelesaikan Final Capstone Project berupa studi kasus riil yang siap diunggah ke GitHub atau disajikan dalam bentuk Case Study profesional.
              </p>
            </div>

            <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
              <h4 className="font-bold text-slate-900">Apakah ada sertifikat kelulusan resmi?</h4>
              <p className="text-slate-600 leading-relaxed">
                Ya, setiap mentee yang menyelesaikan seluruh kurikulum dan tugas review akan menerima Sertifikat Kompetensi Digital yang terverifikasi secara publik.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* ============================================================== */}
      {/* 7. MODAL DETAIL SILABUS & DOKUMEN KURIKULUM RESMI             */}
      {/* ============================================================== */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 bg-slate-900 text-white flex items-start justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-400 text-slate-900 uppercase">
                    {selectedProgram.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-slate-300 uppercase">
                    {selectedProgram.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-slate-300 uppercase">
                    {selectedProgram.level}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {selectedProgram.title}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Mentor Utama: <strong>{selectedProgram.mentor.name}</strong></span>
                  <span>•</span>
                  <span>{selectedProgram.mentor.role}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedProgram(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm">
              {/* Ringkasan Eksekutif */}
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Briefcase size={15} className="text-[#b38867]" />
                  <span>Deskripsi & Tujuan Bimbingan</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {selectedProgram.description}
                </p>
              </div>

              {/* Capaian Pembelajaran */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
                <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                  <CheckCheck size={16} className="text-[#b38867]" />
                  <span>Capaian Kompetensi (Learning Outcomes):</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-amber-950 font-medium">
                  {selectedProgram.learningOutcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b38867] mt-1.5 shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Silabus Detail Mingguan */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen size={15} className="text-[#b38867]" />
                    <span>Silabus & Agenda Bimbingan ({selectedProgram.duration})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {selectedProgram.syllabus.length} Modul Silabus
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedProgram.syllabus.map((mod, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-2xl p-4 bg-white shadow-2xs space-y-2.5 hover:border-gray-300 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-slate-800 text-[10px] font-bold font-mono">
                            {mod.week}
                          </span>
                          <h5 className="font-bold text-xs text-slate-900">{mod.title}</h5>
                        </div>
                      </div>

                      <ul className="space-y-1.5 pl-2 pt-1 border-t border-gray-100">
                        {mod.topics.map((topic, tIdx) => (
                          <li
                            key={tIdx}
                            className="flex items-center gap-2 text-xs text-slate-600 font-medium"
                          >
                            <PlayCircle size={13} className="text-[#b38867] shrink-0" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools & Stack Teknologi */}
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Terminal size={14} className="text-[#b38867]" />
                  <span>Tools & Framework Industri yang Digunakan</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProgram.tools.map((tool, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1 rounded-xl bg-gray-100 text-slate-700 text-xs font-bold border border-gray-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fasilitas & Sertifikat */}
              <div className="pt-2">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award size={15} className="text-emerald-600" />
                  <span>Fasilitas & Standar Sertifikasi</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {selectedProgram.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                      <span className="font-medium text-slate-700">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 line-through block">{selectedProgram.originalPrice}</span>
                <span className="text-2xl font-black text-[#7B5E4A]">{selectedProgram.price}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    alert(`Mengunduh Silabus Resmi: ${selectedProgram.code} - ${selectedProgram.title} (.PDF)`);
                  }}
                  className="px-4 py-2.5 bg-white border border-gray-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition flex items-center gap-1.5"
                >
                  <FileDown size={14} />
                  <span>Unduh Silabus PDF</span>
                </button>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-bold rounded-xl shadow-2xs transition inline-flex items-center gap-1.5"
                >
                  <span>Daftar Program Sekarang</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. MODAL UNDUH BROSUR PROGRAM (PDF DOWNLOAD CONFIRMATION)      */}
      {/* ============================================================== */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#b38867] flex items-center justify-center mx-auto border border-amber-200">
              <FileDown size={24} />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">Unduh Brosur Katalog Program</h3>
              <p className="text-xs text-slate-500 font-medium">
                Dapatkan rincian seluruh silabus bimbingan, jadwal pelaksanaan, dan skema biaya program Aeterna 2026/2027 dalam format PDF.
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Nama Dokumen:</span>
                <strong className="text-slate-800">Brosur-Program-Mentoring-Aeterna-2026.pdf</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ukuran File:</span>
                <strong className="text-slate-800">5.2 MB</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Status Akreditasi:</span>
                <span className="font-bold text-emerald-600">Terverifikasi Standar Industri</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="flex-1 py-2.5 text-xs font-bold text-slate-600 hover:bg-gray-100 rounded-xl transition"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert("Brosur Resmi Program Mentoring Aeterna 2026/2027 berhasil diunduh.");
                  setDownloadModalOpen(false);
                }}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-[#b38867] hover:bg-[#a27355] rounded-xl shadow-2xs transition flex items-center justify-center gap-1.5"
              >
                <Download size={14} />
                <span>Unduh Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 9. MODAL KONSULTASI B2B / LAYANAN PELATIHAN PERUSAHAAN          */}
      {/* ============================================================== */}
      {consultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-900 text-amber-400 rounded-xl">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Konsultasi Program Bimbingan Korporat (B2B)</h3>
                  <p className="text-[11px] text-slate-500">Tim Academic & Enterprise Aeterna akan menghubungi Anda dalam 1x24 jam kerja.</p>
                </div>
              </div>
              <button onClick={() => setConsultModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Terima kasih. Permintaan konsultasi program korporat Anda telah diterima. Tim Academic Enterprise kami akan segera menghubungi Anda.");
                setConsultModalOpen(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Nama Lengkap Perwakilan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Dimas Anggara"
                  className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-1 focus:ring-[#b38867] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Nama Perusahaan / Organisasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="PT Sinergi Digital"
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-1 focus:ring-[#b38867] font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Jabatan / Posisi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="HR Lead / Engineering Manager"
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-1 focus:ring-[#b38867] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Email Korporat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="dimas@sinergi.com"
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-1 focus:ring-[#b38867] font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Nomor WhatsApp / Telp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="081298765432"
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-1 focus:ring-[#b38867] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Kebutuhan Spesifikasi Program & Estimasi Peserta
                </label>
                <textarea
                  rows={2}
                  placeholder="Misal: Mentoring 1-on-1 Fullstack Web & Backend Go untuk 10 orang tim IT internal..."
                  className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-1 focus:ring-[#b38867] font-medium resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setConsultModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-bold rounded-xl transition shadow-2xs"
                >
                  Kirim Permintaan Konsultasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
