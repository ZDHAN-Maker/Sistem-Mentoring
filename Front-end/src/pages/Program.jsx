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
  GraduationCap
} from 'lucide-react';

const PROGRAM_CATALOG = [
  {
    id: 1,
    title: "UI/UX Design: Dari Riset Pengguna hingga Interactive Prototype",
    category: "UI/UX Design",
    level: "Beginner",
    duration: "4 Minggu (8 Sesi)",
    rating: 4.9,
    reviewsCount: 142,
    mentor: {
      name: "Angela Putri",
      role: "Lead Product Designer at Tokopedia",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 350.000",
    price: "Rp 199.000",
    description: "Pelajari framework design thinking, pembuatan wireframe di Figma, design system, usability testing, dan penyusunan case study portofolio yang menarik recruiter.",
    syllabus: [
      "Pengenalan UX Research & Problem Definition",
      "Information Architecture & Wireframing",
      "Visual Hierarchy & Modern UI in Figma",
      "Design System, Components & Auto-layout",
      "Interactive Prototyping & Usability Testing",
      "Case Study Presentation & Portfolio Review"
    ],
    features: ["Mentoring 1-on-1", "Review Portofolio", "Sertifikat Resmi", "Akses Komunitas UI/UX"]
  },
  {
    id: 2,
    title: "Full-Stack Web Development: React, Laravel & RESTful API",
    category: "Web Development",
    level: "Intermediate",
    duration: "6 Minggu (12 Sesi)",
    rating: 4.95,
    reviewsCount: 215,
    mentor: {
      name: "Rudi Hartono",
      role: "Senior Fullstack Engineer at Gojek",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 450.000",
    price: "Rp 249.000",
    description: "Bangun aplikasi web skala produksi dari nol menggunakan React 18, TailwindCSS, Laravel REST API, autentikasi Sanctum, dan deploy ke cloud server.",
    syllabus: [
      "Arsitektur Web Modern & Setup Lingkungan",
      "State Management & Hooks pada React Modern",
      "Backend REST API & Eloquent ORM Laravel",
      "Autentikasi Token, Role Permission & Security",
      "Integrasi API & State Sinkronisasi Frontend",
      "Deployment, CI/CD Pipeline & Optimasi Performa"
    ],
    features: ["Live Coding Session", "Code Review Baris demi Baris", "Sertifikat Resmi", "Proyek Nyata GitHub"]
  },
  {
    id: 3,
    title: "Data Science & Machine Learning: Analisis Data Praktis Industri",
    category: "Data & AI",
    level: "Beginner",
    duration: "5 Minggu (10 Sesi)",
    rating: 4.88,
    reviewsCount: 168,
    mentor: {
      name: "David Pratama",
      role: "Staff Data Scientist at Traveloka",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 390.000",
    price: "Rp 219.000",
    description: "Kuasai Python untuk data wrangling, visualisasi data bisnis, statistika terapan, dan pembuatan model machine learning prediktif yang siap pakai.",
    syllabus: [
      "Fondasi Python untuk Data & Numpy/Pandas",
      "Exploratory Data Analysis (EDA) & Seaborn",
      "Statistika Terapan & Pengujian Hipotesis",
      "Supervised Learning: Regresi & Klasifikasi",
      "Unsupervised Learning & Clustering Model",
      "Deployment Model dengan Streamlit"
    ],
    features: ["Dataset Nyata Perusahaan", "Konsultasi Karier Data", "Sertifikat Resmi", "Template Analisis"]
  },
  {
    id: 4,
    title: "Modern Frontend Engineering: React, Next.js & TypeScript",
    category: "Web Development",
    level: "Advanced",
    duration: "4 Minggu (8 Sesi)",
    rating: 4.92,
    reviewsCount: 94,
    mentor: {
      name: "Fajar Nugraha",
      role: "Frontend Architect at Shopee",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 380.000",
    price: "Rp 229.000",
    description: "Pendalaman arsitektur frontend skala besar: Server Components, TypeScript generic, performa rendering, clean code, dan automated testing.",
    syllabus: [
      "Advanced TypeScript Patterns & Generics",
      "Next.js App Router & Server Components",
      "Custom Hooks & Complex State Management",
      "Web Performance Metrics & SEO Optimization",
      "Testing dengan Jest & React Testing Library",
      "Monorepo Architecture & Microfrontend"
    ],
    features: ["Arsitektur Skala Besar", "Code Review Mendalam", "Sertifikat Resmi", "Akses Source Code"]
  },
  {
    id: 5,
    title: "Mobile App Development: Flutter & Clean Architecture",
    category: "Mobile Apps",
    level: "Intermediate",
    duration: "5 Minggu (10 Sesi)",
    rating: 4.87,
    reviewsCount: 110,
    mentor: {
      name: "Rian Setiawan",
      role: "Mobile Lead at Bukalapak",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 370.000",
    price: "Rp 209.000",
    description: "Bangun aplikasi Android & iOS dengan Flutter, state management BLoC, integrasi REST API, penyimpanan lokal, dan publish ke Google Play Store.",
    syllabus: [
      "Dart Deep Dive & Flutter Widget Ecosystem",
      "Responsive Layouts & Motion Animations",
      "State Management dengan BLoC / Cubit",
      "Clean Architecture & Dependency Injection",
      "Local Storage (Hive/SQLite) & Offline First",
      "Rilis Aplikasi ke Google Play Store"
    ],
    features: ["Cross Platform iOS & Android", "Bimbingan Publish App", "Sertifikat Resmi", "Source Code Lengkap"]
  },
  {
    id: 6,
    title: "Backend Architecture & Microservices: Go & Docker",
    category: "Backend Engineering",
    level: "Advanced",
    duration: "6 Minggu (12 Sesi)",
    rating: 4.94,
    reviewsCount: 88,
    mentor: {
      name: "Haryanto Santoso",
      role: "Principal Backend Engineer",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80",
    originalPrice: "Rp 499.000",
    price: "Rp 279.000",
    description: "Pelajari konkurensi di Go, gRPC, message broker (RabbitMQ/Kafka), containerisasi Docker, database indexing, dan perancangan arsitektur microservices.",
    syllabus: [
      "Go Concurrency, Goroutines & Channels",
      "gRPC vs REST Protocol & Protobuf",
      "Database Sharding & Query Optimization",
      "Event-Driven Architecture & Message Broker",
      "Dockerization, Container Networking & Swarm",
      "Logging, Monitoring & Tracing Terdistribusi"
    ],
    features: ["High Concurrency Mentoring", "Studi Kasus FinTech", "Sertifikat Resmi", "Bimbingan Tech Interview"]
  }
];

const CATEGORIES = ["Semua", "Web Development", "UI/UX Design", "Data & AI", "Mobile Apps", "Backend Engineering"];
const LEVELS = ["Semua Level", "Beginner", "Intermediate", "Advanced"];

function Program() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedLevel, setSelectedLevel] = useState("Semua Level");
  const [sortBy, setSortBy] = useState("popular"); // 'popular' | 'rating' | 'price'
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Filter & Urutkan
  const filteredPrograms = useMemo(() => {
    return PROGRAM_CATALOG.filter((p) => {
      const matchSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCat = selectedCategory === "Semua" || p.category === selectedCategory;
      const matchLevel = selectedLevel === "Semua Level" || p.level === selectedLevel;

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
    <div className="min-h-screen bg-stone-50/70 text-gray-800 pb-20">
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-br from-[#2D241E] via-[#3D312A] to-[#1E1713] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#b38867]/30 text-[#f5dfce] border border-[#b38867]/40 mb-4">
              <Sparkles size={13} className="text-[#e2be9b]" />
              Katalog Mentoring Industri Terbaik
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Belajar Bersama Mentor Profesional
            </h1>
            <p className="mt-4 text-[#d9cac0] text-sm md:text-base leading-relaxed">
              Bergabung dengan lebih dari 1.5 juta anggota yang telah belajar bersama di Aeterna. Kembangkan keterampilan praktis dan raih karier impianmu melalui bimbingan intensif 1-on-1.
            </p>

            {/* Statistik Ringkas */}
            <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center md:text-left">
              <div>
                <p className="text-2xl font-black text-[#e8c7a7]">100+</p>
                <p className="text-xs text-[#b8a69a]">Mentor Expert</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#e8c7a7]">4.9 / 5.0</p>
                <p className="text-xs text-[#b8a69a]">Rata-rata Rating</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#e8c7a7]">95%</p>
                <p className="text-xs text-[#b8a69a]">Tingkat Kepuasan</p>
              </div>
            </div>
          </div>

          {/* Banner Image / Card Ilustrasi */}
          <div className="w-full md:w-[420px] bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-2xl relative">
            <div className="rounded-2xl overflow-hidden mb-4 relative aspect-video bg-gray-800">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
                alt="Mentoring Session"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-semibold px-2.5 py-1 bg-[#b38867] text-white rounded-lg">
                  Sesi Live 1-on-1
                </span>
              </div>
            </div>
            <h3 className="font-bold text-white text-base">Kurikulum Berorientasi Portofolio</h3>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              Dapatkan bimbingan langsung, review kode baris demi baris, dan feedback komprehensif dari mentor pilihanmu.
            </p>
          </div>
        </div>
      </section>

      {/* Main Filter & Katalog Area */}
      <section className="max-w-6xl mx-auto px-4 -mt-6">
        {/* Search & Filter Bar Floating */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-200/80 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama program, topik keahlian, atau nama mentor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-[#b38867] focus:border-[#b38867] outline-none transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Level Filter */}
            <div className="w-full md:w-48">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full py-3 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:ring-1 focus:ring-[#b38867]"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="w-full md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-3 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:ring-1 focus:ring-[#b38867]"
              >
                <option value="popular">Paling Populer</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="price">Harga Termurah</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    active
                      ? "bg-[#b38867] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-sm text-gray-600 font-medium">
            Menampilkan <span className="font-bold text-gray-900">{filteredPrograms.length}</span> program mentoring
          </p>
          {(searchTerm || selectedCategory !== "Semua" || selectedLevel !== "Semua Level") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Semua");
                setSelectedLevel("Semua Level");
              }}
              className="text-xs text-[#b38867] font-semibold hover:underline"
            >
              Reset Semua Filter
            </button>
          )}
        </div>

        {/* Katalog Grid Card */}
        {filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 items-stretch">
            {filteredPrograms.map((item) => {
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Thumbnail */}
                  <div>
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-white/95 text-gray-800 rounded-lg shadow-sm">
                          {item.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg shadow-sm ${
                          item.level === "Beginner" 
                            ? "bg-emerald-500 text-white" 
                            : item.level === "Intermediate" 
                            ? "bg-amber-500 text-white" 
                            : "bg-purple-600 text-white"
                        }`}>
                          {item.level}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      {/* Rating & Durasi */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2.5">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star size={14} fill="currentColor" />
                          <span>{item.rating}</span>
                          <span className="text-gray-400 font-normal">({item.reviewsCount} ulasan)</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock size={13} />
                          <span>{item.duration}</span>
                        </div>
                      </div>

                      {/* Judul */}
                      <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-[#b38867] transition-colors">
                        {item.title}
                      </h3>

                      {/* Mentor Info */}
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                        <img
                          src={item.mentor.avatar}
                          alt={item.mentor.name}
                          className="w-9 h-9 rounded-full object-cover border border-gray-200"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">{item.mentor.name}</p>
                          <p className="text-[11px] text-gray-500 truncate">{item.mentor.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Harga & Action */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-gray-400 line-through block">
                          {item.originalPrice}
                        </span>
                        <span className="text-lg font-extrabold text-[#7B5E4A]">
                          {item.price}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedProgram(item)}
                        className="px-4 py-2 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1.5"
                      >
                        <span>Lihat Detail</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 max-w-md mx-auto">
            <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
            <h4 className="text-base font-bold text-gray-800">Program Tidak Ditemukan</h4>
            <p className="text-xs text-gray-500 mt-1">
              Tidak ada program yang sesuai dengan kata kunci atau filter yang Anda pilih.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Semua");
                setSelectedLevel("Semua Level");
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#b38867] rounded-xl hover:bg-[#a27355]"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </section>

      {/* Modal Detail Program */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header Cover */}
            <div className="relative aspect-video max-h-56 w-full overflow-hidden bg-gray-900">
              <img
                src={selectedProgram.coverImage}
                alt={selectedProgram.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <button
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-2.5 py-0.5 text-xs font-bold bg-[#b38867] rounded-md uppercase tracking-wider">
                  {selectedProgram.category} • {selectedProgram.level}
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold mt-1.5 leading-snug">
                  {selectedProgram.title}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto text-sm">
              {/* Mentor Bar */}
              <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <img
                  src={selectedProgram.mentor.avatar}
                  alt={selectedProgram.mentor.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <p className="text-xs text-gray-500">Mentor Pembimbing:</p>
                  <p className="font-bold text-gray-900 text-sm">{selectedProgram.mentor.name}</p>
                  <p className="text-xs text-[#b38867] font-medium">{selectedProgram.mentor.role}</p>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Tentang Program Ini</h4>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  {selectedProgram.description}
                </p>
              </div>

              {/* Silabus */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-3">Silabus & Materi Bimbingan:</h4>
                <div className="space-y-2">
                  {selectedProgram.syllabus.map((materi, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2.5 bg-gray-50 rounded-xl text-xs">
                      <span className="w-5 h-5 rounded-full bg-[#b38867]/20 text-[#b38867] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 font-medium">{materi}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fasilitas */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-2">Fasilitas yang Didapatkan:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProgram.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 line-through block">{selectedProgram.originalPrice}</span>
                <span className="text-2xl font-black text-[#7B5E4A]">{selectedProgram.price}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-200 rounded-xl transition"
                >
                  Tutup
                </button>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-1.5"
                >
                  <span>Daftar Program Sekarang</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Program;
