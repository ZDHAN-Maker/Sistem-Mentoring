// src/data/langgananDataMinimalis.js

export const paketDataMinimalis = [
  {
    title: "Paket Gratis",
    price: "Rp 0 / selamanya",
    icon: "📦", // Ikon: Kotak
    features: [
      { text: "Akses materi gratis", available: true },
      { text: "Mentoring pribadi", available: false },
      { text: "Sertifikat", available: false },
    ],
    buttonText: "[Mulai]",
    buttonStyle: "bg-[#7B5E4A] hover:bg-[#6A503F]", 
    cardStyle: "bg-white border border-[#7B5E4A]/50",
  },
  {
    title: "Paket Premium",
    price: "Rp 79.000 / bulan",
    icon: "👑", // Ikon: Mahkota
    features: [
      { text: "Semua kelas premium", available: true },
      { text: "Download modul", available: true },
      { text: "Sertifikat akhir", available: true },
    ],
    buttonText: "[Beli Sekarang]",
    buttonStyle: "bg-[#F39C12] hover:bg-[#E08E0B]", 
    cardStyle: "bg-white border border-[#F39C12]/50",
  },
  {
    title: "Paket Exclusive",
    price: "Rp 199.000 / bulan", 
    icon: "💎", 
    features: [
      { text: "Semua fitur Premium", available: true },
      { text: "Mentoring 1-on-1 Bulanan", available: true },
      { text: "Akses ke Grup Mastermind", available: true },
      { text: "Sertifikat Eksklusif", available: true },
    ],
    buttonText: "[Daftar Exclusive]",
    buttonStyle: "bg-[#2C3E50] hover:bg-[#1A252F]", 
    cardStyle: "bg-white border border-[#2C3E50]/50", 
  },
];