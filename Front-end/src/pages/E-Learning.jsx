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
  ChevronRight,
  Download,
  Building2,
  Briefcase,
  ShieldCheck,
  Check,
  Filter,
  LayoutGrid,
  ListFilter,
  ExternalLink,
  HelpCircle,
  PhoneCall,
  Mail,
  ChevronDown,
  CheckCheck,
  SlidersHorizontal,
  BookCheck,
  Terminal,
  Compass,
  FileDown,
  Share2,
  BadgeCheck,
  Calendar,
  Eye
} from 'lucide-react';

// ============================================================================
// DATA KATALOG RESMI PROGRAM PELATIHAN PERUSAHAAN (EDISI 2026/2027)
// ============================================================================
const CORPORATE_CATALOG_COURSES = [
  {
    id: 1,
    code: "AET-DSN-101",
    title: "Mastering Figma & Enterprise Design Systems",
    track: "UI/UX & Product Design",
    level: "Intermediate",
    skkniCode: "SKKNI Desain Digital Level 5",
    duration: "24 Jam Pembelajaran (JP) • 18 Modul Video",
    rating: 4.92,
    enrolledCount: 3840,
    accreditation: "Terstandarisasi Industri",
    targetAudience: "UI/UX Designer, Product Designer, Frontend Engineer, Design Lead",
    instructor: {
      name: "Angela Putri",
      role: "Lead Product Designer at Tokopedia",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      company: "Tokopedia / GoTo Group"
    },
    coverImage: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80",
    description: "Program kurikulum resmi penyusunan Design Tokens, Komponen Skalabilitas Tinggi, Variabel Warna & Spacing, serta kolaborasi handoff developer menggunakan Figma Enterprise.",
    learningOutcomes: [
      "Mampu merancang multi-brand Design System dengan Auto-Layout & Variants",
      "Menguasai implementasi Figma Variables (Tokens) untuk mode Dark/Light",
      "Menyusun dokumentasi UI Component Kit siap handoff via Figma Dev Mode",
      "Mengurangi technical design debt hingga 40% pada skala tim produk besar"
    ],
    tools: ["Figma Enterprise", "Zeroheight", "Storybook", "Token Studio"],
    modules: [
      { 
        session: "Sesi 01", 
        title: "Fondasi & Standarisasi UI Workspace Enterprise", 
        duration: "4 JP",
        lessons: ["Audit UI & Evaluasi Inkonsistensi Visual", "Frame Hierarchy vs Grouping Best Practice", "Praktik: Menyusun Grid System & Typography Scale"] 
      },
      { 
        session: "Sesi 02", 
        title: "Auto-Layout Lanjutan & Responsive Components", 
        duration: "6 JP",
        lessons: ["Prinsip Fixed, Hug, Fill pada Responsive UI", "Min-Width & Max-Width Constraints", "Praktik: Membangun Data Table & Dynamic Card Components"] 
      },
      { 
        session: "Sesi 03", 
        title: "Component Properties, Variants & Design Tokens", 
        duration: "8 JP",
        lessons: ["State Management Component (Default, Hover, Active, Disabled)", "Figma Variables: Semantic Color & Spacing Tokens", "Praktik: Multi-Theme Switcher (Light / Dark Mode)"] 
      },
      { 
        session: "Sesi 04", 
        title: "Prototyping, Dev Mode & Developer Handoff", 
        duration: "6 JP",
        lessons: ["Interactive Smart Animate untuk User Testing", "Dev Mode & Anotasi Spesifikasi Teknis", "Final Capstone: Membangun SaaS Enterprise Dashboard Kit"] 
      }
    ],
    features: [
      "File Starter Kit Design System (.fig)",
      "Sertifikat Kompetensi Resmi dengan QR Code Verifikasi",
      "Studi Kasus Ekosistem E-Commerce & FinTech",
      "Akses Seumur Hidup & Pembaruan Materi Tahunan"
    ]
  },
  {
    id: 2,
    code: "AET-ENG-201",
    title: "Modern Fullstack Web Application with Next.js & React",
    track: "Software Engineering",
    level: "Advanced",
    skkniCode: "SKKNI Rekayasa Perangkat Lunak Level 6",
    duration: "32 Jam Pembelajaran (JP) • 26 Modul Video",
    rating: 4.95,
    enrolledCount: 5210,
    accreditation: "Terstandarisasi Industri",
    targetAudience: "Frontend Developer, Fullstack Engineer, Tech Lead, System Architect",
    instructor: {
      name: "Rudi Hartono",
      role: "Senior Fullstack Engineer at Gojek",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      company: "Gojek / GoTo Financial"
    },
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    description: "Kurikulum komprehensif pengembangan web modern berkinerja tinggi menggunakan Next.js App Router, Server Components, State Architecture, Database Modeling, dan optimasi Core Web Vitals.",
    learningOutcomes: [
      "Menguasai arsitektur React Server Components (RSC) & Server Actions",
      "Mengintegrasikan otentikasi enterprise (OAuth2, JWT, Session Management)",
      "Mendesain schema database relasional & query optimasi dengan Prisma ORM",
      "Mencapai skor Google Lighthouse > 90 pada aplikasi web berskala enterprise"
    ],
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma ORM", "PostgreSQL"],
    modules: [
      { 
        session: "Sesi 01", 
        title: "Arsitektur Next.js App Router & Server Components", 
        duration: "8 JP",
        lessons: ["Server Components vs Client Components Boundary", "Nested Layouts, Templates & Route Groups", "Data Fetching, Caching & Revalidation Strategy"] 
      },
      { 
        session: "Sesi 02", 
        title: "State Management & Form Handling dengan Server Actions", 
        duration: "8 JP",
        lessons: ["Mutasi Data Tanpa API Endpoint Terpisah", "Validasi Form Aman dengan Zod & Action State", "Optimistic UI Update untuk Pengalaman Pengguna Cepat"] 
      },
      { 
        session: "Sesi 03", 
        title: "Database Modeling, ORM & Keamanan Enterprise", 
        duration: "8 JP",
        lessons: ["Skema Database Relasional dengan Prisma ORM", "Integrasi NextAuth.js / Auth.js dengan Role-Based Access Control", "Proteksi Middleware & CSRF Mitigation"] 
      },
      { 
        session: "Sesi 04", 
        title: "Performance Optimization, SEO & Cloud Deployment", 
        duration: "8 JP",
        lessons: ["Dynamic OG Image Generation & Metadata Optimization", "Analisis Bundle Size & Core Web Vitals Monitoring", "Final Capstone: Portal E-Commerce B2B Terintegrasi"] 
      }
    ],
    features: [
      "Source Code Repositori GitHub Bersih & Terdokumentasi",
      "Sertifikat Kompetensi Resmi dengan Akreditasi Digital",
      "Code Review dari Senior Engineer Praktisi",
      "Template Boilerplate Enterprise Siap Pakai"
    ]
  },
  {
    id: 3,
    code: "AET-ENG-202",
    title: "RESTful API Engineering & Clean Architecture with Laravel",
    track: "Software Engineering",
    level: "Intermediate",
    skkniCode: "SKKNI Backend Development Level 5",
    duration: "28 Jam Pembelajaran (JP) • 22 Modul Video",
    rating: 4.88,
    enrolledCount: 3120,
    accreditation: "Terstandarisasi Industri",
    targetAudience: "Backend Developer, PHP Engineer, System Integrator, API Specialist",
    instructor: {
      name: "Budi Santoso",
      role: "Backend Architect at Bukalapak",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      company: "Bukalapak Enterprise"
    },
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    description: "Pelatihan resmi pengembangan API berstandar korporasi dengan memisahkan Service Layer, Repository Pattern, Token Authentication Sanctum, Queue Workers, dan Automated Testing.",
    learningOutcomes: [
      "Menerapkan Clean Architecture dan Separation of Concerns di Laravel",
      "Mencegah N+1 query problem dan mengoptimasi waktu respon API < 150ms",
      "Mengamankan API dengan Sanctum, Rate Limiting, dan Scope Authorization",
      "Menulis automated testing menggunakan Pest PHP untuk menjaga kestabilan sistem"
    ],
    tools: ["Laravel", "PHP 8.3", "MySQL", "Redis", "Pest PHP", "Postman", "Swagger"],
    modules: [
      { 
        session: "Sesi 01", 
        title: "Fondasi RESTful API & Standar JSON Response Korporat", 
        duration: "6 JP",
        lessons: ["Prinsip HTTP Method, Status Code & Error Contract", "API Resources & Transformation Layer", "Form Request Validation & Error Formatting"] 
      },
      { 
        session: "Sesi 02", 
        title: "Service Layer, Repositories & Business Logic Decoupling", 
        duration: "8 JP",
        lessons: ["Menghilangkan Fat Controller dengan Service Pattern", "Dependency Injection & Interface Contracts", "Database Transaction & Event Dispatching"] 
      },
      { 
        session: "Sesi 03", 
        title: "Autentikasi Aman, RBAC & API Rate Limiting", 
        duration: "6 JP",
        lessons: ["Token Management dengan Laravel Sanctum", "Role-Based Permissions & Policy Guards", "Throttle & DDoS Protection pada Public Endpoint"] 
      },
      { 
        session: "Sesi 04", 
        title: "Background Jobs, Caching Redis & Automated Testing", 
        duration: "8 JP",
        lessons: ["Queue Worker untuk Pengiriman Email & Notifikasi", "Redis In-Memory Caching untuk Endpoint Padat Pengunjung", "Automated Feature & Unit Testing dengan Pest PHP"] 
      }
    ],
    features: [
      "Postman Collection API Suite Lengkap",
      "Sertifikat Kompetensi Backend Terverifikasi",
      "Panduan Dokumentasi Swagger / OpenAPI Ready",
      "Akses Konsultasi Arsitektur Database"
    ]
  },
  {
    id: 4,
    code: "AET-DAT-301",
    title: "Enterprise Data Analytics & BI Dashboard with Python & Tableau",
    track: "Data Science & AI",
    level: "Intermediate",
    skkniCode: "SKKNI Analisis Data Level 5",
    duration: "26 Jam Pembelajaran (JP) • 20 Modul Video",
    rating: 4.87,
    enrolledCount: 2490,
    accreditation: "Terstandarisasi Industri",
    targetAudience: "Data Analyst, Business Intelligence, Strategy Specialist, Marketing Lead",
    instructor: {
      name: "Siti Rahma",
      role: "Senior Data Analyst at Traveloka",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      company: "Traveloka Indonesia"
    },
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    description: "Mentransformasi data mentah perusahaan menjadi insight strategis bernilai tinggi menggunakan analisis statistik Python (Pandas/NumPy) dan dashboard eksekutif interaktif di Tableau.",
    learningOutcomes: [
      "Mampu melakukan Data Cleaning & Wrangling pada jutaan baris data transaksi",
      "Menyusun Exploratory Data Analysis (EDA) untuk identifikasi tren & anomali",
      "Mendesain Executive Dashboard interaktif dengan parameter kalkulasi Tableau",
      "Menyampaikan Storytelling Data kepada level C-Suite untuk pengambilan keputusan"
    ],
    tools: ["Python", "Pandas", "Tableau", "Jupyter Notebook", "SQL", "Seaborn"],
    modules: [
      { 
        session: "Sesi 01", 
        title: "Pengolahan Data Korporat dengan Python & Pandas", 
        duration: "6 JP",
        lessons: ["Koneksi Dataset Multi-Sumber (CSV, SQL, Excel)", "Teknik Penanganan Missing Values & Inkonsistensi Tipe Data", "Data Aggregation & Grouping Operasi Kompleks"] 
      },
      { 
        session: "Sesi 02", 
        title: "Exploratory Data Analysis (EDA) & Statistik Deskriptif", 
        duration: "6 JP",
        lessons: ["Distribusi Data, Outlier Detection & Korelasi", "Visualisasi Matplotlib & Seaborn untuk Tim Teknis", "Cohort Analysis & Customer Retention Tracking"] 
      },
      { 
        session: "Sesi 03", 
        title: "Pembuatan Business Dashboard Eksekutif di Tableau", 
        duration: "8 JP",
        lessons: ["Data Modeling & Relationship Mapping di Tableau", "Calculated Fields, LOD Expressions & Interactive Filters", "Mendesain UI Dashboard Ramah Pengambil Keputusan"] 
      },
      { 
        session: "Sesi 04", 
        title: "Presentasi Insight Bisnis & Studi Kasus Nyata", 
        duration: "6 JP",
        lessons: ["Data Storytelling Framework untuk Eksekutif Bisnis", "Simulasi Kasus: Optimasi Revenue & Efisiensi Biaya Operasional", "Final Capstone: Dashboard Kinerja Penjualan Korporat"] 
      }
    ],
    features: [
      "Dataset Transaksi Perusahaan Riil (Anonymized)",
      "Template Dashboard Tableau Siap Pakai",
      "Sertifikat Kompetensi Analis Data Resmi",
      "Panduan Presentasi Storytelling Data"
    ]
  },
  {
    id: 5,
    code: "AET-OPS-501",
    title: "Cloud Infrastructure & CI/CD Pipeline with Docker & AWS",
    track: "Cloud & DevOps",
    level: "Advanced",
    skkniCode: "SKKNI Cloud & Infrastructure Level 6",
    duration: "30 Jam Pembelajaran (JP) • 20 Modul Video",
    rating: 4.91,
    enrolledCount: 1980,
    accreditation: "Terstandarisasi Industri",
    targetAudience: "DevOps Engineer, Cloud Architect, Sysadmin, Infrastructure Lead",
    instructor: {
      name: "Fajar Nugraha",
      role: "DevOps Engineer at Blibli",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      company: "Blibli / Djarum Group"
    },
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    description: "Standardisasi deployment otomatis zero-downtime, kontainerisasi aplikasi dengan Docker, orkestrasi cloud AWS (EC2, S3, RDS), serta konfigurasi CI/CD Pipeline via GitHub Actions.",
    learningOutcomes: [
      "Membangun container Docker yang ringan & aman dengan Multi-Stage Build",
      "Merancang pipeline CI/CD otomatis untuk testing dan automated deployment",
      "Mengelola infrastruktur cloud AWS dengan prinsip keamanan VPC & IAM",
      "Mengimplementasikan monitoring server dan logging terpusat"
    ],
    tools: ["Docker", "AWS EC2", "AWS S3", "GitHub Actions", "Nginx", "Linux Ubuntu"],
    modules: [
      { 
        session: "Sesi 01", 
        title: "Kontainerisasi Aplikasi Berstandar Enterprise dengan Docker", 
        duration: "8 JP",
        lessons: ["Arsitektur Docker Engine vs Virtual Machine", "Optimasi Dockerfile Multi-Stage Build untuk Produksi", "Docker Compose untuk Manajemen Multi-Service (App, DB, Redis)"] 
      },
      { 
        session: "Sesi 02", 
        title: "Automasi CI/CD Pipeline dengan GitHub Actions", 
        duration: "8 JP",
        lessons: ["Penyusunan Workflow YAML untuk Automated Testing", "Build & Push Docker Image ke Container Registry", "Deploy Otomatis ke Server Staging & Production Tanpa Downtime"] 
      },
      { 
        session: "Sesi 03", 
        title: "Konfigurasi Infrastruktur Cloud AWS Enterprise", 
        duration: "8 JP",
        lessons: ["VPC, Subnetting & Security Group Hardening", "Provisioning Server AWS EC2 & Managed DB AWS RDS", "Object Storage Berkecepatan Tinggi dengan AWS S3 & CloudFront"] 
      },
      { 
        session: "Sesi 04", 
        title: "Nginx Reverse Proxy, SSL & Server Monitoring", 
        duration: "6 JP",
        lessons: ["Setup Nginx Reverse Proxy dengan Auto SSL Let's Encrypt", "Server Monitoring CPU, RAM & Disk Space", "Final Capstone: Rilis Aplikasi Skala Korporat di Cloud AWS"] 
      }
    ],
    features: [
      "Template Script CI/CD Pipeline GitHub Actions",
      "Sertifikat Kompetensi Cloud Infrastructure",
      "Praktik Server Cloud Aktif",
      "Panduan Security Checklist Deployment"
    ]
  },
  {
    id: 6,
    code: "AET-LEAD-601",
    title: "Agile Leadership & Enterprise Product Management",
    track: "Leadership & Management",
    level: "Advanced",
    skkniCode: "SKKNI Manajemen Produk & Kepemimpinan Digital Level 6",
    duration: "20 Jam Pembelajaran (JP) • 16 Modul Video",
    rating: 4.93,
    enrolledCount: 1720,
    accreditation: "Terstandarisasi Industri",
    targetAudience: "Product Manager, Scrum Master, Engineering Manager, Project Director",
    instructor: {
      name: "Dimas Pratama",
      role: "VP of Product Strategy at DANA",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      company: "DANA Indonesia"
    },
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    description: "Pedoman kepemimpinan produk berbasis data (Data-Driven Product Management), penyusunan Product Roadmap berorientasi bisnis, metrik OKR, dan orkestrasi tim lintas fungsi.",
    learningOutcomes: [
      "Menyusun Product Strategy & OKR yang selaras dengan target revenue perusahaan",
      "Menguasai teknik Discovery Produk & Validasi Masalah Konsumen secara cepat",
      "Memimpin ritual Agile Scrum & Sprint Planning tanpa micromanagement",
      "Menghitung unit economics, Customer Lifetime Value (CLV), dan CAC"
    ],
    tools: ["Jira Software", "Miro", "Notion Product Hub", "Mixpanel", "Confluence"],
    modules: [
      { 
        session: "Sesi 01", 
        title: "Visi Produk, Product-Market Fit & Analisis Pasar", 
        duration: "5 JP",
        lessons: ["Menyelaraskan Visi Produk dengan Strategi Bisnis Korporat", "Analisis Kompetitor & Value Proposition Canvas", "Validasi Hipotesis Masalah Sebelum Penulisan Kode"] 
      },
      { 
        session: "Sesi 02", 
        title: "Product Roadmap, Prioritisasi Fitur & OKR", 
        duration: "5 JP",
        lessons: ["Metode Prioritisasi RICE Framework & Kano Model", "Menyusun Outcome-Based Roadmap yang Adaptif", "Menetapkan Metrik Keberhasilan Produk (OKRs & KPIs)"] 
      },
      { 
        session: "Sesi 03", 
        title: "Eksekusi Agile & Kolaborasi Lintas Fungsi", 
        duration: "5 JP",
        lessons: ["Menulis User Stories & Acceptance Criteria Berkualitas", "Memimpin Sprint Planning, Backlog Grooming & Retrospective", "Manajemen Stakeholder C-Level & Resolusi Konflik Tim"] 
      },
      { 
        session: "Sesi 04", 
        title: "Product Analytics, Peluncuran & Growth Strategy", 
        duration: "5 JP",
        lessons: ["A/B Testing & Analisis Funnel Konversi Pengguna", "Go-To-Market (GTM) Strategy untuk Peluncuran Fitur Baru", "Final Capstone: Dokumen PRD Komprehensif Skala Korporat"] 
      }
    ],
    features: [
      "Template Dokumen PRD (Product Requirement Document) Standar Silicon Valley",
      "Sertifikat Manajemen Produk & Kepemimpinan Digital",
      "Framework Prioritisasi RICE dalam Spreadsheet Otomatis",
      "Studi Kasus Pertumbuhan Unicorn Indonesia"
    ]
  }
];

