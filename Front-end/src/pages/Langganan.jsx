import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../axiosInstance";
import { 
  Check, 
  X, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  Zap, 
  Award, 
  Users,
  ArrowRight,
  RefreshCw,
  ChevronDown,
  Layers,
  GraduationCap
} from "lucide-react";
import PlanBadgeIcon from "../components/PlanBadgeIcon";
import { paketDataMinimalis } from "../data/langganan";

export default function Langganan() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' | 'yearly'
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const res = await api.get("/subscription-plans");
        if (res.data?.data && res.data.data.length > 0) {
          setPlans(res.data.data);
        } else {
          setPlans(paketDataMinimalis);
        }
      } catch (err) {
        console.warn("Gagal memuat paket dari API, menggunakan fallback lokal:", err);
        setPlans(paketDataMinimalis);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const calculatePrice = (plan) => {
    if (!plan.numeric_price || plan.numeric_price === 0) {
      return plan.price || "Gratis";
    }

    if (billingCycle === "yearly") {
      const discounted = Math.round(plan.numeric_price * 0.8);
      return `Rp ${discounted.toLocaleString("id-ID")}`;
    }

    return `Rp ${plan.numeric_price.toLocaleString("id-ID")}`;
  };

  const getTierDetails = (plan, index) => {
    const lvlNum = index + 1;
    if (lvlNum === 1) {
      return {
        levelCode: "01",
        tierTitle: "Level 1: Dasar",
        subtitle: "Akses Belajar Mandiri",
        badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
        ctaText: "Mulai Belajar Gratis",
        ctaStyle: "border-2 border-slate-800 text-slate-800 hover:bg-slate-900 hover:text-white",
      };
    }
    if (lvlNum === 2) {
      return {
        levelCode: "02",
        tierTitle: "Level 2: Profesional",
        subtitle: "Bimbingan Review Tugas",
        badgeColor: "bg-[#b38867]/15 text-[#7B5E4A] border-[#b38867]/30",
        ctaText: "Pilih Paket Level 2",
        ctaStyle: "bg-[#b38867] hover:bg-[#a27355] text-white shadow-md hover:shadow-lg",
      };
    }
    return {
      levelCode: "03",
      tierTitle: "Level 3: Eksklusif",
      subtitle: "Mentoring 1-on-1 Intensif",
      badgeColor: "bg-slate-900 text-amber-300 border-slate-800",
      ctaText: "Daftar Paket Level 3",
      ctaStyle: "bg-slate-900 hover:bg-black text-white shadow-md hover:shadow-lg",
    };
  };

  const comparisonFeatures = [
    { name: "Akses Semua Modul E-Learning & Silabus", lvl1: true, lvl2: true, lvl3: true },
    { name: "Forum Komunitas Diskusi Belajar", lvl1: true, lvl2: true, lvl3: true },
    { name: "Download Source Code & Asset Proyek", lvl1: false, lvl2: true, lvl3: true },
    { name: "Review & Evaluasi Tugas oleh Senior Mentor", lvl1: false, lvl2: true, lvl3: true },
    { name: "Sesi Live Mentoring 1-on-1 Bulanan", lvl1: false, lvl2: false, lvl3: true },
    { name: "Akses Grup Mastermind & Relasi Karier", lvl1: false, lvl2: false, lvl3: true },
    { name: "Bimbingan Persiapan Interview & Portofolio", lvl1: false, lvl2: false, lvl3: true },
    { name: "Sertifikat Kompetensi Digital Resmi SKKNI", lvl1: false, lvl2: true, lvl3: true },
  ];

  const faqs = [
    {
      q: "Apa perbedaan mendasar antara Level 1, Level 2, dan Level 3?",
      a: "Level 1 ditujukan bagi Anda yang ingin belajar mandiri dengan materi dasar gratis. Level 2 memberikan akses materi lengkap serta review penugasan dari mentor. Sedangkan Level 3 memberikan sesi tatap muka mentoring 1-on-1 pribadi serta bedah portofolio karier eksklusif.",
    },
    {
      q: "Apakah saya bisa berganti level langganan kapan saja?",
      a: "Tentu saja! Anda dapat melakukan upgrade atau downgrade level paket kapan pun langsung dari dashboard akun Anda. Perubahan akan berlaku pada siklus penagihan berikutnya.",
    },
    {
      q: "Bagaimana mekanisme penjadwalan mentoring 1-on-1 pada Level 3?",
      a: "Setelah terdaftar di Level 3, Anda akan memilih mentor praktisi yang sesuai dengan minat dan dapat langsung memilih jadwal sesi video call privat melalui kalender interaktif di dashboard mentee.",
    },
    {
      q: "Metode pembayaran apa saja yang diterima?",
      a: "Kami menerima pembayaran melalui Transfer Bank Virtual Account (BCA, Mandiri, BNI, BRI), E-Wallet (GoPay, OVO, ShopeePay, Dana), serta Kartu Kredit/Debit Visa & MasterCard.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-slate-50 to-stone-100 text-slate-800">
      
      {/* ============================================================== */}
      {/* 1. HERO SECTION                                                */}
      {/* ============================================================== */}
      <section className="pt-16 pb-12 px-4 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#b38867]/10 text-[#7B5E4A] border border-[#b38867]/20 mb-4 shadow-2xs">
          <Layers size={13} className="text-[#b38867]" />
          <span>Tingkatan Paket Pembelajaran Terstruktur</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Pilih Level Paket Mentoring Sesuai Target Kariermu
        </h1>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
          Dapatkan bimbingan kurikulum industri, review penugasan nyata, dan pendampingan 1-on-1 bersama praktisi terkemuka dari level dasar hingga profesional.
        </p>

        {/* Interactive Billing Toggle */}
        <div className="mt-8 inline-flex items-center p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              billingCycle === "monthly"
                ? "bg-slate-900 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tagihan Bulanan
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              billingCycle === "yearly"
                ? "bg-slate-900 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Tagihan Tahunan</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#b38867] text-white">
              Hemat 20%
            </span>
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. PRICING CARDS GRID (DENGAN INDIKATOR LEVEL)                 */}
      {/* ============================================================== */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="p-16 flex items-center justify-center text-slate-500">
            <RefreshCw className="animate-spin text-[#b38867] mr-3" size={24} />
            <span className="font-medium">Memuat paket level mentoring...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((paket, index) => {
              const isPopular = paket.is_popular || index === 1;
              const tier = getTierDetails(paket, index);

              return (
                <div
                  key={index}
                  className={`bg-white rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                    isPopular
                      ? "border-2 border-[#b38867] shadow-xl md:-translate-y-2 ring-4 ring-[#b38867]/10"
                      : "border border-slate-200 shadow-sm hover:shadow-lg"
                  }`}
                >
                  {/* Floating Badge untuk Paket Populer */}
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#b38867] text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                      <Sparkles size={12} /> Paling Diminati
                    </div>
                  )}

                  <div>
                    {/* Header Card: Indikator Level (Pengganti Icon Kotak/Mahkota/Permata) */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        <PlanBadgeIcon level={index + 1} title={paket.title} size="lg" />
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                            Tingkat Langganan
                          </span>
                          <span className="text-sm font-extrabold text-slate-900">
                            {tier.tierTitle}
                          </span>
                        </div>
                      </div>

                      {isPopular && (
                        <span className="text-[11px] font-bold text-[#b38867] bg-[#b38867]/10 px-3 py-1 rounded-full border border-[#b38867]/20 shrink-0">
                          Rekomendasi
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-slate-900">{paket.title}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">{tier.subtitle}</p>

                    {/* Harga */}
                    <div className="mt-4 mb-6">
                      <div className="flex items-baseline gap-1.5">
                        <p className="text-3xl font-black text-[#7B5E4A] tracking-tight">
                          {calculatePrice(paket)}
                        </p>
                        {paket.numeric_price > 0 && (
                          <span className="text-xs font-semibold text-slate-500">/ bulan</span>
                        )}
                      </div>
                      {billingCycle === "yearly" && paket.numeric_price > 0 && (
                        <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                          ✓ Ditagih tahunan (hemat 20%)
                        </p>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 pt-5 border-t border-slate-100">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Fasilitas yang Didapat:
                      </p>
                      {paket.features && paket.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-start gap-2.5">
                          <span
                            className={`mt-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                              feature.available
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {feature.available ? <Check size={11} strokeWidth={3} /> : <X size={11} />}
                          </span>
                          <span
                            className={`text-xs sm:text-sm leading-snug ${
                              feature.available ? "text-slate-700 font-medium" : "text-slate-400 line-through"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <Link
                      to="/register"
                      className={`w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${tier.ctaStyle}`}
                    >
                      <span>{paket.button_text || tier.ctaText}</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 3. MATRIKS PERBANDINGAN FITUR LEVEL                            */}
      {/* ============================================================== */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-8">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#b38867] bg-[#b38867]/10 px-3 py-1 rounded-full border border-[#b38867]/20">
            Perbandingan Detail
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Matriks Perbandingan Fasilitas Antar Level
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lihat fasilitas lengkap yang Anda peroleh pada masing-masing tingkatan level.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold text-slate-700">
                  <th className="py-4 px-6">Fasilitas Mentoring</th>
                  <th className="py-4 px-4 text-center">
                    <span className="block text-slate-900 font-black">Level 1</span>
                    <span className="text-[10px] text-slate-400 font-medium">Dasar</span>
                  </th>
                  <th className="py-4 px-4 text-center bg-amber-50/40 border-x border-amber-100">
                    <span className="block text-[#7B5E4A] font-black">Level 2</span>
                    <span className="text-[10px] text-[#b38867] font-medium">Profesional</span>
                  </th>
                  <th className="py-4 px-4 text-center">
                    <span className="block text-slate-900 font-black">Level 3</span>
                    <span className="text-[10px] text-slate-400 font-medium">Eksklusif</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {comparisonFeatures.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-6 font-medium text-slate-800">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.lvl1 ? (
                        <Check size={16} className="text-emerald-600 inline" strokeWidth={3} />
                      ) : (
                        <span className="text-slate-300 font-mono text-base">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center bg-amber-50/20 border-x border-amber-100">
                      {item.lvl2 ? (
                        <Check size={16} className="text-emerald-600 inline" strokeWidth={3} />
                      ) : (
                        <span className="text-slate-300 font-mono text-base">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.lvl3 ? (
                        <Check size={16} className="text-emerald-600 inline" strokeWidth={3} />
                      ) : (
                        <span className="text-slate-300 font-mono text-base">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. TIGA PILAR NILAI AETERNA                                    */}
      {/* ============================================================== */}
      <section className="bg-white border-y border-slate-200 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Kenapa Memilih Ekosistem Aeterna Mentoring?
            </h2>
            <p className="text-slate-600 mt-2 text-xs sm:text-sm font-medium">
              Dirancang khusus untuk menjembatani kesenjangan antara teori akademis dengan kebutuhan nyata industri teknologi masa kini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col items-start shadow-2xs">
              <div className="p-3 bg-[#b38867] text-white rounded-xl mb-4 shadow-sm">
                <Users size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Mentor Praktisi Industri</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Belajar langsung dari para engineer dan tech lead yang aktif berkarier di perusahaan teknologi terkemuka.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col items-start shadow-2xs">
              <div className="p-3 bg-blue-600 text-white rounded-xl mb-4 shadow-sm">
                <Zap size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Review Kode & Tugas Riil</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Setiap tugas proyek yang Anda kumpulkan akan direview baris per baris dengan feedback terarah untuk meningkatkan standar kualitas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col items-start shadow-2xs">
              <div className="p-3 bg-emerald-600 text-white rounded-xl mb-4 shadow-sm">
                <Award size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Sertifikat Standar SKKNI</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Raih sertifikat kompetensi resmi dengan nomor registrasi unik yang diakui industri dan dapat diverifikasi langsung secara online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. FAQ SECTION (INTERACTIVE ACCORDION)                         */}
      {/* ============================================================== */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
            Punya pertanyaan mengenai paket langganan dan proses belajar?
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, fIdx) => (
            <div
              key={fIdx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-800 text-xs sm:text-sm hover:text-[#b38867] transition"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle size={16} className="text-[#b38867] shrink-0" />
                  <span>{faq.q}</span>
                </span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                    openFaq === fIdx ? "rotate-180 text-[#b38867]" : ""
                  }`}
                />
              </button>
              {openFaq === fIdx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. BOTTOM CTA BANNER (ENTERPRISE BRANDING)                     */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-br from-[#1E1713] via-[#2A201A] to-[#140F0C] text-white py-14 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#b38867]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold border border-white/15">
            <GraduationCap size={13} />
            <span>Mulai Akselerasi Karier Anda</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
            Siap Belajar dan Berkembang Bersama Para Mentor Terbaik?
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-medium">
            Daftarkan diri Anda sekarang dan bergabunglah dengan komunitas talenta digital terdepan di Aeterna Mentoring.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#b38867] hover:bg-[#a27355] text-white rounded-xl font-bold text-xs sm:text-sm transition shadow-lg"
            >
              <span>Daftar Akun Mentee Sekarang</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
