import React from "react";
import { paketDataMinimalis } from "../data/langganan";

function Langganan() {
  return (
    <div className="bg-[#C2A68C] min-h-screen flex flex-col items-center py-16 px-4">
      {/* HEADER */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#3a2f23] mb-3 tracking-wide">
        Pilih Paket Langganan
      </h1>
      <p className="text-lg text-[#3a2f23]/80 mb-14">
        Temukan paket terbaik untuk pengembangan diri kamu ✨
      </p>

      {/* GRID PAKET */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl">
        {paketDataMinimalis.map((paket, index) => (
          <div
            key={index}
            className={`
              ${paket.cardStyle}
              relative rounded-2xl p-8 shadow-lg
              bg-[#f7f1e9]/80 backdrop-blur-sm border border-[#6f5645]/20
              hover:scale-[1.05] hover:shadow-xl hover:border-[#6f5645]/40
              transition-all duration-300 cursor-pointer
              flex flex-col
            `}
          >
            {/* Badge Rekomendasi */}
            {paket.recommended && (
              <div className="absolute top-4 right-4 bg-[#6f5645] text-white px-4 py-1 text-sm rounded-full shadow-md tracking-wide font-semibold">
                ⭐ Rekomendasi
              </div>
            )}

            {/* ICON + TITLE */}
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block text-[#5a4635] opacity-90">
                {paket.icon}
              </span>
              <h2 className="text-2xl font-bold text-[#3a2f23] tracking-wide">
                {paket.title}
              </h2>
            </div>

            {/* PRICE */}
            <div className="text-center mb-8">
              <p className="text-4xl font-extrabold text-[#7B5E4A] drop-shadow-sm">
                {paket.price}
              </p>
              <p className="text-[#3a2f23]/60 text-sm mt-1">
                /bulan – fleksibel & terjangkau
              </p>
            </div>

            {/* FEATURES */}
            <div className="mb-8 space-y-4">
              {paket.features.map((feature, fIndex) => (
                <div
                  key={fIndex}
                  className="flex items-center gap-3 bg-[#e8dfd6]/60 px-3 py-2 rounded-lg border border-[#d1c6b9]/40"
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      feature.available ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    {feature.available ? "✓" : "✕"}
                  </span>

                  <span
                    className={`text-base ${
                      feature.available
                        ? "text-[#3a2f23] font-medium"
                        : "text-gray-500 line-through"
                    }`}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* BUTTON */}
            <button
              className={`
                w-full py-3 px-6 rounded-xl font-semibold text-white text-center
                shadow-md tracking-wide text-lg
                bg-gradient-to-r from-[#7B5E4A] to-[#5a4635]
                hover:shadow-lg hover:brightness-110
                transition-all duration-300
              `}
            >
              Daftar Sekarang
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Langganan;
