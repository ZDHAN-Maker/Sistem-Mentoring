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
  Check,
  Video,
  UserCheck,
  CalendarCheck,
  MessageSquare,
  Flame,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

// ============================================================================
// DATA KATALOG PROGRAM MENTORING INTENSIF 1-ON-1
// ============================================================================
const MENTORSHIP_PROGRAMS = [
  {
    id: 1,
    code: "MENTOR-UIUX-01",
    title: "UI/UX Design Mastery: Bimbingan Riset Pengguna & Enterprise Design System",
    category: "UI/UX Design",
    level: "Beginner to Intermediate",
    skkniCode: "SKKNI Desain Digital Level 5",
    sessionsInfo: "8 Sesi Privat 1-on-1 (Google Meet)",
    durationWeeks: "4 Minggu Intensif",
    remainingSlots: 2, // Indikator kuota slot mentee
    rating: 4.95,
    reviewsCount: 184,
    enrolledCount: 1420,
    targetAudience: "Career Switcher, Junior UI/UX Designer, Product Manager",
    mentor: {
      name: "Angela Putri",
      role: "Lead Product Designer at Tokopedia",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      company: "Tokopedia / GoTo Group",
      experience: "7+ Tahun Pengalaman Industri",
      bio: "Telah membimbing lebih dari 150+ mentee tembus menjadi UI/UX Designer di berbagai startup unicorn dan agensi digital terkemuka."
    },
    coverImage: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 350.000",
    price: "Rp 199.000",
    description: "Dampingan personal langkah demi langkah: Anda akan dibimbing langsung menyusun riset pengguna, menyusun design tokens, merancang UI modern di Figma, hingga bedah portofolio case study privat agar siap dipresentasikan ke HR.",
    mentoringHighlights: [
      "Bimbingan tatap muka privat via Google Meet dengan jadwal fleksibel",
      "Review portofolio & CV baris demi baris sesuai standar rekrutmen industri",
      "Penyusunan 1 Capstone Project riil untuk showcase di Behance & LinkedIn",
      "Simulasi technical interview & tips negosiasi penawaran kerja"
    ],
    tools: ["Figma Enterprise", "Miro", "Notion", "Maze Testing", "Zeplin"],
    syllabus: [
      {
        sessionNum: "Sesi 01 - 02",
        title: "Empathy Mapping, Problem Discovery & Research Validation",
        focus: "Bahas studi kasus nyata produk Anda, susun User Persona, dan identifikasi pain point pengguna secara terarah."
      },
      {
        sessionNum: "Sesi 03 - 04",
        title: "Information Architecture & Wireframing Mentoring",
        focus: "Review wireframe low-fidelity bersama mentor, evaluasi hierarki informasi, dan uji alur navigasi aplikasi."
      },
      {
        sessionNum: "Sesi 05 - 06",
        title: "High-Fidelity UI, Auto-Layout & Design Tokens Figma",
        focus: "Praktik langsung Auto-Layout tingkat lanjut, Color Variables, Typography scale, dan implementasi UI konsisten."
      },
      {
        sessionNum: "Sesi 07 - 08",
        title: "Usability Testing, Final Portfolio Review & Mock Interview",
        focus: "Bedah tuntas presentasi Case Study portofolio Anda dan simulasi interview kerja langsung dengan mentor."
      }
    ],
    features: [
      "8x Sesi Live 1-on-1 via Google Meet (60 Menit/Sesi)",
      "Catatan Notulensi & Rekaman Sesi Tersimpan di Dashboard",
      "Review Portofolio Pribadi Tanpa Batas Selama Program",
      "Sertifikat Kelulusan Resmi Terverifikasi dengan QR Code"
    ]
  },
  {
    id: 2,
    code: "MENTOR-FSW-02",
    title: "Full-Stack Web Engineering: Next.js, React, Laravel & Clean Architecture",
    category: "Web Development",
    level: "Intermediate",
    skkniCode: "SKKNI Rekayasa Perangkat Lunak Level 6",
    sessionsInfo: "12 Sesi Privat 1-on-1 (Google Meet)",
    durationWeeks: "6 Minggu Intensif",
    remainingSlots: 3,
    rating: 4.98,
    reviewsCount: 260,
    enrolledCount: 2180,
    targetAudience: "Frontend/Backend Dev, Mahasiswa IT Tingkat Akhir, Junior Software Engineer",
    mentor: {
      name: "Rudi Hartono",
      role: "Senior Fullstack Engineer at Gojek",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      company: "Gojek / GoTo Financial",
      experience: "8+ Tahun di Ekosistem Tech Unicorn",
      bio: "Berpengalaman menangani sistem skala jutaan pengguna di Gojek. Membantu mentee memahami Clean Code, arsitektur microservices, dan persiapan coding test."
    },
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 450.000",
    price: "Rp 249.000",
    description: "Bangun aplikasi web skala produksi dari nol didampingi Senior Engineer: Next.js App Router, Clean Architecture di Laravel 11, pemisahan Service Layer, sistem otentikasi Sanctum, hingga deployment ke cloud VPS.",
    mentoringHighlights: [
      "Live Coding & Pair Programming langsung bersama Senior Fullstack Engineer",
      "Code Review Pull Request baris demi baris di GitHub pribadi Anda",
      "Implementasi arsitektur Clean Code yang lolos standar audit teknis korporat",
      "Bimbingan deploy produksi ke VPS Linux dengan Nginx Reverse Proxy & SSL"
    ],
    tools: ["React 19", "Next.js", "Laravel 11", "Tailwind CSS", "PostgreSQL", "Git GitHub"],
    syllabus: [
      {
        sessionNum: "Sesi 01 - 04",
        title: "Arsitektur Frontend Modern Next.js & Server Actions",
        focus: "Bedah struktur Next.js App Router, pemisahan Server/Client Components, state management, dan integrasi Tailwind v4."
      },
      {
        sessionNum: "Sesi 05 - 08",
        title: "Clean Backend Architecture & REST API Laravel 11",
        focus: "Menghilangkan Fat Controller dengan Service Pattern, Form Request Validation, dan otentikasi aman berbasis Sanctum Token."
      },
      {
        sessionNum: "Sesi 09 - 12",
        title: "Automated Testing, Cloud Deployment & Capstone Review",
        focus: "Penulisan Automated Test dengan Pest PHP, setup CI/CD pipeline, deploy VPS Ubuntu, dan evaluasi portofolio GitHub."
      }
    ],
    features: [
      "12x Sesi Live Coding & Bimbingan 1-on-1 (60 Menit/Sesi)",
      "Code Review Mendalam pada Repositori GitHub Anda",
      "Template Boilerplate Enterprise Fullstack Siap Pakai",
      "Sertifikat Kompetensi Fullstack Engineer Resmi"
    ]
  },
  {
    id: 3,
    code: "MENTOR-DATA-03",
    title: "Data Science & Practical Machine Learning: Analisis Skala Industri",
    category: "Data Science & AI",
    level: "Beginner to Intermediate",
    skkniCode: "SKKNI Sains Data Terapan Level 5",
    sessionsInfo: "10 Sesi Privat 1-on-1 (Google Meet)",
    durationWeeks: "5 Minggu Intensif",
    remainingSlots: 4,
    rating: 4.91,
    reviewsCount: 195,
    enrolledCount: 1340,
    targetAudience: "Data Enthusiast, Business Analyst, Statistician, Career Shifter",
    mentor: {
      name: "David Pratama",
      role: "Staff Data Scientist at Traveloka",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      company: "Traveloka Indonesia",
      experience: "6+ Tahun di Big Data Analytics",
      bio: "Fokus pada Machine Learning operasional dan data-driven product growth. Siap memandu Anda dari nol hingga fasih mengolah data bisnis riil."
    },
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 390.000",
    price: "Rp 219.000",
    description: "Pelajari cara praktisi menganalisis data riil: data wrangling dengan Pandas, visualisasi insight bisnis eksekutif di Tableau, pemodelan Machine Learning prediktif, dan presentasi data storytelling.",
    mentoringHighlights: [
      "Mentoring privat dengan dataset transaksi perusahaan nyata (anonymized)",
      "Bimbingan menyusun model Machine Learning yang siap pakai (bukan sekadar teori)",
      "Review dashboard visualisasi bisnis bersama Staff Data Scientist",
      "Simulasi interview studi kasus bisnis (Product Data Case Interview)"
    ],
    tools: ["Python", "Pandas", "Scikit-Learn", "Tableau", "Jupyter", "SQL"],
    syllabus: [
      {
        sessionNum: "Sesi 01 - 03",
        title: "Data Extraction, Advanced SQL & Data Wrangling",
        focus: "Query SQL kompleks untuk ekstraksi data korporat, pembersihan missing values & deteksi anomali dengan Pandas."
      },
      {
        sessionNum: "Sesi 04 - 07",
        title: "Machine Learning Modeling (Supervised & Unsupervised)",
        focus: "Pemilihan algoritma (Random Forest, XGBoost, K-Means), feature engineering, evaluasi matriks akurasi & ROC-AUC."
      },
      {
        sessionNum: "Sesi 08 - 10",
        title: "Business Dashboarding & Capstone Presentation",
        focus: "Pembuatan dashboard interaktif Tableau dan latihan presentasi insight bisnis data di hadapan mentor."
      }
    ],
    features: [
      "10x Sesi Mentoring Privat 1-on-1 (60 Menit/Sesi)",
      "Dataset Nyata Kasus Churn & Revenue Modeling",
      "Sertifikat Kompetensi Sains Data Resmi Terverifikasi",
      "Bimbingan Persiapan Teknis Wawancara Data Analyst"
    ]
  },
  {
    id: 4,
    code: "MENTOR-FE-04",
    title: "Advanced Frontend Engineering: React, Next.js, TypeScript & Performance",
    category: "Web Development",
    level: "Advanced",
    skkniCode: "SKKNI Arsitektur Antarmuka Web Level 6",
    durationWeeks: "4 Minggu Intensif",
    sessionsInfo: "8 Sesi Privat 1-on-1 (Google Meet)",
    remainingSlots: 1, // High demand
    rating: 4.96,
    reviewsCount: 118,
    enrolledCount: 960,
    targetAudience: "Frontend Developer, Mid Software Engineer, Web Specialist",
    mentor: {
      name: "Fajar Nugraha",
      role: "Frontend Architect at Shopee",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
      company: "Shopee / Sea Group",
      experience: "9+ Tahun di Web Architecture",
      bio: "Spesialis web performance dan arsitektur aplikasi frontend berskala ratusan juta hit harian. Membantu developer naik kelas dari mid ke senior level."
    },
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 380.000",
    price: "Rp 229.000",
    description: "Program mentoring tingkat lanjut untuk developer yang ingin menguasai generic TypeScript, optimasi Google Core Web Vitals, server streaming, testing otomatis Vitest, dan arsitektur Micro-Frontend.",
    mentoringHighlights: [
      "Bedah arsitektur kode frontend skala besar langsung bersama Frontend Architect",
      "Audit performa dan memory leak aplikasi web hingga mencapai skor 95+",
      "Penyusunan automated testing komprehensif (Unit, Integration, & E2E)",
      "Simulasi System Design Interview untuk posisi Senior Frontend Engineer"
    ],
    tools: ["React 19", "Next.js 15", "TypeScript", "Tailwind CSS", "Vitest", "Lighthouse"],
    syllabus: [
      {
        sessionNum: "Sesi 01 - 02",
        title: "Enterprise TypeScript & Custom Hooks Architecture",
        focus: "Generic types kompleks, compound components pattern, dan state management modular dengan Zustand."
      },
      {
        sessionNum: "Sesi 03 - 04",
        title: "Next.js Streaming Architecture & Cache Strategy",
        focus: "Pemisahan RSC boundaries, React Suspense streaming, dan strategi invalidasi cache data yang aman."
      },
      {
        sessionNum: "Sesi 05 - 06",
        title: "Automated Testing Pipeline (Vitest & Testing Library)",
        focus: "Menulis integration test untuk asynchronous UI, mocking API via MSW, dan CI quality gate."
      },
      {
        sessionNum: "Sesi 07 - 08",
        title: "Performance Audit & Senior Tech Interview Prep",
        focus: "Diagnostik Lighthouse, reduksi bundle size, dan simulasi technical interview level Senior/Lead."
      }
    ],
    features: [
      "8x Sesi Bimbingan Arsitektur Privat 1-on-1",
      "Code Review Kualitas Produksi Tingkat Enterprise",
      "Boilerplate Next.js TypeScript Enterprise Ready",
      "Sertifikat Kompetensi Frontend Architect Resmi"
    ]
  },
  {
    id: 5,
    code: "MENTOR-MOB-05",
    title: "Mobile App Engineering: Flutter, BLoC Architecture & Store Release",
    category: "Mobile Apps",
    level: "Intermediate",
    skkniCode: "SKKNI Pemrograman Mobile Level 5",
    durationWeeks: "5 Minggu Intensif",
    sessionsInfo: "10 Sesi Privat 1-on-1 (Google Meet)",
    remainingSlots: 3,
    rating: 4.89,
    reviewsCount: 132,
    enrolledCount: 1100,
    targetAudience: "Mobile Developer, Flutter Enthusiast, Android/iOS Developer",
    mentor: {
      name: "Rian Setiawan",
      role: "Mobile Lead at Bukalapak",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
      company: "Bukalapak Enterprise",
      experience: "7+ Tahun di Mobile Engineering",
      bio: "Telah mempublikasikan belasan aplikasi mobile berating tinggi di Google Play & App Store. Membimbing pembuatan arsitektur mobile bersih dan scalable."
    },
    coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 370.000",
    price: "Rp 209.000",
    description: "Bimbingan membangun aplikasi mobile cross-platform performa tinggi dengan Flutter. Kuasai arsitektur Clean Architecture, state management BLoC, offline-first storage, integrasi API, dan rilis ke Google Play Store.",
    mentoringHighlights: [
      "Bimbingan live membangun aplikasi Android & iOS dalam 1 codebase",
      "Penerapan BLoC pattern yang rapi dan terpisah antara UI dan logika bisnis",
      "Setup offline caching dengan Hive/SQLite untuk aplikasi tanpa sinyal",
      "Didampingi langsung proses packaging dan upload ke Google Play Store"
    ],
    tools: ["Flutter", "Dart", "BLoC Pattern", "Dio", "Hive DB", "Firebase"],
    syllabus: [
      {
        sessionNum: "Sesi 01 - 03",
        title: "Fondasi Dart OOP & Responsive Widget Layouts",
        focus: "Manajemen async Dart, custom widgets responsif multi-layar, dan navigasi GoRouter."
      },
      {
        sessionNum: "Sesi 04 - 07",
        title: "Clean Architecture & Global State Management BLoC",
        focus: "Pemisahan Data, Domain, Presentation Layer, integrasi REST API dengan Dio, dan offline caching Hive."
      },
      {
        sessionNum: "Sesi 08 - 10",
        title: "Firebase Auth, Keamanan & Rilis ke Google Play",
        focus: "Push notification FCM, keystore signing, obfuscation keamanan kode, dan rilis aplikasi."
      }
    ],
    features: [
      "10x Sesi Mentoring Privat 1-on-1 (60 Menit/Sesi)",
      "Bimbingan Step-by-Step Publish ke Google Play Store",
      "Source Code Aplikasi E-Commerce & Delivery Lengkap",
      "Sertifikat Kompetensi Mobile Developer Resmi"
    ]
  },
  {
    id: 6,
    code: "MENTOR-BE-06",
    title: "Backend Architecture & Distributed Systems: Go, Docker & Kafka",
    category: "Backend Engineering",
    level: "Advanced",
    skkniCode: "SKKNI Arsitektur Sistem Komputasi Level 6",
    durationWeeks: "6 Minggu Intensif",
    sessionsInfo: "12 Sesi Privat 1-on-1 (Google Meet)",
    remainingSlots: 2,
    rating: 4.97,
    reviewsCount: 104,
    enrolledCount: 890,
    targetAudience: "Backend Engineer, Systems Engineer, DevOps, Software Architect",
    mentor: {
      name: "Haryanto Santoso",
      role: "Principal Backend Engineer at DANA",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
      company: "DANA Indonesia",
      experience: "10+ Tahun di High-Throughput Systems",
      bio: "Menangani jutaan transaksi finansial per detik dengan latensi ultra rendah di Go. Membantu insinyur backend memahami arsitektur sistem terdistribusi."
    },
    coverImage: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 499.000",
    price: "Rp 279.000",
    description: "Pendalaman backend berkinerja tinggi bersama Principal Engineer: konkurensi di Go (Goroutines), gRPC proto communication, event-driven architecture Apache Kafka, database sharding, dan Docker containerization.",
    mentoringHighlights: [
      "Mentoring arsitektur konkurensi Go untuk menangani ribuan Request Per Second",
      "Simulasi sistem transaksi FinTech dengan ACID guarantees & Idempotency",
      "Penyusunan arsitektur Microservices berbasis Message Broker Kafka",
      "Simulasi System Design Interview standar perusahaan teknologi Tier-1"
    ],
    tools: ["Go (Golang)", "Docker", "Apache Kafka", "gRPC", "PostgreSQL", "Redis"],
    syllabus: [
      {
        sessionNum: "Sesi 01 - 04",
        title: "Konkurensi Go Tingkat Lanjut & High Throughput Service",
        focus: "Goroutines, Channels, Mutex, race detection, dan context cancellation pada web server."
      },
      {
        sessionNum: "Sesi 05 - 08",
        title: "gRPC Protocols, Distributed Caching & DB Indexing",
        focus: "Schema Protobuf, database query plans & connection pooling, serta Redis caching patterns."
      },
      {
        sessionNum: "Sesi 09 - 12",
        title: "Event-Driven Kafka Architecture & System Design",
        focus: "Kafka consumer groups, message retry patterns, distributed tracing, dan final capstone review."
      }
    ],
    features: [
      "12x Sesi Mentoring Privat 1-on-1 (60 Menit/Sesi)",
      "Simulasi Kasus Sistem Pembayaran Skala FinTech",
      "Sertifikat Kompetensi Backend Architect Resmi",
      "Simulasi Wawancara Arsitektur Sistem Terdistribusi"
    ]
  }
];

