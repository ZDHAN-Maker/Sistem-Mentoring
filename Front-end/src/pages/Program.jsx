import React from 'react';

function Program() {
  return (
    <div className="bg-[#C2A68C] min-h-screen flex flex-col items-center py-6">
      {/* Program Section */}
      <div className="bg-white w-11/12 md:w-1/2 lg:w-1/3 rounded-lg shadow-lg p-6">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-4">Pelajari Ribuan Skill dan Rintis Karir di MySkill</h2>
        
        {/* Gambar Utama */}
        <div className="flex justify-center mb-4">
          <img 
            src="/assets/Gemini_Generated_Image_6pk6d96pk6d96pk6.png" 
            alt="Program"
            className="w-full h-auto max-w-xs rounded-lg"
          />
        </div>
        
        {/* Deskripsi Program */}
        <p className="text-center text-gray-700 mb-6">
          Bergabung dengan lebih dari 1.5 juta anggota yang telah belajar bersama di MySkill. Kembangkan keterampilanmu dan raih karir impianmu bersama kami.
        </p>
        
        {/* Gambar-gambar Pendukung */}
        <div className="mt-6 flex justify-between space-x-4">
          <img 
            src="/assets/Gemini_Generated_Image_304x57304x57304x.png" 
            alt="Image 1"
            className="w-full h-auto max-w-xs rounded-lg"
          />
          <img 
            src="/assets/Gemini_Generated_Image_b201v4b201v4b201.png" 
            alt="Image 2"
            className="w-full h-auto max-w-xs rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default Program;
