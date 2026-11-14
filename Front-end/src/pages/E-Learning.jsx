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
  Eye,
  Play,
  MonitorPlay,
  FolderDown,
  CheckSquare,
  Sparkle
} from 'lucide-react';

// ============================================================================
// DATA KATALOG MODUL VIDEO E-LEARNING ON-DEMAND (EDISI 2026/2027)
// ============================================================================
const ELEARNING_VIDEO_COURSES = [
  {
    id: 1,
    code: "AET-DSN-101",
    title: "Mastering Figma & Enterprise Design Systems",
    track: "UI/UX & Product Design",
    level: "Intermediate",
    skkniCode: "SKKNI Desain Digital Level 5",
    videoCount: 18,
    totalHours: "6.5 Jam Video Full HD",
    pdfCount: 4,
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
    trailerEmbedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ", // Sample trailer
    description: "Modul pembelajaran video on-demand komprehensif: pelajari penyusunan Design Tokens, komponen berskala besar, Figma Variables (Light & Dark Mode), dan kolaborasi developer handoff via Dev Mode.",
    learningOutcomes: [
      "Mampu merancang multi-brand Design System dengan Auto-Layout & Variants",
      "Menguasai implementasi Figma Variables (Tokens) untuk mode Dark/Light",
      "Menyusun dokumentasi UI Component Kit siap handoff via Figma Dev Mode",
      "Mengurangi technical design debt hingga 40% pada skala tim produk besar"
    ],
    tools: ["Figma Enterprise", "Zeroheight", "Storybook", "Token Studio"],
    modules: [
      { 
        session: "Bab 01", 
        title: "Fondasi & Standarisasi UI Workspace Enterprise", 
        duration: "45 Menit • 4 Video",
        lessons: [
          { name: "Pelajaran 1: Audit UI & Evaluasi Inkonsistensi Visual", length: "10:24" },
          { name: "Pelajaran 2: Frame Hierarchy vs Grouping Best Practice", length: "12:15" },
          { name: "Pelajaran 3: Menyusun Grid System & Typography Scale", length: "14:40" },
          { name: "Pelajaran 4: Checklist Starter File Figma Enterprise", length: "08:10" }
        ] 
      },
      { 
        session: "Bab 02", 
        title: "Auto-Layout Lanjutan & Responsive Components", 
        duration: "75 Menit • 5 Video",
        lessons: [
          { name: "Pelajaran 1: Prinsip Fixed, Hug, Fill pada Responsive UI", length: "16:20" },
          { name: "Pelajaran 2: Min-Width & Max-Width Constraints", length: "15:05" },
          { name: "Pelajaran 3: Hands-on: Dynamic Table Card Component", length: "22:15" },
          { name: "Pelajaran 4: Responsive Form Controls & Input States", length: "14:50" }
        ] 
      },
      { 
        session: "Bab 03", 
        title: "Component Properties, Variants & Design Tokens", 
        duration: "95 Menit • 5 Video",
        lessons: [
          { name: "Pelajaran 1: State Management Component (Hover, Active, Disabled)", length: "18:30" },
          { name: "Pelajaran 2: Figma Variables: Semantic Color & Spacing Tokens", length: "24:10" },
          { name: "Pelajaran 3: Multi-Theme Switcher (Light / Dark Mode)", length: "25:40" },
          { name: "Pelajaran 4: Export Tokens ke JSON dengan Token Studio", length: "16:20" }
        ] 
      },
      { 
        session: "Bab 04", 
        title: "Prototyping, Dev Mode & Developer Handoff", 
        duration: "65 Menit • 4 Video",
        lessons: [
          { name: "Pelajaran 1: Interactive Smart Animate untuk User Testing", length: "18:00" },
          { name: "Pelajaran 2: Dev Mode & Anotasi Spesifikasi Teknis", length: "15:30" },
          { name: "Pelajaran 3: Final Project: SaaS Enterprise Dashboard Kit", length: "26:40" }
        ] 
      }
    ],
    features: [
      "18 Modul Video Full HD 1080p (Dapat Diunduh)",
      "4 Berkas Dokumen PDF & Starter Kit Figma (.fig)",
      "Kuis Evaluasi Mandiri di Setiap Akhir Bab",
      "Sertifikat Kelulusan Digital Terverifikasi dengan QR Code"
    ]
  },
  {
    id: 2,
    code: "AET-ENG-201",
    title: "Modern Fullstack Web Application with Next.js & React",
    track: "Software Engineering",
    level: "Advanced",
    skkniCode: "SKKNI Rekayasa Perangkat Lunak Level 6",
    videoCount: 26,
    totalHours: "9.5 Jam Video Full HD",
    pdfCount: 6,
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
    description: "Kuasai ekosistem Next.js App Router, Server Components, Server Actions, validasi Zod, pemodelan database dengan Prisma ORM, dan deployment cloud dengan optimasi Core Web Vitals.",
    learningOutcomes: [
      "Menguasai arsitektur React Server Components (RSC) & Server Actions",
      "Mengintegrasikan otentikasi enterprise (OAuth2, JWT, Session Management)",
      "Mendesain schema database relasional & query optimasi dengan Prisma ORM",
      "Mencapai skor Google Lighthouse > 90 pada aplikasi web berskala enterprise"
    ],
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma ORM", "PostgreSQL"],
    modules: [
      { 
        session: "Bab 01", 
        title: "Arsitektur Next.js App Router & Server Components", 
        duration: "110 Menit • 6 Video",
        lessons: [
          { name: "Pelajaran 1: Server Components vs Client Components Boundary", length: "16:40" },
          { name: "Pelajaran 2: Nested Layouts, Templates & Route Groups", length: "19:10" },
          { name: "Pelajaran 3: Data Fetching, Caching & Revalidation Strategy", length: "24:00" },
          { name: "Pelajaran 4: Streaming SSR dengan React Suspense", length: "22:15" }
        ] 
      },
      { 
        session: "Bab 02", 
        title: "State Management & Form Handling dengan Server Actions", 
        duration: "120 Menit • 7 Video",
        lessons: [
          { name: "Pelajaran 1: Mutasi Data Tanpa API Endpoint Terpisah", length: "18:50" },
          { name: "Pelajaran 2: Validasi Form Aman dengan Zod & Action State", length: "21:30" },
          { name: "Pelajaran 3: Optimistic UI Update untuk Pengalaman Cepat", length: "23:40" }
        ] 
      },
      { 
        session: "Bab 03", 
        title: "Database Modeling, ORM & Keamanan Enterprise", 
        duration: "135 Menit • 7 Video",
        lessons: [
          { name: "Pelajaran 1: Skema Database Relasional dengan Prisma ORM", length: "22:10" },
          { name: "Pelajaran 2: Integrasi NextAuth.js dengan Role Permissions", length: "26:30" },
          { name: "Pelajaran 3: Middleware Proteksi & Mitigasi CSRF", length: "19:20" }
        ] 
      },
      { 
        session: "Bab 04", 
        title: "Performance Optimization, SEO & Cloud Deployment", 
        duration: "115 Menit • 6 Video",
        lessons: [
          { name: "Pelajaran 1: Dynamic OG Image Generation & Metadata", length: "20:15" },
          { name: "Pelajaran 2: Analisis Bundle Size & Core Web Vitals", length: "25:40" },
          { name: "Pelajaran 3: Final Project: Portal E-Commerce B2B Terintegrasi", length: "35:10" }
        ] 
      }
    ],
    features: [
      "26 Video Pembelajaran Full HD Berdurasi 9.5 Jam",
      "Source Code Repositori GitHub Bersih & Lengkap",
      "6 Modul PDF Cheat Sheet Arsitektur Web Modern",
      "Sertifikat Kompetensi Resmi dengan Akreditasi Digital"
    ]
  },
  {
    id: 3,
    code: "AET-ENG-202",
    title: "RESTful API Engineering & Clean Architecture with Laravel",
    track: "Software Engineering",
    level: "Intermediate",
    skkniCode: "SKKNI Backend Development Level 5",
    videoCount: 22,
    totalHours: "8 Jam Video Full HD",
    pdfCount: 5,
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
    description: "Pelajari Service Layer, Repository Pattern, Token Authentication Sanctum, Background Queue Workers, dan Automated Testing menggunakan Pest PHP di Laravel 11.",
    learningOutcomes: [
      "Menerapkan Clean Architecture dan Separation of Concerns di Laravel",
      "Mencegah N+1 query problem dan mengoptimasi waktu respon API < 150ms",
      "Mengamankan API dengan Sanctum, Rate Limiting, dan Scope Authorization",
      "Menulis automated testing menggunakan Pest PHP untuk menjaga kestabilan sistem"
    ],
    tools: ["Laravel", "PHP 8.3", "MySQL", "Redis", "Pest PHP", "Postman", "Swagger"],
    modules: [
      { 
        session: "Bab 01", 
        title: "Fondasi RESTful API & Standar JSON Response", 
        duration: "85 Menit • 5 Video",
        lessons: [
          { name: "Pelajaran 1: HTTP Methods, Status Codes & Error Contracts", length: "15:20" },
          { name: "Pelajaran 2: API Resources & Data Transformation Layer", length: "18:40" },
          { name: "Pelajaran 3: Custom Form Request Validation & Sanitization", length: "20:10" }
        ] 
      },
      { 
        session: "Bab 02", 
        title: "Service Layer, Repositories & Business Logic Decoupling", 
        duration: "110 Menit • 6 Video",
        lessons: [
          { name: "Pelajaran 1: Memisahkan Controller dengan Service Pattern", length: "22:15" },
          { name: "Pelajaran 2: Interface Contracts & Dependency Injection", length: "24:30" },
          { name: "Pelajaran 3: Database Transactions & Event Dispatching", length: "21:00" }
        ] 
      },
      { 
        session: "Bab 03", 
        title: "Autentikasi Aman, RBAC & API Rate Limiting", 
        duration: "95 Menit • 5 Video",
        lessons: [
          { name: "Pelajaran 1: Token Management dengan Laravel Sanctum", length: "23:45" },
          { name: "Pelajaran 2: Role-Based Permissions & Policy Guards", length: "21:20" },
          { name: "Pelajaran 3: Throttling & DDoS Protection di Public API", length: "18:10" }
        ] 
      },
      { 
        session: "Bab 04", 
        title: "Background Jobs, Caching Redis & Automated Testing", 
        duration: "120 Menit • 6 Video",
        lessons: [
          { name: "Pelajaran 1: Queue Worker untuk Notifikasi & Background Jobs", length: "24:10" },
          { name: "Pelajaran 2: In-Memory Caching dengan Redis", length: "22:40" },
          { name: "Pelajaran 3: Automated Unit & Feature Testing dengan Pest", length: "28:30" }
        ] 
      }
    ],
    features: [
      "22 Video Pembelajaran Full HD (Total 8 Jam)",
      "Postman Collection API Suite Lengkap",
      "Dokumentasi API Swagger / OpenAPI Ready",
      "Sertifikat Kompetensi Backend Terverifikasi"
    ]
  },
  {
    id: 4,
    code: "AET-DAT-301",
    title: "Enterprise Data Analytics & BI Dashboard with Python & Tableau",
    track: "Data Science & AI",
    level: "Intermediate",
    skkniCode: "SKKNI Analisis Data Level 5",
    videoCount: 20,
    totalHours: "7.5 Jam Video Full HD",
    pdfCount: 5,
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
    description: "Pelajari manipulasi data besar dengan Pandas, Exploratory Data Analysis (EDA), pembuatan dashboard eksekutif dinamis di Tableau, dan teknik data storytelling untuk keputusan bisnis.",
    learningOutcomes: [
      "Mampu melakukan Data Cleaning & Wrangling pada jutaan baris data transaksi",
      "Menyusun Exploratory Data Analysis (EDA) untuk identifikasi tren & anomali",
      "Mendesain Executive Dashboard interaktif dengan parameter kalkulasi Tableau",
      "Menyampaikan Storytelling Data kepada level C-Suite untuk pengambilan keputusan"
    ],
    tools: ["Python", "Pandas", "Tableau", "Jupyter Notebook", "SQL", "Seaborn"],
    modules: [
      { 
        session: "Bab 01", 
        title: "Pengolahan Data Korporat dengan Python & Pandas", 
        duration: "85 Menit • 5 Video",
        lessons: [
          { name: "Pelajaran 1: Impor Dataset Multi-Sumber (CSV, SQL, Excel)", length: "17:10" },
          { name: "Pelajaran 2: Handling Missing Values & Data Types", length: "19:40" },
          { name: "Pelajaran 3: Aggregation & Complex Grouping Operations", length: "22:30" }
        ] 
      },
      { 
        session: "Bab 02", 
        title: "Exploratory Data Analysis (EDA) & Statistik Deskriptif", 
        duration: "95 Menit • 5 Video",
        lessons: [
          { name: "Pelajaran 1: Distribusi Data, Outlier & Korelasi", length: "21:00" },
          { name: "Pelajaran 2: Visualisasi Seaborn untuk Analisis Tren", length: "23:15" },
          { name: "Pelajaran 3: Cohort Analysis & Customer Retention Tracking", length: "25:40" }
        ] 
      },
      { 
        session: "Bab 03", 
        title: "Pembuatan Business Dashboard Eksekutif di Tableau", 
        duration: "120 Menit • 6 Video",
        lessons: [
          { name: "Pelajaran 1: Data Modeling & Relationships di Tableau", length: "24:10" },
          { name: "Pelajaran 2: Calculated Fields & LOD Expressions", length: "28:30" },
          { name: "Pelajaran 3: Desain UI Dashboard Ramah Eksekutif", length: "26:40" }
        ] 
      },
      { 
        session: "Bab 04", 
        title: "Presentasi Insight Bisnis & Studi Kasus Nyata", 
        duration: "80 Menit • 4 Video",
        lessons: [
          { name: "Pelajaran 1: Framework Data Storytelling untuk C-Level", length: "20:10" },
          { name: "Pelajaran 2: Case Study: Revenue Optimization & Cost Saving", length: "25:30" },
          { name: "Pelajaran 3: Capstone: Executive Performance Dashboard", length: "28:40" }
        ] 
      }
    ],
    features: [
      "20 Video Pembelajaran Full HD (Total 7.5 Jam)",
      "Dataset Riil Transaksi Anonymized (.csv & .sqlite)",
      "5 Template Dashboard Tableau Siap Pakai",
      "Sertifikat Kompetensi Analis Data Resmi"
    ]
  },
  {
    id: 5,
    code: "AET-OPS-501",
    title: "Cloud Infrastructure & CI/CD Pipeline with Docker & AWS",
    track: "Cloud & DevOps",
    level: "Advanced",
    skkniCode: "SKKNI Cloud & Infrastructure Level 6",
    videoCount: 20,
    totalHours: "8.5 Jam Video Full HD",
    pdfCount: 5,
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
    description: "Standardisasi kontainerisasi aplikasi dengan Docker, deployment otomatis zero-downtime, orkestrasi cloud di AWS (EC2, S3, RDS), dan setup CI/CD pipeline via GitHub Actions.",
    learningOutcomes: [
      "Membangun container Docker yang ringan & aman dengan Multi-Stage Build",
      "Merancang pipeline CI/CD otomatis untuk testing dan automated deployment",
      "Mengelola infrastruktur cloud AWS dengan prinsip keamanan VPC & IAM",
      "Mengimplementasikan monitoring server dan logging terpusat"
    ],
    tools: ["Docker", "AWS EC2", "AWS S3", "GitHub Actions", "Nginx", "Linux Ubuntu"],
    modules: [
      { 
        session: "Bab 01", 
        title: "Kontainerisasi Aplikasi Berstandar Enterprise", 
        duration: "110 Menit • 5 Video",
        lessons: [
          { name: "Pelajaran 1: Arsitektur Docker Engine vs Virtual Machine", length: "20:30" },
          { name: "Pelajaran 2: Dockerfile Multi-Stage Build untuk Produksi", length: "24:10" },
          { name: "Pelajaran 3: Docker Compose Multi-Container (App, DB, Redis)", length: "26:40" }
        ] 
      },
      { 
        session: "Bab 02", 
        title: "Automasi CI/CD Pipeline dengan GitHub Actions", 
        duration: "115 Menit • 5 Video",
        lessons: [
          { name: "Pelajaran 1: Workflow YAML untuk Automated Testing", length: "22:15" },
          { name: "Pelajaran 2: Build & Push Docker Image ke Container Registry", length: "25:30" },
          { name: "Pelajaran 3: Zero-Downtime Deployment via SSH Action", length: "28:00" }
        ] 
      },
      { 
        session: "Bab 03", 
        title: "Konfigurasi Infrastruktur Cloud AWS Enterprise", 
        duration: "130 Menit • 5 Video",
        lessons: [
          { name: "Pelajaran 1: VPC, Subnetting & Security Group Hardening", length: "26:20" },
          { name: "Pelajaran 2: Provisioning AWS EC2 & Managed DB AWS RDS", length: "28:40" },
          { name: "Pelajaran 3: S3 Bucket Storage & CDN CloudFront", length: "24:10" }
        ] 
      },
      { 
        session: "Bab 04", 
        title: "Nginx Reverse Proxy, SSL & Server Monitoring", 
        duration: "95 Menit • 5 Video",
        lessons: [
          { name: "Pelajaran 1: Setup Nginx Reverse Proxy & Auto SSL", length: "22:40" },
          { name: "Pelajaran 2: Monitoring Resource CPU, RAM & Disk Space", length: "20:10" },
          { name: "Pelajaran 3: Capstone: Automated Deployment Production", length: "32:15" }
        ] 
      }
    ],
    features: [
      "20 Video Pembelajaran Full HD (Total 8.5 Jam)",
      "Script Workflow CI/CD YAML GitHub Actions Siap Pakai",
      "5 Modul PDF Panduan Setup Cloud AWS & Docker",
      "Sertifikat Kompetensi Cloud Infrastructure Resmi"
    ]
  },
  {
    id: 6,
    code: "AET-LEAD-601",
    title: "Agile Leadership & Enterprise Product Management",
    track: "Leadership & Management",
    level: "Advanced",
    skkniCode: "SKKNI Manajemen Produk Level 6",
    videoCount: 16,
    totalHours: "6 Jam Video Full HD",
    pdfCount: 4,
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
    description: "Pedoman manajemen produk berbasis data, penyusunan outcome-based roadmap, kerangka prioritisasi RICE, metrik OKR, dan orkestrasi tim lintas fungsi.",
    learningOutcomes: [
      "Menyusun Product Strategy & OKR yang selaras dengan target revenue perusahaan",
      "Menguasai teknik Discovery Produk & Validasi Masalah Konsumen secara cepat",
      "Memimpin ritual Agile Scrum & Sprint Planning tanpa micromanagement",
      "Menghitung unit economics, Customer Lifetime Value (CLV), dan CAC"
    ],
    tools: ["Jira Software", "Miro", "Notion Product Hub", "Mixpanel", "Confluence"],
    modules: [
      { 
        session: "Bab 01", 
        title: "Visi Produk, Product-Market Fit & Analisis Pasar", 
        duration: "75 Menit • 4 Video",
        lessons: [
          { name: "Pelajaran 1: Menyelaraskan Visi Produk dengan Strategi Bisnis", length: "18:40" },
          { name: "Pelajaran 2: Analisis Kompetitor & Value Proposition", length: "20:15" },
          { name: "Pelajaran 3: Validasi Hipotesis Sebelum Pengembangan", length: "19:20" }
        ] 
      },
      { 
        session: "Bab 02", 
        title: "Product Roadmap, Prioritisasi Fitur & OKR", 
        duration: "85 Menit • 4 Video",
        lessons: [
          { name: "Pelajaran 1: Metode Prioritisasi RICE Framework & Kano Model", length: "22:10" },
          { name: "Pelajaran 2: Menyusun Outcome-Based Roadmap yang Adaptif", length: "24:30" },
          { name: "Pelajaran 3: Menetapkan Metrik Keberhasilan Produk (OKRs)", length: "21:15" }
        ] 
      },
      { 
        session: "Bab 03", 
        title: "Eksekusi Agile & Kolaborasi Lintas Fungsi", 
        duration: "90 Menit • 4 Video",
        lessons: [
          { name: "Pelajaran 1: Menulis User Stories & Acceptance Criteria", length: "21:40" },
          { name: "Pelajaran 2: Sprint Planning, Backlog Grooming & Retrospective", length: "23:10" },
          { name: "Pelajaran 3: Manajemen Stakeholder C-Level & Resolusi Konflik", length: "25:30" }
        ] 
      },
      { 
        session: "Bab 04", 
        title: "Product Analytics, Peluncuran & Growth Strategy", 
        duration: "90 Menit • 4 Video",
        lessons: [
          { name: "Pelajaran 1: A/B Testing & Analisis Funnel Konversi Pengguna", length: "24:15" },
          { name: "Pelajaran 2: Go-To-Market (GTM) Strategy untuk Fitur Baru", length: "26:40" },
          { name: "Pelajaran 3: Final Project: Dokumen PRD Komprehensif", length: "28:10" }
        ] 
      }
    ],
    features: [
      "16 Video Pembelajaran Full HD (Total 6 Jam)",
      "Template Dokumen PRD Standar Silicon Valley",
      "Framework Prioritisasi RICE Spreadsheet Otomatis",
      "Sertifikat Manajemen Produk & Kepemimpinan Digital"
    ]
  }
];