const TRACK_CATEGORIES = [
  "Semua Bidang",
  "UI/UX Design",
  "Web Development",
  "Data Science & AI",
  "Mobile Apps",
  "Backend Engineering"
];

const TRUSTED_COMPANIES = [
  { name: "Telkom Indonesia", industry: "Telekomunikasi & BUMN Digital" },
  { name: "Bank Central Asia (BCA)", industry: "Perbankan Swasta Terbesar" },
  { name: "Bank Mandiri", industry: "Jasa Keuangan BUMN" },
  { name: "GoTo (Gojek & Tokopedia)", industry: "Ekosistem Teknologi Terkemuka" },
  { name: "Astra International", industry: "Konglomerasi Industri Otomotif" },
  { name: "Pertamina", industry: "Energi & Sumber Daya Nasional" },
  { name: "Traveloka", industry: "Platform Perjalanan & Lifestyle" },
  { name: "Shopee Indonesia", industry: "E-Commerce & Digital Marketplace" },
  { name: "DANA Indonesia", industry: "Fintech & Dompet Digital" },
  { name: "Unilever Indonesia", industry: "Fast Moving Consumer Goods" },
  { name: "Bukalapak", industry: "Solusi Retail & E-Commerce" },
  { name: "Blibli / GDP Venture", industry: "Omnichannel Commerce" }
];

