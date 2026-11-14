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
  RefreshCw
} from "lucide-react";
import { paketDataMinimalis } from "../data/langganan";

function Langganan() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' | 'yearly'

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
      // Diskon 20% untuk tahunan
      const discounted = Math.round(plan.numeric_price * 0.8);
      return `Rp ${discounted.toLocaleString("id-ID")} / bulan`;
    }

    return plan.price || `Rp ${plan.numeric_price.toLocaleString("id-ID")} / bulan`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-amber-50/30 text-gray-800">
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 max-w-5xl mx-auto text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#b38867]/10 text-[#b38867] mb-4">
          <Sparkles size={13} />
          Investasi Terbaik untuk Masa Depanmu
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Pilih Paket Mentoring yang Tepat untuk Kariermu
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Tingkatkan keterampilan praktis dengan kurikulum terstruktur, feedback langsung dari mentor profesional, dan portofolio nyata yang siap kerja.
        </p>

        {/* Billing Toggle */}
        <div className="mt-8 inline-flex items-center p-1.5 bg-gray-100 rounded-2xl border border-gray-200">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2 rounded-xl text-xs md:text-sm font-semibold transition ${
              billingCycle === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Tagihan Bulanan
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs md:text-sm font-semibold transition ${
              billingCycle === "yearly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>Tagihan Tahunan</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#b38867] text-white">
              Hemat 20%
            </span>
          </button>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="p-16 flex items-center justify-center text-gray-500">
            <RefreshCw className="animate-spin text-[#b38867] mr-3" size={24} />
            <span className="font-medium">Memuat paket pilihan...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((paket, index) => {
              const isPopular = paket.is_popular;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                    isPopular
                      ? "border-2 border-[#b38867] shadow-xl md:-translate-y-2 ring-4 ring-[#b38867]/10"
                      : "border border-gray-200 shadow-sm hover:shadow-lg"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#b38867] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                      <Sparkles size={12} /> Paling Populer
                    </div>
                  )}

                  <div>
                    {/* Header Card */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl p-2.5 bg-gray-50 rounded-2xl border border-gray-100 inline-block">
                        {paket.icon || "📦"}
                      </span>
                      {isPopular && (
                        <span className="text-xs font-semibold text-[#b38867] bg-[#b38867]/10 px-2.5 py-1 rounded-full">
                          Rekomendasi
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900">{paket.title}</h3>
                    <div className="mt-3 mb-6">
                      <p className="text-3xl font-extrabold text-[#7B5E4A]">
                        {calculatePrice(paket)}
                      </p>
                      {billingCycle === "yearly" && paket.numeric_price > 0 && (
                        <p className="text-xs text-gray-400 mt-1">Ditagih tahunan (hemat 20%)</p>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 pt-6 border-t border-gray-100">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                        Fasilitas yang Didapat:
                      </p>
                      {paket.features && paket.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                              feature.available
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {feature.available ? <Check size={12} strokeWidth={3} /> : <X size={12} />}
                          </span>
                          <span
                            className={`text-sm leading-snug ${
                              feature.available ? "text-gray-700 font-medium" : "text-gray-400 line-through"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-8 mt-6 border-t border-gray-100">
                    <Link
                      to="/register"
                      className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                        isPopular
                          ? "bg-[#b38867] hover:bg-[#a27355] text-white hover:shadow-md"
                          : "bg-gray-900 hover:bg-black text-white"
                      }`}
                    >
                      <span>{paket.button_text || "Mulai Sekarang"}</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Kenapa Berlangganan */}
      <section className="bg-white border-y border-gray-200 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Kenapa Belajar di Aeterna Mentoring?</h2>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Kami merancang sistem mentoring yang bukan sekadar menonton video, melainkan bimbingan intensif berorientasi hasil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100 flex flex-col items-start">
              <div className="p-3 bg-[#b38867] text-white rounded-xl mb-4">
                <Users size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Mentor Praktisi Industri</h3>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                Belajar langsung dari engineer dan designer yang aktif bekerja di tech company terkemuka dengan studi kasus nyata.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col items-start">
              <div className="p-3 bg-blue-600 text-white rounded-xl mb-4">
                <Zap size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Feedback Tugas Personal</h3>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                Setiap tugas dan submission yang kamu kumpulkan akan direview langsung baris per baris dengan catatan perbaikan konstruktif.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col items-start">
              <div className="p-3 bg-emerald-600 text-white rounded-xl mb-4">
                <Award size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Sertifikat & Portofolio</h3>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                Lulus dengan proyek nyata yang layak dipamerkan di GitHub, Behance, dan CV untuk meyakinkan calon perekrut kerja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Pertanyaan yang Sering Diajukan</h2>
          <p className="text-gray-500 text-sm mt-1">Punya pertanyaan lain? Tim kami siap membantu kapan saja.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <h4 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
              <HelpCircle size={18} className="text-[#b38867]" />
              Apakah saya bisa berganti paket langganan di kemudian hari?
            </h4>
            <p className="text-gray-600 text-xs md:text-sm mt-2 pl-6 leading-relaxed">
              Tentu saja! Anda dapat melakukan upgrade atau downgrade paket kapan pun dari dashboard akun Anda. Perubahan akan berlaku pada periode penagihan berikutnya.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <h4 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
              <HelpCircle size={18} className="text-[#b38867]" />
              Bagaimana cara kerja mentoring 1-on-1?
            </h4>
            <p className="text-gray-600 text-xs md:text-sm mt-2 pl-6 leading-relaxed">
              Setelah mendaftar paket yang mencakup mentoring pribadi, Anda akan dijodohkan dengan mentor sesuai bidang keahlian pilihan dan dapat mengatur jadwal pertemuan tatap muka online via video call.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <h4 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
              <HelpCircle size={18} className="text-[#b38867]" />
              Metode pembayaran apa saja yang didukung?
            </h4>
            <p className="text-gray-600 text-xs md:text-sm mt-2 pl-6 leading-relaxed">
              Kami mendukung pembayaran melalui Transfer Bank Virtual Account (BCA, Mandiri, BNI, BRI), E-Wallet (GoPay, OVO, Dana), dan Kartu Kredit.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-[#b38867] to-[#8d674c] text-white py-12 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold">Siap Memulai Perjalanan Belajarmu?</h2>
        <p className="mt-2 text-white/90 text-sm md:text-base max-w-xl mx-auto">
          Daftarkan dirimu sekarang dan bergabung dengan komunitas pembelajar berbakat di Aeterna Mentoring.
        </p>
        <Link
          to="/register"
          className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg"
        >
          Daftar Sekarang Secara Gratis <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}

export default Langganan;