// ============================================================================
// DATA TRACK & KATEGORI PELATIHAN
// ============================================================================
const TRACK_CATEGORIES = [
  "Semua Bidang Pelatihan",
  "Software Engineering",
  "UI/UX & Product Design",
  "Data Science & AI",
  "Cloud & DevOps",
  "Leadership & Management"
];

// ============================================================================
// LOGO & PERUSAHAAN MITRA TERKEMUKA (TRUSTED BY SECTION)
// ============================================================================
const TRUSTED_COMPANIES = [
  { name: "Telkom Indonesia", industry: "Telekomunikasi & Digital BUMN", tag: "Enterprise Partner" },
  { name: "Bank Central Asia (BCA)", industry: "Perbankan Swasta Terbesar", tag: "Banking & Finance" },
  { name: "Bank Mandiri", industry: "Jasa Keuangan BUMN", tag: "Banking & Finance" },
  { name: "GoTo (Gojek & Tokopedia)", industry: "Ekosistem Teknologi Terkemuka", tag: "Tech Unicorn" },
  { name: "Astra International", industry: "Konglomerasi Industri & Otomotif", tag: "Automotive & Conglomerate" },
  { name: "Pertamina", industry: "Energi & Minyak Gas Nasional", tag: "Energy & BUMN" },
  { name: "Traveloka", industry: "Platform Perjalanan & Lifestyle", tag: "Consumer Tech" },
  { name: "Shopee Indonesia", industry: "E-Commerce & Digital Services", tag: "Retail Tech" },
  { name: "DANA Indonesia", industry: "Fintech & Dompet Digital", tag: "Fintech" },
  { name: "Unilever Indonesia", industry: "Fast Moving Consumer Goods (FMCG)", tag: "Multinational FMCG" },
  { name: "Bukalapak", industry: "Teknologi & Solusi Retail", tag: "Tech Commerce" },
  { name: "Blibli / GDP Venture", industry: "Ekosistem Omnichannel Perdagangan", tag: "Enterprise Retail" }
];