export default function Program() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Bidang");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  // Filter & Urutkan
  const filteredPrograms = useMemo(() => {
    return MENTORSHIP_PROGRAMS.filter((p) => {
      const matchSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      {/* 1. TOP BAR DOKUMEN & AKREDITASI RESMI PROGRAM MENTORING         */}
      {/* ============================================================== */}
      <div className="bg-slate-900 text-slate-300 text-[11px] border-b border-slate-800 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider text-[10px] border border-amber-500/30">
              Program 1-on-1
            </span>
            <span className="text-slate-400">
              Katalog Mentoring Intensif & Bimbingan Portofolio Privat • <strong>Edisi 2026/2027</strong>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-slate-400 hidden sm:inline flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-400 inline" /> Mentor Terverifikasi dari Top Tech Companies
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
              <span>In-House Mentoring (B2B)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. HERO SECTION PROGRAM: FOKUS MENTOR & LIVE 1-ON-1 SESSIONS   */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#b38867]/15 via-[#b38867]/5 to-transparent pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-gray-200/70">
        <div className="absolute inset-0 bg-[radial-gradient(#b38867_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Kolom Kiri: Headline & Value Proposition Bimbingan Personal */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#b38867]/30 text-[#7B5E4A] text-xs font-bold shadow-2xs">
                <Sparkles size={14} className="text-[#b38867]" />
                <span>Eksklusif: Sesi Tatap Muka 1-on-1 dengan Senior Mentor</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.18]">
                Bimbingan Karier Intensif <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b38867] to-[#7B5E4A]">
                  Bersama Mentor Praktisi Terkemuka
                </span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-medium mx-auto lg:mx-0">
                Bukan sekadar menonton video rekaman. Dapatkan bimbingan personal dua arah langsung dengan Lead Engineer & Principal Designer: atur jadwal di kalender fleksibel, review kode baris demi baris, dan bangun portofolio capstone siap kerja.
              </p>

              {/* Search Bar Input */}
              <div className="pt-2 max-w-xl mx-auto lg:mx-0">
                <div className="relative flex items-center bg-white rounded-2xl shadow-md border border-gray-200 p-2 transition focus-within:border-[#b38867] focus-within:ring-2 focus-within:ring-[#b38867]/20">
                  <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari mentor, topik bimbingan (misal: UI/UX, Fullstack, AI)..."
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-bold rounded-xl transition shadow-2xs shrink-0"
                  >
                    <span>Cari Program</span>
                  </button>
                </div>
              </div>

              {/* Quick KPI Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-200/80">
                <div className="text-left">
                  <p className="text-2xl font-black text-[#b38867]">100+</p>
                  <p className="text-xs font-bold text-slate-800">Senior Mentor</p>
                  <p className="text-[10px] text-slate-400">Praktisi unicorn aktif</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-[#b38867]">1-on-1</p>
                  <p className="text-xs font-bold text-slate-800">Bimbingan Privat</p>
                  <p className="text-[10px] text-slate-400">Bukan kelas massal</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-[#b38867]">4.95 / 5</p>
                  <p className="text-xs font-bold text-slate-800">Kepuasan Mentee</p>
                  <p className="text-[10px] text-slate-400">Ribuan sesi terbimbing</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-[#b38867]">95.8%</p>
                  <p className="text-xs font-bold text-slate-800">Tembus Portofolio</p>
                  <p className="text-[10px] text-slate-400">Siap interview kerja</p>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Interactive Visual Card (Simulasi Sesi Live 1-on-1 di Google Meet) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-gray-200 space-y-4 relative">
                {/* Status Badge Floating */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Sesi Mentoring Live 1-on-1</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">Google Meet HD</span>
                </div>

                {/* Simulasi Video Room 1-on-1 */}
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-slate-700 shadow-inner flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
                    alt="Sesi Mentoring Live"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  
                  {/* Floating Video Overlay */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-semibold flex items-center gap-1.5">
                    <Video size={13} className="text-rose-400" />
                    <span>Live Code & Portfolio Review</span>
                  </div>

                  {/* Mentor Mini Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                        alt="Mentor"
                        className="w-7 h-7 rounded-full border border-white/60 object-cover"
                      />
                      <div>
                        <p className="font-bold text-xs leading-none">Rudi Hartono</p>
                        <p className="text-[10px] text-white/70">Senior Fullstack at Gojek</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-mono text-[10px] font-bold">
                      01:14:28
                    </span>
                  </div>
                </div>

                {/* Info Rincian Fitur Sesi */}
                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/80">
                    <div className="flex items-center gap-2">
                      <CalendarCheck size={16} className="text-[#b38867]" />
                      <span className="font-semibold text-slate-800">Jadwal Sesi Fleksibel:</span>
                    </div>
                    <span className="font-bold text-[#b38867]">Disepakati Berdua</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} className="text-emerald-600" />
                      <span className="font-semibold text-slate-800">Format Bimbingan:</span>
                    </div>
                    <span className="font-bold text-slate-700">1 Mentee : 1 Mentor</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. ALUR 4 LANGKAH MENTORING BERJALAN (HOW IT WORKS)           */}
      {/* ============================================================== */}
      <section className="bg-white border-b border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#b38867] bg-[#b38867]/10 px-3 py-1 rounded-full border border-[#b38867]/20">
              Alur Bimbingan Praktis
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Bagaimana Program Mentoring 1-on-1 Berjalan?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              4 langkah terarah untuk membantu Anda mencapai target karier digital dengan pendampingan langsung.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-2 relative">
              <span className="w-8 h-8 rounded-xl bg-[#b38867] text-white flex items-center justify-center font-black text-sm shadow-xs">
                1
              </span>
              <h4 className="font-bold text-sm text-slate-900">Pilih Program & Mentor</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Tinjau profil spesialisasi mentor dari perusahaan impian Anda dan pilih kurikulum yang ingin Anda kuasai.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-200/80 space-y-2 relative">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                2
              </span>
              <h4 className="font-bold text-sm text-slate-900">Atur Jadwal di Kalender</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Tentukan hari dan jam pertemuan yang cocok. Jadwal fleksibel yang dapat disesuaikan dengan aktivitas Anda.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/40 border border-purple-200/80 space-y-2 relative">
              <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                3
              </span>
              <h4 className="font-bold text-sm text-slate-900">Sesi Live 1-on-1 & Code Review</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Tatap muka privat via Google Meet: bedah materi, tanyakan kendala coding/desain, dan terima notulensi evaluasi.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-2 relative">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                4
              </span>
              <h4 className="font-bold text-sm text-slate-900">Capstone Portfolio & Lulus</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Selesaikan proyek portofolio berstandar industri dan dapatkan sertifikat resmi terverifikasi dengan QR Code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. SECTION "TRUSTED BY" PERUSAHAAN MITRA                      */}
      {/* ============================================================== */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              Praktisi Teruji
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Mentor Kami Bekerja di Perusahaan Teknologi Terdepan
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Dapatkan arahan langsung dari mereka yang telah bertahun-tahun berkarya di ekosistem digital skala besar.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
            {TRUSTED_COMPANIES.map((c, i) => (
              <div
                key={i}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-center transition"
              >
                <p className="font-bold text-xs text-white line-clamp-1">{c.name}</p>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{c.industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. KATALOG PROGRAM MENTORING UTAMA DENGAN FILTER & VIEW TOGGLE  */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        
        {/* Header Katalog */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#b38867]">
                Katalog Program Mentoring
              </span>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs text-slate-500 font-medium">Tahun Ajaran 2026/2027</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pilih Program & Booking Mentor Favorit Anda
            </h2>
          </div>

          {/* Toggle View: Grid vs Table */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <div className="inline-flex p-1 bg-gray-200/80 rounded-xl text-xs font-bold">
              <button
                onClick={() => setViewMode("grid")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Tampilan Kartu Mentoring"
              >
                <LayoutGrid size={14} />
                <span>Kartu Mentor</span>
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
                <span>Tabel Matriks</span>
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

          {/* Sub Filter: Level & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <SlidersHorizontal size={13} className="text-[#b38867]" /> Level:
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
              Menampilkan <strong>{filteredPrograms.length}</strong> program bimbingan privat
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAMPILAN 1: GRID MODE (KARTU MENTOR KHAS DENGAN AVATAR BESAR)   */}
        {/* ============================================================== */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPrograms.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Cover Image & Floating Badges */}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

                    {/* Top Badges: Kode Program & Level */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-300 text-[11px] font-mono font-bold tracking-wider border border-white/10">
                        {item.code}
                      </span>

                      {/* Indikator Sisa Slot Mentee (Fitur Khas Mentoring) */}
                      <span className="px-2.5 py-1 rounded-lg bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs animate-pulse">
                        <Flame size={12} />
                        <span>Sisa {item.remainingSlots} Slot Mentee</span>
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
                        <span className="text-white/70 font-normal text-[10px]">({item.reviewsCount} ulasan)</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content: Mentor Profile Spotlight & Sesi */}
                  <div className="p-6 space-y-4">
                    {/* Format Sesi Mentoring Live 1-on-1 */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#b38867] bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200">
                      <span className="flex items-center gap-1.5">
                        <Video size={13} />
                        <span>{item.sessionsInfo}</span>
                      </span>
                      <span className="text-slate-500 font-medium">{item.durationWeeks}</span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-[#b38867] transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-2 font-medium">
                        {item.description}
                      </p>
                    </div>

                    {/* Spotlight Profil Mentor (Avatar Besar & Kredensial Unicorn) */}
                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                      <img
                        src={item.mentor.avatar}
                        alt={item.mentor.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-2xs shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-extrabold text-slate-900 truncate">{item.mentor.name}</p>
                          <BadgeCheck size={14} className="text-blue-500 shrink-0" />
                        </div>
                        <p className="text-[11px] text-[#b38867] font-bold truncate">{item.mentor.role}</p>
                        <p className="text-[10px] text-slate-400 truncate">{item.mentor.experience}</p>
                      </div>
                    </div>

                    {/* Learning Highlights */}
                    <div className="space-y-1.5 text-xs text-slate-600 font-medium pt-1">
                      {item.mentoringHighlights.slice(0, 2).map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions & Pricing */}
                <div className="p-6 pt-0 border-t border-gray-100/80 mt-2">
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
                        className="py-2.5 px-3 text-xs font-bold rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 border border-gray-200 transition"
                      >
                        Silabus
                      </button>
                      <Link
                        to="/register"
                        className="py-2.5 px-4 text-xs font-bold rounded-xl bg-[#b38867] hover:bg-[#a27355] text-white shadow-2xs transition inline-flex items-center gap-1.5"
                      >
                        <UserCheck size={14} />
                        <span>Pilih Mentor</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAMPILAN 2: TABLE MODE (MATRIKS PROGRAM RESMI)                 */}
        {/* ============================================================== */}
        {viewMode === "table" && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-900 text-white uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-4 px-4">Kode Program</th>
                    <th className="py-4 px-4 min-w-[280px]">Nama Program & Fokus</th>
                    <th className="py-4 px-4">Bidang</th>
                    <th className="py-4 px-4">Format Sesi</th>
                    <th className="py-4 px-4 min-w-[190px]">Mentor Praktisi</th>
                    <th className="py-4 px-4">Slot</th>
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
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        <p className="font-bold text-[#b38867]">{p.sessionsInfo}</p>
                        <p className="text-[10px] text-slate-400">{p.durationWeeks}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{p.mentor.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{p.mentor.role}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">
                          Sisa {p.remainingSlots}
                        </span>
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

      </section>

      {/* ============================================================== */}
      {/* 6. MODAL RINCIAN SILABUS & PROFIL MENTOR DETAIL                */}
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
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/80 text-white uppercase">
                    Sisa {selectedProgram.remainingSlots} Slot
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {selectedProgram.title}
                </h3>
                <p className="text-xs text-slate-300 flex items-center gap-2">
                  <Video size={13} className="text-emerald-400" />
                  <span>{selectedProgram.sessionsInfo} • {selectedProgram.durationWeeks}</span>
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
              {/* Profil Lengkap Mentor */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <img
                  src={selectedProgram.mentor.avatar}
                  alt={selectedProgram.mentor.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md shrink-0"
                />
                <div className="space-y-1 text-center sm:text-left min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <h4 className="font-black text-slate-900 text-sm">{selectedProgram.mentor.name}</h4>
                    <BadgeCheck size={16} className="text-blue-500" />
                  </div>
                  <p className="text-xs font-bold text-[#b38867]">{selectedProgram.mentor.role}</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{selectedProgram.mentor.bio}</p>
                </div>
              </div>

              {/* Deskripsi Program */}
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Briefcase size={15} className="text-[#b38867]" />
                  <span>Tujuan & Sasaran Bimbingan</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {selectedProgram.description}
                </p>
              </div>

              {/* Mentoring Highlights */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <CheckCheck size={16} className="text-[#b38867]" />
                  <span>Keuntungan Eksklusif Bimbingan 1-on-1:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                  {selectedProgram.mentoringHighlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b38867] mt-1.5 shrink-0" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Silabus Pertemuan */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen size={15} className="text-[#b38867]" />
                  <span>Rencana Sesi Pertemuan Mingguan</span>
                </h4>

                <div className="space-y-2.5">
                  {selectedProgram.syllabus.map((s, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-2xl p-4 bg-white shadow-2xs space-y-1.5 hover:border-gray-300 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-slate-800 text-[10px] font-bold font-mono">
                          {s.sessionNum}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          Live 1-on-1
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-slate-900">{s.title}</h5>
                      <p className="text-xs text-slate-600 font-medium">{s.focus}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools & Fasilitas */}
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Terminal size={14} className="text-[#b38867]" />
                  <span>Tools & Stack Teknologi Bimbingan</span>
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

              <div>
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award size={15} className="text-emerald-600" />
                  <span>Fasilitas Resmi yang Didapatkan</span>
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
                  onClick={() => setSelectedProgram(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  Tutup
                </button>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-bold rounded-xl shadow-2xs transition inline-flex items-center gap-1.5"
                >
                  <UserCheck size={14} />
                  <span>Pilih Mentor & Daftar</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Unduh Brosur PDF */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#b38867] flex items-center justify-center mx-auto border border-amber-200">
              <FileDown size={24} />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">Unduh Brosur Program Mentoring</h3>
              <p className="text-xs text-slate-500 font-medium">
                Dapatkan rincian seluruh program bimbingan 1-on-1, profil lengkap mentor, dan skema biaya program Aeterna 2026/2027.
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Nama Dokumen:</span>
                <strong className="text-slate-800">Katalog-Mentoring-Aeterna-2026.pdf</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Format Sesi:</span>
                <strong className="text-slate-800">Live 1-on-1 Google Meet</strong>
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

      {/* Modal Konsultasi B2B */}
      {consultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-900 text-amber-400 rounded-xl">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Konsultasi Program In-House Mentoring (B2B)</h3>
                  <p className="text-[11px] text-slate-500">Tim Academic Enterprise Aeterna akan menghubungi Anda dalam 1x24 jam kerja.</p>
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
                    Nama Perusahaan <span className="text-red-500">*</span>
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
                    Jabatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="HR Lead / Tech Manager"
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
                    placeholder="dimas@perusahaan.com"
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-1 focus:ring-[#b38867] font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Nomor WhatsApp <span className="text-red-500">*</span>
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
                  Kebutuhan Bimbingan & Estimasi Jumlah Peserta
                </label>
                <textarea
                  rows={2}
                  placeholder="Misal: Mentoring Fullstack & Cloud untuk 8 orang software engineer internal..."
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