const TRACK_CATEGORIES = [
  "Semua Bidang Pelatihan",
  "Software Engineering",
  "UI/UX & Product Design",
  "Data Science & AI",
  "Cloud & DevOps",
  "Leadership & Management"
];

// Rekomendasi Jalur Belajar Mandiri (Learning Paths)
const LEARNING_PATHS = [
  {
    title: "Jalur Mahir: Frontend Software Engineer",
    steps: ["Fondasi HTML, CSS & JS Modern", "React.js & State Management", "Next.js 15 Enterprise & TypeScript"],
    totalModules: "3 Kursus • 50+ Video",
    totalDuration: "18 Jam Video",
    badge: "Paling Populer"
  },
  {
    title: "Jalur Mahir: UI/UX Product Designer",
    steps: ["User Research & UX Discovery", "Figma Auto-Layout & Prototyping", "Multi-Brand Design Tokens & Systems"],
    totalModules: "2 Kursus • 32+ Video",
    totalDuration: "12 Jam Video",
    badge: "Rekomendasi Karier"
  },
  {
    title: "Jalur Mahir: Backend & Cloud Infrastructure",
    steps: ["Clean Architecture API Laravel", "Docker Containerization", "AWS Cloud Infrastructure & CI/CD"],
    totalModules: "3 Kursus • 46+ Video",
    totalDuration: "17 Jam Video",
    badge: "Enterprise Standard"
  }
];

