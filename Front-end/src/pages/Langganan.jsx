import React from 'react';
import { paketDataMinimalis } from '../data/langganan';

function Langganan() {
  return (
    <div className="bg-[#C2A68C] min-h-screen flex flex-col items-center py-12 px-4">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Pilih Paket Langganan</h1>
      <p className="text-lg text-gray-600 mb-12">Temukan paket yang tepat untuk kebutuhan kamu</p>

      {/* Paket Container - 3 Kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {paketDataMinimalis.map((paket, index) => (
          <div
            key={index}
            className={`${paket.cardStyle} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col`}
          >
            {/* Icon dan Title */}
            <div className="text-center mb-6">
              <span className="text-5xl mb-3 block">{paket.icon}</span>
              <h2 className="text-2xl font-bold text-gray-800">{paket.title}</h2>
            </div>

            {/* Price */}
            <div className="text-center mb-8">
              <p className="text-3xl font-bold text-[#7B5E4A]">{paket.price}</p>
            </div>

            {/* Features List */}
            <div className="mb-8 space-y-4">
              {paket.features.map((feature, fIndex) => (
                <div key={fIndex} className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-sm font-bold  ${
                      feature.available ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    {feature.available ? '✓' : '✕'}
                  </span>
                  <span
                    className={`text-base ${
                      feature.available ? 'text-gray-800 font-medium' : 'text-gray-400 line-through'
                    }`}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Button */}
            <button
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors duration-200 ${paket.buttonStyle}`}
            >
              {paket.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Langganan;
