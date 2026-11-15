import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  ArrowUpRight,
  Heart,
  Linkedin,
  Github,
  Youtube,
  Instagram,
  Twitter,
  CheckCircle2
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#120E0C] text-stone-300 border-t border-stone-800 relative z-30 overflow-hidden">
      
      {/* Decorative Ambient Radial Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#b38867]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Value / Trust Strip */}
      <div className="border-b border-stone-800/80 bg-stone-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#b38867]/15 text-[#b38867] flex items-center justify-center shrink-0 border border-[#b38867]/30">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="font-bold text-white">Standar Kompetensi SKKNI</p>
                <p className="text-stone-400 text-[11px]">Kurikulum berbasis standar industri dan profesi resmi</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Award size={16} />
              </div>
              <div>
                <p className="font-bold text-white">Sertifikasi Terverifikasi</p>
                <p className="text-stone-400 text-[11px]">Nomor sertifikat digital unik dapat diverifikasi online</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="font-bold text-white">Mentor Praktisi Senior</p>
                <p className="text-stone-400 text-[11px]">Bimbingan langsung dari praktisi aktif top tech company</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Kolom 1 (4 cols): Profil Perusahaan & Brand */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/program" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-amber-50/10 border border-[#b38867]/40 flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition">
                <img
                  src="/assets/Logo Sistem Mentoring.png"
                  alt="Aeterna Logo"
                  className="w-full h-full object-contain brightness-110"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-white text-lg tracking-tight">
                    Aeterna
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#b38867]/30 text-amber-300 uppercase tracking-wider border border-[#b38867]/40">
                    Academy
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 font-medium">
                  Sistem Mentoring & Pelatihan Industri
                </p>
              </div>
            </Link>

            <p className="text-xs text-stone-400 leading-relaxed font-normal">
              Aeterna adalah ekosistem bimbingan karier digital terintegrasi yang menghubungkan para pembelajar dengan praktisi industri teknologi terkemuka melalui kurikulum berbasis proyek, sesi live 1-on-1, dan materi e-learning on-demand 24/7.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-2.5">
                Ikuti Media Sosial Kami:
              </p>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-[#b38867] hover:border-[#b38867] flex items-center justify-center transition shadow-2xs"
                  title="LinkedIn Aeterna"
                >
                  <Linkedin size={15} />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-[#b38867] hover:border-[#b38867] flex items-center justify-center transition shadow-2xs"
                  title="GitHub Aeterna"
                >
                  <Github size={15} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-[#b38867] hover:border-[#b38867] flex items-center justify-center transition shadow-2xs"
                  title="YouTube Aeterna"
                >
                  <Youtube size={15} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-[#b38867] hover:border-[#b38867] flex items-center justify-center transition shadow-2xs"
                  title="Instagram Aeterna"
                >
                  <Instagram size={15} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-[#b38867] hover:border-[#b38867] flex items-center justify-center transition shadow-2xs"
                  title="X (Twitter) Aeterna"
                >
                  <Twitter size={15} />
                </a>
              </div>
            </div>
          </div>

          {/* Kolom 2 (4 cols): Alamat Kantor & Kontak Resmi */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-stone-800 pb-2">
              Informasi Alamat & Kontak Resmi
            </h4>

            <div className="space-y-3 text-xs">
              {/* Alamat Fisik Kantor */}
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#b38867] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-stone-200 block">Kantor Pusat (Headquarters):</strong>
                  <span className="text-stone-400">
                    Aeterna Tower, Lantai 18-20, Kawasan SCBD, Jl. Jend. Sudirman Kav. 52-53, Senayan, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12190, Indonesia.
                  </span>
                </div>
              </div>

              {/* Email Resmi */}
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-[#b38867] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-200 block">Layanan & Kemitraan:</strong>
                  <div className="flex flex-col gap-0.5 text-stone-400">
                    <a href="mailto:support@aeterna.id" className="hover:text-amber-300 transition">
                      support@aeterna.id (Bantuan Mentee & Mentor)
                    </a>
                    <a href="mailto:partnership@aeterna.id" className="hover:text-amber-300 transition">
                      partnership@aeterna.id (Kerja Sama Kampus & Korporasi)
                    </a>
                  </div>
                </div>
              </div>

              {/* Telepon / Hotline */}
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-[#b38867] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-200 block">Hotline Konsultasi:</strong>
                  <p className="text-stone-400">
                    +62 (021) 5088-9900 <span className="text-stone-500">•</span> WhatsApp: +62 811-2345-6789
                  </p>
                </div>
              </div>

              {/* Jam Operasional */}
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-[#b38867] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-200 block">Jam Operasional Layanan:</strong>
                  <p className="text-stone-400">
                    Senin – Jumat: 08.00 – 20.00 WIB | Sabtu: 09.00 – 15.00 WIB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom 3 (2 cols): Program & Katalog */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-stone-800 pb-2">
              Katalog Layanan
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/program" className="hover:text-amber-300 transition flex items-center justify-between">
                  <span>Program Mentoring</span>
                  <ArrowUpRight size={12} className="opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/e-learning" className="hover:text-amber-300 transition flex items-center justify-between">
                  <span>E-Learning 24/7</span>
                  <ArrowUpRight size={12} className="opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/langganan" className="hover:text-amber-300 transition flex items-center justify-between">
                  <span>Paket Langganan</span>
                  <ArrowUpRight size={12} className="opacity-60" />
                </Link>
              </li>
              <li>
                <a href="#skkni" onClick={(e) => { e.preventDefault(); alert("Kurikulum Aeterna disusun berbasis Standar Kompetensi Kerja Nasional Indonesia (SKKNI)."); }} className="hover:text-amber-300 transition">
                  Standarisasi SKKNI
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-300 transition">
                  Portal Masuk Akun
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-amber-300 transition">
                  Registrasi Mentee
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4 (2 cols): Legal & Perusahaan */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-stone-800 pb-2">
              Legal & Perusahaan
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#about" onClick={(e) => { e.preventDefault(); alert("PT Aeterna Solusi Digital — Platform Akselerasi Karier Digital."); }} className="hover:text-amber-300 transition">
                  Tentang Perusahaan
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Ketentuan Layanan resmi berlaku untuk seluruh pengguna platform Aeterna."); }} className="hover:text-amber-300 transition">
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Kebijakan Privasi menjamin perlindungan data pribadi sesuai UU PDP."); }} className="hover:text-amber-300 transition">
                  Kebijakan Privasi (PDP)
                </a>
              </li>
              <li>
                <a href="#refund" onClick={(e) => { e.preventDefault(); alert("Garansi 100% kepuasan belajar dengan syarat dan ketentuan berlaku."); }} className="hover:text-amber-300 transition">
                  Kebijakan Garansi
                </a>
              </li>
              <li>
                <a href="#mentor" onClick={(e) => { e.preventDefault(); alert("Pendaftaran mentor terbuka bagi praktisi industri berpengalaman minimal 3 tahun."); }} className="hover:text-amber-300 transition">
                  Gabung Menjadi Mentor
                </a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }} className="hover:text-amber-300 transition">
                  Pusat Bantuan & FAQ
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Credits */}
      <div className="border-t border-stone-800/80 bg-stone-950 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          
          {/* Hak Cipta Resmi */}
          <div className="flex items-center gap-2 text-center md:text-left">
            <span>
              © 2026 <strong>PT Aeterna Solusi Digital</strong>. Seluruh Hak Cipta Dilindungi Undang-Undang.
            </span>
          </div>

          {/* Kredit Pengembangan & Status Sistem */}
          <div className="flex items-center gap-4 flex-wrap justify-center text-[11px]">
            <span className="flex items-center gap-1.5 text-stone-400">
              <span>Dikembangkan dengan</span>
              <Heart size={12} className="text-red-500 fill-red-500" />
              <span>untuk Ekosistem Talenta Indonesia</span>
            </span>

            <span className="hidden sm:inline text-stone-600">•</span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistem Operasional (99.98%)
            </span>
          </div>

        </div>
      </div>

    </footer>
  );
}