export default function ELearning() {
  const [selectedTrack, setSelectedTrack] = useState("Semua Bidang Pelatihan");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [previewTrailerCourse, setPreviewTrailerCourse] = useState(null); // Modal video player trailer
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  // Filter List Kursus Video
  const filteredCourses = useMemo(() => {
    return ELEARNING_VIDEO_COURSES.filter(course => {
      const matchTrack = selectedTrack === "Semua Bidang Pelatihan" || course.track === selectedTrack;
      const matchLevel = selectedLevel === "all" || course.level.toLowerCase() === selectedLevel.toLowerCase();
      const matchSearch = searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchTrack && matchLevel && matchSearch;
    });
  }, [selectedTrack, selectedLevel, searchQuery]);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 antialiased selection:bg-[#b38867]/20 selection:text-[#7B5E4A]">
      
      {/* ============================================================== */}
      {/* 1. TOP BAR DOKUMEN & PERPUSTAKAAN MEDIA VIDEO 24/7             */}
      {/* ============================================================== */}
      <div className="bg-slate-900 text-slate-300 text-[11px] border-b border-slate-800 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold uppercase tracking-wider text-[10px] border border-indigo-500/30 flex items-center gap-1">
              <MonitorPlay size={11} /> Perpustakaan On-Demand
            </span>
            <span className="text-slate-400">
              Katalog Kursus Video Mandiri & E-Learning Praktis • <strong>Akses 24/7 Selamanya</strong>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-slate-400 hidden sm:inline flex items-center gap-1">
              <CheckCircle2 size={13} className="text-emerald-400 inline" /> Dilengkapi File Latihan & Dokumen PDF Resmi
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button 
              onClick={() => setDownloadModalOpen(true)}
              className="text-amber-300 hover:text-white font-semibold flex items-center gap-1 transition"
            >
              <FileDown size={13} />
              <span>Unduh Silabus Video (PDF)</span>
            </button>
            <span className="text-slate-700">|</span>
            <Link 
              to="/langganan"
              className="text-slate-300 hover:text-white font-semibold flex items-center gap-1 transition"
            >
              <Sparkles size={13} className="text-[#b38867]" />
              <span>Buka Akses Semua Modul</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. HERO SECTION E-LEARNING: FOKUS VIDEO PLAYER & ACCESS 24/7    */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900 text-white pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#b38867_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Kolom Kiri: Headline & Fitur On-Demand LMS */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-bold tracking-wide">
                <MonitorPlay size={14} className="text-amber-400" />
                <span>On-Demand Learning Platform: Belajar Mandiri Tanpa Batasan Waktu</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.18]">
                Perpustakaan Kursus Video <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-[#b38867]">
                  Digital & Modul Praktis 24/7
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium mx-auto lg:mx-0">
                Akses video rekaman resolusi Full HD, starter kit kode latihan, dan modul PDF berstandar industri. Putar video kapan saja, ulangi materi tersulit sesuai ritme Anda, dan klaim sertifikat digital kelulusan otomatis.
              </p>

              {/* Search Bar Input */}
              <div className="pt-2 max-w-xl mx-auto lg:mx-0">
                <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-2 transition focus-within:bg-white focus-within:text-slate-900 group">
                  <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0 group-focus-within:text-slate-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari video kursus, modul latihan (misal: Next.js, Figma, Docker)..."
                    className="w-full px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 bg-transparent outline-none font-medium group-focus-within:text-slate-900 group-focus-within:placeholder-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-1.5 text-slate-400 hover:text-white mr-2 transition group-focus-within:hover:text-slate-700"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-bold rounded-xl transition shadow-2xs shrink-0"
                  >
                    <span>Cari Modul</span>
                  </button>
                </div>
              </div>

              {/* Quick Metrics Bar E-Learning */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
                <div className="text-left">
                  <p className="text-2xl font-black text-amber-400">50+</p>
                  <p className="text-xs font-bold text-white">Kursus Video</p>
                  <p className="text-[10px] text-slate-400">Modul terstruktur</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-amber-400">250+</p>
                  <p className="text-xs font-bold text-white">Jam Pembelajaran</p>
                  <p className="text-[10px] text-slate-400">Full HD video</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-amber-400">24/7</p>
                  <p className="text-xs font-bold text-white">Akses Selamanya</p>
                  <p className="text-[10px] text-slate-400">Tanpa kedaluwarsa</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-amber-400">100%</p>
                  <p className="text-xs font-bold text-white">Sertifikat Otomatis</p>
                  <p className="text-[10px] text-slate-400">Dilengkapi QR Code</p>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Interactive Mockup (Video Player Simulator Interface) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-slate-800/90 rounded-3xl p-5 shadow-2xl border border-slate-700 space-y-4 relative backdrop-blur-md">
                
                {/* Header Simulator Video */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="ml-2 font-mono text-[10px] text-slate-400">Aeterna Video Player v2.4</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px] border border-indigo-500/30">
                    1080p HD
                  </span>
                </div>

                {/* Layar Video Frame 16:9 */}
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border border-slate-700 shadow-inner flex items-center justify-center group cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80"
                    alt="Video Player Frame"
                    className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#b38867] text-white flex items-center justify-center shadow-xl group-hover:scale-115 transition">
                      <Play size={24} className="fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Top Bar Video Status */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                    Sedang Diputar: Bab 02 • Pelajaran 3
                  </span>

                  {/* Progress Bar Video */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                    <div className="h-full bg-[#b38867] w-[68%]" />
                  </div>
                </div>

                {/* Playlist Video Simulator */}
                <div className="space-y-1.5 pt-1 text-xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daftar Modul Video:</p>
                  
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <PlayCircle size={15} className="text-[#b38867] shrink-0" />
                      <span className="font-semibold text-slate-200 truncate">1. Fondasi Auto-Layout Dinamis</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">14:20</span>
                  </div>

                  <div className="p-2.5 bg-slate-900/50 rounded-xl border border-slate-700/50 flex items-center justify-between opacity-80">
                    <div className="flex items-center gap-2 min-w-0">
                      <PlayCircle size={15} className="text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-300 truncate">2. Figma Variables & Token Studio</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">22:45</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. JALUR BELAJAR MANDIRI (RECOMMENDED LEARNING PATHS)          */}
      {/* ============================================================== */}
      <section className="bg-white border-b border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Rekomendasi Jalur Belajar (Learning Path)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Belajar Terarah dari Nol hingga Siap Kerja
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Ikuti urutan video modul yang telah disusun bertahap agar penguasaan materi menjadi runut dan maksimal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LEARNING_PATHS.map((path, idx) => (
              <div
                key={idx}
                className="bg-gray-50/80 rounded-3xl p-6 border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4 hover:border-gray-300 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-gray-200 text-slate-700">
                      {path.badge}
                    </span>
                    <span className="text-[11px] font-bold text-[#b38867]">{path.totalDuration}</span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    {path.title}
                  </h3>

                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    {path.steps.map((st, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {sIdx + 1}
                        </span>
                        <span className="font-medium">{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{path.totalModules}</span>
                  <Link
                    to="/langganan"
                    className="font-bold text-[#b38867] hover:underline flex items-center gap-1"
                  >
                    <span>Mulai Jalur</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. KATALOG UTAMA MODUL VIDEO DENGAN FILTER & VIEW TOGGLE        */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        
        {/* Header Katalog */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#b38867]">
                Katalog Modul Video
              </span>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs text-slate-500 font-medium">On-Demand Course Library 2026/2027</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Koleksi Video Pembelajaran & Modul PDF Praktis
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
                title="Tampilan Kartu Video"
              >
                <LayoutGrid size={14} />
                <span>Kartu Video</span>
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
              <span className="hidden sm:inline">Unduh PDF Silabus</span>
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

          {/* Sub Filter: Level */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2">
            <div className="flex items-center gap-2 flex-wrap">
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
              Menampilkan <strong>{filteredCourses.length}</strong> modul kursus video on-demand
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAMPILAN 1: GRID MODE (KARTU VIDEO PLAYER DENGAN HOVER PLAY)    */}
        {/* ============================================================== */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCourses.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Frame Video 16:9 dengan Tombol Play */}
                  <div 
                    onClick={() => setSelectedCourse(c)}
                    className="relative h-48 overflow-hidden bg-slate-900 cursor-pointer"
                  >
                    <img
                      src={c.coverImage}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

                    {/* Centered Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-black/60 group-hover:bg-[#b38867] text-white flex items-center justify-center backdrop-blur-md shadow-lg group-hover:scale-115 transition duration-300">
                        <Play size={20} className="fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Top Badges: Kode Dokumen & Durasi Video */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-300 text-[11px] font-mono font-bold tracking-wider border border-white/10">
                        {c.code}
                      </span>

                      <span className="px-2.5 py-1 rounded-lg bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                        <MonitorPlay size={11} />
                        <span>{c.videoCount} Video</span>
                      </span>
                    </div>

                    {/* Bottom Metadata di Cover */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-bold text-[11px] bg-[#b38867]/90 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                        {c.track}
                      </span>
                      <div className="flex items-center gap-1 font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                        <Star size={12} fill="currentColor" />
                        <span>{c.rating}</span>
                        <span className="text-white/70 font-normal text-[10px]">({c.enrolledCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content Kursus Video */}
                  <div className="p-6 space-y-4">
                    {/* Badge Durasi & Dokumen Downloadable */}
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                      <span className="flex items-center gap-1 text-slate-700 font-bold">
                        <Clock size={12} className="text-[#b38867]" />
                        <span>{c.totalHours}</span>
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <FolderDown size={12} />
                        <span>{c.pdfCount} Modul PDF</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-[#b38867] transition-colors line-clamp-2">
                        {c.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-2 font-medium">
                        {c.description}
                      </p>
                    </div>

                    {/* Instructor Info */}
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <img
                        src={c.instructor.avatar}
                        alt={c.instructor.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{c.instructor.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{c.instructor.role}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 pt-0 border-t border-gray-100/80 mt-2">
                  <div className="pt-3 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCourse(c)}
                      className="flex-1 py-2.5 px-3 text-xs font-bold rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 border border-gray-200 transition text-center"
                    >
                      Daftar Video & Silabus
                    </button>
                    <Link
                      to="/langganan"
                      className="py-2.5 px-4 text-xs font-bold rounded-xl bg-[#b38867] hover:bg-[#a27355] text-white shadow-2xs transition inline-flex items-center gap-1.5"
                    >
                      <PlayCircle size={14} />
                      <span>Buka Akses</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAMPILAN 2: TABLE MODE (MATRIKS MODUL RESMI)                   */}
        {/* ============================================================== */}
        {viewMode === "table" && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-900 text-white uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-4 px-4">Kode</th>
                    <th className="py-4 px-4 min-w-[280px]">Judul Modul Kursus</th>
                    <th className="py-4 px-4">Bidang</th>
                    <th className="py-4 px-4">Jumlah Video</th>
                    <th className="py-4 px-4">Total Durasi</th>
                    <th className="py-4 px-4 min-w-[180px]">Instruktur</th>
                    <th className="py-4 px-4 text-center">Aksi</th>
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
                      <td className="py-3.5 px-4 font-bold text-indigo-700">
                        {c.videoCount} Video HD
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {c.totalHours}
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

      </section>

      {/* ============================================================== */}
      {/* 5. MODAL PLAYLIST VIDEO & SILABUS LENGKAP                       */}
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
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/80 text-white uppercase flex items-center gap-1">
                    <MonitorPlay size={10} /> {selectedCourse.videoCount} Video Modul
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {selectedCourse.title}
                </h3>
                <p className="text-xs text-slate-300 flex items-center gap-2">
                  <span>Instruktur: <strong>{selectedCourse.instructor.name}</strong></span>
                  <span>•</span>
                  <span>Total Durasi: {selectedCourse.totalHours}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body: Playlist Bab & Pelajaran Video */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm">
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText size={15} className="text-[#b38867]" />
                  <span>Tentang Kursus Video Ini</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {selectedCourse.description}
                </p>
              </div>

              {/* Playlist Bab Video Lengkap */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <MonitorPlay size={15} className="text-indigo-600" />
                    <span>Daftar Playlist Video Pelajaran</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {selectedCourse.modules.length} Bab Pembelajaran
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedCourse.modules.map((mod, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-2xl p-4 bg-white shadow-2xs space-y-2 hover:border-gray-300 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold font-mono">
                            {mod.session}
                          </span>
                          <h5 className="font-bold text-xs text-slate-900">{mod.title}</h5>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 bg-gray-100 px-2 py-0.5 rounded">
                          {mod.duration}
                        </span>
                      </div>

                      <div className="space-y-1.5 pl-2 pt-2 border-t border-gray-100">
                        {mod.lessons.map((ls, lIdx) => (
                          <div
                            key={lIdx}
                            className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-lg transition text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <PlayCircle size={14} className="text-[#b38867] shrink-0" />
                              <span className="text-slate-700 font-medium">{ls.name}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">{ls.length}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fasilitas Downloadable */}
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award size={15} className="text-emerald-600" />
                  <span>Fasilitas Kursus On-Demand</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {selectedCourse.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
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
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
              >
                Tutup
              </button>
              <Link
                to="/langganan"
                className="px-6 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-bold rounded-xl shadow-2xs transition inline-flex items-center gap-1.5"
              >
                <PlayCircle size={15} />
                <span>Buka Akses Video Sekarang</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal Unduh PDF Silabus */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-200">
              <FileDown size={24} />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">Unduh Silabus Modul E-Learning</h3>
              <p className="text-xs text-slate-500 font-medium">
                Dapatkan rincian seluruh modul video, daftar bab pelajaran, dan materi downloadable dalam format PDF.
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Nama Dokumen:</span>
                <strong className="text-slate-800">Silabus-ELearning-Aeterna-2026.pdf</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Akses:</span>
                <strong className="text-slate-800">On-Demand Video 24/7</strong>
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
                  alert("Silabus Modul E-Learning Aeterna 2026/2027 berhasil diunduh.");
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

    </div>
  );
}