export default function ELearning() {
  const [selectedTrack, setSelectedTrack] = useState("Semua Bidang Pelatihan");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  // Filter List Kursus
  const filteredCourses = useMemo(() => {
    return CORPORATE_CATALOG_COURSES.filter(course => {
      const matchTrack = selectedTrack === "Semua Bidang Pelatihan" || course.track === selectedTrack;
      const matchLevel = selectedLevel === "all" || course.level.toLowerCase() === selectedLevel.toLowerCase();
      const matchSearch = searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchTrack && matchLevel && matchSearch;
    });
  }, [selectedTrack, selectedLevel, searchQuery]);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 antialiased selection:bg-[#b38867]/20 selection:text-[#7B5E4A]">
      
      {/* ============================================================== */}
      {/* 1. STRIP AKREDITASI & META DOKUMEN RESMI KATALOG (TOP BAR)     */}
      {/* ============================================================== */}
      <div className="bg-slate-900 text-slate-300 text-[11px] border-b border-slate-800 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider text-[10px] border border-amber-500/30">
              Dokumen Resmi
            </span>
            <span className="text-slate-400">
              Katalog Kurikulum & Pelatihan Talenta Perusahaan • <strong>Edisi 2026/2027</strong>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-slate-400 hidden sm:inline flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-400 inline" /> Standar Kompetensi SKKNI & Terakreditasi Industri
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button 
              onClick={() => setDownloadModalOpen(true)}
              className="text-amber-300 hover:text-white font-semibold flex items-center gap-1 transition"
            >
              <FileDown size={13} />
              <span>Unduh Brosur Katalog (PDF)</span>
            </button>
            <span className="text-slate-700">|</span>
            <button 
              onClick={() => setConsultModalOpen(true)}
              className="text-slate-300 hover:text-white font-semibold flex items-center gap-1 transition"
            >
              <Building2 size={13} />
              <span>Layanan Pelatihan Korporasi (B2B)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. HERO SECTION DENGAN UKURAN LAYAR PENUH & FONT ENTERPRISE    */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#b38867]/12 via-[#b38867]/5 to-transparent pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-gray-200/70">
        {/* Dekorasi Grid Background Halus */}
        <div className="absolute inset-0 bg-[radial-gradient(#b38867_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-5">
            {/* Badge Enterprise Category */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#b38867]/30 text-[#7B5E4A] text-xs font-bold tracking-wide shadow-2xs">
              <Sparkles size={14} className="text-[#b38867]" />
              <span>Corporate Academy & Professional E-Learning Training Catalog</span>
            </div>

            {/* Headline Utama: Font Elegan, Tajam, Proporsional */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.18] sm:leading-[1.16]">
              Katalog Kurikulum & Akselerasi <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b38867] to-[#7B5E4A]">
                Kompetensi Talenta Perusahaan
              </span>
            </h1>

            {/* Sub-headline Deskriptif Resmi */}
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed font-medium">
              Eksplorasi modul pelatihan berstandar industri yang dirancang oleh praktisi terkemuka dari Tech Unicorn dan Korporasi. Dilengkapi silabus resmi, studi kasus riil, dan sertifikat kompetensi terverifikasi.
            </p>

            {/* Search Input Bar Terintegrasi */}
            <div className="max-w-2xl mx-auto pt-4">
              <div className="relative flex items-center bg-white rounded-2xl shadow-md border border-gray-200 p-2 transition focus-within:border-[#b38867] focus-within:ring-2 focus-within:ring-[#b38867]/20">
                <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kode modul, topik kurikulum (misal: Next.js, Figma, Laravel, Docker, AI)..."
                  className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-gray-400 bg-transparent outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
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
                  <span>Cari Katalog</span>
                </button>
              </div>

              {/* Tag Populer */}
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500 flex-wrap">
                <span className="font-semibold text-slate-600">Topik Populer:</span>
                {["Next.js Fullstack", "Design System Figma", "Clean Architecture", "Docker AWS", "Data Analytics"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-2.5 py-0.5 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-[#b38867] border border-gray-200 text-[11px] font-semibold transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Metrics Bar Enterprise (4 Pilar Metrik) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto pt-8">
              <div className="p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-gray-200 shadow-2xs text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#b38867]">150+</span>
                  <Building2 size={20} className="text-[#b38867]/60" />
                </div>
                <p className="text-xs font-bold text-slate-800">Perusahaan Mitra & BUMN</p>
                <p className="text-[11px] text-slate-500">Klien korporasi aktif terdaftar</p>
              </div>

              <div className="p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-gray-200 shadow-2xs text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#b38867]">50+</span>
                  <BookCheck size={20} className="text-[#b38867]/60" />
                </div>
                <p className="text-xs font-bold text-slate-800">Modul Terstandarisasi</p>
                <p className="text-[11px] text-slate-500">Kurikulum berbasis standar industri</p>
              </div>

              <div className="p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-gray-200 shadow-2xs text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#b38867]">98.6%</span>
                  <Star size={20} className="text-[#b38867]/60" />
                </div>
                <p className="text-xs font-bold text-slate-800">CSAT Score Kepuasan</p>
                <p className="text-[11px] text-slate-500">Berdasarkan ulasan 25k+ talenta</p>
              </div>

              <div className="p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-gray-200 shadow-2xs text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#b38867]">100%</span>
                  <BadgeCheck size={20} className="text-[#b38867]/60" />
                </div>
                <p className="text-xs font-bold text-slate-800">Sertifikat Terverifikasi</p>
                <p className="text-[11px] text-slate-500">Dilengkapi nomor ID & QR Code</p>
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
              Kredibilitas & Rekam Jejak
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Dipercaya oleh Lebih dari 150+ Perusahaan Terkemuka di Indonesia
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Digunakan oleh pimpinan Human Capital dan L&D Manager untuk akselerasi kecakapan teknis talenta digital internal.
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

          {/* Banner Jaminan Akreditasi Mutu Pelatihan */}
          <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                <ShieldCheck size={24} />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">Standar Kurikulum Sesuai Kebutuhan Industri 4.0</h4>
                <p className="text-xs text-slate-400">Seluruh materi dirancang langsung oleh Subject Matter Expert aktif di industri teknologi terdepan.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button 
                onClick={() => setConsultModalOpen(true)}
                className="px-4 py-2 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-bold rounded-xl transition shadow-2xs whitespace-nowrap"
              >
                Konsultasikan Kebutuhan Tim
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
                Katalog Kurikulum Resmi
              </span>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs text-slate-500 font-medium">Tahun Ajaran 2026/2027</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Daftar Program Pelatihan & Silabus Kompetensi
            </h2>
          </div>

          {/* Quick Action Button & View Mode Toggle */}
          <div className="flex items-center gap-3 self-start md:self-end">
            {/* View Mode Toggle: Grid vs Table */}
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
              <span className="hidden sm:inline">Unduh PDF Katalog</span>
            </button>
          </div>
        </div>

        {/* Filter Navigation: Track Pills */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {TRACK_CATEGORIES.map((track) => (
              <button
                key={track}
                onClick={() => setSelectedTrack(track)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  selectedTrack === track
                    ? "bg-[#b38867] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-gray-200 hover:bg-gray-50 hover:text-slate-900"
                }`}
              >
                {track}
              </button>
            ))}
          </div>

          {/* Filter Sub-Bar: Level & Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <SlidersHorizontal size={13} className="text-[#b38867]" /> Level Kualifikasi:
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
            </div>

            <div>
              Menampilkan <strong>{filteredCourses.length}</strong> modul pelatihan terakreditasi
              {searchQuery && (
                <span> untuk pencarian "<em>{searchQuery}</em>"</span>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAMPILAN 1: GRID MODE (KARTU KATALOG KORPORAT)                 */}
        {/* ============================================================== */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Cover Banner */}
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

                    {/* Top Badges: Kode Dokumen & Level */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-300 text-[11px] font-mono font-bold tracking-wider border border-white/10">
                        {course.code}
                      </span>

                      <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-bold uppercase tracking-wider">
                        {course.level}
                      </span>
                    </div>

                    {/* Bottom Metadata di Cover */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-bold text-[11px] bg-[#b38867]/90 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                        {course.track}
                      </span>
                      <div className="flex items-center gap-1 font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                        <Star size={12} fill="currentColor" />
                        <span>{course.rating}</span>
                        <span className="text-white/70 font-normal text-[10px]">({course.enrolledCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content Katalog */}
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1">
                        <Clock size={12} className="text-[#b38867]" />
                        <span>{course.duration}</span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-snug group-hover:text-[#b38867] transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-2 font-medium">
                        {course.description}
                      </p>
                    </div>

                    {/* Target Peserta / Divisi */}
                    <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-100 text-xs space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Peserta:</p>
                      <p className="text-[11px] font-semibold text-slate-700 line-clamp-1">{course.targetAudience}</p>
                    </div>

                    {/* Instructor / Subject Matter Expert Profile */}
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {course.instructor.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {course.instructor.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 pt-0 border-t border-gray-100/80 flex items-center gap-3 mt-4">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="flex-1 py-2.5 px-3 text-xs font-bold rounded-xl bg-gray-100 hover:bg-gray-200/80 text-slate-700 border border-gray-200 transition text-center"
                  >
                    Rincian Silabus
                  </button>
                  <Link
                    to="/langganan"
                    className="py-2.5 px-4 text-xs font-bold rounded-xl bg-[#b38867] hover:bg-[#a27355] text-white shadow-2xs transition flex items-center justify-center gap-1.5"
                  >
                    <PlayCircle size={15} />
                    <span>Mulai Akses</span>
                  </Link>
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
                    <th className="py-4 px-4">Kode</th>
                    <th className="py-4 px-4 min-w-[280px]">Nama Program Kurikulum</th>
                    <th className="py-4 px-4">Bidang Pelatihan</th>
                    <th className="py-4 px-4">Tingkat</th>
                    <th className="py-4 px-4">Durasi Pelatihan</th>
                    <th className="py-4 px-4 min-w-[180px]">Instruktur / SME</th>
                    <th className="py-4 px-4 text-center">Aksi Dokumen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-amber-50/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#b38867]">
                        {c.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 text-xs">{c.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{c.targetAudience}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-slate-700 font-semibold text-[11px]">
                          {c.track}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold uppercase text-[10px] text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                          {c.level}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {c.duration}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{c.instructor.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{c.instructor.company}</p>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedCourse(c)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-slate-800 rounded-lg text-xs font-semibold transition"
                          >
                            Silabus
                          </button>
                          <Link
                            to="/langganan"
                            className="px-3 py-1.5 bg-[#b38867] hover:bg-[#a27355] text-white rounded-lg text-xs font-bold transition shadow-2xs"
                          >
                            Akses
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
        {filteredCourses.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 p-8">
            <BookOpen className="w-14 h-14 text-[#b38867] mx-auto opacity-50 mb-3" />
            <h3 className="text-lg font-bold text-slate-900">Kurikulum Tidak Ditemukan</h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
              Tidak ada modul yang cocok dengan kata kunci atau filter terpilih. Silakan ubah filter pencarian Anda.
            </p>
          </div>
        )}

        {/* ============================================================== */}
        {/* 5. SECTION SOLUSI PELATIHAN PERUSAHAAN (B2B CORPORATE)        */}
        {/* ============================================================== */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-8 mt-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Layanan Korporasi & In-House Training
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Kembangkan Kapabilitas Tim Internal dengan Kurikulum yang Disesuaikan
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Aeterna menyediakan solusi B2B Enterprise: mulai dari program Custom In-House Bootcamp, diagnostik skill gap karyawan, hingga integrasi LMS SCORM untuk kemudahan audit L&D perusahaan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => setConsultModalOpen(true)}
                className="px-6 py-3.5 bg-[#b38867] hover:bg-[#a27355] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition inline-flex items-center justify-center gap-2"
              >
                <Building2 size={16} />
                <span>Jadwalkan Demo Korporat</span>
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
              <h4 className="font-bold text-xs text-white">Customized Curriculum</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">Materi diselaraskan dengan arsitektur teknologi & framework internal perusahaan Anda.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="p-2 w-fit rounded-lg bg-emerald-400/20 text-emerald-300">
                <Users size={18} />
              </div>
              <h4 className="font-bold text-xs text-white">1-on-1 Mentor Guidance</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">Sesi bimbingan intensif dan code review berkala oleh Lead Engineer berpengalaman.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="p-2 w-fit rounded-lg bg-blue-400/20 text-blue-300">
                <Layers size={18} />
              </div>
              <h4 className="font-bold text-xs text-white">HR Analytics Dashboard</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">Laporan progres belajar, completion rate, dan skor asesmen karyawan secara transparan.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="p-2 w-fit rounded-lg bg-purple-400/20 text-purple-300">
                <Award size={18} />
              </div>
              <h4 className="font-bold text-xs text-white">Sertifikasi Standar Industri</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">Sertifikat kompetensi resmi berstandar nasional dan dapat diverifikasi langsung di LinkedIn.</p>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 6. FAQ RESMI SEPUTAR KATALOG & PELATIHAN                      */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-2xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Pertanyaan Umum Terkait Katalog & Sertifikasi
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Informasi seputar pendaftaran, metode pembelajaran, dan sertifikasi resmi Aeterna.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto text-xs">
            <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
              <h4 className="font-bold text-slate-900">Apakah modul kursus dapat diakses seumur hidup?</h4>
              <p className="text-slate-600 leading-relaxed">
                Ya, peserta yang terdaftar memiliki akses tanpa batas waktu (lifetime access) ke seluruh materi rekaman, file latihan, dan pembaruan modul tahunan.
              </p>
            </div>

            <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
              <h4 className="font-bold text-slate-900">Bagaimana proses verifikasi sertifikat kelulusan?</h4>
              <p className="text-slate-600 leading-relaxed">
                Setiap sertifikat kelulusan dilengkapi nomor registrasi unik dan QR Code yang dapat diverifikasi secara publik oleh rekruter maupun tim HR korporat.
              </p>
            </div>

            <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
              <h4 className="font-bold text-slate-900">Apakah materi bisa disesuaikan untuk pelatihan internal perusahaan?</h4>
              <p className="text-slate-600 leading-relaxed">
                Tentu. Tim Aeterna Enterprise siap menyesuaikan kurikulum, studi kasus, dan durasi sesuai dengan stack teknologi internal perusahaan Anda.
              </p>
            </div>

            <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
              <h4 className="font-bold text-slate-900">Bagaimana sistem penagihan untuk pendaftaran korporasi?</h4>
              <p className="text-slate-600 leading-relaxed">
                Kami mendukung pembayaran melalui transfer bank korporat, faktur pajak resmi, e-procurement B2B, dan perjanjian kerjasama (PKS) bertahap.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* ============================================================== */}
      {/* 7. MODAL DETAIL SILABUS & DOKUMEN KURIKULUM RESMI             */}
      {/* ============================================================== */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 bg-slate-900 text-white flex items-start justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-400 text-slate-900 uppercase">
                    {selectedCourse.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-slate-300 uppercase">
                    {selectedCourse.track}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-slate-300 uppercase">
                    Level: {selectedCourse.level}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {selectedCourse.title}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Instruktur Utama: <strong>{selectedCourse.instructor.name}</strong></span>
                  <span>•</span>
                  <span>{selectedCourse.instructor.role}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedCourse(null)}
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
                  <FileText size={15} className="text-[#b38867]" />
                  <span>Ringkasan Eksekutif Modul</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {selectedCourse.description}
                </p>
              </div>

              {/* Capaian Pembelajaran (Learning Outcomes) */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
                <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                  <CheckCheck size={16} className="text-[#b38867]" />
                  <span>Capaian Pembelajaran (Learning Outcomes):</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-amber-950 font-medium">
                  {selectedCourse.learningOutcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b38867] mt-1.5 shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Silabus Detail Pertemuan */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen size={15} className="text-[#b38867]" />
                    <span>Struktur Silabus Pembelajaran ({selectedCourse.duration})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {selectedCourse.modules.length} Sesi Pertemuan
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedCourse.modules.map((mod, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-2xl p-4 bg-white shadow-2xs space-y-2.5 hover:border-gray-300 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-slate-800 text-[10px] font-bold font-mono">
                            {mod.session}
                          </span>
                          <h5 className="font-bold text-xs text-slate-900">{mod.title}</h5>
                        </div>
                        <span className="text-[10px] font-bold text-[#b38867] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {mod.duration}
                        </span>
                      </div>

                      <ul className="space-y-1.5 pl-2 pt-1 border-t border-gray-100">
                        {mod.lessons.map((lesson, lIdx) => (
                          <li
                            key={lIdx}
                            className="flex items-center gap-2 text-xs text-slate-600 font-medium"
                          >
                            <PlayCircle size={13} className="text-[#b38867] shrink-0" />
                            <span>{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools & Teknologi yang Digunakan */}
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Terminal size={14} className="text-[#b38867]" />
                  <span>Tools & Stack Teknologi Pembelajaran</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCourse.tools.map((tool, tIdx) => (
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
                  {selectedCourse.features.map((feat, fIdx) => (
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
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
              >
                Tutup Dokumen
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    alert(`Mengunduh Silabus Resmi: ${selectedCourse.code} - ${selectedCourse.title} (.PDF)`);
                  }}
                  className="px-4 py-2.5 bg-white border border-gray-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition flex items-center gap-1.5"
                >
                  <FileDown size={14} />
                  <span>Unduh Silabus PDF</span>
                </button>
                <Link
                  to="/langganan"
                  className="px-5 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-bold rounded-xl shadow-2xs transition inline-flex items-center gap-1.5"
                >
                  <PlayCircle size={15} />
                  <span>Akses Kursus Sekarang</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. MODAL UNDUH KATALOG RESMI (PDF DOWNLOAD CONFIRMATION)       */}
      {/* ============================================================== */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#b38867] flex items-center justify-center mx-auto border border-amber-200">
              <FileDown size={24} />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">Unduh Katalog Resmi Perusahaan</h3>
              <p className="text-xs text-slate-500 font-medium">
                Dapatkan dokumen lengkap silabus kurikulum, jadwal pelatihan, dan skema paket B2B Aeterna 2026/2027 dalam format PDF.
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Nama Dokumen:</span>
                <strong className="text-slate-800">Katalog-Kurikulum-Aeterna-2026.pdf</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ukuran File:</span>
                <strong className="text-slate-800">4.8 MB</strong>
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
                  alert("Katalog Kurikulum Resmi Aeterna 2026/2027 berhasil diunduh.");
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
                  <h3 className="text-base font-bold text-slate-900">Konsultasi Pelatihan Perusahaan (B2B)</h3>
                  <p className="text-[11px] text-slate-500">Tim Enterprise Aeterna akan menghubungi Anda dalam 1x24 jam kerja.</p>
                </div>
              </div>
              <button onClick={() => setConsultModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Terima kasih. Permintaan konsultasi korporat Anda telah diterima. Tim Business Development kami akan segera menghubungi kontak yang Anda cantumkan.");
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
                  placeholder="Misal: Hendra Wijaya"
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
                    placeholder="PT Teknologi Unggul"
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-1 focus:ring-[#b38867] font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Jabatan / Divisi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="L&D Manager / Tech Lead"
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
                    placeholder="hendra@perusahaan.com"
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
                    placeholder="081234567890"
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-1 focus:ring-[#b38867] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Kebutuhan Pelatihan & Estimasi Jumlah Karyawan
                </label>
                <textarea
                  rows={2}
                  placeholder="Misal: Pelatihan Clean Architecture & Next.js untuk 15 orang Software Engineer..."
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
